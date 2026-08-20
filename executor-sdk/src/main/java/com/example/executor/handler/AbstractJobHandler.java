package com.example.executor.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class AbstractJobHandler implements JobHandler {

    protected final Logger log = LoggerFactory.getLogger(getClass());

    @Override
    public abstract String execute(String executorParam) throws Exception;

    @Override
    public abstract String getHandlerName();
}