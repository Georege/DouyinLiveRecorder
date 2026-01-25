# -*- encoding: utf-8 -*-

"""
抖音直播弹幕获取类
"""

import asyncio
import json
import time
import websockets
from typing import Dict, List, Optional, Any
from .base import DanmakuBase
from .utils import DanmakuUtils


class DouyinDanmaku(DanmakuBase):
    """
    抖音直播弹幕获取类
    """
    
    def __init__(self, room_id: str, proxy_addr: Optional[str] = None, logger=None):
        """
        初始化抖音弹幕获取器
        
        Args:
            room_id: 直播间ID
            proxy_addr: 代理地址
            logger: 日志对象
        """
        super().__init__(room_id, proxy_addr, logger)
        self.platform = "douyin"
        self.websocket = None
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': f'https://live.douyin.com/{room_id}'
        }
        self.heartbeat_interval = 30  # 心跳间隔（秒）
    
    async def connect(self) -> bool:
        """
        连接到抖音弹幕服务器
        
        Returns:
            bool: 连接是否成功
        """
        try:
            # 获取WebSocket连接地址
            ws_url = await self._get_ws_url()
            if not ws_url:
                if self.logger:
                    self.logger.error(f"[{self.platform}] 获取WebSocket连接地址失败")
                else:
                    print(f"[{self.platform}] 获取WebSocket连接地址失败")
                return False
            
            if self.logger:
                self.logger.debug(f"[{self.platform}] 尝试连接WebSocket: {ws_url}")
                if self.proxy_addr:
                    self.logger.debug(f"[{self.platform}] 使用代理: {self.proxy_addr}")
            else:
                print(f"[{self.platform}] 尝试连接WebSocket: {ws_url}")
                if self.proxy_addr:
                    print(f"[{self.platform}] 使用代理: {self.proxy_addr}")
            
            # 建立WebSocket连接
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
                    # 不使用代理时，可以传递headers参数
                    self.websocket = await websockets.connect(
                        ws_url,
                        headers=self.headers,
                        ping_interval=self.heartbeat_interval,
                        ping_timeout=10
                    )
            except Exception as e:
                # 如果仍然失败，尝试不带任何额外参数的连接
                if self.logger:
                    self.logger.warning(f"[{self.platform}] WebSocket连接失败，尝试不带额外参数的连接: {e}")
                else:
                    print(f"[{self.platform}] WebSocket连接失败，尝试不带额外参数的连接: {e}")
                self.websocket = await websockets.connect(
                    ws_url,
                    ping_interval=self.heartbeat_interval,
                    ping_timeout=10
                )
            
            if self.logger:
                self.logger.info(f"[{self.platform}] WebSocket连接成功")
            else:
                print(f"[{self.platform}] WebSocket连接成功")
            
            # 发送认证消息
            await self._send_auth_message()
            if self.logger:
                self.logger.debug(f"[{self.platform}] 发送认证消息成功")
            
            # 启动心跳任务
            asyncio.create_task(self._heartbeat_task())
            if self.logger:
                self.logger.debug(f"[{self.platform}] 启动心跳任务")
            
            return True
        except Exception as e:
            if self.logger:
                self.logger.error(f"[{self.platform}] 弹幕连接失败: {e}")
            else:
                print(f"[{self.platform}] 弹幕连接失败: {e}")
            return False
    
    async def disconnect(self):
        """
        断开与抖音弹幕服务器的连接
        """
        if self.websocket:
            try:
                await self.websocket.close()
            except Exception as e:
                print(f"断开抖音弹幕连接失败: {e}")
            finally:
                self.websocket = None
    
    async def get_danmaku(self) -> List[Dict[str, Any]]:
        """
        获取抖音弹幕数据
        
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
            print("抖音弹幕连接已关闭")
            self.websocket = None
        except Exception as e:
            print(f"获取抖音弹幕失败: {e}")
        
        return danmaku_list
    
    async def _get_ws_url(self) -> Optional[str]:
        """
        获取WebSocket连接地址
        
        Returns:
            Optional[str]: WebSocket连接地址
        """
        try:
            # 这里需要实现获取WebSocket连接地址的逻辑
            # 通常需要通过逆向工程获取，参考现有的抖音直播API
            # 暂时返回一个示例地址，实际使用时需要替换
            # 注意：这只是一个示例，实际需要根据抖音API的变化进行调整
            return f"wss://webcast5-ws.douyin.com/webcast/room/enter/?room_id={self.room_id}"
        except Exception as e:
            print(f"获取抖音WebSocket地址失败: {e}")
            return None
    
    async def _send_auth_message(self):
        """
        发送认证消息
        """
        if not self.websocket:
            return
        
        try:
            # 构造认证消息
            auth_message = {
                "type": "join_room",
                "room_id": self.room_id,
                "user_id": "",  # 可选
                "device_id": "",  # 可选
                "client_version": "26.8.0",
                "aid": 1128,
                "app_name": "douyin"
            }
            
            # 发送认证消息
            await self.websocket.send(json.dumps(auth_message))
        except Exception as e:
            print(f"发送抖音认证消息失败: {e}")
    
    async def _heartbeat_task(self):
        """
        心跳任务
        """
        while self.is_running and self.websocket:
            try:
                # 发送心跳消息
                heartbeat_message = {"type": "heartbeat"}
                await self.websocket.send(json.dumps(heartbeat_message))
                await asyncio.sleep(self.heartbeat_interval)
            except Exception as e:
                print(f"发送抖音心跳消息失败: {e}")
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
            print(f"解析抖音消息失败: {e}")
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
            if msg_type in ["heartbeat", "join_room_resp"]:
                return None
            
            # 处理弹幕消息
            if msg_type == "danmaku":
                content = message.get("content", "")
                user_info = message.get("user", {})
                username = user_info.get("nickname", "")
                user_id = user_info.get("id", "")
                
                if content:
                    return self._format_danmaku(
                        id=message.get("id", ""),
                        user_id=user_id,
                        username=username,
                        content=content,
                        type="danmaku",
                        color=message.get("color", "#FFFFFF"),
                        font_size=message.get("font_size", 25)
                    )
            
            # 处理礼物消息
            elif msg_type == "gift":
                gift_info = message.get("gift", {})
                gift_name = gift_info.get("name", "")
                gift_count = gift_info.get("count", 1)
                user_info = message.get("user", {})
                username = user_info.get("nickname", "")
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
                username = user_info.get("nickname", "")
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
            print(f"处理抖音消息失败: {e}")
        
        return None
