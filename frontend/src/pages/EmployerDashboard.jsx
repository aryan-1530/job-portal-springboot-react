import React, { useEffect, useState } from "react";
import {
  getEmployerJobs,
  closeJob,
} from "../services/employerService";
import CreateJobForm from "../components/CreateJobForm";
import JobApplicants from "../components/JobApplicants";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openJobId, setOpenJobId] = useState(null);

  // 🔥 NEW: applicant count per job
  const [applicantCounts, setApplicantCounts] = useState({});

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await getEmployerJobs();
      setJobs(res.data.content || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load employer jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleCloseJob = async (jobId) => {
    const confirm = window.confirm(
      "Are you sure you want to close this job?"
    );
    if (!confirm) return;

    try {
      await closeJob(jobId);
      loadJobs();
    } catch (err) {
      console.error(err);
      alert("Failed to close job");
    }
  };

  // 🔥 NEW: receive applicant count from JobApplicants
  const handleCountUpdate = (jobId, count) => {
    setApplicantCounts((prev) => ({
      ...prev,
      [jobId]: count,
    }));
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#020617",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* ================= CREATE JOB ================= */}
      <CreateJobForm onSuccess={loadJobs} />

      <h2 style={{ marginBottom: "20px" }}>My Job Postings</h2>

      {loading && <div style={{ color: "#9ca3af" }}>Loading jobs...</div>}

      {!loading && jobs.length === 0 && (
        <div style={{ color: "#9ca3af" }}>No jobs posted yet</div>
      )}

      {!loading &&
        jobs.map((job) => (
          <div
            key={job.id}
            style={{
              background: "#0f172a",
              padding: "22px",
              borderRadius: "16px",
              marginBottom: "24px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.45)",
            }}
          >
            {/* JOB INFO */}
            <h3 style={{ marginBottom: "6px" }}>{job.title}</h3>

            <div style={{ fontSize: "13px", color: "#9ca3af" }}>
              {job.company} • {job.location} • {job.jobType}
            </div>

            <div style={{ marginTop: "6px", fontSize: "14px" }}>
              Salary: ₹{job.salary}
            </div>

            {/* STATUS + POSTED DATE */}
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#9ca3af" }}>
              Status:{" "}
              <span
                style={{
                  color:
                    job.status === "OPEN" ? "#22c55e" : "#ef4444",
                  fontWeight: "600",
                }}
              >
                {job.status}
              </span>
              {" • "}
              Posted on{" "}
              {job.postedAt
                ? new Date(job.postedAt).toLocaleDateString()
                : "-"}
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", gap: "12px", marginTop: "14px" }}>
              {/* VIEW / HIDE APPLICANTS */}
              <button
                onClick={() =>
                  setOpenJobId(openJobId === job.id ? null : job.id)
                }
                style={{
                  background: "#2563eb",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {openJobId === job.id
                  ? "Hide Applicants"
                  : "View Applicants"}

                {/* 🔥 APPLICANT COUNT BADGE */}
                {applicantCounts[job.id] > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      background: "#22c55e",
                      color: "black",
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "2px 8px",
                      borderRadius: "999px",
                    }}
                  >
                    {applicantCounts[job.id]}
                  </span>
                )}
              </button>

              {/* CLOSE JOB (ONLY IF OPEN) */}
              {job.status === "OPEN" && (
                <button
                  onClick={() => handleCloseJob(job.id)}
                  style={{
                    background: "#7f1d1d",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Close Job
                </button>
              )}
            </div>

            {/* ================= SLIDE DOWN APPLICANTS ================= */}
            <div
              style={{
                overflow: "hidden",
                transition: "max-height 0.4s ease, opacity 0.3s ease",
                maxHeight: openJobId === job.id ? "800px" : "0px",
                opacity: openJobId === job.id ? 1 : 0,
                marginTop: openJobId === job.id ? "16px" : "0px",
              }}
            >
              {openJobId === job.id && (
                <JobApplicants
                  jobId={job.id}
                  onCountChange={handleCountUpdate}
                />
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default EmployerDashboard;
