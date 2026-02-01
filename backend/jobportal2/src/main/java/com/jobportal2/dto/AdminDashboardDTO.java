package com.jobportal2.dto;

public class AdminDashboardDTO {

    private long totalUsers;
    private long totalAdmins;
    private long totalEmployers;
    private long totalJobSeekers;
    private long totalJobs;
    private long totalApplications;

    public AdminDashboardDTO() {}

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(long totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public long getTotalEmployers() {
        return totalEmployers;
    }

    public void setTotalEmployers(long totalEmployers) {
        this.totalEmployers = totalEmployers;
    }

    public long getTotalJobSeekers() {
        return totalJobSeekers;
    }

    public void setTotalJobSeekers(long totalJobSeekers) {
        this.totalJobSeekers = totalJobSeekers;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }
}
