import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { applyJob } from "../services/JobSeekerService";

const JobList = ({ filters }) => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔄 RESET PAGE WHEN FILTERS CHANGE
  useEffect(() => {
    setPage(0);
  }, [filters.keyword, filters.location, filters.jobType]);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const params = { page, size: 5 };
      if (filters.keyword?.trim()) params.keyword = filters.keyword;
      if (filters.location?.trim()) params.location = filters.location;
      if (filters.jobType) params.jobType = filters.jobType;

      const res = await api.get("/jobs", { params });

      setJobs(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching jobs", err);
      setJobs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // ✅ JWT based apply
  const handleApply = async (jobId) => {
    try {
      await applyJob(jobId);
      alert("Applied successfully");
      fetchJobs(); // 🔥 refresh to get updated applied=true
    } catch (err) {
      console.error(err);
      alert("You may have already applied for this job");
    }
  };

  return (
    <div>
      {loading && <div style={{ color: "#9ca3af" }}>Loading jobs...</div>}

      {!loading && jobs.length === 0 && (
        <div style={{ color: "#9ca3af" }}>No jobs found.</div>
      )}

      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            background: "#020617",
            padding: "20px",
            borderRadius: "14px",
            marginBottom: "20px",
            color: "white",
          }}
        >
          <h3>{job.title}</h3>

          <div style={{ color: "#9ca3af", marginBottom: "4px" }}>
            {job.company} • {job.location}
          </div>

          <div>
            {job.jobType} • ₹{job.salary}
          </div>

          {/* JOB DESCRIPTION */}
          <div
            style={{
              marginTop: "10px",
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#e5e7eb",
            }}
          >
            {job.description}
          </div>

          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "6px" }}>
            Posted on{" "}
            {job.postedAt
              ? new Date(job.postedAt).toLocaleDateString()
              : "-"}
          </div>

          {/* ✅ APPLY / CLOSED / APPLIED LOGIC */}
          {job.status === "CLOSED" ? (
            <div
              style={{
                marginTop: "12px",
                color: "#f87171",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              This job is closed
            </div>
          ) : (
            <button
              disabled={job.applied}
              onClick={() => handleApply(job.id)}
              style={{
                marginTop: "12px",
                background: job.applied ? "#334155" : "#2563eb",
                border: "none",
                padding: "10px 16px",
                borderRadius: "10px",
                color: "white",
                cursor: job.applied ? "not-allowed" : "pointer",
              }}
            >
              {job.applied ? "Applied" : "Apply"}
            </button>
          )}
        </div>
      ))}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span style={{ color: "#9ca3af" }}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobList;
