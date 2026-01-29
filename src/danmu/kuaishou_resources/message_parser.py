# -*- encoding: utf-8 -*-

"""
快手直播弹幕解析器
支持多种消息类型：评论、点赞、进场、关注、礼物
"""

import binascii
import blackboxprotobuf
import json
from typing import Dict, List, Optional, Any
from enum import IntEnum


class MessageType(IntEnum):
    """
    消息类型枚举
    """
    COMMENT = 1  # 评论
    LIKE = 2     # 点赞
    ENTER = 3    # 进场
    FOLLOW = 4   # 关注
    GIFT = 5     # 礼物
    UNKNOWN = 0  # 未知类型


class KuaishouMessageParser:
    """
    快手消息解析器
    使用 blackboxprotobuf 动态解析 protobuf 消息
    """
    
    def __init__(self, logger=None):
        """
        初始化解析器
        
        Args:
            logger: 日志对象
        """
        self.logger = logger
        
    def parse_websocket_message(self, hex_str: str) -> List[Dict[str, Any]]:
        """
        解析 WebSocket 消息
        
        Args:
            hex_str: 十六进制字符串格式的消息数据
            
        Returns:
            List[Dict[str, Any]]: 解析后的消息列表
        """
        try:
            # 转换 hex 为二进制
            data = binascii.unhexlify(hex_str)
            
            if self.logger:
                self.logger.debug("=" * 50)
                self.logger.debug("【外层协议解析 (SocketMessage)】")
            
            # 1. 解析最外层 SocketMessage
            outer_msg, _ = blackboxprotobuf.decode_message(data)
            
            # 提取关键字段
            command = outer_msg.get('1')       # Command ID (310=弹幕推送)
            compression = outer_msg.get('2')   # 压缩标识 (1=通常无压缩或gzip)
            payload = outer_msg.get('3')       # 核心业务数据
            timestamp = outer_msg.get('4')     # 时间戳
            
            if self.logger:
                self.logger.debug(f"Command ID : {command}")
                self.logger.debug(f"Timestamp  : {timestamp}")
                self.logger.debug(f"Payload Type: {type(payload)}")
            
            # 2. 核心业务层解析 (WebFeedMessage)
            if command == 310:
                return self._parse_feed_message(payload, timestamp)
            else:
                if self.logger:
                    self.logger.debug(f"未处理的 Command ID: {command}")
                return []
                
        except Exception as e:
            if self.logger:
                self.logger.error(f"解析 WebSocket 消息失败: {e}")
            return []
    
    def _parse_feed_message(self, payload: Any, timestamp: int) -> List[Dict[str, Any]]:
        """
        解析 Feed 消息 (WebFeedMessage)
        
        Args:
            payload: 消息内容（可能是 bytes 或 dict）
            timestamp: 时间戳
            
        Returns:
            List[Dict[str, Any]]: 解析后的消息列表
        """
        try:
            if self.logger:
                self.logger.debug("\n【内层业务解析 (WebFeedMessage)】")
            
            # 处理 payload：可能是 bytes (未自动解析) 或 dict (已自动解析)
            feed_data = None
            if isinstance(payload, bytes):
                # 如果是 bytes，手动解一次
                feed_data, _ = blackboxprotobuf.decode_message(payload)
            elif isinstance(payload, dict):
                # 如果已经是 dict，直接使用
                feed_data = payload
            else:
                if self.logger:
                    self.logger.error(f"无法处理的 Payload 类型: {type(payload)}")
                return []
            
            # 提取顶部展示信息
            display_id = feed_data.get('1')
            display_count = feed_data.get('2')
            
            if self.logger:
                self.logger.debug(f"直播间游标/ID: {display_id}")
                self.logger.debug(f"直播间热度展示: {display_count}")
            
            # 3. 遍历消息列表 (Repeated Field 5)
            items = feed_data.get('5')
            
            if items is None:
                if self.logger:
                    self.logger.debug("本包无弹幕内容")
                return []
            
            # 统一转为列表处理
            if not isinstance(items, list):
                items = [items]
            
            if self.logger:
                self.logger.debug(f"\n收到 {len(items)} 条消息:")
            
            # 解析每条消息
            messages = []
            for index, item in enumerate(items):
                msg = self._parse_feed_item(item, timestamp)
                if msg:
                    messages.append(msg)
            
            return messages
            
        except Exception as e:
            if self.logger:
                self.logger.error(f"解析 Feed 消息失败: {e}")
            return []
    
    def _parse_feed_item(self, item: Dict[str, Any], timestamp: int) -> Optional[Dict[str, Any]]:
        """
        解析单条 Feed 消息 (WebFeedItem)
        
        Args:
            item: 单条消息数据
            timestamp: 时间戳
            
        Returns:
            Optional[Dict[str, Any]]: 解析后的消息
        """
        try:
            # 提取单条消息详情
            msg_type = item.get('7')     # 消息类型
            content = item.get('3')      # 消息内容
            sort_rank = item.get('4')    # 排序Key
            
            # 提取用户信息 (Field 2)
            user_info = item.get('2', {})
            user_id = user_info.get('1')
            nickname = user_info.get('2')
            head_url = user_info.get('3')
            
            # 构造消息对象
            message = {
                'user_id': user_id,
                'nickname': nickname,
                'head_url': head_url,
                'content': content,
                'timestamp': timestamp,
                'sort_rank': sort_rank,
                'msg_type': msg_type,
                'platform': 'kuaishou'
            }
            
            # 根据消息类型设置不同的描述
            if msg_type == MessageType.COMMENT:
                message['type'] = 'comment'
                message['description'] = f"{nickname}: {content}"
                if self.logger:
                    self.logger.debug(f"[{len(message)+1}] [弹幕] {nickname}({user_id}): {content}")
                    
            elif msg_type == MessageType.LIKE:
                message['type'] = 'like'
                message['description'] = f"{nickname} 点亮了直播间"
                if self.logger:
                    self.logger.debug(f"[{len(message)+1}] [点赞] {nickname} 点亮了直播间")
                    
            elif msg_type == MessageType.ENTER:
                message['type'] = 'enter'
                message['description'] = f"{nickname} 进入了直播间"
                if self.logger:
                    self.logger.debug(f"[{len(message)+1}] [进场] {nickname} 进入了直播间")
                    
            elif msg_type == MessageType.FOLLOW:
                message['type'] = 'follow'
                message['description'] = f"{nickname} 关注了主播"
                if self.logger:
                    self.logger.debug(f"[{len(message)+1}] [关注] {nickname} 关注了主播")
                    
            elif msg_type == MessageType.GIFT:
                message['type'] = 'gift'
                message['description'] = f"{nickname} 送出了 {content}"
                # 尝试提取礼物详细信息
                gift_info = self._extract_gift_info(item)
                if gift_info:
                    message.update(gift_info)
                if self.logger:
                    self.logger.debug(f"[{len(message)+1}] [礼物] {nickname} 送出了 {content}")
                    
            else:
                message['type'] = 'unknown'
                message['description'] = f"{nickname}: {content}"
                if self.logger:
                    self.logger.debug(f"[{len(message)+1}] [未知类型 {msg_type}] {nickname}: {content}")
            
            return message
            
        except Exception as e:
            if self.logger:
                self.logger.error(f"解析单条消息失败: {e}")
            return None
    
    def _extract_gift_info(self, item: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        提取礼物信息
        
        Args:
            item: 消息数据
            
        Returns:
            Optional[Dict[str, Any]]: 礼物信息
        """
        try:
            gift_info = {}
            
            # 尝试从不同字段提取礼物信息
            # Field 8: giftId
            if '8' in item:
                gift_info['gift_id'] = item['8']
            
            # Field 9: 可能包含礼物数量或其他信息
            if '9' in item:
                gift_info['gift_count'] = item['9']
            
            # Field 10: 可能包含礼物名称
            if '10' in item:
                gift_info['gift_name'] = item['10']
            
            return gift_info if gift_info else None
            
        except Exception as e:
            if self.logger:
                self.logger.error(f"提取礼物信息失败: {e}")
            return None
    
    def parse_binary_message(self, data: bytes) -> List[Dict[str, Any]]:
        """
        解析二进制消息（直接传入 bytes 而不是 hex 字符串）
        
        Args:
            data: 二进制消息数据
            
        Returns:
            List[Dict[str, Any]]: 解析后的消息列表
        """
        try:
            # 转换为 hex 字符串
            hex_str = binascii.hexlify(data).decode('utf-8')
            return self.parse_websocket_message(hex_str)
            
        except Exception as e:
            if self.logger:
                self.logger.error(f"解析二进制消息失败: {e}")
            return []
    
    def get_message_type_name(self, msg_type: int) -> str:
        """
        获取消息类型名称
        
        Args:
            msg_type: 消息类型 ID
            
        Returns:
            str: 消息类型名称
        """
        try:
            return MessageType(msg_type).name
        except ValueError:
            return f"UNKNOWN({msg_type})"


# 测试代码
if __name__ == "__main__":
    # 创建解析器
    parser = KuaishouMessageParser()
    
    # 测试用例 1 (弹幕)
    hex_str_1 = "08b60210011a540a0433333039120739382e35e4b8872a4312220a0f337866686138786e70787773636a67120fe6809de5a6b9e5a6b9e5be88e985b71a0f4b504ce586b2e586b2e586b2efbc8122083836504b46773d3d38014200208691a1d0bf33"
    
    print(">>> 测试用例 1 (弹幕) <<<")
    messages = parser.parse_websocket_message(hex_str_1)
    for msg in messages:
        print(json.dumps(msg, ensure_ascii=False, indent=2))
