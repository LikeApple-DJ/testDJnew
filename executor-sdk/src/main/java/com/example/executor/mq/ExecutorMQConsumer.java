package com.example.executor.mq;

import com.example.executor.handler.JobHandlerExecutor;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@RocketMQMessageListener(topic = "scheduler-job-dispatch", consumerGroup = "executor-dispatch-consumer")
public class ExecutorMQConsumer implements RocketMQListener<ExecutorMQConsumer.JobDispatchMessage> {

    private static final Logger log = LoggerFactory.getLogger(ExecutorMQConsumer.class);
    private final JobHandlerExecutor jobHandlerExecutor;

    public ExecutorMQConsumer(JobHandlerExecutor jobHandlerExecutor) {
        this.jobHandlerExecutor = jobHandlerExecutor;
    }

    @Override
    public void onMessage(JobDispatchMessage message) {
        log.info("收到调度指令: jobId={}, handler={}", message.getJobId(), message.getJobHandler());
        jobHandlerExecutor.execute(message);
    }

    public static class JobDispatchMessage {
        private Long jobId;
        private String jobHandler;
        private String executorParam;
        private String triggerTime;
        private String traceId;

        public Long getJobId() { return jobId; }
        public void setJobId(Long jobId) { this.jobId = jobId; }
        public String getJobHandler() { return jobHandler; }
        public void setJobHandler(String jobHandler) { this.jobHandler = jobHandler; }
        public String getExecutorParam() { return executorParam; }
        public void setExecutorParam(String executorParam) { this.executorParam = executorParam; }
        public String getTriggerTime() { return triggerTime; }
        public void setTriggerTime(String triggerTime) { this.triggerTime = triggerTime; }
        public String getTraceId() { return traceId; }
        public void setTraceId(String traceId) { this.traceId = traceId; }
    }
}