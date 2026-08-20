package com.example.executor.handler;

public interface JobHandler {
    String execute(String executorParam) throws Exception;
    String getHandlerName();
}