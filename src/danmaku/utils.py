# -*- encoding: utf-8 -*-

"""
弹幕工具类
包含通用的工具函数和方法
"""

import asyncio
import json
import time
import urllib.parse
from typing import Dict, Optional, Any
import websockets
import httpx


class DanmakuUtils:
    """
    弹幕工具类
    提供通用的工具函数
    """
    
    @staticmethod
    async def websocket_connect(url: str, headers: Optional[Dict[str, str]] = None,
                              proxy_addr: Optional[str] = None) -> Optional[websockets.WebSocketClientProtocol]:
        """
        建立WebSocket连接
        
        Args:
            url: WebSocket连接地址
            headers: 请求头
            proxy_addr: 代理地址
            
        Returns:
            Optional[websockets.WebSocketClientProtocol]: WebSocket连接对象
        """
        try:
            # 处理代理
            proxy = None
            if proxy_addr:
                proxy = proxy_addr
            
            # 建立连接
            async with websockets.connect(
                url,
                extra_headers=headers,
                proxy=proxy,
                ping_interval=30,
                ping_timeout=10
            ) as websocket:
                return websocket
        except Exception as e:
            print(f"WebSocket连接失败: {e}")
            return None
    
    @staticmethod
    async def http_get(url: str, headers: Optional[Dict[str, str]] = None,
                      proxy_addr: Optional[str] = None) -> Optional[str]:
        """
        发送HTTP GET请求
        
        Args:
            url: 请求地址
            headers: 请求头
            proxy_addr: 代理地址
            
        Returns:
            Optional[str]: 响应内容
        """
        try:
            async with httpx.AsyncClient(proxy=proxy_addr, timeout=15) as client:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                return response.text
        except Exception as e:
            print(f"HTTP GET请求失败: {e}")
            return None
    
    @staticmethod
    async def http_post(url: str, data: Optional[Dict[str, Any]] = None,
                       headers: Optional[Dict[str, str]] = None,
                       proxy_addr: Optional[str] = None) -> Optional[str]:
        """
        发送HTTP POST请求
        
        Args:
            url: 请求地址
            data: 请求数据
            headers: 请求头
            proxy_addr: 代理地址
            
        Returns:
            Optional[str]: 响应内容
        """
        try:
            async with httpx.AsyncClient(proxy=proxy_addr, timeout=15) as client:
                response = await client.post(url, json=data, headers=headers)
                response.raise_for_status()
                return response.text
        except Exception as e:
            print(f"HTTP POST请求失败: {e}")
            return None
    
    @staticmethod
    def format_timestamp(timestamp: float) -> str:
        """
        格式化时间戳
        
        Args:
            timestamp: 时间戳
            
        Returns:
            str: 格式化后的时间字符串
        """
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(timestamp))
    
    @staticmethod
    def parse_json(data: str) -> Optional[Dict[str, Any]]:
        """
        解析JSON数据
        
        Args:
            data: JSON字符串
            
        Returns:
            Optional[Dict[str, Any]]: 解析后的字典
        """
        try:
            return json.loads(data)
        except Exception as e:
            print(f"JSON解析失败: {e}")
            return None
    
    @staticmethod
    def generate_random_string(length: int) -> str:
        """
        生成随机字符串
        
        Args:
            length: 字符串长度
            
        Returns:
            str: 随机字符串
        """
        import random
        import string
        return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
    
    @staticmethod
    def url_encode(data: Dict[str, str]) -> str:
        """
        URL编码
        
        Args:
            data: 要编码的字典
            
        Returns:
            str: 编码后的字符串
        """
        return urllib.parse.urlencode(data)
    
    @staticmethod
    def calculate_relative_time(start_time: float) -> float:
        """
        计算相对时间
        
        Args:
            start_time: 开始时间
            
        Returns:
            float: 相对时间（秒）
        """
        return time.time() - start_time
    
    @staticmethod
    async def retry_operation(operation, max_retries: int = 3, delay: float = 1.0):
        """
        重试操作
        
        Args:
            operation: 要执行的操作
            max_retries: 最大重试次数
            delay: 重试延迟（秒）
            
        Returns:
            Any: 操作结果
        """
        for i in range(max_retries):
            try:
                return await operation()
            except Exception as e:
                if i == max_retries - 1:
                    raise
                print(f"操作失败，{delay}秒后重试 ({i+1}/{max_retries}): {e}")
                await asyncio.sleep(delay)
                delay *= 2  # 指数退避
