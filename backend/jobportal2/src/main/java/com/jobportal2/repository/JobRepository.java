package com.jobportal2.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.jobportal2.entity.Job;
import com.jobportal2.entity.JobStatus;
import com.jobportal2.entity.User;

public interface JobRepository
        extends JpaRepository<Job, Long>,
                JpaSpecificationExecutor<Job> {

    // ✅ Employer-specific jobs (OPEN + CLOSED)
    Page<Job> findByEmployer(User employer, Pageable pageable);

    // ✅ Job seeker jobs (ONLY OPEN)
    Page<Job> findByStatus(JobStatus status, Pageable pageable);

    // 📊 Admin analytics
    @Query("SELECT j.employer.name as employer, COUNT(j) as total FROM Job j GROUP BY j.employer.name")
    List<Map<String, Object>> getJobsPerEmployer();
}
