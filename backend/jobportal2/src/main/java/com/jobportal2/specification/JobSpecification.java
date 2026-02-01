package com.jobportal2.specification;

import org.springframework.data.jpa.domain.Specification;
import com.jobportal2.entity.Job;

public class JobSpecification {

    // ================= KEYWORD FILTER =================
    // Searches in: title, description, company, location
    public static Specification<Job> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.trim().toLowerCase() + "%";

            return cb.or(
                cb.like(cb.lower(root.get("title")), pattern),
                cb.like(cb.lower(root.get("description")), pattern),
                cb.like(cb.lower(root.get("company")), pattern),
                cb.like(cb.lower(root.get("location")), pattern) // ✅ REQUIRED FIX
            );
        };
    }

    // ================= LOCATION FILTER =================
    // Partial + case-insensitive
    public static Specification<Job> hasLocation(String location) {
        return (root, query, cb) -> {
            if (location == null || location.trim().isEmpty()) {
                return cb.conjunction();
            }

            return cb.like(
                cb.lower(root.get("location")),
                "%" + location.trim().toLowerCase() + "%"
            );
        };
    }

    // ================= JOB TYPE FILTER =================
    // ENUM-safe (NO lower())
    public static Specification<Job> hasJobType(String jobType) {
        return (root, query, cb) -> {
            if (jobType == null || jobType.trim().isEmpty()) {
                return cb.conjunction();
            }

            return cb.equal(root.get("jobType"), jobType);
        };
    }
}
