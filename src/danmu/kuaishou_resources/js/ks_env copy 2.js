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
// 4. 【核心新增】Hook 逻辑 (必须在加载 core.js 之前)
// ==========================================
console.log("正在初始化环境并设置 Hook...");

const originalCall = Function.prototype.call;
Function.prototype.call = function (thisArg, ...args) {
    // 监听是否调用了 "$encode" 指令
    if (thisArg === "$encode") {
        if (!global.KS_EncInstance) {
            console.log(">>> [Hook 成功] 捕获到加密实例 e !");
            global.KS_EncInstance = this; // 保存到全局
        }
    }
    return originalCall.apply(this, [thisArg, ...args]);
};

// ==========================================
// 5. 导入快手源码
// ==========================================
try {
    require("./core.js");
} catch (e) {
    console.error("加载 core.js 时发生错误 (非致命错误可忽略):", e.message);
}

// ==========================================
// 6. Token 生成函数
// ==========================================

function get_token(url, query_params) {
    return new Promise((resolve, reject) => {
        const enc = global.KS_EncInstance || window.KS_EncInstance;
        
        if (!enc) {
            reject("错误：未捕获到加密实例 (KS_EncInstance 为空)，请检查 core.js 是否正常运行或 Hook 是否生效");
            return;
        }

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

        try {
            enc.call("$encode", [payload, {
                suc: (res) => resolve(res),
                err: (err) => reject(err)
            }]);
        } catch (error) {
            reject("执行加密出错: " + error);
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

    // 等待一小会儿确保 core.js 初始化完成
    setTimeout(() => {
        get_token(testUrl, testQuery)
            .then(token => {
                console.log("\n====== 生成成功 ======");
                console.log(token);
                console.log("======================");
            })
            .catch(err => {
                console.error("\n====== 生成失败 ======");
                console.error(err);
            });
    }, 1000);
}