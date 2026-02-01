package com.jobportal2.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobportal2.dto.AdminDashboardDTO;
import com.jobportal2.dto.AdminAnalyticsDTO;
import com.jobportal2.entity.ApplicationStatus;
import com.jobportal2.entity.Job;
import com.jobportal2.entity.JobStatus;
import com.jobportal2.entity.Role;
import com.jobportal2.entity.User;
import com.jobportal2.repository.JobApplicationRepository;
import com.jobportal2.repository.JobRepository;
import com.jobportal2.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    // ================= USERS =================

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ THIS WAS MISSING / BROKEN
    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // 🔴 BLOCK USER
    @PutMapping("/user/{id}/block")
    public void blockUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        if (user.getRole() != Role.ADMIN) {
            user.setActive(false);
            userRepository.save(user);
        }
    }

    // 🟢 ACTIVATE USER
    @PutMapping("/user/{id}/activate")
    public void activateUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setActive(true);
        userRepository.save(user);
    }

    // ================= JOBS =================

    @GetMapping("/jobs")
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // ❌ DELETE JOB ONLY IF NO APPLICATIONS
    @DeleteMapping("/job/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {

        if (jobApplicationRepository.existsByJobId(id)) {
            return ResponseEntity
                    .status(409)
                    .body("Job has applications. Close it instead.");
        }

        jobRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // 🟡 CLOSE JOB
    @PutMapping("/job/{id}/close")
    public void closeJobByAdmin(@PathVariable Long id) {
        Job job = jobRepository.findById(id).orElseThrow();
        job.setStatus(JobStatus.CLOSED);
        jobRepository.save(job);
    }

    // ================= DASHBOARD =================

    @GetMapping("/dashboard")
    public AdminDashboardDTO getDashboardStats() {

        AdminDashboardDTO dto = new AdminDashboardDTO();

        dto.setTotalUsers(userRepository.count());
        dto.setTotalJobs(jobRepository.count());
        dto.setTotalApplications(jobApplicationRepository.count());

        dto.setTotalAdmins(
                userRepository.findAll().stream()
                        .filter(u -> u.getRole() == Role.ADMIN)
                        .count()
        );

        dto.setTotalEmployers(
                userRepository.findAll().stream()
                        .filter(u -> u.getRole() == Role.EMPLOYER)
                        .count()
        );

        dto.setTotalJobSeekers(
                userRepository.findAll().stream()
                        .filter(u -> u.getRole() == Role.JOB_SEEKER)
                        .count()
        );

        return dto;
    }

    // ================= 📊 ANALYTICS =================

    @GetMapping("/analytics")
    public AdminAnalyticsDTO getAnalytics() {

        AdminAnalyticsDTO dto = new AdminAnalyticsDTO();

        long shortlisted =
                jobApplicationRepository.countByStatus(ApplicationStatus.SHORTLISTED);
        long interviewed =
                jobApplicationRepository.countByStatus(ApplicationStatus.INTERVIEWED);
        long hired =
                jobApplicationRepository.countByStatus(ApplicationStatus.HIRED);

        dto.setTotalApplications(jobApplicationRepository.count());
        dto.setTotalShortlisted(shortlisted + interviewed + hired);
        dto.setTotalInterviewed(interviewed + hired);
        dto.setTotalHired(hired);

        dto.setJobsPerEmployer(jobRepository.getJobsPerEmployer());
        dto.setApplicationsPerJob(jobApplicationRepository.getApplicationsPerJob());

        return dto;
    }
}
