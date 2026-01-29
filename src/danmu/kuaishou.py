# -*- encoding: utf-8 -*-

"""
快手直播弹幕获取类
使用 WebSocket + Protobuf + AES 加密
"""

import asyncio
import struct
import time
import gzip
import binascii
import requests
import websockets
import websocket
import threading
from typing import Dict, List, Optional, Any
from .base import DanmakuBase
from .kuaishou_resources.aes_cipher import KuaishouAESCipher
from .kuaishou_resources import kuaishou_pb2 as ksp
from .kuaishou_resources.message_parser import KuaishouMessageParser, MessageType


class KuaishouDanmaku(DanmakuBase):
    """
    快手直播弹幕获取类
    使用WebSocket + Protobuf + AES获取实时弹幕
    3xq5drejhpe45iy 应该是快手平台内部定义的用户唯一uid
    """
    
    def __init__(self, room_id:str, ks_id: str, proxy_addr: Optional[str] = None, logger=None, cookies: Optional[str] = None):
        """
        初始化快手弹幕获取器
        
        Args:
            room_id: 直播间id room_id 等于 快手官方的liveStreamId
            ks_id: 快手id 等于快手官方的author id
            proxy_addr: 代理地址
            logger: 日志对象
            cookies: Cookie字符串（快手可能需要登录Cookie）

        诸多参数可以需要通过访问https://live.kuaishou.com/u/ks_id 来获取
        """
        super().__init__(room_id, proxy_addr, logger)
        self.platform = "kuaishou"
        self.ks_id = ks_id  # 存储快手author id
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://live.kuaishou.com/'
        })
        
        # 添加Cookie支持
        if cookies:
            self.session.headers.update({
                'Cookie': cookies
            })
            self.logger.info(f"[{self.platform}] 已设置Cookie")
        else:
            self.logger.warning(f"[{self.platform}] 未设置Cookie，可能导致API返回result=0")
        
        if proxy_addr:
            self.session.proxies = {
                'http': proxy_addr,
                'https': proxy_addr
            }
        
        # WebSocket相关
        self.websocket = None
        self.heartbeat_task = None
        self.receive_task = None
        self.ws_url = None
        self.token = None
        
        # AES加密器
        self.aes_cipher = KuaishouAESCipher()
        
        # 消息解析器（支持多种消息类型）
        self.message_parser = KuaishouMessageParser(logger=self.logger)
        
        # 弹幕缓冲
        self.danmaku_buffer = []
        self.max_buffer_size = 1000
        # 线程锁，保护弹幕缓冲的读写
        self.buffer_lock = threading.Lock()

    def _get_websocket_info(self) -> Optional[Dict[str, Any]]:
        """
        获取WebSocket连接信息
        
        Returns:
            Optional[Dict[str, Any]]: WebSocket信息，包含urls和token
        """
        try:
            # 检查是否已经从HTML中提取到WebSocket信息
            if self.ws_url and self.token:
                self.logger.info(f"[{self.platform}] 已从HTML中提取到WebSocket信息，直接使用")
                return {
                    'webSocketUrls': self.ws_url,
                    'token': self.token
                }
            
            url = f"https://live.kuaishou.com/live_api/liveroom/websocketinfo"
            
            # 尝试添加浏览器中使用的参数
            params = {
                'liveStreamId': self.room_id,
                'caver': 2,  # 从浏览器请求中看到的参数
                '__NS_hxfalcon': self._generate_ns_hxfalcon(self.room_id)  # 动态生成参数
            }
            
            # 更新请求头，添加浏览器中使用的头信息
            # 使用ks_id作为用户ID构建Referer
            referer_user_id = self.ks_id if self.ks_id else self.room_id
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0',
                'Referer': f'https://live.kuaishou.com/u/{referer_user_id}',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Microsoft Edge";v="144"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
            }
            
            # 如果有kww头信息，添加它
            # 注意：这个值可能需要动态生成，这里暂时使用浏览器中的值
            kww_value = 'K408WWQK1WMvAnj5ysWy4uSqG3bFcmRrv0/vijpwWnXUiYW6+L0lrtti3yHXZp6BDxshPyRmBGIqdKgEF5OaF+Rnyqs8AVZ/9V6jbo7nRWb8uMF6qgjSb4VbknGC5AUKOMTpms9b4bOz4gNK7TIFbaxwF=='
            headers['kww'] = kww_value
            
            self.logger.info(f"[{self.platform}] 正在获取WebSocket连接信息: liveStreamId={self.room_id}, ks_id={self.ks_id}")
            self.logger.debug(f"[{self.platform}] 请求URL: {url}")
            self.logger.debug(f"[{self.platform}] 请求参数: {params}")
            self.logger.debug(f"[{self.platform}] 请求Cookie: {'已设置' if 'Cookie' in self.session.headers else '未设置'}")
            self.logger.debug(f"[{self.platform}] 请求kww头: {'已设置' if kww_value else '未设置'}")
            
            response = self.session.get(url, params=params, headers=headers, timeout=10)
            
            self.logger.debug(f"[{self.platform}] 响应状态码: {response.status_code} 响应内容： {response.text}")
            
            if response.status_code != 200:
                self.logger.error(f"[{self.platform}] 获取WebSocket信息失败，状态码: {response.status_code}")
                # 尝试使用GraphQL API
                return self._get_websocket_info_graphql()
            
            data = response.json()
            
            # 添加详细日志
            self.logger.debug(f"[{self.platform}] 完整响应: {data}")
            
            # 检查返回结果
            # 尝试从多个可能的位置获取result
            result = data.get('result', data.get('data', {}).get('result', 0))
            if result != 1:
                error_msg = {
                    0: '未知错误（可能需要Cookie或直播间已下播）',
                    1: '成功',
                    2: '直播间未开播或不存在，请确认直播间ID是否正确且正在直播',
                    3: '权限不足',
                    4: '参数错误',
                    400002: '遭遇站点拦截验证码，手动打开https://www.kuaishou.com/new-reco验证'
                }.get(result, f'未知错误码({result})')
                
                self.logger.error(f"[{self.platform}] WebSocket信息返回错误: {error_msg} (result={result})")
                self.logger.error(f"[{self.platform}] 提示: 请确保直播ID格式为 3x开头的liveStreamId，例如: 3xtzhay4ip4htua")
                self.logger.error(f"[{self.platform}] 如果result=0，可能需要登录Cookie，请在config.ini中配置ks_cookie")
                self.logger.error(f"[{self.platform}] 如果result=2，请确认直播间正在直播且liveStreamId正确")
                # 尝试使用GraphQL API
                return self._get_websocket_info_graphql()
            
            # 从data或data.data中提取WebSocket信息
            websocket_data = data.get('data', data)
            self.ws_url = websocket_data.get('webSocketUrls', websocket_data.get('urls', []))
            self.token = websocket_data.get('token', '')
            
            # 支持websocketUrls（复数）和webSocketUrls（单数）
            if not self.ws_url:
                self.ws_url = websocket_data.get('websocketUrls', [])
            
            if not self.ws_url or not self.token:
                # 尝试从响应的其他位置获取WebSocket地址
                possible_ws_keys = ['websocketUrls', 'wsUrls', 'socketUrls', 'webSocket', 'ws']
                for key in possible_ws_keys:
                    ws_value = websocket_data.get(key, data.get(key))
                    if ws_value:
                        self.ws_url = ws_value if isinstance(ws_value, list) else [ws_value]
                        self.logger.info(f"[{self.platform}] 从响应的{key}字段提取到WebSocket地址: {self.ws_url}")
                        break
                
                # 尝试从响应的其他位置获取token
                possible_token_keys = ['token', 'wsToken', 'socketToken']
                for key in possible_token_keys:
                    token_value = websocket_data.get(key, data.get(key))
                    if token_value:
                        self.token = token_value
                        self.logger.info(f"[{self.platform}] 从响应的{key}字段提取到token")
                        break
                
                if not self.ws_url or not self.token:
                    self.logger.warning(f"[{self.platform}] 未获取到完整的WebSocket信息: ws_url={self.ws_url}, token={self.token}")
                    # 尝试使用GraphQL API
                    return self._get_websocket_info_graphql()
            
            self.logger.info(f"[{self.platform}] 成功获取WebSocket信息, 共{len(self.ws_url)}个地址")
            return websocket_data
            
        except Exception as e:
            self.logger.error(f"[{self.platform}] 获取WebSocket信息异常: {e}")
            import traceback
            self.logger.debug(f"[{self.platform}] 错误详情: {traceback.format_exc()}")
            # 尝试使用GraphQL API
            return self._get_websocket_info_graphql()

    def _get_websocket_info_graphql(self) -> Optional[Dict[str, Any]]:
        """
        使用GraphQL API获取WebSocket连接信息
        
        Returns:
            Optional[Dict[str, Any]]: WebSocket信息，包含urls和token
        """
        try:
            # 构建GraphQL请求数据
            data = {
                'operationName': "WebSocketInfoQuery",
                'query': "query WebSocketInfoQuery($liveStreamId: String) {\n  webSocketInfo(liveStreamId: $liveStreamId) {\n    token\n    webSocketUrls\n    __typename\n  }\n}\n",
                'variables': {'liveStreamId': self.room_id}
            }
            
            # GraphQL API URL
            url_api = "https://live.kuaishou.com/live_graphql"
            
            # 请求头
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0',
                'Referer': f'https://live.kuaishou.com/u/{self.room_id}',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Microsoft Edge";v="144"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
            }
            
            self.logger.info(f"[{self.platform}] 尝试使用GraphQL API获取WebSocket信息")
            self.logger.debug(f"[{self.platform}] GraphQL请求URL: {url_api}")
            self.logger.debug(f"[{self.platform}] GraphQL请求数据: {data}")
            
            # 发送GraphQL请求
            response = self.session.post(url_api, headers=headers, json=data, timeout=10)
            
            self.logger.debug(f"[{self.platform}] GraphQL响应状态码: {response.status_code}")
            
            if response.status_code != 200:
                self.logger.error(f"[{self.platform}] GraphQL API请求失败，状态码: {response.status_code}")
                return None
            
            # 解析响应
            res_text = response.json()
            self.logger.debug(f"[{self.platform}] GraphQL响应数据: {res_text}")
            
            # 提取WebSocket信息
            if 'data' in res_text and 'webSocketInfo' in res_text['data']:
                web_socket_info = res_text['data']['webSocketInfo']
                token = web_socket_info.get('token', '')
                web_socket_urls = web_socket_info.get('webSocketUrls', [])
                
                if token and web_socket_urls:
                    self.token = token
                    self.ws_url = web_socket_urls if isinstance(web_socket_urls, list) else [web_socket_urls]
                    self.logger.info(f"[{self.platform}] 从GraphQL API获取到WebSocket信息")
                    self.logger.info(f"[{self.platform}] WebSocket地址: {self.ws_url}")
                    return {
                        'token': token,
                        'webSocketUrls': self.ws_url
                    }
                else:
                    self.logger.error(f"[{self.platform}] GraphQL API返回的WebSocket信息不完整")
                    return None
            else:
                self.logger.error(f"[{self.platform}] GraphQL API响应格式不正确")
                return None
            
        except Exception as e:
            self.logger.error(f"[{self.platform}] GraphQL API请求异常: {e}")
            import traceback
            self.logger.debug(f"[{self.platform}] 错误详情: {traceback.format_exc()}")
            return None

    def _pack_message(self, payload_type: int, payload: bytes, compression_type: int = 1) -> bytes:
        """
        打包WebSocket消息
        
        Args:
            payload_type: 消息类型
            payload: 消息内容（Protobuf序列化后的bytes）
            compression_type: 压缩类型（1=无压缩，2=GZIP，3=AES）
            
        Returns:
            bytes: 打包后的二进制消息
        """
        # 构造SocketMessage
        socket_msg = ksp.SocketMessage()
        socket_msg.payloadType = payload_type
        socket_msg.compressionType = compression_type
        socket_msg.payload = payload
        
        # 序列化Protobuf消息
        msg_bytes = socket_msg.SerializeToString()
        
        # 添加消息头（长度+类型）
        # 参考：https://github.com/SocialSisterYi/xkawaii-kuaishou-live-danmu/blob/master/src/KuaishouLive.ts
        header = struct.pack('>I', len(msg_bytes))
        
        return header + msg_bytes
    
    def _unpack_message(self, data: bytes) -> Optional[Dict[str, Any]]:
        """
        解包WebSocket消息
        
        Args:
            data: WebSocket接收的二进制数据
            
        Returns:
            Optional[Dict[str, Any]]: 解包后的消息
        """
        try:
            # 解析消息头
            if len(data) < 4:
                return None
            
            msg_len = struct.unpack('>I', data[:4])[0]
            
            if len(data) < 4 + msg_len:
                return None
            
            msg_bytes = data[4:4+msg_len]
            
            # 解析SocketMessage
            socket_msg = ksp.SocketMessage()
            socket_msg.ParseFromString(msg_bytes)
            
            return {
                'payloadType': socket_msg.payloadType,
                'compressionType': socket_msg.compressionType,
                'payload': socket_msg.payload
            }
            
        except Exception as e:
            self.logger.debug(f"[{self.platform}] 解包消息失败: {e}")
            return None
    
    def _decrypt_payload(self, payload: bytes, compression_type: int) -> Optional[bytes]:
        """
        解密消息内容
        
        Args:
            payload: 加密的消息内容
            compression_type: 压缩类型
            
        Returns:
            Optional[bytes]: 解密后的内容
        """
        try:
            # 如果使用AES加密
            if compression_type == 3:
                payload = self.aes_cipher.decrypt(payload)
                compression_type = 1  # 解密后通常不需要压缩
            
            # 如果使用GZIP压缩
            if compression_type == 2:
                payload = gzip.decompress(payload)
            
            return payload
            
        except Exception as e:
            self.logger.debug(f"[{self.platform}] 解密消息失败: {e}")
            return None
    
    def _extract_danmaku_from_payload(self, payload: bytes) -> List[Dict[str, Any]]:
        """
        从消息内容中提取弹幕和多种类型的消息
        
        Args:
            payload: 解密后的消息内容（Protobuf格式）
            
        Returns:
            List[Dict[str, Any]]: 消息列表（包含评论、点赞、进场、关注、礼物等）
        """
        try:
            # 使用新的消息解析器解析 payload
            # 将 bytes 转换为 hex 字符串
            hex_str = binascii.hexlify(payload).decode('utf-8')
            
            # 解析消息
            messages = self.message_parser.parse_websocket_message(hex_str)
            
            # 转换为统一格式
            danmaku_list = []
            for msg in messages:
                try:
                    # 根据消息类型处理
                    msg_type = msg.get('type', 'unknown')
                    
                    if msg_type == 'comment':
                        # 评论弹幕
                        danmaku = {
                            'userId': msg.get('user_id'),
                            'nickname': msg.get('nickname'),
                            'content': msg.get('content'),
                            'timestamp': msg.get('timestamp'),
                            'msg_type': 'comment'
                        }
                        if danmaku.get('content') and danmaku.get('nickname'):
                            danmaku_list.append(danmaku)
                            
                    elif msg_type == 'like':
                        # 点赞消息
                        danmaku = {
                            'userId': msg.get('user_id'),
                            'nickname': msg.get('nickname'),
                            'content': f"{msg.get('nickname')} 点亮了直播间",
                            'timestamp': msg.get('timestamp'),
                            'msg_type': 'like'
                        }
                        if danmaku.get('nickname'):
                            danmaku_list.append(danmaku)
                            
                    elif msg_type == 'enter':
                        # 进场消息
                        danmaku = {
                            'userId': msg.get('user_id'),
                            'nickname': msg.get('nickname'),
                            'content': f"{msg.get('nickname')} 进入了直播间",
                            'timestamp': msg.get('timestamp'),
                            'msg_type': 'enter'
                        }
                        if danmaku.get('nickname'):
                            danmaku_list.append(danmaku)
                            
                    elif msg_type == 'follow':
                        # 关注消息
                        danmaku = {
                            'userId': msg.get('user_id'),
                            'nickname': msg.get('nickname'),
                            'content': f"{msg.get('nickname')} 关注了主播",
                            'timestamp': msg.get('timestamp'),
                            'msg_type': 'follow'
                        }
                        if danmaku.get('nickname'):
                            danmaku_list.append(danmaku)
                            
                    elif msg_type == 'gift':
                        # 礼物消息
                        gift_name = msg.get('gift_name', msg.get('content', '未知礼物'))
                        gift_count = msg.get('gift_count', 1)
                        danmaku = {
                            'userId': msg.get('user_id'),
                            'nickname': msg.get('nickname'),
                            'content': f"{msg.get('nickname')} 送出了 {gift_name} x{gift_count}",
                            'timestamp': msg.get('timestamp'),
                            'msg_type': 'gift',
                            'gift_id': msg.get('gift_id'),
                            'gift_name': gift_name,
                            'gift_count': gift_count
                        }
                        if danmaku.get('nickname'):
                            danmaku_list.append(danmaku)
                            
                    else:
                        # 其他类型消息
                        danmaku = {
                            'userId': msg.get('user_id'),
                            'nickname': msg.get('nickname'),
                            'content': msg.get('description', msg.get('content', '')),
                            'timestamp': msg.get('timestamp'),
                            'msg_type': 'unknown'
                        }
                        if danmaku.get('content'):
                            danmaku_list.append(danmaku)
                            
                except Exception as e:
                    self.logger.debug(f"[{self.platform}] 处理单条消息失败: {e}")
                    continue
            
            return danmaku_list
            
        except Exception as e:
            self.logger.debug(f"[{self.platform}] 提取消息失败: {e}")
            return []
    
    async def _send_heartbeat(self):
        """
        发送心跳包
        """
        try:
            while self.is_running and self.websocket:
                try:
                    # 构造CSWebHeartbeat消息
                    heartbeat = ksp.CSWebHeartbeat()
                    heartbeat.timestamp = int(time.time() * 1000)
                    
                    # 序列化Protobuf
                    payload = heartbeat.SerializeToString()
                    
                    # 打包消息（CS_HEARTBEAT = 1）
                    msg = self._pack_message(1, payload, 1)
                    
                    await self.websocket.send(msg)
                    self.logger.debug(f"[{self.platform}] 发送心跳")
                    
                except Exception as e:
                    self.logger.error(f"[{self.platform}] 发送心跳失败: {e}")
                    break
                
                await asyncio.sleep(20)  # 每20秒发送一次心跳
                
        except Exception as e:
            self.logger.error(f"[{self.platform}] 心跳任务异常: {e}")

    async def _send_enter_room_wsclient(self, ws):
        """
        通过websocket-client库发送进入房间消息（使用与浏览器完全一致的格式）
        
        Args:
            ws: websocket-client连接实例

        发起消息结构：
        # 构成：
        1.开头特征
        2.Token
        3.分隔符
        4.liveStreamId:
        5.分隔符
        6.page_id(kslive.log.page_id)(固定的16位字符串_时间戳)

        # 格式： 
        开头特征 + Token + 分隔符 + liveStreamId: + 分隔符 + page_id
        """
        try:
            self.logger.info(f"[{self.platform}] WebSocket连接建立，正在发送进房包...")
            
            # 获取各部分数据
            token = self.token  # 已经是Base64编码的
            session_id = self.room_id
            
            # 生成与浏览器一致的时间戳前缀（随机字符串）
            import random
            import string
            # # page_id的随机生成，但并不随机
            timestamp = str(int(time.time() * 1000))
            # timestamp_prefix = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
            # charset = "bjectSymhasOwnProp-0123456789ABCDEFGHIJKLMNQRTUVWXYZ_dfgiklquvxz"
            # timestamp_prefix = ''.join(random.choices(charset, k=16))
            page_id = "lQ-qwSuHNFfNYCCO_1769669970604"
            
            # 开头特征：使用与浏览器完全一致的起始特征
            '''
            浏览f12开发者模式hex，发现开头特征为\x08\xc8\x01\x1a\x88\x02\x0a\xd8
            '''
            # 包含换行符的开头特征
            start_marker = b'\x08\xc8\x01\x1a\x88\x02\x0a\xd8'
            
            # Token（已经是Base64编码的）
            token_bytes = token.encode('utf-8')
            
            # 分隔符和标识符部分
            separator1 = b'\x1a'
            separator2 = b'\x12\x0b'
            session_part = f"{session_id}:".encode('utf-8')  # 注意添加冒号
            separator3 = b'\x1e'
            page_id_part = page_id.encode('utf-8')
            
            self.logger.debug(f"[{self.platform}] Token: {token}")
            self.logger.debug(f"[{self.platform}] Session ID: {session_id}")
            self.logger.debug(f"[{self.platform}] page_id: {page_id}")

            # 构造完整消息
            # 格式： 开头特征 + Token + 分隔符 + liveStreamId: + 分隔符 + page_id
            msg = start_marker + separator1 + token_bytes + separator2 + session_part + separator3 + page_id_part
            self.logger.debug(f"[{self.platform}] 消息长度: {len(msg)}")
            self.logger.debug(f'[{self.platform}] 组合后hex值是：{msg}')
            # 打印组合后的内容（按utf-8格式）
            try:
                msg_utf8 = msg.decode('utf-8', errors='replace')
                self.logger.debug(f"[{self.platform}] 组合后消息内容（UTF-8）: {msg_utf8}")
            except Exception as e:
                self.logger.debug(f"[{self.platform}] 无法按UTF-8解码消息: {e}")
            
            # 使用Binary帧发送消息
            import websocket
            ws.send(msg, opcode=websocket.ABNF.OPCODE_BINARY)
            self.logger.info(f"[{self.platform}] 发送进入房间消息（Binary帧）成功")
            
        except Exception as e:
            self.logger.error(f"[{self.platform}] 发送进入房间消息失败: {e}")
            import traceback
            self.logger.debug(traceback.format_exc())

    async def _process_message_wsclient(self, message):
        """
        处理通过websocket-client库接收到的消息
        
        Args:
            message: 接收到的原始消息
        """
        try:
            # 解包消息
            msg = self._unpack_message(message)
            if not msg:
                return
            
            payload_type = msg.get('payloadType')
            compression_type = msg.get('compressionType')
            payload = msg.get('payload', b'')
            
            # 如果是SC_FEED_PUSH消息（310），提取弹幕
            if payload_type == 310:
                # 解密消息内容
                decrypted_payload = self._decrypt_payload(payload, compression_type)
                if decrypted_payload:
                    # 提取弹幕
                    danmaku_list = self._extract_danmaku_from_payload(decrypted_payload)
                    
                    for danmaku in danmaku_list:
                        # 处理并存储弹幕
                        processed = await self._process_message(danmaku)
                        if processed:
                            self.add_to_buffer(processed)
                            self.logger.debug(f"[{self.platform}] 收到弹幕: {processed.get('username', '')}: {processed.get('content', '')}")
        except Exception as e:
            self.logger.error(f"[{self.platform}] 处理消息失败: {e}")

    async def _send_heartbeat_wsclient(self):
        """
        通过websocket-client库发送心跳消息
        """
        try:
            while self.is_running and self.websocket:
                try:
                    # 构造CSWebHeartbeat消息
                    heartbeat = ksp.CSWebHeartbeat()
                    heartbeat.timestamp = int(time.time() * 1000)
                    
                    # 序列化Protobuf
                    payload = heartbeat.SerializeToString()
                    
                    # 打包消息（CS_HEARTBEAT = 1）
                    msg = self._pack_message(1, payload, 1)
                    
                    # 检查websocket-client实例是否可用
                    if hasattr(self.websocket, 'sock') and self.websocket.sock and self.websocket.sock.connected:
                        self.websocket.sock.send(msg)
                        self.logger.debug(f"[{self.platform}] 发送心跳")
                    else:
                        self.logger.error(f"[{self.platform}] WebSocket连接已关闭，无法发送心跳")
                        break
                    
                except Exception as e:
                    self.logger.error(f"[{self.platform}] 发送心跳失败: {e}")
                    break
                
                import asyncio
                await asyncio.sleep(20)  # 每20秒发送一次心跳
                
        except Exception as e:
            self.logger.error(f"[{self.platform}] 心跳任务异常: {e}")

    async def _send_enter_room(self):
        """
        发送进入房间消息
        """
        try:
            # 构造CSWebEnterRoom消息
            enter_room = ksp.CSWebEnterRoom()
            enter_room.liveStreamId = self.room_id
            enter_room.token = self.token
            
            # 序列化Protobuf
            payload = enter_room.SerializeToString()
            
            # 打包消息（CS_ENTER_ROOM = 200）
            msg = self._pack_message(200, payload, 1)
            
            await self.websocket.send(msg)
            self.logger.info(f"[{self.platform}] 发送进入房间消息")
            
        except Exception as e:
            self.logger.error(f"[{self.platform}] 发送进入房间消息失败: {e}")
    
    async def _receive_message(self):
        """
        接收WebSocket消息
        """
        try:
            while self.is_running and self.websocket:
                try:
                    data = await self.websocket.recv()
                    
                    # 解包消息
                    msg = self._unpack_message(data)
                    if not msg:
                        continue
                    
                    payload_type = msg.get('payloadType')
                    compression_type = msg.get('compressionType')
                    payload = msg.get('payload', b'')
                    
                    # 如果是SC_FEED_PUSH消息（310），提取弹幕
                    if payload_type == 310:
                        # 解密消息内容
                        decrypted_payload = self._decrypt_payload(payload, compression_type)
                        if decrypted_payload:
                            # 提取弹幕
                            danmaku_list = self._extract_danmaku_from_payload(decrypted_payload)
                            
                            for danmaku in danmaku_list:
                                # 处理并存储弹幕
                                processed = await self._process_message(danmaku)
                                if processed:
                                    self.add_to_buffer(processed)
                                    self.logger.debug(f"[{self.platform}] 收到弹幕: {processed.get('username', '')}: {processed.get('content', '')}")
                
                except websockets.exceptions.ConnectionClosed:
                    self.logger.warning(f"[{self.platform}] WebSocket连接已关闭")
                    break
                except Exception as e:
                    self.logger.error(f"[{self.platform}] 接收消息失败: {e}")
                    await asyncio.sleep(1)
                    
        except Exception as e:
            self.logger.error(f"[{self.platform}] 接收任务异常: {e}")
    
    def add_to_buffer(self, danmaku: Dict[str, Any]):
        """
        添加弹幕到缓冲区
        
        Args:
            danmaku: 弹幕数据
        """
        # 使用线程锁保证线程安全
        with self.buffer_lock:
            self.danmaku_buffer.append(danmaku)
            
            # 限制缓冲区大小
            if len(self.danmaku_buffer) > self.max_buffer_size:
                self.danmaku_buffer = self.danmaku_buffer[-self.max_buffer_size:]
    
    def _extract_livestreamid_from_url(self, url: str) -> Optional[str]:
        """
        从快手直播间URL或用户主页URL中提取liveStreamId

        Args:
            url: 快手直播间URL或快手id

        Returns:
            Optional[str]: liveStreamId，失败返回None
        """
        import re
        import json

        try:
            self.logger.info(f"[{self.platform}] 正在从URL提取liveStreamId: {url}")

            # 步骤1: 检查URL格式，提取author_id
            # 处理不同格式的URL
            author_id = None
            
            # 检查是否是临时跳转链接（3x开头，不是用户主页）
            if re.search(r'live\.kuaishou\.com/(3x[a-zA-Z0-9]+)', url) and not re.search(r'live\.kuaishou\.com/u/', url):
                # 格式: https://live.kuaishou.com/3x1234567890
                # 这是一个临时跳转链接，需要访问获取真实URL
                self.logger.info(f"[{self.platform}] 检测到临时跳转链接，正在获取真实URL: {url}")
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9',
                    'Referer': 'https://live.kuaishou.com/'
                }
                # 访问临时链接获取跳转后的真实URL
                response = self.session.get(url, headers=headers, timeout=10, allow_redirects=True)
                response.raise_for_status()
                # 获取跳转后的真实URL
                real_url = response.url
                self.logger.info(f"[{self.platform}] 获取到真实URL: {real_url}")
                # 递归调用本方法处理真实URL
                return self._extract_livestreamid_from_url(real_url)
            elif re.search(r'live\.kuaishou\.com/u/', url):
                # 格式: https://live.kuaishou.com/u/3xwgei6q9i989
                match = re.search(r'live\.kuaishou\.com/u/([^/?]+)', url)
                if match:
                    author_id = match.group(1)
                    self.logger.info(f"[{self.platform}] 从URL提取到author_id: {author_id}")
            elif not url.startswith('http'):
                # 如果直接输入的是author_id
                author_id = url
                self.logger.info(f"[{self.platform}] 直接使用输入作为author_id: {author_id}")

            # 如果提取到author_id，构造标准直播间URL
            if author_id:
                url = f"https://live.kuaishou.com/u/{author_id}"
                self.logger.info(f"[{self.platform}] 构造直播间URL: {url}")

            # 步骤2: 访问页面获取liveStreamId
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Referer': 'https://live.kuaishou.com/'
            }

            # 如果session中有cookie，会自动使用
            response = self.session.get(url, headers=headers, timeout=10, allow_redirects=True)
            response.raise_for_status()

            html = response.text

            # 步骤3: 检查是否触发了验证码
            if "验证" in html or "captcha" in html or "请完成安全验证" in html:
                self.logger.error(f"[{self.platform}] 触发了验证码，无法提取liveStreamId")
                self.logger.warning(f"[{self.platform}] 建议在浏览器中访问一次，然后将Cookie复制到配置中")
                return None

            # 步骤4: 尝试从window.__INITIAL_STATE__中提取（推荐方法）
            self.logger.info(f"[{self.platform}] 尝试从window.__INITIAL_STATE__中提取liveStreamId")
            state_match = re.search(r'window\.__INITIAL_STATE__=(.*?);\s*\(function|window\.__INITIAL_STATE__=(.*?);\s*$', html, re.DOTALL)
            if state_match:
                try:
                    # 获取匹配的JSON字符串
                    json_str = state_match.group(1) or state_match.group(2)
                    if not json_str:
                        raise ValueError("No JSON string matched")
                    
                    # 清理JSON字符串，移除可能的JavaScript语法
                    # 移除末尾的分号
                    json_str = json_str.rstrip(';')
                    # 移除可能的注释
                    json_str = re.sub(r'//.*$', '', json_str, flags=re.MULTILINE)
                    json_str = re.sub(r'/\*[\s\S]*?\*/', '', json_str)
                    # 处理JavaScript特有值
                    json_str = json_str.replace('undefined', 'null')
                    json_str = json_str.replace('NaN', 'null')
                    json_str = json_str.replace('Infinity', 'null')
                    json_str = json_str.replace('-Infinity', 'null')
                    # 确保布尔值是小写
                    json_str = re.sub(r'\bTrue\b', 'true', json_str)
                    json_str = re.sub(r'\bFalse\b', 'false', json_str)
                    # 移除多余的空格
                    json_str = json_str.strip()
                    
                    # 尝试解析JSON
                    data = json.loads(json_str)
                    
                    # 尝试多种可能的路径获取liveStreamId
                    possible_paths = [
                        ['requests', 'liveroom', 'liveStream', 'id'],
                        ['liveroom', 'liveStream', 'id'],
                        ['liveStream', 'id'],
                        ['roomInfo', 'liveStream', 'id'],
                        ['room', 'liveStream', 'id'],
                        ['data', 'liveStream', 'id'],
                        # 新增：支持playList结构
                        ['requests', 'liveroom', 'playList', 0, 'liveStream', 'id'],
                        ['liveroom', 'playList', 0, 'liveStream', 'id'],
                        ['playList', 0, 'liveStream', 'id']
                    ]
                    
                    livestreamid = None
                    for path in possible_paths:
                        try:
                            value = data
                            for key in path:
                                value = value[key]
                            if value:
                                livestreamid = value
                                self.logger.info(f"[{self.platform}] 从window.__INITIAL_STATE__提取到liveStreamId: {livestreamid}")
                                break
                        except (KeyError, TypeError):
                            continue
                    
                    # 尝试提取WebSocket相关信息
                    if livestreamid:
                        # 尝试多种可能的路径获取WebSocket信息
                        ws_paths = [
                            ['requests', 'liveroom', 'liveStream', 'webSocketUrls'],
                            ['requests', 'liveroom', 'liveStream', 'urls'],
                            ['requests', 'liveroom', 'liveStream', 'token'],
                            ['liveroom', 'liveStream', 'webSocketUrls'],
                            ['liveroom', 'liveStream', 'urls'],
                            ['liveroom', 'liveStream', 'token'],
                            ['liveStream', 'webSocketUrls'],
                            ['liveStream', 'urls'],
                            ['liveStream', 'token'],
                            ['roomInfo', 'liveStream', 'webSocketUrls'],
                            ['roomInfo', 'liveStream', 'urls'],
                            ['roomInfo', 'liveStream', 'token'],
                            ['room', 'liveStream', 'webSocketUrls'],
                            ['room', 'liveStream', 'urls'],
                            ['room', 'liveStream', 'token'],
                            ['data', 'liveStream', 'webSocketUrls'],
                            ['data', 'liveStream', 'urls'],
                            ['data', 'liveStream', 'token'],
                            # 新增：支持playList结构
                            ['requests', 'liveroom', 'playList', 0, 'liveStream', 'webSocketUrls'],
                            ['requests', 'liveroom', 'playList', 0, 'liveStream', 'urls'],
                            ['requests', 'liveroom', 'playList', 0, 'liveStream', 'token'],
                            ['liveroom', 'playList', 0, 'liveStream', 'webSocketUrls'],
                            ['liveroom', 'playList', 0, 'liveStream', 'urls'],
                            ['liveroom', 'playList', 0, 'liveStream', 'token'],
                            ['playList', 0, 'liveStream', 'webSocketUrls'],
                            ['playList', 0, 'liveStream', 'urls'],
                            ['playList', 0, 'liveStream', 'token']
                        ]
                        
                        for path in ws_paths:
                            try:
                                value = data
                                for key in path:
                                    value = value[key]
                                if value:
                                    if 'webSocketUrls' in path or 'urls' in path:
                                        self.ws_url = value if isinstance(value, list) else [value]
                                        self.logger.info(f"[{self.platform}] 从window.__INITIAL_STATE__提取到WebSocket地址: {self.ws_url}")
                                    elif 'token' in path:
                                        self.token = value
                                        self.logger.info(f"[{self.platform}] 从window.__INITIAL_STATE__提取到token: {self.token}")
                            except (KeyError, TypeError):
                                continue
                    
                    if livestreamid:
                        return livestreamid
                except json.JSONDecodeError as e:
                    self.logger.warning(f"[{self.platform}] 解析window.__INITIAL_STATE__失败: {e}")
                    # 打印前500个字符和错误位置附近的内容，方便调试
                    if state_match:
                        error_pos = min(e.pos, len(state_match.group(1) or '') - 1)
                        start_pos = max(0, error_pos - 100)
                        end_pos = min(len(state_match.group(1) or ''), error_pos + 100)
                        context = (state_match.group(1) or '')[start_pos:end_pos]
                        self.logger.debug(f"[{self.platform}] 错误位置附近的内容: {context}")
                except Exception as e:
                    self.logger.warning(f"[{self.platform}] 处理window.__INITIAL_STATE__时发生错误: {e}")

            # 步骤5: 尝试直接正则匹配liveStreamId
            self.logger.info(f"[{self.platform}] 尝试直接正则匹配liveStreamId")
            # 尝试多种可能的正则模式
            patterns = [
                r'"liveStreamId"\s*:\s*"([^"]+)"',  # 标准格式
                r"liveStreamId:\s*'([^']+)',",  # 单引号格式
                r'liveStreamId=([a-zA-Z0-9]+)',  # URL参数格式
                r'liveStreamId\\s*=\\s*["\']?([a-zA-Z0-9]+)["\']?',  # 松散格式
                r'id\s*:\s*["\']([a-zA-Z0-9]+)["\'].*?liveStream',  # 可能的变体
                r'liveStream\\s*:\s*\{[^}]*?id\s*:\s*["\']([a-zA-Z0-9]+)["\']',
                r'["\'](3x[a-zA-Z0-9]{10,})["\'].*?liveStream',  # 以3x开头的liveStreamId
                r'liveStream.*?["\'](3x[a-zA-Z0-9]{10,})["\']'  # 另一种3x开头的格式
            ]
            
            for i, pattern in enumerate(patterns):
                try:
                    match = re.search(pattern, html)
                    if match:
                        livestreamid = match.group(1)
                        self.logger.info(f"[{self.platform}] 从正则模式{i+1}提取到liveStreamId: {livestreamid}")
                        return livestreamid
                except Exception as e:
                    self.logger.debug(f"[{self.platform}] 正则模式{i+1}执行失败: {e}")
            
            # 步骤5.1: 直接搜索3x开头的字符串
            self.logger.info(f"[{self.platform}] 尝试直接搜索3x开头的liveStreamId")
            three_x_pattern = r'3x[a-zA-Z0-9]{10,}'
            matches = re.findall(three_x_pattern, html)
            if matches:
                # 优先选择长度合理的匹配
                for candidate in matches:
                    if 12 <= len(candidate) <= 30:  # 合理的长度范围
                        self.logger.info(f"[{self.platform}] 直接搜索到liveStreamId: {candidate}")
                        return candidate
            
            # 步骤6: 尝试从GraphQL API获取（备用方法）
            if author_id:
                self.logger.info(f"[{self.platform}] 尝试从GraphQL API获取liveStreamId")
                try:
                    api_url = "https://live.kuaishou.com/live_api/profile/public"
                    api_params = {
                        'principalId': author_id
                    }
                    
                    api_response = self.session.get(api_url, params=api_params, headers=headers, timeout=10)
                    api_response.raise_for_status()
                    
                    api_data = api_response.json()
                    self.logger.debug(f"[{self.platform}] GraphQL API返回: {api_data}")
                    
                    # 尝试从API响应中提取liveStreamId
                    possible_api_paths = [
                        ['data', 'liveStream', 'id'],
                        ['data', 'live', 'liveStream', 'id'],
                        ['data', 'roomInfo', 'liveStream', 'id']
                    ]
                    
                    for path in possible_api_paths:
                        try:
                            value = api_data
                            for key in path:
                                value = value[key]
                            if value:
                                livestreamid = value
                                self.logger.info(f"[{self.platform}] 从GraphQL API提取到liveStreamId: {livestreamid}")
                                return livestreamid
                        except (KeyError, TypeError):
                            continue
                except Exception as e:
                    self.logger.warning(f"[{self.platform}] GraphQL API请求失败: {e}")

            # 步骤7: 提取失败，返回错误信息
            self.logger.error(f"[{self.platform}] 无法从URL提取liveStreamId，请确认：")
            self.logger.error(f"[{self.platform}] 1. 主播是否正在直播")
            self.logger.error(f"[{self.platform}] 2. 是否需要登录Cookie")
            self.logger.error(f"[{self.platform}] 3. URL格式是否正确（应该包含主播ID）")
            self.logger.error(f"[{self.platform}] 提示: liveStreamId是单次直播的会话ID，每次开播都会变化")
            return None

        except Exception as e:
            self.logger.error(f"[{self.platform}] 提取liveStreamId失败: {e}")
            import traceback
            self.logger.debug(f"[{self.platform}] 错误详情: {traceback.format_exc()}")
            return None

    async def connect(self) -> bool:
        """
        连接到快手弹幕服务器
        使用WebSocket方式获取实时弹幕
        
        Returns:
            bool: 连接是否成功
        """
        try:
            # 步骤 1: 尝试解析真实的 liveStreamId
            # 只有当传入的 liveStreamId 为空时，才尝试从页面上获取最新的 liveStreamId
            # 因为如果已经传入了有效的 liveStreamId，就不需要再从页面上获取了
            if not self.room_id:
                self.logger.info(f"[{self.platform}] 传入的 liveStreamId 为空，尝试从页面获取")
                real_livestream_id = self._extract_livestreamid_from_url(self.ks_id)
                
                if real_livestream_id:
                    self.logger.info(f"[{self.platform}] 从页面获取到 liveStreamId: {real_livestream_id}")
                    self.room_id = real_livestream_id
                else:
                    self.logger.error(f"[{self.platform}] 无法从页面解析 liveStreamId，连接失败")
                    return False
            else:
                self.logger.info(f"[{self.platform}] 直接使用传入的 liveStreamId: {self.room_id}")

            # 步骤 2: 获取WebSocket连接信息
            ws_info = self._get_websocket_info()
            if not ws_info:
                # 如果获取失败，尝试从页面重新提取liveStreamId（可能之前的提取失败了）
                self.logger.info(f"[{self.platform}] 获取WebSocket信息失败，尝试重新从页面提取liveStreamId")
                # 构造标准直播间URL
                url = f"https://live.kuaishou.com/u/{self.ks_id}"
                real_livestream_id = self._extract_livestreamid_from_url(url)
                if real_livestream_id and real_livestream_id != self.room_id:
                    self.logger.info(f"[{self.platform}] 重新转换 ID: {self.room_id} -> {real_livestream_id}")
                    self.room_id = real_livestream_id
                    # 再次尝试获取WebSocket连接信息
                    ws_info = self._get_websocket_info()
                    if not ws_info:
                        return False
                else:
                    return False
            
            # 尝试连接WebSocket
            self.logger.info(f"[{self.platform}] 正在连接WebSocket...")
            
            # 尝试连接可用的WebSocket地址
            for url in self.ws_url:
                try:
                    # 使用websocket-client库连接
                    import websocket
                    import threading
                    
                    # 保存WebSocket连接
                    ws_client = None
                    
                    def on_open(ws):
                        nonlocal ws_client
                        ws_client = ws
                        self.logger.info(f"[{self.platform}] WebSocket连接成功: {url}")
                        # 发送进入房间消息
                        import asyncio
                        asyncio.run(self._send_enter_room_wsclient(ws))
                        
                    def on_message(ws, message):
                        # 处理接收到的消息
                        import asyncio
                        asyncio.run(self._process_message_wsclient(message))
                        
                    def on_error(ws, error):
                        self.logger.error(f"[{self.platform}] WebSocket错误: {error}")
                        
                    def on_close(ws, close_status_code, close_msg):
                        self.logger.info(f"[{self.platform}] WebSocket连接关闭")
                        self.is_running = False
                    
                    # 直接使用原始的WebSocket URL，不添加额外参数
                    self.logger.debug(f"[{self.platform}] 使用原始WebSocket URL: {url}")
                    
                    # 构建WebSocket连接的Headers 但目前未使用
                    headers = {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0',
                        'Origin': 'https://live.kuaishou.com',
                    }
                    if 'Cookie' in self.session.headers:
                        headers['Cookie'] = self.session.headers['Cookie']
                    
                    # 创建WebSocket客户端
                    websocket.enableTrace(True)
                    ws_app = websocket.WebSocketApp(
                        url,
                        on_open=on_open,
                        on_message=on_message,
                        on_error=on_error,
                        on_close=on_close,
                        # header = headers, # 携带cookie
                    )
                    
                    # 启动WebSocket客户端（非阻塞）
                    def run_websocket():
                        try:
                            ws_app.run_forever(
                                ping_interval=20,
                                ping_timeout=10
                            )
                        except Exception as e:
                            self.logger.error(f"[{self.platform}] WebSocket线程异常: {e}")
                            import traceback
                            self.logger.debug(traceback.format_exc())
                            self.is_running = False
                    
                    ws_thread = threading.Thread(target=run_websocket)
                    ws_thread.daemon = True
                    ws_thread.start()
                    
                    # 等待连接建立
                    import time
                    time.sleep(2)
                    
                    if ws_client:
                        self.websocket = ws_app
                        self.ws_thread = ws_thread
                        break
                    else:
                        self.logger.warning(f"[{self.platform}] 连接 {url} 失败: 连接未建立")
                        continue
                    
                except Exception as e:
                    self.logger.warning(f"[{self.platform}] 连接 {url} 失败: {e}")
                    continue
            else:
                self.logger.error(f"[{self.platform}] 所有WebSocket地址连接失败")
                return False
            
            # 设置运行状态
            self.is_running = True
            self.start_time = time.time()
            
            # 启动心跳任务
            import asyncio
            self.heartbeat_task = asyncio.create_task(self._send_heartbeat_wsclient())
            
            self.logger.info(f"[{self.platform}] 弹幕连接成功，开始接收弹幕")
            return True
            
        except Exception as e:
            self.logger.error(f"[{self.platform}] 连接失败: {e}")
            import traceback
            self.logger.debug(traceback.format_exc())
            return False

    
    async def disconnect(self):
        """
        断开与快手弹幕服务器的连接
        """
        self.is_running = False
        
        # 取消任务
        if self.receive_task:
            self.receive_task.cancel()
            try:
                await self.receive_task
            except:
                pass
        
        if self.heartbeat_task:
            self.heartbeat_task.cancel()
            try:
                await self.heartbeat_task
            except:
                pass
        
        # 关闭WebSocket
        if self.websocket:
            try:
                # 检查是否是websocket-client实例
                if hasattr(self.websocket, 'close'):
                    # 对于websocket-client实例
                    self.websocket.close()
                else:
                    # 对于websockets库实例
                    await self.websocket.close()
            except Exception as e:
                self.logger.error(f"关闭WebSocket失败: {e}")
        
        # 关闭session
        if self.session:
            try:
                self.session.close()
            except Exception as e:
                self.logger.error(f"断开快手弹幕连接失败: {e}")
    
    def _get_comments_via_http(self, limit: int = 50) -> List[Dict[str, Any]]:
        """
        通过HTTP API获取快手直播间评论数据
        当WebSocket连接失败时，使用此方法获取评论
        
        Args:
            limit: 获取评论数量限制
            
        Returns:
            List[Dict[str, Any]]: 评论数据列表
        """
        comments = []
        
        try:
            self.logger.info(f"[{self.platform}] 尝试通过HTTP API获取评论数据")
            
            # 尝试多个可能的API端点
            api_endpoints = [
                {
                    'url': 'https://live.kuaishou.com/live_api/liveroom/websocketinfo',
                    'params': {
                        'liveStreamId': self.room_id,
                        'caver': 2,
                        '__NS_hxfalcon': self._generate_ns_hxfalcon(self.room_id)
                    },
                    'description': 'WebSocket信息API'
                },
                {
                    'url': 'https://live.kuaishou.com/live_api/comment/list',
                    'params': {'liveStreamId': self.room_id, 'count': limit, 'caver': 2},
                    'description': '评论列表API'
                },
                {
                    'url': 'https://live.kuaishou.com/live_api/chat/list',
                    'params': {'liveStreamId': self.room_id, 'count': limit, 'caver': 2},
                    'description': '聊天记录API'
                }
            ]
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0',
                'Referer': f'https://live.kuaishou.com/u/{self.room_id}',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Microsoft Edge";v="144"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'kww': 'K408WWQK1WMvAnj5ysWy4uSqG3bFcmRrv0/vijpwWnXUiYW6+L0lrtti3yHXZp6BDxshPyRmBGIqdKgEF5OaF+Rnyqs8AVZ/9V6jbo7nRWb8uMF6qgjSb4VbknGC5AUKOMTpms9b4bOz4gNK7TIFbaxwF=='
            }
            
            for endpoint in api_endpoints:
                try:
                    self.logger.debug(f"[{self.platform}] 尝试{endpoint['description']}: {endpoint['url']}")
                    
                    response = self.session.get(
                        endpoint['url'],
                        params=endpoint['params'],
                        headers=headers,
                        timeout=10
                    )
                    
                    self.logger.debug(f"[{self.platform}] {endpoint['description']}响应状态码: {response.status_code}")
                    
                    if response.status_code == 200:
                        data = response.json()
                        self.logger.debug(f"[{self.platform}] {endpoint['description']}响应数据: {data}")
                        
                        # 尝试从响应中提取评论数据
                        extracted_comments = self._extract_comments_from_response(data)
                        if extracted_comments:
                            comments.extend(extracted_comments)
                            self.logger.info(f"[{self.platform}] 从{endpoint['description']}获取到 {len(extracted_comments)} 条评论")
                            
                            if len(comments) >= limit:
                                break
                
                except Exception as e:
                    self.logger.debug(f"[{self.platform}] {endpoint['description']}请求失败: {e}")
                    continue
            
            # 如果API端点都失败，尝试从页面HTML中提取评论
            if not comments:
                self.logger.info(f"[{self.platform}] API端点都失败，尝试从页面HTML中提取评论")
                comments = self._extract_comments_from_html()
            
            self.logger.info(f"[{self.platform}] HTTP API共获取到 {len(comments)} 条评论")
            
        except Exception as e:
            self.logger.error(f"[{self.platform}] 通过HTTP API获取评论失败: {e}")
        
        return comments
    
    def _generate_ns_hxfalcon(self, liveStreamId: str) -> str:
        """
        生成 __NS_hxfalcon 参数
        通过调用本地 HTTP 服务获取加密结果
        
        Args:
            liveStreamId: 直播间ID
            
        Returns:
            str: 生成的 __NS_hxfalcon 参数
        """
        try:
            # 服务地址
            url = "http://localhost:8080/token"
            
            # 构造请求参数
            data = {
                'url': '/live_api/liveroom/websocketinfo',
                'query': {
                    'liveStreamId': liveStreamId,
                    'caver': '2'
                }
            }
            
            # 发送 POST 请求
            response = requests.post(url, json=data, timeout=10)
            
            # 检查响应状态码
            if response.status_code != 200:
                self.logger.error(f"[{self.platform}] 获取 __NS_hxfalcon 失败，状态码: {response.status_code}")
                # 失败时返回默认值
                return 'HUDR_sFnX-DtsB0FXsbDPT3TMP-sk0ishB7ND_Bxe3L3K-RS7eNsXai_ut5POQayfk4twoEaCZi52Qvk2IT0zmpjb_OtO8KEdgwI4YxbBVQWtmsiu3BGqZ7ljcDFpy4srDjIFQ7UVJkuImbuGN1lU3wbETHvK50pajNtL-bUlhQif$HE_1b049df9fb5e2b15adcb515afc680d52e951505050518fc8fcea458d24b572075f65cb51cb066e8a2b066eb850'
            
            # 解析响应
            result = response.json()
            
            # 检查响应数据
            if not result.get('success'):
                self.logger.error(f"[{self.platform}] 获取 __NS_hxfalcon 失败: {result.get('error', '未知错误')}")
                # 失败时返回默认值
                return 'HUDR_sFnX-DtsB0FXsbDPT3TMP-sk0ishB7ND_Bxe3L3K-RS7eNsXai_ut5POQayfk4twoEaCZi52Qvk2IT0zmpjb_OtO8KEdgwI4YxbBVQWtmsiu3BGqZ7ljcDFpy4srDjIFQ7UVJkuImbuGN1lU3wbETHvK50pajNtL-bUlhQif$HE_1b049df9fb5e2b15adcb515afc680d52e951505050518fc8fcea458d24b572075f65cb51cb066e8a2b066eb850'
            
            # 返回生成的 __NS_hxfalcon 参数
            token = result.get('token', '')
            self.logger.debug(f"[{self.platform}] 成功获取 __NS_hxfalcon: {token}")
            return token
            
        except Exception as e:
            self.logger.error(f"[{self.platform}] 调用服务生成 __NS_hxfalcon 失败: {e}")
            # 异常时返回默认值
            return 'HUDR_sFnX-DtsB0FXsbDPT3TMP-sk0ishB7ND_Bxe3L3K-RS7eNsXai_ut5POQayfk4twoEaCZi52Qvk2IT0zmpjb_OtO8KEdgwI4YxbBVQWtmsiu3BGqZ7ljcDFpy4srDjIFQ7UVJkuImbuGN1lU3wbETHvK50pajNtL-bUlhQif$HE_1b049df9fb5e2b15adcb515afc680d52e951505050518fc8fcea458d24b572075f65cb51cb066e8a2b066eb850'
    
    def _extract_comments_from_response(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        从API响应中提取评论数据
        
        Args:
            data: API响应数据
            
        Returns:
            List[Dict[str, Any]]: 评论数据列表
        """
        comments = []
        
        try:
            # 尝试多种可能的数据结构
            possible_paths = [
                ['data', 'comments'],
                ['data', 'commentFeeds'],
                ['data', 'list'],
                ['data', 'commentList'],  # 添加对commentList字段的支持
                ['comments'],
                ['commentFeeds'],
                ['list'],
                ['commentList'],  # 添加对commentList字段的支持
                ['data', 'result', 'comments'],
                ['result', 'comments']
            ]
            
            for path in possible_paths:
                try:
                    value = data
                    for key in path:
                        value = value[key]
                    
                    if value and isinstance(value, list):
                        for item in value:
                            comment = self._parse_comment_item(item)
                            if comment:
                                comments.append(comment)
                        break
                except (KeyError, TypeError):
                    continue
            
        except Exception as e:
            self.logger.debug(f"[{self.platform}] 从响应提取评论失败: {e}")
        
        return comments
    
    def _parse_comment_item(self, item: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        解析单条评论数据
        
        Args:
            item: 评论数据项
            
        Returns:
            Optional[Dict[str, Any]]: 解析后的评论数据
        """
        try:
            user_info = item.get('user', item.get('userInfo', {}))
            
            comment = {
                'userId': user_info.get('id', user_info.get('principalId', user_info.get('userId', ''))),
                'nickname': user_info.get('name', user_info.get('userName', user_info.get('nickname', ''))),
                'content': item.get('content', item.get('text', item.get('comment', ''))),
                'timestamp': item.get('timestamp', item.get('time', int(time.time() * 1000))),
                'msg_type': 'comment',
                'platform': 'kuaishou'
            }
            
            if comment['content']:
                return comment
            
        except Exception as e:
            self.logger.debug(f"[{self.platform}] 解析评论项失败: {e}")
        
        return None
    
    def _extract_comments_from_html(self) -> List[Dict[str, Any]]:
        """
        从页面HTML中提取评论数据
        
        Returns:
            List[Dict[str, Any]]: 评论数据列表
        """
        import re
        import json
        comments = []
        
        try:
            self.logger.info(f"[{self.platform}] 尝试从页面HTML提取评论")
            
            # 获取直播间页面
            url = f"https://live.kuaishou.com/u/{self.room_id}"
            response = self.session.get(url, timeout=10)
            
            if response.status_code == 200:
                html = response.text
                
                # 尝试从window.__INITIAL_STATE__中提取评论
                state_match = re.search(r'window\.__INITIAL_STATE__=(.*?);\s*\(function|window\.__INITIAL_STATE__=(.*?);\s*$', html, re.DOTALL)
                if state_match:
                    try:
                        json_str = state_match.group(1) or state_match.group(2)
                        if json_str:
                            json_str = json_str.rstrip(';')
                            json_str = re.sub(r'//.*$', '', json_str, flags=re.MULTILINE)
                            json_str = re.sub(r'/\*[\s\S]*?\*/', '', json_str)
                            json_str = json_str.replace('undefined', 'null')
                            json_str = json_str.replace('NaN', 'null')
                            json_str = json_str.replace('Infinity', 'null')
                            json_str = json_str.replace('-Infinity', 'null')
                            json_str = re.sub(r'\bTrue\b', 'true', json_str)
                            json_str = re.sub(r'\bFalse\b', 'false', json_str)
                            json_str = json_str.strip()
                            
                            data = json.loads(json_str)
                            
                            # 尝试从多个路径提取评论
                            possible_paths = [
                                ['requests', 'liveroom', 'commentFeeds'],
                                ['liveroom', 'commentFeeds'],
                                ['roomInfo', 'commentFeeds'],
                                ['data', 'commentFeeds']
                            ]
                            
                            for path in possible_paths:
                                try:
                                    value = data
                                    for key in path:
                                        value = value[key]
                                    
                                    if value and isinstance(value, list):
                                        for item in value:
                                            comment = self._parse_comment_item(item)
                                            if comment:
                                                comments.append(comment)
                                        break
                                except (KeyError, TypeError):
                                    continue
                    except Exception as e:
                        self.logger.debug(f"[{self.platform}] 从window.__INITIAL_STATE__提取评论失败: {e}")
            
        except Exception as e:
            self.logger.error(f"[{self.platform}] 从HTML提取评论失败: {e}")
        
        return comments
    
    async def get_danmaku(self) -> List[Dict[str, Any]]:
        """
        获取快手弹幕数据
        从缓冲区获取已经接收到的弹幕（WebSocket在后台持续接收）
        
        Returns:
            List[Dict[str, Any]]: 弹幕数据列表
        """
        danmaku_list = []
        
        # 暂时关闭HTTP API方式获取弹幕
        # if not self.is_running:
        #     # 如果WebSocket未运行，尝试通过HTTP API获取评论
        #     self.logger.info(f"[{self.platform}] WebSocket未运行，尝试通过HTTP API获取评论")
        #     danmaku_list = self._get_comments_via_http()
        #     return danmaku_list
        
        try:
            # 从缓冲区获取弹幕（使用线程锁保证线程安全）
            with self.buffer_lock:
                if self.danmaku_buffer:
                    danmaku_list = self.danmaku_buffer.copy()
                    self.danmaku_buffer = []
                    
                    self.logger.debug(f"[{self.platform}] 返回 {len(danmaku_list)} 条弹幕")
                
        except Exception as e:
            self.logger.error(f"获取快手弹幕失败: {e}")
        
        return danmaku_list
    
    async def _process_message(self, message: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        处理单条弹幕消息
        
        Args:
            message: 原始消息
            
        Returns:
            Optional[Dict[str, Any]]: 处理后的弹幕数据，None表示忽略此消息
        """
        try:
            # 快手API返回的数据格式
            content = message.get('content', '')
            user_id = message.get('userId', '')
            username = message.get('nickname', '')
            timestamp = message.get('timestamp', int(time.time() * 1000))
            
            if not content or not username:
                return None
            
            # 计算相对时间
            relative_time = (timestamp - self.start_time * 1000) / 1000 if self.start_time else 0
            
            # 格式化弹幕数据
            danmaku = {
                'id': f"{user_id}_{timestamp}",
                'timestamp': timestamp,
                'relative_time': relative_time,
                'user_id': user_id,
                'username': username,
                'content': content,
                'type': 'danmaku',
                'color': '#FFFFFF',
                'font_size': 25,
                'platform': self.platform,
                'room_id': self.room_id
            }
            
            return danmaku
            
        except Exception as e:
            self.logger.error(f"处理快手消息失败: {e}")
            import traceback
            self.logger.error(traceback.format_exc())
            return None
