# -*- encoding: utf-8 -*-

"""
快手 WebSocket 消息 AES 加密解密工具
参考 UserScript 中的实现
"""

import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad


class KuaishouAESCipher:
    """快手 WebSocket 消息 AES 加密解密"""

    def __init__(self):
        # 从 UserScript 中提取的密钥和 IV
        self.key = b'PPbzKKL7NB15leYy'
        self.iv = b'JRODKJiolJ9xqso0'

    def encrypt(self, data: bytes) -> bytes:
        """
        AES 加密

        Args:
            data: 待加密的数据

        Returns:
            bytes: 加密后的数据
        """
        try:
            cipher = AES.new(self.key, AES.MODE_CBC, self.iv)
            # 使用 PKCS7 填充
            padded_data = pad(data, AES.block_size)
            encrypted = cipher.encrypt(padded_data)
            return encrypted
        except Exception as e:
            raise Exception(f"AES 加密失败: {e}")

    def decrypt(self, data: bytes) -> bytes:
        """
        AES 解密

        Args:
            data: 待解密的数据

        Returns:
            bytes: 解密后的数据
        """
        try:
            cipher = AES.new(self.key, AES.MODE_CBC, self.iv)
            decrypted = cipher.decrypt(data)
            # 移除 PKCS7 填充
            unpadded = unpad(decrypted, AES.block_size)
            return unpadded
        except Exception as e:
            raise Exception(f"AES 解密失败: {e}")
