package com.jobportal2.service.impl;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal2.dto.InterviewDTO;
import com.jobportal2.entity.Interview;
import com.jobportal2.entity.InterviewMode;
import com.jobportal2.entity.JobApplication;
import com.jobportal2.entity.User;
import com.jobportal2.entity.ApplicationStatus;
import com.jobportal2.repository.InterviewRepository;
import com.jobportal2.repository.JobApplicationRepository;
import com.jobportal2.repository.UserRepository;
import com.jobportal2.security.JwtUtil;
import com.jobportal2.service.EmailService;
import com.jobportal2.service.InterviewService;

@Service
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService; // reuse existing EmailService

    public InterviewServiceImpl(
            InterviewRepository interviewRepository,
            JobApplicationRepository applicationRepository,
            UserRepository userRepository,
            JwtUtil jwtUtil) {

        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public InterviewDTO scheduleInterview(InterviewDTO dto, String auth) {

        String token = auth.replace("Bearer", "").trim();
        String email = jwtUtil.extractEmail(token);
        String role  = jwtUtil.extractRole(token);

        if (!"EMPLOYER".equals(role)) {
            throw new RuntimeException("Access denied");
        }

        JobApplication application = applicationRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getJob().getEmployer().getEmail().equals(email)) {
            throw new RuntimeException("Access denied");
        }

        if (application.getStatus() != ApplicationStatus.SHORTLISTED) {
            throw new RuntimeException("Interview allowed only after shortlist");
        }

        // UPDATE IF EXISTS, ELSE CREATE
        Interview interview = interviewRepository
                .findByApplicationId(application.getId())
                .orElse(new Interview());

        interview.setApplication(application);
        interview.setScheduledAt(dto.getScheduledAt());
        interview.setMode(InterviewMode.valueOf(dto.getMode()));
        interview.setMeetingLink(dto.getMeetingLink());

        interviewRepository.save(interview);

        // ✅ CRITICAL FIX: MOVE APPLICATION TO INTERVIEWED
        application.setInterviewScheduled(true);
        application.setInterviewAt(dto.getScheduledAt());
        application.setStatus(ApplicationStatus.INTERVIEWED);
        applicationRepository.save(application);

        // EMAIL: INTERVIEW SCHEDULED
        User candidate = application.getUser();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

        String body =
                "Hi " + candidate.getName() + ",\n\n"
              + "Your interview has been scheduled 🎉\n\n"
              + "📌 Job: " + application.getJob().getTitle() + "\n"
              + "🏢 Company: " + application.getJob().getCompany() + "\n"
              + "🗓 Date & Time: " + dto.getScheduledAt().format(formatter) + "\n"
              + (dto.getMeetingLink() != null && !dto.getMeetingLink().isBlank()
                    ? "🔗 Meeting Link: " + dto.getMeetingLink() + "\n\n"
                    : "\n")
              + "Please be on time and all the best!\n\n"
              + "— Job Spring Team";

        emailService.sendEmail(
                candidate.getEmail(),
                "Interview Scheduled – " + application.getJob().getTitle(),
                body
        );

        dto.setId(interview.getId());
        dto.setStatus(interview.getStatus().name());

        return dto;
    }

    @Override
    public List<InterviewDTO> getMyInterviews(String auth) {

        String token = auth.replace("Bearer", "").trim();
        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return interviewRepository.findByApplicationUserId(user.getId())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<InterviewDTO> getInterviewsByJob(Long jobId, String auth) {

        String token = auth.replace("Bearer", "").trim();
        String email = jwtUtil.extractEmail(token);

        return interviewRepository.findByApplicationJobId(jobId)
                .stream()
                .filter(i ->
                        i.getApplication()
                         .getJob()
                         .getEmployer()
                         .getEmail()
                         .equals(email))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private InterviewDTO toDTO(Interview interview) {

        InterviewDTO dto = new InterviewDTO();
        dto.setId(interview.getId());
        dto.setApplicationId(interview.getApplication().getId());
        dto.setScheduledAt(interview.getScheduledAt());
        dto.setMode(interview.getMode().name());
        dto.setMeetingLink(interview.getMeetingLink());
        dto.setStatus(interview.getStatus().name());

        return dto;
    }
}
