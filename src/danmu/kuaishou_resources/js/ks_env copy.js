// ==========================================
// 1. 引入 JSDOM 和 Canvas 来伪造浏览器
// ==========================================
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { createCanvas } = require("canvas");

// 伪造一个 URL (必须是快手直播间的 URL)
const url = "https://live.kuaishou.com/u/3xwgei6q9i989";

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="app"></div></body></html>`, {
    url: url,
    referrer: "https://live.kuaishou.com/",
    contentType: "text/html",
    includeNodeLocations: true,
    runScripts: "dangerously" // 允许执行 JS
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

// 【补齐下面这些 Event 相关的类】
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;
global.MessageEvent = dom.window.MessageEvent; // 这个也经常用

// 【补齐这两个事件监听函数】
// 注意：必须使用 .bind(dom.window)，否则 'this' 指向会出错
global.addEventListener = dom.window.addEventListener.bind(dom.window);
global.removeEventListener = dom.window.removeEventListener.bind(dom.window);

// 模拟 Image 对象 (指纹检测常用)
global.Image = dom.window.Image;

// ==========================================
// 3. 深度补环境 (针对快手风控的补丁)
// ==========================================

// [关键] 模拟 Canvas (快手必查！)
// JSDOM 本身不支持 Canvas 绘图，必须用 node-canvas 替换
dom.window.HTMLCanvasElement.prototype.getContext = function (type) {
    if (type === '2d') {
        // 创建一个真实的 node-canvas 上下文
        return createCanvas(300, 150).getContext('2d');
    }
    return null; // WebGL 比较难模拟，先返回 null 或模拟假对象
};

// [关键] 隐藏 Node.js 特征
// 如果代码检测到 process 对象，就知道是 Node 环境
const myProcess = process; 
delete global.process;
// delete global.Buffer;

// 补全 navigator 属性
Object.defineProperties(navigator, {
    userAgent: { value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
    platform: { value: "Win32" },
    languages: { value: ["zh-CN", "zh"] },
    plugins: { value: [1, 2, 3] }, // 伪造插件长度
    webdriver: { value: false }    // 这是一个常见的反爬检测点
});

// 补全 screen 属性
Object.defineProperties(screen, {
    width: { value: 1920 },
    height: { value: 1080 },
    availWidth: { value: 1920 },
    availHeight: { value: 1040 },
    colorDepth: { value: 24 }
});

// ==========================================
// 4. 导入快手源码
// ==========================================

// 这里需要你把扣下来的 JS 代码放进去
// 假设你扣下来的代码文件叫 core.js
// 注意：你需要修改 core.js，把那个加密对象 e 导出到 global.MY_ENCRYPTOR
require("./core.js"); 

// ==========================================
// 5. 对外提供调用接口 (供 Python 调用)
// ==========================================

function generate_token(params_json) {
    return new Promise((resolve, reject) => {
        try {
            const params = JSON.parse(params_json);
            
            // 假设你在 core.js 里把那个 e 挂载到了 window.KS_EncInstance
            if (!window.KS_EncInstance) {
                reject("加密实例未初始化，请检查 core.js");
                return;
            }

            // 调用加密逻辑
            window.KS_EncInstance.call("$encode", [params, {
                suc: (res) => resolve(res),
                err: (err) => reject(err)
            }]);

        } catch (e) {
            reject(e.toString());
        }
    });
}

// 接收 Python 传来的参数 (命令行参数)
// 例如: node ks_env.js '{"url":"..."}'
const args = myProcess.argv.slice(2);
if (args.length > 0) {
    generate_token(args[0]).then(token => {
        console.log(token); // 输出给 Python
    }).catch(err => {
        console.error("Error:", err);
    });
}