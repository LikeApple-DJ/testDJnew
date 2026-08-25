package com.example.tool.service.impl;

import com.example.tool.common.exception.BusinessException;
import com.example.tool.constant.HashAlgorithmEnum;
import com.example.tool.service.HashService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 哈希计算服务实现。
 *
 * @author DTCoder
 */
@Service
public class HashServiceImpl implements HashService {

    private static final Logger logger = LoggerFactory.getLogger(HashServiceImpl.class);

    @Override
    public String computeHash(String input, HashAlgorithmEnum algorithm) {
        if (input == null || input.isEmpty()) {
            throw new BusinessException("TOOL_001", "输入不能为空");
        }

        try {
            MessageDigest digest = MessageDigest.getInstance(algorithm.getAlgorithm());
            byte[] hashBytes = digest.digest(input.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            String result = hexString.toString();
            if (logger.isDebugEnabled()) {
                logger.debug("哈希计算完成: algorithm={}, input length={}, hash={}",
                        algorithm.getAlgorithm(), input.length(), result);
            }
            return result;
        } catch (NoSuchAlgorithmException e) {
            logger.error("不支持的哈希算法: {}", algorithm.getAlgorithm(), e);
            throw new BusinessException("TOOL_002", "不支持的哈希算法: " + algorithm.getAlgorithm());
        }
    }
}