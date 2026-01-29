// ==========================================
// 1. 引入 JSDOM 和 Canvas 来伪造浏览器
// ==========================================
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { createCanvas } = require("canvas");

// 伪造一个 URL (必须是快手直播间的 URL)
const url = "https://www.kuaishou.com/new-reco";

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="app"></div></body></html>`, {
    url: url,
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

Object.defineProperty(Object.prototype, '$encode', {
    get: function() {
        // 当代码尝试访问 obj.$encode 时触发
        if (!global.KS_EncInstance) {
            console.log(">>> [Hook 成功] 发现加密函数 $encode !");
            // 此处的 this 就是包含 $encode 的那个实例对象
            global.KS_EncInstance = this; 
        }
        // 返回一个实际的功能函数，确保程序不崩溃
        return function(...args) {
            // 这里可以记录加密时的入参
            // console.log(">>> $encode 被调用，参数:", args);
            return global.KS_EncInstance.$encode.apply(this, args);
        };
    },
    set: function(val) {
        // 如果代码尝试赋值 obj.$encode = ...
        this._$encode = val;
    },
    configurable: true
});

// ==========================================
// 针对自定义调度器的 Hook
// ==========================================

// 1. 伪造 Error 堆栈 (防止 SECS 检测)
// 这是一个常见的风控对抗点
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

// 2. 深度监控 global["$encode"] 的赋值
// 代码最后执行的是 this.realm.global["$encode"].apply(...)
// 我们需要找到这个 realm.global
global._realEncode = null;
Object.defineProperty(Object.prototype, '$encode', {
    get: function() {
        return global._realEncode;
    },
    set: function(fn) {
        if (typeof fn === 'function' && !this._isHooked) {
            console.log(">>> [极点 Hook 成功] 捕获到真实的 $encode 函数！");
            global._realEncode = fn;
            this._isHooked = true;
        }
    },
    configurable: true
});

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
        global.KS_EncInstance = this; 
        console.log(">>> [实例捕获成功] 已抓取到加密引擎实例 e");
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
// 6. Token 生成函数
// ==========================================

// ==========================================
// 6. Token 生成函数（修复版）
// ==========================================

function get_token(url, query_params) {
    return new Promise((resolve, reject) => {
        // 1. 获取实例
        const enc = global.KS_EncInstance || window.KS_EncInstance;
        
        if (!enc) {
            reject("错误：未捕获到加密实例 (KS_EncInstance 为空)");
            return;
        }

        // 2. 构造 payload
        const payload = {
            url: url,
            query: query_params || {},
            form: {},
            requestBody: {}
        };
        if (!payload.query.caver) {
            payload.query.caver = "2";
        }

        try {
            console.log(">>> 准备调用加密 (e.call)...");
            
            // 3. 正确的调用方式：使用 call 指令
            enc.call("$encode", [payload, {
                suc: (res) => {
                    console.log(">>> 加密成功！");
                    resolve(res);
                },
                err: (err) => {
                    console.log(">>> 加密失败回调:", err);
                    reject(err);
                }
            }]);
        } catch (error) {
            console.error(">>> 执行加密出错:", error);
            reject("执行加密出错: " + error.message);
        }
    });
}

// ==========================================
// 7. 执行逻辑 (CLI 参数 或 默认测试)
// ==========================================

const args = myProcess.argv.slice(2);

if (args.length > 0) {
    // 模式 A: 供 Python 调用 (传入 JSON 字符串)
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
} else {
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
        
        // 检查所有可能的加密实例
        const enc = global._realEncode || global.KS_EncInstance || window.KS_EncInstance;
        
        if (enc) {
            console.log(">>> 找到加密实例，开始生成 token...");
            get_token(testUrl, testQuery)
                .then(token => console.log("\n[成功] Token:", token))
                .catch(err => console.error("\n[失败]:", err));
        } else {
            console.log(">>> 未能捕获实例。建议：1. 搜索 core.js 里的 '$encode' 关键字；2. 切换 __USE_SSR__ 为 false");
        }
    }, 3000);
}