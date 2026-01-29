from playwright.sync_api import sync_playwright
import json
import time

def run():
    with sync_playwright() as p:
        # 1. 启动浏览器 (headless=False 可以看到浏览器操作，调试完改成 True)
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        # ============================================================
        # 【核心步骤】注入 Hook 代码
        # 这段代码会在页面所有 JS 执行前运行
        # 它的作用是：一旦快手调用加密函数，就把加密实例(e)偷出来
        # ============================================================
        hook_script = """
        console.log("正在注入 Hook...");
        
        // 保存原始的 call 方法
        const originalCall = Function.prototype.call;
        
        // 重写 call 方法
        Function.prototype.call = function(...args) {
            // 监听第一个参数是不是 "$encode"
            if (args[0] === "$encode") {
                console.log(">>> 捕获到加密实例！已保存到 window.__KS_ENCRYPTOR");
                window.__KS_ENCRYPTOR = this; // 【关键】把 this (也就是 e) 保存到全局
            }
            return originalCall.apply(this, args);
        };
        """
        page.add_init_script(hook_script)

        # 2. 访问直播间，触发页面加载 JS
        # 随便找个直播间，目的是让页面跑起来，初始化加密模块
        target_url = "https://live.kuaishou.com/u/BT12345678BT" 
        print(f"正在访问页面: {target_url}")
        page.goto(target_url)

        # 3. 等待捕获成功
        print("等待加密模块初始化...")
        # 只要页面发起任何请求（比如心跳、获取用户信息），就会触发我们的 Hook
        # 我们轮询检查 window.__KS_ENCRYPTOR 是否存在
        for _ in range(80):
            is_captured = page.evaluate("() => !!window.__KS_ENCRYPTOR")
            if is_captured:
                print("加密实例捕获成功！")
                break
            time.sleep(1)
        
        if not is_captured:
            print("捕获失败，可能页面结构变了或未触发加密请求")
            return

        # ============================================================
        # 【调用步骤】现在可以随心所欲生成 Token 了
        # ============================================================
        
        def generate_hxfalcon(url, query_params):
            # 构造输入对象，注意补全 caver: "2"
            payload = {
                "url": url,
                "query": query_params,
                "form": {},
                "requestBody": {}
            }
            # 确保 query 里有 caver，修复之前的报错
            if "caver" not in payload["query"]:
                payload["query"]["caver"] = "2"

            payload_json = json.dumps(payload)
            
            # 在浏览器里执行加密
            result = page.evaluate(f"""
                () => {{
                    return new Promise((resolve, reject) => {{
                        if (!window.__KS_ENCRYPTOR) {{
                            reject("加密器未找到");
                            return;
                        }}
                        
                        window.__KS_ENCRYPTOR.call("$encode", [{payload_json}, {{
                            suc: function(res) {{ resolve(res) }},
                            err: function(err) {{ reject(err) }}
                        }}]);
                    }});
                }}
            """)
            return result

        # --- 测试生成 ---
        print("\n=== 开始生成 Token ===")
        
        # 模拟请求参数
        test_url = "/rest/v/profile/get"
        test_query = {"caver": "2"} # 这里其实可以传更多参数
        
        token = generate_hxfalcon(test_url, test_query)
        print(f"生成的 __NS_hxfalcon:\n{token}")
        
        print("\n长度:", len(token))

        # 保持浏览器不关闭，你可以继续生成其他参数的 token
        # time.sleep(100) 
        browser.close()

if __name__ == "__main__":
    run()