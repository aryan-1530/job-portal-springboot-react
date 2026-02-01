package com.jobportal2.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal2.dto.JobApplicationDTO;
import com.jobportal2.entity.ApplicationStatus;
import com.jobportal2.entity.Job;
import com.jobportal2.entity.JobApplication;
import com.jobportal2.entity.User;
import com.jobportal2.exception.ResourceNotFoundException;
import com.jobportal2.repository.JobApplicationRepository;
import com.jobportal2.repository.JobRepository;
import com.jobportal2.repository.UserRepository;
import com.jobportal2.security.JwtUtil;
import com.jobportal2.service.EmailService;
import com.jobportal2.service.JobApplicationService;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    // ================= APPLY TO JOB =================
    @Override
    public JobApplicationDTO applyToJob(Long jobId, String auth) {

        String token = auth.substring(7);
        String email = jwtUtil.extractEmail(token);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (jobApplicationRepository.existsByJobAndUser(job, user)) {
            throw new RuntimeException("You have already applied for this job");
        }

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setUser(user);
        application.setStatus(ApplicationStatus.APPLIED);

        JobApplication saved = jobApplicationRepository.save(application);

        emailService.sendEmail(
                user.getEmail(),
                "Application Received",
                "Hi " + user.getName() + ",\n\n"
              + "Your application for " + job.getTitle()
              + " at " + job.getCompany() + " has been received.\n\n"
              + "— Job Spring Team"
        );

        return mapToDTO(saved);
    }

    // ================= USER → VIEW APPLICATIONS =================
    @Override
    public List<JobApplicationDTO> getApplicationsByUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return jobApplicationRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= EMPLOYER → VIEW APPLICANTS =================
    @Override
    public List<JobApplicationDTO> getApplicationsByJob(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        return jobApplicationRepository.findByJob(job)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= UPDATE STATUS (REUSED) =================
    @Override
    public void updateStatus(Long applicationId, String status) {

        JobApplication app = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        ApplicationStatus newStatus = ApplicationStatus.valueOf(status);
        ApplicationStatus current = app.getStatus();

        // ✅ BASIC FLOW GUARD
        if (newStatus == ApplicationStatus.HIRED &&
            current != ApplicationStatus.INTERVIEWED) {
            throw new RuntimeException("Hire allowed only after interview");
        }

        app.setStatus(newStatus);
        jobApplicationRepository.save(app);

        User user = app.getUser();
        Job job = app.getJob();

        // 📧 EMAILS
        switch (newStatus) {

            case SHORTLISTED ->
                emailService.sendEmail(
                    user.getEmail(),
                    "Application Shortlisted 🎉",
                    "Hi " + user.getName() + ",\n\n"
                  + "You have been shortlisted for "
                  + job.getTitle() + " at " + job.getCompany() + ".\n\n"
                  + "— Job Spring Team"
                );

            case REJECTED ->
                emailService.sendEmail(
                    user.getEmail(),
                    "Application Update",
                    "Hi " + user.getName() + ",\n\n"
                  + "Your application for "
                  + job.getTitle() + " was not selected.\n\n"
                  + "— Job Spring Team"
                );

            case HIRED ->
                emailService.sendEmail(
                    user.getEmail(),
                    "🎉 Congratulations! You’re Hired",
                    "Hi " + user.getName() + ",\n\n"
                  + "Congratulations! You have been selected for "
                  + job.getTitle() + " at " + job.getCompany() + ".\n\n"
                  + "HR will contact you shortly.\n\n"
                  + "— Job Spring Team"
                );

            default -> {}
        }
    }

    // ================= ENTITY → DTO =================
    private JobApplicationDTO mapToDTO(JobApplication application) {

        JobApplicationDTO dto = new JobApplicationDTO();
        dto.setId(application.getId());
        dto.setJobId(application.getJob().getId());
        dto.setUserId(application.getUser().getId());
        dto.setJobTitle(application.getJob().getTitle());
        dto.setCompany(application.getJob().getCompany());
        dto.setStatus(application.getStatus().name());
        dto.setResumeUploaded(application.getUser().getResumePath() != null);
        dto.setInterviewScheduled(application.isInterviewScheduled());
        dto.setInterviewAt(application.getInterviewAt());

        return dto;
    }
}
