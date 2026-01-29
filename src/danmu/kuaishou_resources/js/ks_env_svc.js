// ==========================================
// 1. 引入 JSDOM 和 Canvas 来伪造浏览器
// ==========================================
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { createCanvas } = require("canvas");

// 引入 HTTP 模块以创建服务
const http = require('http');
const url = require('url');

// 伪造一个 URL (必须是快手直播间的 URL)
const baseUrl = "https://www.kuaishou.com/new-reco";

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="app"></div></body></html>`, {
    url: baseUrl,
    referrer: "https://live.kuaishou.com/",
    contentType: "text/html",
    includeNodeLocations: true,
    runScripts: "dangerously"
});

// ==========================================
// 2. 将 JSDOM 对象挂载到全局 (Global)
// ==========================================
global.window = dom.window;
global.document = dom.window.document;
global.location = dom.window.location;
global.navigator = dom.window.navigator;
global.screen = dom.window.screen;
global.history = dom.window.history;
global.localStorage = dom.window.localStorage;
global.sessionStorage = dom.window.sessionStorage;

global.MutationObserver = dom.window.MutationObserver;
global.XMLHttpRequest = dom.window.XMLHttpRequest;

// Event 相关
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;
global.MessageEvent = dom.window.MessageEvent;

// 监听函数 bind
global.addEventListener = dom.window.addEventListener.bind(dom.window);
global.removeEventListener = dom.window.removeEventListener.bind(dom.window);

// 关键点：设置你的目标变量
window.__USE_SSR__ = false;

// Image 对象
global.Image = dom.window.Image;

// ==========================================
// 3. 深度补环境 (针对快手风控的补丁)
// ==========================================

// Canvas 模拟
dom.window.HTMLCanvasElement.prototype.getContext = function (type) {
    if (type === '2d') {
        return createCanvas(300, 150).getContext('2d');
    }
    return null;
};

// 隐藏 Node.js 特征 (保留 myProcess 用于最后接收参数)
const myProcess = process; 
delete global.process;
// delete global.Buffer; // 保持注释，不要删

// 补全 navigator
Object.defineProperties(navigator, {
    userAgent: { value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
    platform: { value: "Win32" },
    languages: { value: ["zh-CN", "zh"] },
    plugins: { value: [1, 2, 3] },
    webdriver: { value: false }
});

// 补全 screen
Object.defineProperties(screen, {
    width: { value: 1920 },
    height: { value: 1080 },
    availWidth: { value: 1920 },
    availHeight: { value: 1040 },
    colorDepth: { value: 24 }
});

// ==========================================
// 4. 【捕获器版】直接 Hook 属性读取
// ==========================================
console.log("正在启动属性监控器...");

// 优化的Hook机制 - 统一管理加密实例
let hasLoggedEncodeHook = false;
let hasLoggedRealEncodeHook = false;

// Hook $encode 属性读取 - 用于捕获加密实例
Object.defineProperty(Object.prototype, '$encode', {
    get: function() {
        if (!global.KS_EncInstance && !hasLoggedEncodeHook) {
            console.log(">>> [Hook 成功] 发现加密函数 $encode !");
            hasLoggedEncodeHook = true;
            global.KS_EncInstance = this;
        }
        // 返回一个代理函数，避免原函数被覆盖
        return (...args) => {
            if (global.KS_EncInstance && typeof global.KS_EncInstance.$encode === 'function') {
                return global.KS_EncInstance.$encode.apply(global.KS_EncInstance, args);
            } else {
                console.error(">>> 加密实例不可用");
            }
        };
    },
    set: function(val) {
        // 记录设置操作
        this._$encode = val;
        if (typeof val === 'function' && !hasLoggedRealEncodeHook) {
            console.log(">>> [极点 Hook 成功] 捕获到真实的 $encode 函数！");
            global._realEncode = val;
            hasLoggedRealEncodeHook = true;
        }
    },
    configurable: true
});

// ==========================================
// 针对自定义调度器的 Hook
// ==========================================

// 伪造 Error 堆栈 (防止 SECS 检测)
const originalError = global.Error;
global.Error = function (message) {
    const err = new originalError(message);
    // 伪造一个看起来像浏览器的 stack
    Object.defineProperty(err, 'stack', {
        value: "Error\n    at Object.getSig4 (https://www.kuaishou.com/assets/core.js:10:10)\n    at https://www.kuaishou.com/assets/core.js:100:20",
        configurable: true
    });
    return err;
};

// ==========================================
// 针对 Invalid URL 的深度补丁
// ==========================================
const OldURL = global.URL;
global.URL = class extends OldURL {
    constructor(url, base) {
        // 如果 base 为空且 url 是相对路径（不含协议）
        if (!base && typeof url === 'string' && !url.includes('://')) {
            // 强行补全一个合法的 base
            base = "https://www.kuaishou.com/";
        }
        try {
            super(url, base);
        } catch (e) {
            // 最后的倔强：如果还是错，尝试拼凑出一个绝对地址
            super("https://www.kuaishou.com/" + url.replace(/^\.\//, ""));
        }
    }
};

// 拦截 Vite 预加载，直接返回一个空的 Promise
global.__vitePreload = function(factory, deps, rel) {
    console.log(">>> [拦截成功] 屏蔽了异步组件加载:", deps);
    // 返回一个 resolve 的 Promise，防止 core.js 后续逻辑卡死
    return Promise.resolve({});
};

// 伪造浏览器堆栈，防止 SECS 检测
const OriginalError = global.Error;
global.Error = function(message) {
    const err = new OriginalError(message);
    const fakeStack = [
        "Error: " + (message || ""),
        "    at p.call (https://static.kuaishou.com/kf/mw/static/js/core.js:1:1024)",
        "    at getSig4 (https://static.kuaishou.com/kf/mw/static/js/core.js:1:2048)",
        "    at Object.main (https://static.kuaishou.com/kf/mw/static/js/core.js:1:512)"
    ].join("\n");

    Object.defineProperty(err, 'stack', {
        get: () => fakeStack,
        configurable: true
    });
    return err;
};

// 自动捕获 p 的实例 (即 getSig4 的第一个参数 e)
Object.defineProperty(Object.prototype, 'realm', {
    set: function(val) {
        this._realm = val;
        // 当任何对象的 realm 属性被赋值时，检查它是否包含 global.$encode
        // 这里 this 就是 p 的实例
        if (!global.KS_EncInstance) {
            global.KS_EncInstance = this; 
            console.log(">>> [实例捕获成功] 已抓取到加密引擎实例 e");
        }
    },
    get: function() {
        return this._realm;
    },
    configurable: true
});

// ==========================================
// 5. 导入快手源码
// ==========================================
try {
    require("./core.js");
    // 如果 main 没有自动运行，尝试手动运行
    if (typeof main === 'function') {
        console.log("手动启动 main()...");
        main();
    }
} catch (e) {
    console.error("加载 core.js 时发生错误 (非致命错误可忽略):", e.message);
}

// ==========================================
// 6. Token 生成函数（修复版，更明确的调试信息）
// ==========================================

function get_token(url, query_params) {
    return new Promise((resolve, reject) => {
        console.log(">>> 开始尝试生成token...");
        console.log(">>> 检查全局加密实例状态...");
        console.log("  - global._realEncode 存在:", !!global._realEncode);
        console.log("  - global.KS_EncInstance 存在:", !!global.KS_EncInstance);
        console.log("  - KS_EncInstance.$encode 存在:", !!(global.KS_EncInstance && typeof global.KS_EncInstance.$encode === 'function'));
        console.log("  - _realEncode 类型:", typeof global._realEncode);
        console.log("  - KS_EncInstance 类型:", typeof global.KS_EncInstance);
        
        // 尝试从多个位置获取加密实例
        let encInstance = null;
        let instanceType = "";

        if (global._realEncode && typeof global._realEncode === 'function') {
            encInstance = global._realEncode;
            instanceType = "_realEncode (function)";
        } else if (global.KS_EncInstance && typeof global.KS_EncInstance.$encode === 'function') {
            encInstance = global.KS_EncInstance;
            instanceType = "KS_EncInstance (object with $encode)";
        } else if (global.KS_EncInstance && typeof global.KS_EncInstance.call === 'function') {
            encInstance = global.KS_EncInstance;
            instanceType = "KS_EncInstance (object with call)";
        }

        if (!encInstance) {
            reject("错误：未捕获到加密实例 (所有实例均为空)，请检查 core.js 是否正常运行或 Hook 是否生效");
            return;
        }

        console.log(`>>> 使用加密实例类型: ${instanceType}`);
        
        // 构造 payload
        const payload = {
            url: url,
            query: query_params || {},
            form: {},
            requestBody: {}
        };
        
        // 自动补全 caver
        if (!payload.query.caver) {
            payload.query.caver = "2";
        }

        console.log(`>>> 准备加密请求，URL: ${url}, 参数:`, payload.query);
        
        try {
            // 根据加密实例的类型决定如何调用
            if (instanceType === "_realEncode (function)") {
                // 如果 encInstance 本身就是函数（即 _realEncode）
                console.log(">>> 调用 _realEncode 函数...");
                encInstance(payload, {
                    suc: (res) => {
                        console.log(">>> 加密成功返回结果");
                        resolve(res);
                    },
                    err: (err) => {
                        console.log(">>> 加密过程出错:", err);
                        reject(err);
                    }
                });
            } else if (instanceType === "KS_EncInstance (object with call)" && typeof encInstance.call === 'function') {
                // 如果 encInstance 是对象，具有 call 方法
                console.log(">>> 调用 KS_EncInstance.call('$encode')...");
                encInstance.call("$encode", payload, {
                    suc: (res) => {
                        console.log(">>> 加密成功返回结果");
                        resolve(res);
                    },
                    err: (err) => {
                        console.log(">>> 加密过程出错:", err);
                        reject(err);
                    }
                });
            } else if (instanceType === "KS_EncInstance (object with $encode)" && typeof encInstance.$encode === 'function') {
                // 如果 encInstance 是对象，具有 $encode 方法
                console.log(">>> 调用 KS_EncInstance.$encode...");
                encInstance.$encode(payload, {
                    suc: (res) => {
                        console.log(">>> 加密成功返回结果");
                        resolve(res);
                    },
                    err: (err) => {
                        console.log(">>> 加密过程出错:", err);
                        reject(err);
                    }
                });
            } else {
                reject(`错误：无法识别的加密实例类型(${instanceType})，无可用的调用方法`);
            }
        } catch (error) {
            console.log(">>> 执行加密时抛出异常:", error);
            reject("执行加密出错: " + error);
        }
    });
}

// ==========================================
// 7. HTTP 服务端实现
// ==========================================

function createKSEnvService(port = 8080) {
    const server = http.createServer(async (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        
        // 设置 CORS 头部
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        // 处理预检请求
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        
        // 路由处理
        if (pathname === '/health' && req.method === 'GET') {
            // 健康检查端点
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'OK',
                timestamp: new Date().toISOString(),
                hasEncryptionInstance: !!(global._realEncode || global.KS_EncInstance)
            }));
        } 
        else if (pathname === '/token' && req.method === 'POST') {
            // 获取 token 端点
            let body = '';
            
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', async () => {
                try {
                    const params = JSON.parse(body);
                    const targetUrl = params.url || "/rest/v/profile/get";
                    const targetQuery = params.query || {};
                    
                    console.log(`>>> 接收到请求: URL=${targetUrl}, Query=${JSON.stringify(targetQuery)}`);
                    
                    const token = await get_token(targetUrl, targetQuery);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        token: token,
                        url: targetUrl,
                        query: targetQuery
                    }));
                } catch (error) {
                    console.error('>>> 生成token时出错:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: error.message
                    }));
                }
            });
        }
        else if (pathname === '/token' && req.method === 'GET') {
            // GET 方式获取 token，参数从查询字符串中获取
            try {
                const targetUrl = parsedUrl.query.url || "/rest/v/profile/get";
                // 解析查询参数
                const queryParamStr = parsedUrl.query.query;
                let targetQuery = {};
                
                if (queryParamStr) {
                    try {
                        targetQuery = JSON.parse(queryParamStr);
                    } catch(e) {
                        // 如果不是JSON，则尝试作为简单的查询参数
                        targetQuery = parsedUrl.query;
                        // 移除我们特别处理的字段
                        delete targetQuery.url;
                    }
                }
                
                console.log(`>>> 接收到GET请求: URL=${targetUrl}, Query=${JSON.stringify(targetQuery)}`);
                
                const token = await get_token(targetUrl, targetQuery);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    token: token,
                    url: targetUrl,
                    query: targetQuery
                }));
            } catch (error) {
                console.error('>>> 生成token时出错:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: error.message
                }));
            }
        }
        else {
            // 未知路由
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Endpoint not found'
            }));
        }
    });
    
    server.listen(port, () => {
        console.log(`>>> ks_env 服务已启动，监听端口: ${port}`);
        console.log(`>>> 健康检查: http://localhost:${port}/health`);
        console.log(`>>> 获取Token (POST): http://localhost:${port}/token`);
        console.log(`>>> 获取Token (GET): http://localhost:${port}/token?url=/rest/v/profile/get&query={"param":"value"}`);
    });
    
    return server;
}

// ==========================================
// 8. 执行逻辑 (CLI 参数 或 作为服务运行)
// ==========================================

const args = myProcess.argv.slice(2);

if (args.length > 0) {
    // 模式 A: 供 Python 调用 (传入参数，可能是启动服务的命令)
    if (args[0] === '--service' || args[0] === '-s') {
        // 作为服务运行
        const port = parseInt(args[1]) || 8080;
        createKSEnvService(port);
    } else {
        // 兼容旧的 CLI 调用方式
        try {
            const params = JSON.parse(args[0]);
            const targetUrl = params.url || "/rest/v/profile/get";
            const targetQuery = params.query || {};

            get_token(targetUrl, targetQuery)
                .then(token => console.log(token))
                .catch(err => console.error("Error:", err));
        } catch (e) {
            console.error("JSON 解析失败:", e);
        }
    }
} else {
    // 模式 B: 直接运行服务 (node ks_env.js)
    console.log("未传入参数，默认启动 HTTP 服务...");
    createKSEnvService(); // 默认端口 8080
    
    // 模式 B: 直接运行测试 (node ks_env.js)
    console.log("未传入参数，执行默认测试...");
    const testUrl = "/rest/v/profile/get";
    const testQuery = { "caver": "2" };

    // 修改测试逻辑
    setTimeout(() => {
        console.log("开始最后搜索...");
        console.log(">>> 检查全局变量状态:");
        console.log("  - global._realEncode:", !!global._realEncode);
        console.log("  - global.KS_EncInstance:", !!global.KS_EncInstance);
        console.log("  - window.KS_EncInstance:", !!window.KS_EncInstance);
        console.log("  - KS_EncInstance 详细信息:", global.KS_EncInstance);
        console.log("  - _realEncode 详细信息:", global._realEncode);
        
        // 检查所有可能的加密实例
        const hasValidInstance = global._realEncode || (global.KS_EncInstance && (typeof global.KS_EncInstance.$encode === 'function' || typeof global.KS_EncInstance.call === 'function'));
        
        if (hasValidInstance) {
            console.log(">>> 找到加密实例，开始生成 token...");
            get_token(testUrl, testQuery)
                .then(token => console.log("\n[成功] Token:", token))
                .catch(err => console.error("\n[失败]:", err));
        } else {
            console.log(">>> 未能捕获有效实例。建议：1. 搜索 core.js 里的 '$encode' 关键字；2. 切换 __USE_SSR__ 为 false");
        }
    }, 3000);
}