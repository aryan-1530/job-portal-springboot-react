package com.jobportal2.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.jobportal2.dto.JobDTO;
import com.jobportal2.dto.PageResponseDTO;
import com.jobportal2.entity.Job;
import com.jobportal2.entity.JobStatus;
import com.jobportal2.entity.User;
import com.jobportal2.exception.ResourceNotFoundException;
import com.jobportal2.repository.JobApplicationRepository;
import com.jobportal2.repository.JobRepository;
import com.jobportal2.repository.UserRepository;
import com.jobportal2.security.JwtUtil;
import com.jobportal2.service.JobService;
import com.jobportal2.specification.JobSpecification;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ================= JOB SEEKER (JWT AWARE) =================
    @Override
    public PageResponseDTO<JobDTO> getAllJobs(
            int page,
            int size,
            String sortBy,
            String sortDir,
            String keyword,
            String location,
            String jobType,
            String auth) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Job> spec = Specification
                .where(JobSpecification.hasKeyword(keyword))
                .and(JobSpecification.hasLocation(location))
                .and(JobSpecification.hasJobType(jobType))
                .and((root, query, cb) ->
                        cb.equal(root.get("status"), JobStatus.OPEN)
                );

        Page<Job> jobPage = jobRepository.findAll(spec, pageable);

        // 🔐 Resolve logged-in userId via EMAIL
        Long userId = null;

        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            String email = jwtUtil.extractEmail(token);

            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                userId = user.getId();
            }
        }

        // 🔥 MAKE IT FINAL FOR LAMBDA
        final Long finalUserId = userId;

        List<JobDTO> content = jobPage.getContent()
                .stream()
                .map(job -> mapToDTO(job, finalUserId))
                .collect(Collectors.toList());

        PageResponseDTO<JobDTO> response = new PageResponseDTO<>();
        response.setContent(content);
        response.setPageNumber(jobPage.getNumber());
        response.setPageSize(jobPage.getSize());
        response.setTotalElements(jobPage.getTotalElements());
        response.setTotalPages(jobPage.getTotalPages());
        response.setLast(jobPage.isLast());

        return response;
    }

    // ================= EMPLOYER =================
    @Override
    public PageResponseDTO<JobDTO> getEmployerJobs(
            int page,
            int size,
            String sortBy,
            String sortDir,
            String auth) {

        String token = auth.substring(7);
        String email = jwtUtil.extractEmail(token);
        String role = jwtUtil.extractRole(token);

        if (!"EMPLOYER".equals(role)) {
            throw new RuntimeException("Access denied");
        }

        User employer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Job> jobPage = jobRepository.findByEmployer(employer, pageable);

        List<JobDTO> content = jobPage.getContent()
                .stream()
                .map(job -> mapToDTO(job, null))
                .collect(Collectors.toList());

        PageResponseDTO<JobDTO> response = new PageResponseDTO<>();
        response.setContent(content);
        response.setPageNumber(jobPage.getNumber());
        response.setPageSize(jobPage.getSize());
        response.setTotalElements(jobPage.getTotalElements());
        response.setTotalPages(jobPage.getTotalPages());
        response.setLast(jobPage.isLast());

        return response;
    }

    // ================= CREATE JOB =================
    @Override
    public JobDTO createJob(JobDTO jobDTO, String auth) {

        String token = auth.substring(7);
        String email = jwtUtil.extractEmail(token);

        User employer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        Job job = new Job();
        job.setTitle(jobDTO.getTitle());
        job.setDescription(jobDTO.getDescription());
        job.setCompany(jobDTO.getCompany());
        job.setLocation(jobDTO.getLocation());
        job.setJobType(jobDTO.getJobType());
        job.setSalary(jobDTO.getSalary());
        job.setEmployer(employer);

        return mapToDTO(jobRepository.save(job), null);
    }

    // ================= CLOSE JOB =================
    @Override
    public void closeJob(Long jobId, String auth) {

        String token = auth.substring(7);
        String email = jwtUtil.extractEmail(token);
        String role = jwtUtil.extractRole(token);

        if (!"EMPLOYER".equals(role)) {
            throw new RuntimeException("Access denied");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getEmployer().getEmail().equals(email)) {
            throw new RuntimeException("You are not allowed to close this job");
        }

        job.setStatus(JobStatus.CLOSED);
        jobRepository.save(job);
    }

    // ================= DTO MAPPER =================
    private JobDTO mapToDTO(Job job, Long userId) {

        JobDTO dto = new JobDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setCompany(job.getCompany());
        dto.setLocation(job.getLocation());
        dto.setJobType(job.getJobType());
        dto.setSalary(job.getSalary());
        dto.setStatus(job.getStatus().name());
        dto.setPostedAt(job.getPostedAt());

        if (job.getEmployer() != null) {
            dto.setEmployerId(job.getEmployer().getId());
        }

        if (userId != null) {
            dto.setApplied(
                jobApplicationRepository
                    .existsByJobIdAndUserId(job.getId(), userId)
            );
        } else {
            dto.setApplied(false);
        }

        return dto;
    }
}
