package com.example.tool.constant;

/**
 * 哈希算法枚举。
 *
 * @author DTCoder
 */
public enum HashAlgorithmEnum {

    SHA256("SHA-256"),
    MD5("MD5"),
    SHA1("SHA-1");

    private final String algorithm;

    HashAlgorithmEnum(String algorithm) {
        this.algorithm = algorithm;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    /**
     * 根据算法名称字符串查找枚举。
     * 若 name 为 null 或空白，默认返回 {@link #SHA256}。
     *
     * @param name 算法名称（可为 null）
     * @return 对应的枚举值，默认 SHA256
     * @throws IllegalArgumentException 如果未找到匹配的算法
     */
    public static HashAlgorithmEnum fromName(String name) {
        if (name == null || name.isBlank()) {
            return SHA256;
        }
        for (HashAlgorithmEnum value : values()) {
            if (value.algorithm.equalsIgnoreCase(name) || value.name().equalsIgnoreCase(name)) {
                return value;
            }
        }
        throw new IllegalArgumentException("不支持的哈希算法: " + name);
    }
}