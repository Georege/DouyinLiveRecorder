# -*- encoding: utf-8 -*-

"""
抖音直播弹幕获取类
整合 douyin_impl.py 和 douyin_module.py 的功能
支持 cookie 传递，解决获取 room_id 失败的问题
"""

import asyncio
import json
import threading
from typing import Dict, List, Optional, Any

from src.danmu.base import DanmakuBase


class DouyinDanmaku(DanmakuBase):
    """
    抖音直播弹幕获取类
    使用 douyin/liveMan.py 下的 DouyinLiveWebFetcher 实现
    支持 cookie 传递
    """

    def __init__(self, room_id: str, proxy_addr: Optional[str] = None, logger=None, cookies: Optional[str] = None):
        """
        初始化抖音弹幕获取器

        Args:
            room_id: 直播间ID
            proxy_addr: 代理地址
            logger: 日志对象
            cookies: 抖音cookie字符串，用于获取room_id时的认证
        """
        super().__init__(room_id, proxy_addr, logger)
        self.platform = "douyin"
        self.fetcher = None
        self.cookies = cookies  # 保存 cookie

    async def connect(self) -> bool:
        """
        连接到抖音弹幕服务器

        Returns:
            bool: 连接是否成功
        """
        try:
            # 延迟导入避免循环依赖
            from .douyin.liveMan import DouyinLiveWebFetcher

            # 初始化 DouyinLiveWebFetcher，传入 cookies
            # main.py 已经传入的是获取到的真实 room_id，因此不需要再通过 API 获取
            self.logger.info(f"初始化 DouyinLiveWebFetcher，传入 cookies（不使用API获取room_id）")
            self.fetcher = DouyinLiveWebFetcher(self.room_id, cookies=self.cookies, use_api_for_room_id=False)

            # 启动一个线程来运行 fetcher
            def run_fetcher():
                try:
                    self.fetcher.start()
                except Exception as e:
                    self.logger.error(f"[{self.platform}] 弹幕获取线程失败: {e}")

            # 启动线程
            threading.Thread(target=run_fetcher, daemon=True).start()

            self.logger.info(f"[{self.platform}] 弹幕连接成功")

            return True
        except Exception as e:
            self.logger.error(f"[{self.platform}] 弹幕连接失败: {e}")
            return False

    async def disconnect(self):
        """
        断开与抖音弹幕服务器的连接
        """
        if self.fetcher:
            try:
                self.fetcher.stop()
                self.logger.info(f"[{self.platform}] 弹幕连接已断开")
            except Exception as e:
                self.logger.error(f"[{self.platform}] 断开弹幕连接失败: {e}")
            finally:
                self.fetcher = None

    async def get_danmaku(self) -> List[Dict[str, Any]]:
        """
        获取抖音弹幕数据
        从 DouyinLiveWebFetcher 的缓冲区中获取已解析的弹幕数据

        Returns:
            List[Dict[str, Any]]: 弹幕数据列表
        """
        if self.fetcher:
            return self.fetcher.get_danmaku_buffer()
        return []

    async def _process_message(self, message: Any) -> Optional[Dict[str, Any]]:
        """
        处理单条弹幕消息
        注意：此方法不使用，消息处理在 DouyinLiveWebFetcher 内部完成

        Args:
            message: 原始消息

        Returns:
            Optional[Dict[str, Any]]: 处理后的弹幕数据，None表示忽略此消息
        """
        return None
