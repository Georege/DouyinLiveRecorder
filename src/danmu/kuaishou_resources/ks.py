import subprocess
import json

def get_hxfalcon_by_node(url, query_params):
    # 构造输入数据
    payload = {
        "url": url,
        "query": query_params,
        "form": {},
        "requestBody": {}
    }
    # 记得加上 caver
    if "caver" not in payload["query"]:
        payload["query"]["caver"] = "2"
        
    payload_json = json.dumps(payload)

    try:
        # 调用 Node 脚本
        # 格式: node ks_env.js '{"json":"..."}'
        result = subprocess.run(
            ["node", "ks_env.js", payload_json],
            capture_output=True,
            text=True,
            encoding='utf-8' # 防止乱码
        )

        if result.returncode != 0:
            print("Node执行错误:", result.stderr)
            return None

        token = result.stdout.strip()
        return token

    except Exception as e:
        print(f"调用异常: {e}")
        return None

# 测试
token = get_hxfalcon_by_node("/rest/v/profile/get", {"caver": "2"})
print("生成的 Token:", token)