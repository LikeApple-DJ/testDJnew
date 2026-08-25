package com.example.tool.service.impl;

import com.example.tool.constant.HashAlgorithmEnum;
import com.example.tool.common.exception.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * {@link HashServiceImpl} 单元测试。
 *
 * @author DTCoder
 */
@DisplayName("HashServiceImpl 单元测试")
class HashServiceImplTest {

    private HashServiceImpl hashService;

    @BeforeEach
    void setUp() {
        hashService = new HashServiceImpl();
    }

    @Test
    @DisplayName("SHA-256 哈希计算正常")
    void should_computeSha256_when_validInput() {
        String result = hashService.computeHash("hello", HashAlgorithmEnum.SHA256);

        assertThat(result)
                .isNotBlank()
                .hasSize(64)
                .matches("^[0-9a-f]+$");
    }

    @Test
    @DisplayName("MD5 哈希计算正常")
    void should_computeMd5_when_validInput() {
        String result = hashService.computeHash("hello", HashAlgorithmEnum.MD5);

        assertThat(result)
                .isNotBlank()
                .hasSize(32)
                .matches("^[0-9a-f]+$");
    }

    @Test
    @DisplayName("SHA-1 哈希计算正常")
    void should_computeSha1_when_validInput() {
        String result = hashService.computeHash("hello", HashAlgorithmEnum.SHA1);

        assertThat(result)
                .isNotBlank()
                .hasSize(40)
                .matches("^[0-9a-f]+$");
    }

    @Test
    @DisplayName("相同输入产生相同哈希")
    void should_produceSameHash_when_sameInput() {
        String hash1 = hashService.computeHash("test", HashAlgorithmEnum.SHA256);
        String hash2 = hashService.computeHash("test", HashAlgorithmEnum.SHA256);

        assertThat(hash1).isEqualTo(hash2);
    }

    @Test
    @DisplayName("不同输入产生不同哈希")
    void should_produceDifferentHash_when_differentInput() {
        String hash1 = hashService.computeHash("hello", HashAlgorithmEnum.SHA256);
        String hash2 = hashService.computeHash("world", HashAlgorithmEnum.SHA256);

        assertThat(hash1).isNotEqualTo(hash2);
    }

    @Test
    @DisplayName("空字符串抛出 BusinessException")
    void should_throwException_when_emptyInput() {
        assertThatThrownBy(() -> hashService.computeHash("", HashAlgorithmEnum.SHA256))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("输入不能为空");
    }

    @Test
    @DisplayName("null 输入抛出 BusinessException")
    void should_throwException_when_nullInput() {
        assertThatThrownBy(() -> hashService.computeHash(null, HashAlgorithmEnum.SHA256))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("输入不能为空");
    }
}