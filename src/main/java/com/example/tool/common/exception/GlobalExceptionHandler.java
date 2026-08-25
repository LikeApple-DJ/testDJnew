package com.example.tool.common.exception;

import com.example.tool.common.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * 全局异常处理器。
 *
 * @author DTCoder
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 校验失败字段 → 错误码映射。
     * 根据设计文档：
     * - input 为空 → TOOL_001
     * - array 为空 → TOOL_003
     * - array 超长 → TOOL_004
     */
    private static final Map<String, String> VALIDATION_ERROR_CODE_MAP = Map.of(
            "input", "TOOL_001",
            "array", "TOOL_003"
    );

    /**
     * 处理业务异常。
     *
     * @param e 业务异常
     * @return 错误响应
     */
    @ExceptionHandler(BusinessException.class)
    public ApiResponse<Void> handleBusinessException(BusinessException e) {
        logger.warn("业务异常: code={}, message={}", e.getErrorCode(), e.getMessage());
        return ApiResponse.error(e.getErrorCode(), e.getMessage());
    }

    /**
     * 处理 Jakarta Validation 参数校验失败异常。
     * 根据校验失败字段映射对应错误码。
     *
     * @param e 参数校验异常
     * @return 错误响应
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<Void> handleValidationException(MethodArgumentNotValidException e) {
        FieldError fieldError = e.getBindingResult().getFieldError();
        String fieldName = fieldError != null ? fieldError.getField() : "";
        String errorCode = VALIDATION_ERROR_CODE_MAP.getOrDefault(fieldName, "TOOL_999");
        String message = fieldError != null ? fieldError.getDefaultMessage() : "参数校验失败";
        logger.warn("参数校验失败: code={}, field={}, message={}", errorCode, fieldName, message);
        return ApiResponse.error(errorCode, message);
    }

    /**
     * 处理非法参数异常（如不支持的哈希算法）。
     *
     * @param e 非法参数异常
     * @return 错误响应
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ApiResponse<Void> handleIllegalArgumentException(IllegalArgumentException e) {
        logger.warn("非法参数: message={}", e.getMessage());
        return ApiResponse.error("TOOL_002", e.getMessage());
    }

    /**
     * 处理未知异常。
     *
     * @param e 异常
     * @return 错误响应
     */
    @ExceptionHandler(Exception.class)
    public ApiResponse<Void> handleException(Exception e) {
        logger.error("系统异常: {}", e.getMessage(), e);
        return ApiResponse.error("TOOL_999", "系统内部错误");
    }
}