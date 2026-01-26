# -*- encoding: utf-8 -*-

"""
快手直播弹幕获取类
"""

import asyncio
import json
import time
import websockets
from typing import Dict, List, Optional, Any
from .base import DanmakuBase
from .utils import DanmakuUtils


class KuaishouDanmaku(DanmakuBase):
    """
    快手直播弹幕获取类
    """
    
    def __init__(self, room_id: str, proxy_addr: Optional[str] = None, logger=None):
        """
        初始化快手弹幕获取器
        
        Args:
            room_id: 直播间ID
            proxy_addr: 代理地址
            logger: 日志对象
        """
        super().__init__(room_id, proxy_addr, logger)
        self.platform = "kuaishou"
        self.websocket = None
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': f'https://live.kuaishou.com/{room_id}'
        }
        self.heartbeat_interval = 30  # 心跳间隔（秒）
    
    async def connect(self) -> bool:
        """
        连接到快手弹幕服务器
        
        Returns:
            bool: 连接是否成功
        """
        try:
            # 获取WebSocket连接地址
            ws_url = await self._get_ws_url()
            if not ws_url:
                self.logger.error(f"[{self.platform}] 获取WebSocket连接地址失败")
                return False
            
            self.logger.debug(f"[{self.platform}] 尝试连接WebSocket: {ws_url}")
            if self.proxy_addr:
                self.logger.debug(f"[{self.platform}] 使用代理: {self.proxy_addr}")
            else:
                self.logger.debug(f"[{self.platform}] 不使用代理")
            
            # 建立WebSocket连接
            retry_count = 3
            for i in range(retry_count):
                try:
                    if self.proxy_addr:
                        # 使用代理时，避免传递headers参数
                        self.websocket = await websockets.connect(
                            ws_url,
                            proxy=self.proxy_addr,
                            ping_interval=self.heartbeat_interval,
                            ping_timeout=10
                        )
                    else:
                        # 不使用代理时，也避免传递headers参数，以确保与不同版本的websockets库兼容
                        self.websocket = await websockets.connect(
                            ws_url,
                            ping_interval=self.heartbeat_interval,
                            ping_timeout=10
                        )
                    break
                except Exception as e:
                    if i == retry_count - 1:
                        raise
                    self.logger.warning(f"[{self.platform}] WebSocket连接失败 (尝试 {i+1}/{retry_count}): {e}")
                    await asyncio.sleep(2)
            
            self.logger.info(f"[{self.platform}] WebSocket连接成功")
            
            # 发送认证消息
            await self._send_auth_message()
            self.logger.debug(f"[{self.platform}] 发送认证消息成功")
            
            # 启动心跳任务
            asyncio.create_task(self._heartbeat_task())
            self.logger.debug(f"[{self.platform}] 启动心跳任务")
            
            return True
        except Exception as e:
            self.logger.error(f"[{self.platform}] 弹幕连接失败: {e}")
            if "getaddrinfo failed" in str(e):
                self.logger.error(f"[{self.platform}] 网络连接错误: 无法解析主机名，请检查网络连接和DNS设置")
            elif "proxy" in str(e).lower():
                self.logger.error(f"[{self.platform}] 代理错误: 请检查代理配置是否正确")
            return False
    
    async def disconnect(self):
        """
        断开与快手弹幕服务器的连接
        """
        if self.websocket:
            try:
                await self.websocket.close()
            except Exception as e:
                self.logger.error(f"断开快手弹幕连接失败: {e}")
            finally:
                self.websocket = None
    
    async def get_danmaku(self) -> List[Dict[str, Any]]:
        """
        获取快手弹幕数据
        
        Returns:
            List[Dict[str, Any]]: 弹幕数据列表
        """
        danmaku_list = []
        
        if not self.websocket:
            return danmaku_list
        
        try:
            # 接收消息
            message = await self.websocket.recv()
            
            # 解析消息
            parsed_message = await self._parse_message(message)
            
            # 处理消息
            if isinstance(parsed_message, list):
                for msg in parsed_message:
                    danmaku = await self._process_message(msg)
                    if danmaku:
                        danmaku_list.append(danmaku)
                        self.add_to_buffer(danmaku)
            elif parsed_message:
                danmaku = await self._process_message(parsed_message)
                if danmaku:
                    danmaku_list.append(danmaku)
                    self.add_to_buffer(danmaku)
        except websockets.ConnectionClosed:
            self.logger.info("快手弹幕连接已关闭")
            self.websocket = None
        except Exception as e:
            self.logger.error(f"获取快手弹幕失败: {e}")
        
        return danmaku_list
    
    async def _get_ws_url(self) -> Optional[str]:
        """
        获取WebSocket连接地址
        
        Returns:
            Optional[str]: WebSocket连接地址
        """
        try:
            # 这里需要实现获取WebSocket连接地址的逻辑
            # 通常需要通过逆向工程获取，参考现有的快手直播API
            # 暂时返回一个示例地址，实际使用时需要替换
            # 注意：这只是一个示例，实际需要根据快手API的变化进行调整
            return f"wss://live-ws-pc.kuaishou.com/websocket?room_id={self.room_id}"
        except Exception as e:
            self.logger.error(f"获取快手WebSocket地址失败: {e}")
            return None
    
    async def _send_auth_message(self):
        """
        发送认证消息
        """
        if not self.websocket:
            return
        
        try:
            auth_message = {
                "type": "joinRoom",
                "roomId": self.room_id,
                "userId": "",
                "clientVersion": "2.8.0",
                "platform": "pc"
            }
            
            await self.websocket.send(json.dumps(auth_message))
        except Exception as e:
            self.logger.error(f"发送快手认证消息失败: {e}")
    
    async def _heartbeat_task(self):
        """
        心跳任务
        """
        while self.is_running and self.websocket:
            try:
                heartbeat_message = {"type": "heartbeat"}
                await self.websocket.send(json.dumps(heartbeat_message))
                await asyncio.sleep(self.heartbeat_interval)
            except Exception as e:
                self.logger.error(f"发送快手心跳消息失败: {e}")
                break
    
    async def _parse_message(self, message: str) -> Optional[Any]:
        """
        解析消息
        
        Args:
            message: 原始消息
            
        Returns:
            Optional[Any]: 解析后的消息
        """
        try:
            return json.loads(message)
        except Exception as e:
            self.logger.error(f"解析快手消息失败: {e}")
            return None
    
    async def _process_message(self, message: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        处理单条弹幕消息
        
        Args:
            message: 原始消息
            
        Returns:
            Optional[Dict[str, Any]]: 处理后的弹幕数据，None表示忽略此消息
        """
        try:
            msg_type = message.get("type")
            
            # 忽略心跳和其他非弹幕消息
            if msg_type in ["heartbeat", "joinRoomResp"]:
                return None
            
            # 处理弹幕消息
            if msg_type == "chat":
                content = message.get("content", "")
                user_info = message.get("user", {})
                username = user_info.get("name", "")
                user_id = user_info.get("id", "")
                
                if content:
                    return self._format_danmaku(
                        id=message.get("id", ""),
                        user_id=user_id,
                        username=username,
                        content=content,
                        type="danmaku",
                        color=message.get("color", "#FFFFFF"),
                        font_size=message.get("fontSize", 25)
                    )
            
            # 处理礼物消息
            elif msg_type == "gift":
                gift_info = message.get("gift", {})
                gift_name = gift_info.get("name", "")
                gift_count = gift_info.get("count", 1)
                user_info = message.get("user", {})
                username = user_info.get("name", "")
                user_id = user_info.get("id", "")
                
                content = f"赠送 {gift_name} x{gift_count}"
                return self._format_danmaku(
                    id=message.get("id", ""),
                    user_id=user_id,
                    username=username,
                    content=content,
                    type="gift",
                    color="#FF0000",
                    font_size=25,
                    gift_name=gift_name,
                    gift_count=gift_count
                )
            
            # 处理进场消息
            elif msg_type == "enter":
                user_info = message.get("user", {})
                username = user_info.get("name", "")
                user_id = user_info.get("id", "")
                
                content = "进入直播间"
                return self._format_danmaku(
                    id=message.get("id", ""),
                    user_id=user_id,
                    username=username,
                    content=content,
                    type="enter",
                    color="#00FF00",
                    font_size=20
                )
            
        except Exception as e:
            self.logger.error(f"处理快手消息失败: {e}")
        
        return None
