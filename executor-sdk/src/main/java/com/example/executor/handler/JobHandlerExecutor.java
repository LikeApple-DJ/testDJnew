package com.example.executor.handler;

import com.example.executor.mq.ExecutorMQConsumer;
import com.example.executor.mq.ExecutorMQProducer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class JobHandlerExecutor {

    private static final Logger log = LoggerFactory.getLogger(JobHandlerExecutor.class);
    private final Map<String, JobHandler> handlerRegistry = new ConcurrentHashMap<>();
    private final ExecutorMQProducer mqProducer;

    public JobHandlerExecutor(ExecutorMQProducer mqProducer) {
        this.mqProducer = mqProducer;
    }

    public void registerHandler(JobHandler handler) {
        handlerRegistry.put(handler.getHandlerName(), handler);
        log.info("执行器已注册: handler={}", handler.getHandlerName());
    }

    public void execute(ExecutorMQConsumer.JobDispatchMessage message) {
        String handlerName = message.getJobHandler();
        JobHandler handler = handlerRegistry.get(handlerName);

        if (handler == null) {
            log.error("未找到处理器: handler={}", handlerName);
            mqProducer.sendCallback(message.getJobId(), message.getTraceId(), 2,
                    "No handler found: " + handlerName);
            return;
        }

        try {
            log.info("开始执行任务: jobId={}, handler={}", message.getJobId(), handlerName);
            String result = handler.execute(message.getExecutorParam());
            mqProducer.sendCallback(message.getJobId(), message.getTraceId(), 1, result);
            log.info("任务执行成功: jobId={}", message.getJobId());
        } catch (Exception e) {
            log.error("任务执行失败: jobId={}, error={}", message.getJobId(), e.getMessage());
            mqProducer.sendCallback(message.getJobId(), message.getTraceId(), 2, e.getMessage());
        }
    }
}