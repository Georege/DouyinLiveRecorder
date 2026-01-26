#!/usr/bin/python
# coding:utf-8

# @FileName:    liveMan.py
# @Time:        2024/1/2 21:51
# @Author:      bubu
# @Project:     douyinLiveWebFetcher

import codecs
import gzip
import hashlib
import random
import re
import string
import subprocess
import threading
import time
import execjs
import urllib.parse
from contextlib import contextmanager
from unittest.mock import patch
from typing import Optional

import requests
import websocket
from py_mini_racer import MiniRacer

from .ac_signature import get__ac_signature
from .protobuf.douyin import *

from urllib3.util.url import parse_url

# 导入原项目的方法
import sys
import os
# 添加项目根目录到Python路径
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
# 直接从模块导入，避免命名冲突
from src.spider import get_douyin_stream_data
from src.room import get_sec_user_id
from src.logger import logger


def execute_js(js_file: str):
    """
    执行 JavaScript 文件
    :param js_file: JavaScript 文件路径
    :return: 执行结果
    """
    with open(js_file, 'r', encoding='utf-8') as file:
        js_code = file.read()
    
    ctx = execjs.compile(js_code)
    return ctx


@contextmanager
def patched_popen_encoding(encoding='utf-8'):
    original_popen_init = subprocess.Popen.__init__
    
    def new_popen_init(self, *args, **kwargs):
        kwargs['encoding'] = encoding
        original_popen_init(self, *args, **kwargs)
    
    with patch.object(subprocess.Popen, '__init__', new_popen_init):
        yield


def generateSignature(wss, script_file='sign.js'):
    """
    出现gbk编码问题则修改 python模块subprocess.py的源码中Popen类的__init__函数参数encoding值为 "utf-8"
    """
    params = ("live_id,aid,version_code,webcast_sdk_version,"
              "room_id,sub_room_id,sub_channel_id,did_rule,"
              "user_unique_id,device_platform,device_type,ac,"
              "identity").split(',')
    wss_params = urllib.parse.urlparse(wss).query.split('&')
    wss_maps = {i.split('=')[0]: i.split("=")[-1] for i in wss_params}
    tpl_params = [f"{i}={wss_maps.get(i, '')}" for i in params]
    param = ','.join(tpl_params)
    md5 = hashlib.md5()
    md5.update(param.encode())
    md5_param = md5.hexdigest()
    
    # 获取脚本文件的绝对路径
    script_dir = os.path.dirname(os.path.abspath(__file__))
    script_path = os.path.join(script_dir, 'js', script_file)
    
    # 检查脚本文件是否存在
    if not os.path.exists(script_path):
        logger.error(f"【X】脚本文件不存在: {script_path}")
        return None
    
    with codecs.open(script_path, 'r', encoding='utf8') as f:
        script = f.read()
    
    ctx = MiniRacer()
    ctx.eval(script)
    
    try:
        signature = ctx.call("get_sign", md5_param)
        return signature
    except Exception as e:
        logger.error(f"生成签名失败: {e}")
    
    # 以下代码对应js脚本为sign_v0.js
    # context = execjs.compile(script)
    # with patched_popen_encoding(encoding='utf-8'):
    #     ret = context.call('getSign', {'X-MS-STUB': md5_param})
    # return ret.get('X-Bogus')


def generateMsToken(length=182):
    """
    产生请求头部cookie中的msToken字段，其实为随机的107位字符
    :param length:字符位数
    :return:msToken
    """
    random_str = ''
    base_str = string.ascii_letters + string.digits + '-_'
    _len = len(base_str) - 1
    for _ in range(length):
        random_str += base_str[random.randint(0, _len)]
    return random_str


class DouyinLiveWebFetcher:

    def __init__(self, live_id, abogus_file=None, cookies: Optional[str] = None, use_api_for_room_id: bool = False):
        """
        直播间弹幕抓取对象

        :param live_id: 直播间的ID。
                       如果 use_api_for_room_id=False，则传入网页直播间URL中的live_id（如：https://live.douyin.com/261378947940，其中的261378947940即是live_id）
                       如果 use_api_for_room_id=True，则传入已通过API获取到的真实room_id（如：7599437824162499363）
        :param cookies: 抖音cookie字符串，用于获取room_id时的认证
        :param use_api_for_room_id: 是否使用API获取room_id。如果为False，则直接使用传入的live_id作为room_id
        """
        # 获取脚本文件的绝对路径
        script_dir = os.path.dirname(os.path.abspath(__file__))
        self.abogus_file = abogus_file or os.path.join(script_dir, 'js', 'a_bogus.js')
        self.sign_file = os.path.join(script_dir, 'js', 'sign.js')
        self.__ttwid = None
        # 如果不使用API获取room_id，则直接使用传入的live_id作为room_id
        self.__room_id = live_id if not use_api_for_room_id else None
        self.session = requests.Session()
        self.live_id = live_id
        self.host = "https://www.douyin.com/"
        self.live_url = "https://live.douyin.com/"
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0"
        self.cookies = cookies  # 保存 cookies 参数
        self.use_api_for_room_id = use_api_for_room_id  # 标记是否需要通过API获取room_id
        self.headers = {
            'User-Agent': self.user_agent
        }
        # 添加弹幕缓冲区
        self.danmaku_buffer = []
        self.max_buffer_size = 1000
    
    def start(self):
        self._connectWebSocket()
    
    def stop(self):
        if hasattr(self, 'ws') and self.ws:
            self.ws.close()
    
    def _add_to_buffer(self, danmaku_data: dict):
        """
        将弹幕数据添加到缓冲区
        
        Args:
            danmaku_data: 弹幕数据字典
        """
        self.danmaku_buffer.append(danmaku_data)
        # 保持缓冲区大小在限制内
        if len(self.danmaku_buffer) > self.max_buffer_size:
            self.danmaku_buffer = self.danmaku_buffer[-self.max_buffer_size:]
    
    def get_danmaku_buffer(self):
        """
        获取缓冲区中的弹幕数据并清空缓冲区
        
        Returns:
            list: 缓冲区中的弹幕数据列表
        """
        result = []
        if self.danmaku_buffer:
            result = self.danmaku_buffer.copy()
            self.danmaku_buffer = []
        return result
    
    @property
    def ttwid(self):
        """
        产生请求头部cookie中的ttwid字段，访问抖音网页版直播间首页可以获取到响应cookie中的ttwid
        :return: ttwid
        """
        if self.__ttwid:
            return self.__ttwid
        headers = {
            "User-Agent": self.user_agent,
        }
        try:
            response = self.session.get(self.live_url, headers=headers)
            response.raise_for_status()
        except Exception as err:
            logger.error(f"【X】Request the live url error: {err}")
        else:
            self.__ttwid = response.cookies.get('ttwid')
            return self.__ttwid
    
    @property
    def room_id(self):
        """
        获取直播间roomId

        如果在初始化时已传入room_id（use_api_for_room_id=False），则直接返回。
        否则，根据直播间的地址获取到真正的直播间roomId。
        优先使用 get_douyin_web_stream_data API 方法，失败后使用备用方法
        :return:room_id
        """
        # 如果已设置room_id，直接返回
        if self.__room_id:
            return self.__room_id

        # 只有在需要通过API获取room_id时才执行
        if not self.use_api_for_room_id:
            # 直接使用live_id作为room_id
            self.__room_id = self.live_id
            return self.__room_id

        try:
            import asyncio
            from src.spider import get_douyin_web_stream_data

            url = self.live_url + self.live_id
            logger.debug(f"【DEBUG】尝试使用 get_douyin_web_stream_data API: url={url}")

            # 方法1：优先使用 get_douyin_web_stream_data API（已在main.py验证成功）
            room_data = asyncio.run(get_douyin_web_stream_data(url, cookies=self.cookies))

            # 从返回的数据中获取room_id
            if 'real_room_id' in room_data and room_data['real_room_id'] != 'unknown':
                self.__room_id = room_data['real_room_id']
                logger.info(f"【✓】通过API成功获取room_id: {self.__room_id}")
                return self.__room_id
            elif 'room_id' in room_data:
                self.__room_id = room_data['room_id']
                logger.info(f"【✓】通过API成功获取room_id: {self.__room_id}")
                return self.__room_id
            elif 'id_str' in room_data:
                self.__room_id = room_data['id_str']
                logger.info(f"【✓】通过API成功获取id_str作为room_id: {self.__room_id}")
                return self.__room_id

            logger.warning("【!】API返回的数据中未找到有效的room_id字段，尝试备用方法")
        except Exception as e:
            logger.warning(f"【!】get_douyin_web_stream_data API调用失败: {e}，尝试备用方法")

        # 方法2：备用方法 - 使用原来的HTML爬取实现
        try:
            headers = {
                "User-Agent": self.user_agent,
                "cookie": f"ttwid={self.ttwid}&msToken={generateMsToken()}; __ac_nonce=0123407cc00a9e438deb4",
            }
            if self.cookies:
                headers["cookie"] = self.cookies

            response = self.session.get(url, headers=headers)
            response.raise_for_status()

            # 尝试多种正则表达式匹配room_id
            patterns = [
                r'roomId\\":\\"(\d+)\\"',
                r'room_id\\":\\"(\d+)\\"',
                r'enter_room_id\\":\\"(\d+)\\"',
                r'roomId=(\d+)',
                r'"room_id":"(\d+)"',
                r'"enter_room_id":"(\d+)"',
            ]

            html_str = response.text
            for pattern in patterns:
                match = re.search(pattern, html_str)
                if match:
                    self.__room_id = match.group(1)
                    logger.info(f"【✓】通过备用方法成功获取room_id: {self.__room_id}")
                    return self.__room_id

            logger.error(f"【X】所有方法都无法获取room_id: {url}")
            return None
        except Exception as e:
            logger.error(f"【X】备用方法获取room_id失败: {e}")
            return None

    def get_ac_nonce(self):
        """
        获取 __ac_nonce
        """
        resp_cookies = self.session.get(self.host, headers=self.headers).cookies
        return resp_cookies.get("__ac_nonce")
    
    def get_ac_signature(self, __ac_nonce: str = None) -> str:
        """
        获取 __ac_signature
        """
        __ac_signature = get__ac_signature(self.host[8:], __ac_nonce, self.user_agent)
        self.session.cookies.set("__ac_signature", __ac_signature)
        return __ac_signature
    
    def get_a_bogus(self, url_params: dict):
        """
        获取 a_bogus
        """
        try:
            url = urllib.parse.urlencode(url_params)
            ctx = execute_js(self.abogus_file)
            _a_bogus = ctx.call("get_ab", url, self.user_agent)
            return _a_bogus
        except Exception as e:
            logger.error(f"【X】获取 a_bogus 失败: {e}")
            # 如果获取失败，返回空字符串
            return ""
    
    def get_room_status(self):
        """
        获取直播间开播状态:
        room_status: 2 直播已结束
        room_status: 0 直播进行中
        """
        msToken = generateMsToken()
        nonce = self.get_ac_nonce()
        signature = self.get_ac_signature(nonce)
        url = ('https://live.douyin.com/webcast/room/web/enter/?aid=6383'
               '&app_name=douyin_web&live_id=1&device_platform=web&language=zh-CN&enter_from=page_refresh'
               '&cookie_enabled=true&screen_width=5120&screen_height=1440&browser_language=zh-CN&browser_platform=Win32'
               '&browser_name=Edge&browser_version=140.0.0.0'
               f'&web_rid={self.live_id}'
               f'&room_id_str={self.room_id}'
               '&enter_source=&is_need_double_stream=false&insert_task_id=&live_reason=&msToken=' + msToken)
        query = parse_url(url).query
        params = {i[0]: i[1] for i in [j.split('=') for j in query.split('&')]}
        a_bogus = self.get_a_bogus(params)  # 计算a_bogus,成功率不是100%，出现失败时重试即可
        url += f"&a_bogus={a_bogus}"
        headers = self.headers.copy()
        headers.update({
            'Referer': f'https://live.douyin.com/{self.live_id}',
            'Cookie': f'ttwid={self.ttwid};__ac_nonce={nonce}; __ac_signature={signature}',
        })
        resp = self.session.get(url, headers=headers)
        data = resp.json().get('data')
        if data:
            room_status = data.get('room_status')
            user = data.get('user')
            user_id = user.get('id_str')
            nickname = user.get('nickname')
            logger.info(f"【{nickname}】[{user_id}]直播间：{['正在直播', '已结束'][bool(room_status)]}.")
    
    def _connectWebSocket(self):
        """
        连接抖音直播间websocket服务器，请求直播间数据
        """
        try:
            wss = ("wss://webcast100-ws-web-lq.douyin.com/webcast/im/push/v2/?app_name=douyin_web"
                   "&version_code=180800&webcast_sdk_version=1.0.14-beta.0"
                   "&update_version_code=1.0.14-beta.0&compress=gzip&device_platform=web&cookie_enabled=true"
                   "&screen_width=1536&screen_height=864&browser_language=zh-CN&browser_platform=Win32"
                   "&browser_name=Mozilla"
                   "&browser_version=5.0%20(Windows%20NT%2010.0;%20Win64;%20x64)%20AppleWebKit/537.36%20(KHTML,"
                   "%20like%20Gecko)%20Chrome/126.0.0.0%20Safari/537.36"
                   "&browser_online=true&tz_name=Asia/Shanghai"
                   "&cursor=d-1_u-1_fh-7392091211001140287_t-1721106114633_r-1"
                   f"&internal_ext=internal_src:dim|wss_push_room_id:{self.room_id}|wss_push_did:7319483754668557238"
                   f"|first_req_ms:1721106114541|fetch_time:1721106114633|seq:1|wss_info:0-1721106114633-0-0|"
                   f"&host=https://live.douyin.com&aid=6383&live_id=1&did_rule=3&endpoint=live_pc&support_wrds=1"
                   f"&user_unique_id=7319483754668557238&im_path=/webcast/im/fetch/&identity=audience"
                   f"&need_persist_msg_count=15&insert_task_id=&live_reason=&room_id={self.room_id}&heartbeatDuration=0")
            
            # 使用正确的签名文件路径
            signature = generateSignature(wss, self.sign_file)
            if signature is None:
                logger.error("【X】生成签名失败，无法连接WebSocket")
                return
            
            wss += f"&signature={signature}"
            
            headers = {
                "cookie": f"ttwid={self.ttwid}",
                'user-agent': self.user_agent,
            }
            
            self.ws = websocket.WebSocketApp(wss,
                                             header=headers,
                                             on_open=self._wsOnOpen,
                                             on_message=self._wsOnMessage,
                                             on_error=self._wsOnError,
                                             on_close=self._wsOnClose)
            self.ws.run_forever()
        except Exception as e:
            logger.error(f"【X】WebSocket连接失败: {e}")
            if hasattr(self, 'ws') and self.ws:
                self.stop()
            # 不抛出异常，避免影响整个程序
            return
    
    def _sendHeartbeat(self):
        """
        发送心跳包
        """
        while True:
            try:
                heartbeat = PushFrame(payload_type='hb').SerializeToString()
                self.ws.send(heartbeat, websocket.ABNF.OPCODE_PING)
                logger.info("【√】发送心跳包")
            except Exception as e:
                logger.error(f"【X】心跳包检测错误: {e}")
                break
            else:
                time.sleep(5)
    
    def _wsOnOpen(self, ws):
        """
        连接建立成功
        """
        logger.info("【√】WebSocket连接成功.")
        threading.Thread(target=self._sendHeartbeat).start()
    
    def _wsOnMessage(self, ws, message):
        """
        接收到数据
        :param ws: websocket实例
        :param message: 数据
        """
        
        # 根据proto结构体解析对象
        package = PushFrame().parse(message)
        response = Response().parse(gzip.decompress(package.payload))
        
        # 返回直播间服务器链接存活确认消息，便于持续获取数据
        if response.need_ack:
            ack = PushFrame(log_id=package.log_id,
                            payload_type='ack',
                            payload=response.internal_ext.encode('utf-8')
                            ).SerializeToString()
            ws.send(ack, websocket.ABNF.OPCODE_BINARY)
        
        # 根据消息类别解析消息体
        for msg in response.messages_list:
            method = msg.method
            try:
                {
                    'WebcastChatMessage': self._parseChatMsg,  # 聊天消息
                    'WebcastGiftMessage': self._parseGiftMsg,  # 礼物消息
                    'WebcastLikeMessage': self._parseLikeMsg,  # 点赞消息
                    'WebcastMemberMessage': self._parseMemberMsg,  # 进入直播间消息
                    'WebcastSocialMessage': self._parseSocialMsg,  # 关注消息
                    'WebcastRoomUserSeqMessage': self._parseRoomUserSeqMsg,  # 直播间统计
                    'WebcastFansclubMessage': self._parseFansclubMsg,  # 粉丝团消息
                    'WebcastControlMessage': self._parseControlMsg,  # 直播间状态消息
                    'WebcastEmojiChatMessage': self._parseEmojiChatMsg,  # 聊天表情包消息
                    'WebcastRoomStatsMessage': self._parseRoomStatsMsg,  # 直播间统计信息
                    'WebcastRoomMessage': self._parseRoomMsg,  # 直播间信息
                    'WebcastRoomRankMessage': self._parseRankMsg,  # 直播间排行榜信息
                    'WebcastRoomStreamAdaptationMessage': self._parseRoomStreamAdaptationMsg,  # 直播间流配置
                }.get(method)(msg.payload)
            except Exception:
                pass
    
    def _wsOnError(self, ws, error):
        logger.error(f"WebSocket error: {error}")
    
    def _wsOnClose(self, ws, *args):
        self.get_room_status()
        logger.info("WebSocket connection closed.")
    
    def _parseChatMsg(self, payload):
        """聊天消息"""
        message = ChatMessage().parse(payload)
        user_name = message.user.nick_name
        user_id = message.user.id
        content = message.content
        logger.info(f"【聊天msg】[{user_id}]{user_name}: {content}")
        # 将弹幕数据存入缓冲区
        import time
        danmaku_data = {
            "id": str(int(time.time() * 1000)),
            "timestamp": int(time.time() * 1000),
            "user_id": user_id,
            "username": user_name,
            "content": content,
            "type": "chat",
            "platform": "douyin",
            "room_id": self.room_id
        }
        self._add_to_buffer(danmaku_data)
    
    def _parseGiftMsg(self, payload):
        """礼物消息"""
        message = GiftMessage().parse(payload)
        user_name = message.user.nick_name
        gift_name = message.gift.name
        gift_cnt = message.combo_count
        logger.info(f"【礼物msg】{user_name} 送出了 {gift_name}x{gift_cnt}")
        # 将弹幕数据存入缓冲区
        import time
        danmaku_data = {
            "id": str(int(time.time() * 1000)),
            "timestamp": int(time.time() * 1000),
            "user_id": message.user.id,
            "username": user_name,
            "content": f"赠送 {gift_name}x{gift_cnt}",
            "type": "gift",
            "gift_name": gift_name,
            "gift_count": gift_cnt,
            "platform": "douyin",
            "room_id": self.room_id
        }
        self._add_to_buffer(danmaku_data)
    
    def _parseLikeMsg(self, payload):
        '''点赞消息'''
        message = LikeMessage().parse(payload)
        user_name = message.user.nick_name
        count = message.count
        logger.info(f"【点赞msg】{user_name} 点了{count}个赞")
        # 将弹幕数据存入缓冲区
        import time
        danmaku_data = {
            "id": str(int(time.time() * 1000)),
            "timestamp": int(time.time() * 1000),
            "user_id": message.user.id,
            "username": user_name,
            "content": f"点了{count}个赞",
            "type": "like",
            "like_count": count,
            "platform": "douyin",
            "room_id": self.room_id
        }
        self._add_to_buffer(danmaku_data)
    
    def _parseMemberMsg(self, payload):
        '''进入直播间消息'''
        message = MemberMessage().parse(payload)
        user_name = message.user.nick_name
        user_id = message.user.id
        gender = ["女", "男"][message.user.gender]
        logger.info(f"【进场msg】[{user_id}][{gender}]{user_name} 进入了直播间")
        # 将弹幕数据存入缓冲区
        import time
        danmaku_data = {
            "id": str(int(time.time() * 1000)),
            "timestamp": int(time.time() * 1000),
            "user_id": user_id,
            "username": user_name,
            "content": f"进入直播间",
            "type": "enter",
            "gender": gender,
            "platform": "douyin",
            "room_id": self.room_id
        }
        self._add_to_buffer(danmaku_data)
    
    def _parseSocialMsg(self, payload):
        '''关注消息'''
        message = SocialMessage().parse(payload)
        user_name = message.user.nick_name
        user_id = message.user.id
        logger.info(f"【关注msg】[{user_id}]{user_name} 关注了主播")
        # 将弹幕数据存入缓冲区
        import time
        danmaku_data = {
            "id": str(int(time.time() * 1000)),
            "timestamp": int(time.time() * 1000),
            "user_id": user_id,
            "username": user_name,
            "content": "关注了主播",
            "type": "follow",
            "platform": "douyin",
            "room_id": self.room_id
        }
        self._add_to_buffer(danmaku_data)
    
    def _parseRoomUserSeqMsg(self, payload):
        '''直播间统计'''
        message = RoomUserSeqMessage().parse(payload)
        current = message.total
        total = message.total_pv_for_anchor
        logger.info(f"【统计msg】当前观看人数: {current}, 累计观看人数: {total}")
    
    def _parseFansclubMsg(self, payload):
        '''粉丝团消息'''
        message = FansclubMessage().parse(payload)
        content = message.content
        logger.info(f"【粉丝团msg】 {content}")
    
    def _parseEmojiChatMsg(self, payload):
        '''聊天表情包消息'''
        message = EmojiChatMessage().parse(payload)
        emoji_id = message.emoji_id
        user = message.user
        common = message.common
        default_content = message.default_content
        logger.info(f"【聊天表情包id】 {emoji_id},user：{user},common:{common},default_content:{default_content}")
    
    def _parseRoomMsg(self, payload):
        message = RoomMessage().parse(payload)
        common = message.common
        room_id = common.room_id
        logger.info(f"【直播间msg】直播间id:{room_id}")
    
    def _parseRoomStatsMsg(self, payload):
        message = RoomStatsMessage().parse(payload)
        display_long = message.display_long
        logger.info(f"【直播间统计msg】{display_long}")
    
    def _parseRankMsg(self, payload):
        message = RoomRankMessage().parse(payload)
        ranks_list = message.ranks_list
        logger.info(f"【直播间排行榜msg】{ranks_list}")
    
    def _parseControlMsg(self, payload):
        '''直播间状态消息'''
        message = ControlMessage().parse(payload)
        
        if message.status == 3:
            logger.info("直播间已结束")
            self.stop()
    
    def _parseRoomStreamAdaptationMsg(self, payload):
        message = RoomStreamAdaptationMessage().parse(payload)
        adaptationType = message.adaptation_type
        logger.info(f'直播间adaptation: {adaptationType}')
