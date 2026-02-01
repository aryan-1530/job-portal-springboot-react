package com.jobportal2.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobportal2.entity.Interview;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    Optional<Interview> findByApplicationId(Long applicationId);

    List<Interview> findByApplicationUserId(Long userId);

    List<Interview> findByApplicationJobId(Long jobId);
}
