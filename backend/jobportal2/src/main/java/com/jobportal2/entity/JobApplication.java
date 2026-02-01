package com.jobportal2.entity;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Job job;

    @ManyToOne
    private User user;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private boolean interviewScheduled = false;

    private LocalDateTime interviewAt;
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

    public JobApplication() {}

    public Long getId() {
        return id;
    }

    public Job getJob() {
        return job;
    }

    public User getUser() {
        return user;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}
