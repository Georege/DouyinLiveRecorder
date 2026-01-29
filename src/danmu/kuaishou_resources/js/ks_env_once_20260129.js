// ==========================================
// 1. 引入 JSDOM 和 Canvas
// ==========================================
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { createCanvas } = require("canvas");

// 伪造直播间 URL
const url = "https://live.kuaishou.com/u/3xwgei6q9i989";

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="app"></div></body></html>`, {
    url: url,
    referrer: "https://live.kuaishou.com/",
    contentType: "text/html",
    includeNodeLocations: true,
    runScripts: "dangerously"
});

// ==========================================
// 2. 补全浏览器环境 (Global)
// ==========================================
global.window = dom.window;
global.document = dom.window.document;
global.location = dom.window.location;
global.navigator = dom.window.navigator;
global.screen = dom.window.screen;
global.history = dom.window.history;
global.localStorage = dom.window.localStorage;
global.sessionStorage = dom.window.sessionStorage;

// 【关键修复】补全 self 和 top，防止报错
global.self = dom.window;
global.top = dom.window;
global.parent = dom.window;
dom.window.self = dom.window;
dom.window.top = dom.window;

global.MutationObserver = dom.window.MutationObserver;
global.XMLHttpRequest = dom.window.XMLHttpRequest;

// Event & Listeners
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;
global.MessageEvent = dom.window.MessageEvent;
global.addEventListener = dom.window.addEventListener.bind(dom.window);
global.removeEventListener = dom.window.removeEventListener.bind(dom.window);

// Image
global.Image = dom.window.Image;

// 补 requestAnimationFrame (很多前端库依赖这个)
global.requestAnimationFrame = function(callback) { return setTimeout(callback, 16); };
global.cancelAnimationFrame = function(id) { clearTimeout(id); };

// ==========================================
// 3. 深度补环境 (风控补丁)
// ==========================================

// Canvas 模拟
dom.window.HTMLCanvasElement.prototype.getContext = function (type) {
    if (type === '2d') {
        return createCanvas(300, 150).getContext('2d');
    }
    return null;
};

// 隐藏 Node 特征
const myProcess = process; 
delete global.process; 

// Navigator
Object.defineProperties(navigator, {
    userAgent: { value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
    platform: { value: "Win32" },
    languages: { value: ["zh-CN", "zh"] },
    plugins: { value: [1, 2, 3] },
    webdriver: { value: false }
});

// Screen
Object.defineProperties(screen, {
    width: { value: 1920 },
    height: { value: 1080 },
    colorDepth: { value: 24 }
});

// 拦截 Vite 预加载
global.__vitePreload = function() { return Promise.resolve({}); };

// ==========================================
// 4. 【核心 Hook】Function.prototype.call
// ==========================================
console.log(">>> 初始化 Hook 监控...");

// 只要快手源码运行，它必然通过 call("$encode") 来调用
const originalCall = Function.prototype.call;
Function.prototype.call = function (thisArg, ...args) {
    // 监听调用参数
    if (thisArg === "$encode") {
        if (!global.KS_EncInstance) {
            console.log(">>> [Hook 成功] 捕获到加密实例 e !");
            global.KS_EncInstance = this; // 锁定目标
        }
    }
    return originalCall.apply(this, [thisArg, ...args]);
};

// ==========================================
// 5. 加载源码 & 主动触发
// ==========================================
try {
    // 假设你的 JS 文件名是 app.cafa96e5de9023c78a6b.js
    // 这里的返回值通常是 Webpack 的导出对象
    const lib = require("./app.cafa96e5de9023c78a6b.js");
    
    // 【主动触发策略】
    // 很多时候代码加载了但不执行，我们需要去"戳"它一下
    // 尝试寻找导出对象里是否有 init, main, setup 之类的方法并执行
    if (lib && typeof lib === 'function') {
        try { lib(); } catch(e){}
    }
    
    // 如果 main 是全局函数，尝试调用
    if (typeof main === 'function') {
        console.log(">>> 尝试手动执行 main()...");
        main();
    }
    
} catch (e) {
    console.error("加载源码出错 (非致命可忽略):", e.message);
}

// ==========================================
// 6. Token 生成函数
// ==========================================
function get_token(url, query_params) {
    return new Promise((resolve, reject) => {
        const enc = global.KS_EncInstance;
        
        if (!enc) {
            reject("Error: 加密对象未捕获。可能原因：1.源码未执行到加密初始化 2.变量名混淆导致 Hook 失效");
            return;
        }

        const payload = {
            url: url,
            query: query_params || { caver: "2" },
            form: {},
            requestBody: {}
        };
        // 自动补全 caver
        if (!payload.query.caver) { payload.query.caver = "2"; }

        try {
            // 使用 call 调用 (这是最原生的方式)
            enc.call("$encode", [payload, {
                suc: (res) => resolve(res),
                err: (err) => reject(err)
            }]);
        } catch (error) {
            reject("调用出错: " + error.message);
        }
    });
}

// ==========================================
// 7. 执行测试
// ==========================================
const args = myProcess.argv.slice(2);

// 默认测试参数
const testUrl = "/rest/v/profile/get";
const testQuery = { "caver": "2" };

// 延时执行，给 core.js 一点初始化时间
setTimeout(() => {
    if (global.KS_EncInstance) {
        console.log("\n>>> 加密实例已就绪，开始生成...");
        // 如果有外部参数则用外部参数，否则跑默认测试
        if (args.length > 0) {
            try {
                const p = JSON.parse(args[0]);
                get_token(p.url, p.query).then(console.log).catch(console.error);
            } catch(e) { console.error("参数解析失败"); }
        } else {
            get_token(testUrl, testQuery).then(t => {
                console.log("\n====== 生成成功 ======");
                console.log(t);
                console.log("======================");
            }).catch(console.error);
        }
    } else {
        console.error("\n>>> [失败] 超时仍未捕获到加密实例。");
        console.error("建议方案：");
        console.error("1. 检查 app.js 里是否有 'self is not defined' 报错 (已修复)");
        console.error("2. 检查 app.js 底部是否注释掉了 main() (请取消注释)");
        console.error("3. 在 app.js 搜索 'initLogger'，在第一行手动加 window.KS_EncInstance = e");
    }
}, 2000);