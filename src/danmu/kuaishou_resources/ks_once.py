import requests
import json

# 启动服务后，可以通过以下方式调用

# GET 方式
response = requests.get('http://localhost:8080/token', params={
    'url': '/rest/v/profile/get',
    'query': json.dumps({'param': 'value'})
})

# POST 方式
data = {
    'url': '/rest/v/profile/get',
    'query': {'param': 'value'}
}
response = requests.post('http://localhost:8080/token', json=data)

result = response.json()
print(result)