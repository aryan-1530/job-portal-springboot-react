package com.jobportal2.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private JobApplication application;

    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    private InterviewMode mode;

    private String meetingLink;

    @Enumerated(EnumType.STRING)
    private InterviewStatus status;

    public Interview() {}

    @PrePersist
    public void onCreate() {
        this.status = InterviewStatus.SCHEDULED;
    }

    // ===== getters & setters =====

    public Long getId() {
        return id;
    }

    public JobApplication getApplication() {
        return application;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public InterviewMode getMode() {
        return mode;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public InterviewStatus getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setApplication(JobApplication application) {
        this.application = application;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public void setMode(InterviewMode mode) {
        this.mode = mode;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public void setStatus(InterviewStatus status) {
        this.status = status;
    }
}
