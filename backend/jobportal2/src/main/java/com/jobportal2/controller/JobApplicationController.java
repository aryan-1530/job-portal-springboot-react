package com.jobportal2.controller;

import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

import com.jobportal2.dto.JobApplicationDTO;
import com.jobportal2.entity.JobApplication;
import com.jobportal2.repository.JobApplicationRepository;
import com.jobportal2.security.JwtUtil;
import com.jobportal2.service.JobApplicationService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService applicationService;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ================= APPLY TO JOB (JWT BASED) =================
    @PostMapping("/apply")
    public JobApplicationDTO applyToJob(
            @RequestParam Long jobId,
            @RequestHeader("Authorization") String auth) {

        return applicationService.applyToJob(jobId, auth);
    }

    // ================= JOB SEEKER → VIEW APPLICATIONS =================
    @GetMapping("/user/{userId}")
    public List<JobApplicationDTO> getApplicationsByUser(
            @PathVariable Long userId) {

        return applicationService.getApplicationsByUser(userId);
    }

    // ================= EMPLOYER → VIEW APPLICANTS =================
    @GetMapping("/job/{jobId}")
    public List<JobApplicationDTO> getApplicationsByJob(
            @PathVariable Long jobId) {

        return applicationService.getApplicationsByJob(jobId);
    }

    // ================= EMPLOYER → SHORTLIST =================
    @PutMapping("/{id}/shortlist")
    public void shortlistApplicant(@PathVariable Long id) {
        applicationService.updateStatus(id, "SHORTLISTED");
    }
 // ================= EMPLOYER → HIRE =================
    @PutMapping("/{id}/hire")
    public void hireApplicant(@PathVariable Long id) {
        applicationService.updateStatus(id, "HIRED");
    }

    // ================= EMPLOYER → REJECT =================
    @PutMapping("/{id}/reject")
    public void rejectApplicant(@PathVariable Long id) {
        applicationService.updateStatus(id, "REJECTED");
    }
 // ================= EMPLOYER → MARK INTERVIEW COMPLETED =================
    @PutMapping("/{id}/interviewed")
    public void markInterviewed(@PathVariable Long id) {
        applicationService.updateStatus(id, "INTERVIEWED");
    }


    // ================= EMPLOYER → VIEW RESUME (PDF) =================
    @GetMapping("/{applicationId}/resume")

    public ResponseEntity<Resource> viewResume(
            @PathVariable Long applicationId,
            @RequestHeader("Authorization") String auth) {

        try {
            String token = auth.replace("Bearer", "").trim();
            String email = jwtUtil.extractEmail(token);

            JobApplication application = jobApplicationRepository
                    .findById(applicationId)
                    .orElseThrow(() -> new RuntimeException("Application not found"));

            // ✅ SECURITY CHECK
            boolean isEmployer =
                    application.getJob().getEmployer().getEmail().equals(email);

            boolean isApplicant =
                    application.getUser().getEmail().equals(email);

            if (!isEmployer && !isApplicant) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            if (application.getUser().getResumePath() == null) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = Paths.get(application.getUser().getResumePath());

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + filePath.getFileName() + "\""
                    )
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
