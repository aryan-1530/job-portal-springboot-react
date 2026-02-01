package com.jobportal2.dto;

import java.time.LocalDateTime;

public class JobApplicationDTO {

    private Long id;
    private Long jobId;
    private Long userId;
    private String jobTitle;
    private String company;
    private String status;

    // existing
    private boolean resumeUploaded;

    // 🔹 INTERVIEW TRACKING (NEW)
    private boolean interviewScheduled;
    private LocalDateTime interviewAt;

    public JobApplicationDTO() {}

    // ===== getters & setters =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isResumeUploaded() {
        return resumeUploaded;
    }

    public void setResumeUploaded(boolean resumeUploaded) {
        this.resumeUploaded = resumeUploaded;
    }

    public boolean isInterviewScheduled() {
        return interviewScheduled;
    }

    public void setInterviewScheduled(boolean interviewScheduled) {
        this.interviewScheduled = interviewScheduled;
    }

    public LocalDateTime getInterviewAt() {
        return interviewAt;
    }

    public void setInterviewAt(LocalDateTime interviewAt) {
        this.interviewAt = interviewAt;
    }
}
