package com.jobportal2.service;

import com.jobportal2.dto.JobDTO;
import com.jobportal2.dto.PageResponseDTO;

public interface JobService {

    // ================= JOB SEEKER (JWT AWARE) =================
    PageResponseDTO<JobDTO> getAllJobs(
            int page,
            int size,
            String sortBy,
            String sortDir,
            String keyword,
            String location,
            String jobType,
            String auth
    );

    // ================= EMPLOYER =================
    PageResponseDTO<JobDTO> getEmployerJobs(
            int page,
            int size,
            String sortBy,
            String sortDir,
            String token
    );

    JobDTO createJob(JobDTO jobDTO, String token);

    void closeJob(Long jobId, String token);
}
