package com.jobportal2.dto;

import java.time.LocalDateTime;

public class InterviewDTO {

    private Long id;
    private Long applicationId;
    private LocalDateTime scheduledAt;
    private String mode;
    private String meetingLink;
    private String status;

    public InterviewDTO() {}

    public Long getId() {
        return id;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public String getMode() {
        return mode;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public String getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
