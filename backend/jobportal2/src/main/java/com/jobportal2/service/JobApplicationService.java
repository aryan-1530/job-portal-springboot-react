package com.jobportal2.service;

import java.util.List;
import com.jobportal2.dto.JobApplicationDTO;

public interface JobApplicationService {

    // ✅ JWT BASED
	JobApplicationDTO applyToJob(Long jobId, String auth);


    List<JobApplicationDTO> getApplicationsByUser(Long userId);

    List<JobApplicationDTO> getApplicationsByJob(Long jobId);

    void updateStatus(Long applicationId, String status);
}
