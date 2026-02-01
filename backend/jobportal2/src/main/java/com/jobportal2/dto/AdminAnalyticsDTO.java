package com.jobportal2.dto;

import java.util.List;
import java.util.Map;

public class AdminAnalyticsDTO {

    private long totalUsers;
    private long totalJobSeekers;
    private long totalApplications;

    private long totalShortlisted;
    private long totalInterviewed;
    private long totalHired;

    private List<Map<String, Object>> jobsPerEmployer;
    private List<Map<String, Object>> applicationsPerJob;

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalJobSeekers() { return totalJobSeekers; }
    public void setTotalJobSeekers(long totalJobSeekers) { this.totalJobSeekers = totalJobSeekers; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getTotalShortlisted() { return totalShortlisted; }
    public void setTotalShortlisted(long totalShortlisted) { this.totalShortlisted = totalShortlisted; }

    public long getTotalInterviewed() { return totalInterviewed; }
    public void setTotalInterviewed(long totalInterviewed) { this.totalInterviewed = totalInterviewed; }

    public long getTotalHired() { return totalHired; }
    public void setTotalHired(long totalHired) { this.totalHired = totalHired; }

    public List<Map<String, Object>> getJobsPerEmployer() { return jobsPerEmployer; }
    public void setJobsPerEmployer(List<Map<String, Object>> jobsPerEmployer) { this.jobsPerEmployer = jobsPerEmployer; }

    public List<Map<String, Object>> getApplicationsPerJob() { return applicationsPerJob; }
    public void setApplicationsPerJob(List<Map<String, Object>> applicationsPerJob) { this.applicationsPerJob = applicationsPerJob; }
}
