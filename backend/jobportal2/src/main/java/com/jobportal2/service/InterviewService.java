package com.jobportal2.service;

import java.util.List;

import com.jobportal2.dto.InterviewDTO;


public interface InterviewService {

    InterviewDTO scheduleInterview(InterviewDTO dto, String auth);

    List<InterviewDTO> getMyInterviews(String auth);

    List<InterviewDTO> getInterviewsByJob(Long jobId, String auth);
}
