package com.example.executor.mq;

import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ExecutorMQProducer {

    private static final String TOPIC_JOB_CALLBACK = "scheduler-job-callback";
    private final RocketMQTemplate rocketMQTemplate;

    public ExecutorMQProducer(RocketMQTemplate rocketMQTemplate) {
        this.rocketMQTemplate = rocketMQTemplate;
    }

    public void sendCallback(Long jobId, String traceId, int status, String result) {
        JobCallbackMessage message = new JobCallbackMessage(
                jobId, traceId, status, result, LocalDateTime.now()
        );
        rocketMQTemplate.send(TOPIC_JOB_CALLBACK, MessageBuilder.withPayload(message).build());
    }

    public static class JobCallbackMessage {
        private Long jobId;
        private String traceId;
        private int status;
        private String result;
        private LocalDateTime finishTime;

        public JobCallbackMessage() {}

        public JobCallbackMessage(Long jobId, String traceId, int status, String result, LocalDateTime finishTime) {
            this.jobId = jobId;
            this.traceId = traceId;
            this.status = status;
            this.result = result;
            this.finishTime = finishTime;
        }

        public Long getJobId() { return jobId; }
        public void setJobId(Long jobId) { this.jobId = jobId; }
        public String getTraceId() { return traceId; }
        public void setTraceId(String traceId) { this.traceId = traceId; }
        public int getStatus() { return status; }
        public void setStatus(int status) { this.status = status; }
        public String getResult() { return result; }
        public void setResult(String result) { this.result = result; }
        public LocalDateTime getFinishTime() { return finishTime; }
        public void setFinishTime(LocalDateTime finishTime) { this.finishTime = finishTime; }
    }
}