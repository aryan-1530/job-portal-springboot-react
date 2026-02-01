package com.jobportal2.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jobportal2.entity.ApplicationStatus;
import com.jobportal2.entity.Job;
import com.jobportal2.entity.JobApplication;
import com.jobportal2.entity.User;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    // ================= BASIC =================

    boolean existsByJobAndUser(Job job, User user);

    boolean existsByJobIdAndUserId(Long jobId, Long userId);

    // ✅ THIS IS REQUIRED FOR ADMIN DELETE / CLOSE LOGIC
    boolean existsByJobId(Long jobId);

    // (optional but useful)
    long countByJobId(Long jobId);

    List<JobApplication> findByUser(User user);

    List<JobApplication> findByJob(Job job);

    // ================= 📊 ANALYTICS =================

    // Applications per Job
    @Query("""
        SELECT a.job.title AS job,
               COUNT(a) AS total
        FROM JobApplication a
        GROUP BY a.job.title
    """)
    List<Map<String, Object>> getApplicationsPerJob();

    // Status-based counts (used in funnel & hire rate)
    long countByStatus(ApplicationStatus status);
}
