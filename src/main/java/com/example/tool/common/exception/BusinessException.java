package com.example.tool.common.exception;

/**
 * 业务异常。
 *
 * @author DTCoder
 */
public class BusinessException extends RuntimeException {

    private final String errorCode;

    /**
     * 构造业务异常。
     *
     * @param errorCode 错误码
     * @param message   错误信息
     */
    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}