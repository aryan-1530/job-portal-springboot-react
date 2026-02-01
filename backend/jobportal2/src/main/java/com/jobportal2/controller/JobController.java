package com.jobportal2.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal2.dto.JobDTO;
import com.jobportal2.dto.PageResponseDTO;
import com.jobportal2.service.JobService;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    // ================= GET ALL JOBS (PAGINATION + SORTING + FILTERS) =================
    @GetMapping
    public PageResponseDTO<JobDTO> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestHeader(value = "Authorization", required = false) String auth
    ) {
        return jobService.getAllJobs(
                page,
                size,
                sortBy,
                sortDir,
                keyword,
                location,
                jobType,
                auth
        );
    }

    // ================= CREATE JOB (EMPLOYER) =================
    @PostMapping
    public JobDTO createJob(
            @RequestBody JobDTO dto,
            @RequestHeader("Authorization") String auth) {

        return jobService.createJob(dto, auth);
    }
 // ================= EMPLOYER JOBS =================
    @GetMapping("/employer")
    public PageResponseDTO<JobDTO> getEmployerJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestHeader("Authorization") String auth
    ) {
        return jobService.getEmployerJobs(page, size, sortBy, sortDir, auth);
    }
    
    @PutMapping("/{jobId}/close")
    public void closeJob(
            @PathVariable Long jobId,
            @RequestHeader("Authorization") String auth) {

        jobService.closeJob(jobId, auth);
    }


}
