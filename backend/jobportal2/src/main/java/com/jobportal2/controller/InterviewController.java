package com.jobportal2.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.jobportal2.dto.InterviewDTO;
import com.jobportal2.service.InterviewService;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping("/schedule")
    public InterviewDTO scheduleInterview(
            @RequestBody InterviewDTO dto,
            @RequestHeader("Authorization") String auth) {

        return interviewService.scheduleInterview(dto, auth);
    }

    @GetMapping("/my")
    public List<InterviewDTO> myInterviews(
            @RequestHeader("Authorization") String auth) {

        return interviewService.getMyInterviews(auth);
    }

    @GetMapping("/job/{jobId}")
    public List<InterviewDTO> jobInterviews(
            @PathVariable Long jobId,
            @RequestHeader("Authorization") String auth) {

        return interviewService.getInterviewsByJob(jobId, auth);
    }
}
