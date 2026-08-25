package com.example.tool.common;

/**
 * 统一 API 响应体。
 *
 * @param <T> 业务数据类型
 * @author DTCoder
 */
public class ApiResponse<T> {

    private String code;
    private String msg;
    private T data;

    private ApiResponse() {
    }

    /**
     * 创建成功响应。
     *
     * @param data 业务数据
     * @param <T>  数据类型
     * @return 成功响应
     */
    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.code = "OK";
        response.msg = "SUCCESS";
        response.data = data;
        return response;
    }

    /**
     * 创建错误响应。
     *
     * @param code 错误码
     * @param msg  错误信息
     * @param <T>  数据类型
     * @return 错误响应
     */
    public static <T> ApiResponse<T> error(String code, String msg) {
        ApiResponse<T> response = new ApiResponse<>();
        response.code = code;
        response.msg = msg;
        response.data = null;
        return response;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}