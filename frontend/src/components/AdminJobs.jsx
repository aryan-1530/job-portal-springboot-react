import React, { useEffect, useState, useCallback } from "react";
import {
  getAllJobs,
  deleteJob,
  closeJobByAdmin,
} from "../services/adminService";

const AdminJobs = () => {
  const [jobsPage, setJobsPage] = useState(null);
  const [page, setPage] = useState(0);

  // ================= LOAD JOBS =================
  const loadJobs = useCallback(() => {
    getAllJobs(page).then(setJobsPage);
  }, [page]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // ================= DELETE / CLOSE LOGIC =================
  const handleDelete = async (job) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this job?\n\n${job.title} at ${job.company}`
    );

    if (!confirmDelete) return;

    try {
      await deleteJob(job.id);
      alert("Job deleted successfully");
      loadJobs();
    } catch (err) {
      if (err.response?.status === 409) {
        const confirmClose = window.confirm(
          "This job has applications.\nYou cannot delete it.\n\nDo you want to CLOSE the job instead?"
        );

        if (confirmClose) {
          await closeJobByAdmin(job.id);
          alert("Job closed successfully");
          loadJobs();
        }
      } else {
        alert("Failed to delete job");
      }
    }
  };

  // ================= UI =================
  return (
    <div style={{ padding: "30px", background: "#020617", minHeight: "100vh" }}>
      <h2 style={{ color: "white" }}>All Jobs</h2>

      {jobsPage?.content?.map((job) => (
        <div
          key={job.id}
          style={{
            background: "#020617",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "15px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            color: "white",
          }}
        >
          <h4 style={{ color: "#38bdf8" }}>{job.title}</h4>

          <p style={{ color: "#9ca3af" }}>
            {job.company} • {job.location}
          </p>

          <p style={{ fontSize: "14px" }}>{job.description}</p>

          <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
            {/* DELETE */}
            <button
              onClick={() => handleDelete(job)}
              style={{
                background: "#7f1d1d",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
              }}
            >
              Delete
            </button>

            {/* CLOSE JOB */}
            {job.status === "OPEN" && (
              <button
                onClick={() => closeJobByAdmin(job.id).then(loadJobs)}
                style={{
                  background: "#1e40af",
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
        </div>
      ))}

      {/* ================= PAGINATION ================= */}
      {jobsPage && (
        <div style={{ marginTop: "20px", color: "white" }}>
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            style={btn}
          >
            Prev
          </button>

          <span style={{ margin: "0 12px" }}>
            Page {page + 1} of {jobsPage.totalPages}
          </span>

          <button
            disabled={page === jobsPage.totalPages - 1}
            onClick={() => setPage(page + 1)}
            style={btn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const btn = {
  background: "#2563eb",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
};

export default AdminJobs;
