# -*- encoding: utf-8 -*-

"""
弹幕获取基础类
定义通用的弹幕获取接口和方法
"""

import abc
import asyncio
import json
import time
from typing import Dict, List, Optional, Any
from datetime import datetime


class DanmakuBase(metaclass=abc.ABCMeta):
    """
    弹幕获取基础抽象类
    所有平台的弹幕获取类都应继承此类并实现抽象方法
    """
    
    def __init__(self, room_id: str, proxy_addr: Optional[str] = None, logger=None):
        """
        初始化弹幕获取器
        
        Args:
            room_id: 直播间ID
            proxy_addr: 代理地址
            logger: 日志对象
        """
        self.room_id = room_id
        self.proxy_addr = proxy_addr
        self.logger = logger
        self.is_running = False
        self.start_time = None
        self.danmaku_buffer = []
        self.max_buffer_size = 1000
        self._stop_event = asyncio.Event()
        self.platform = "unknown"
    
    @abc.abstractmethod
    async def connect(self) -> bool:
        """
        连接到弹幕服务器
        
        Returns:
            bool: 连接是否成功
        """
        pass
    
    @abc.abstractmethod
    async def disconnect(self):
        """
        断开与弹幕服务器的连接
        """
        pass
    
    @abc.abstractmethod
    async def get_danmaku(self) -> List[Dict[str, Any]]:
        """
        获取弹幕数据
        
        Returns:
            List[Dict[str, Any]]: 弹幕数据列表
        """
        pass
    
    @abc.abstractmethod
    async def _process_message(self, message: Any) -> Optional[Dict[str, Any]]:
        """
        处理单条弹幕消息
        
        Args:
            message: 原始消息
            
        Returns:
            Optional[Dict[str, Any]]: 处理后的弹幕数据，None表示忽略此消息
        """
        pass
    
    async def start(self):
        """
        开始获取弹幕
        """
        if not self.is_running:
            self.is_running = True
            self.start_time = time.time()
            self._stop_event.clear()
    
    async def stop(self):
        """
        停止获取弹幕
        """
        if self.is_running:
            self.is_running = False
            self._stop_event.set()
            await self.disconnect()
    
    def is_stopped(self) -> bool:
        """
        检查是否已停止
        
        Returns:
            bool: 是否已停止
        """
        return self._stop_event.is_set()
    
    def _format_danmaku(self, **kwargs) -> Dict[str, Any]:
        """
        格式化弹幕数据
        
        Args:
            **kwargs: 弹幕字段
            
        Returns:
            Dict[str, Any]: 格式化后的弹幕数据
        """
        timestamp = time.time()
        relative_time = timestamp - self.start_time if self.start_time else 0
        
        return {
            "id": kwargs.get("id", f"{int(timestamp * 1000)}"),
            "timestamp": int(timestamp * 1000),
            "relative_time": round(relative_time, 3),
            "user_id": kwargs.get("user_id", ""),
            "username": kwargs.get("username", ""),
            "content": kwargs.get("content", ""),
            "type": kwargs.get("type", "danmaku"),
            "color": kwargs.get("color", "#FFFFFF"),
            "font_size": kwargs.get("font_size", 25),
            "platform": self.platform,
            "room_id": self.room_id,
            **kwargs
        }
    
    def add_to_buffer(self, danmaku: Dict[str, Any]):
        """
        添加弹幕到缓冲区
        
        Args:
            danmaku: 弹幕数据
        """
        self.danmaku_buffer.append(danmaku)
        if len(self.danmaku_buffer) > self.max_buffer_size:
            self.danmaku_buffer.pop(0)
    
    def clear_buffer(self):
        """
        清空弹幕缓冲区
        """
        self.danmaku_buffer.clear()
    
    def get_buffer(self) -> List[Dict[str, Any]]:
        """
        获取弹幕缓冲区数据
        
        Returns:
            List[Dict[str, Any]]: 弹幕数据列表
        """
        return self.danmaku_buffer.copy()
