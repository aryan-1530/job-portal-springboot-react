import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import JobApplicants from "./JobApplicants";

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    api
      .get(`/jobs?page=${page}&size=6`)
      .then((res) => {
        setJobs(res.data.content || []);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  }, [page]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <h3 style={{ color: "white", marginBottom: "20px" }}>
        My Job Postings
      </h3>

      {jobs.length === 0 && (
        <p style={{ color: "#9ca3af" }}>No jobs posted yet.</p>
      )}

      {/* JOB GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {jobs.map((j) => (
          <div
            key={j.id}
            style={{
              background: "#020617",
              borderRadius: "14px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.45)",
              padding: "22px",
              color: "white",
              transition: "0.2s",
            }}
          >
            <h4 style={{ color: "#38bdf8", marginBottom: "4px" }}>
              {j.title}
            </h4>

            <div style={{ fontSize: "13px", color: "#9ca3af" }}>
              {j.company} • {j.location}
            </div>

            <p style={{ marginTop: "12px", fontSize: "14px" }}>
              {j.description}
            </p>

            <div style={{ marginTop: "12px", fontSize: "13px" }}>
              <b>Type:</b> {j.jobType || "Not specified"}
            </div>

            <div style={{ fontSize: "13px" }}>
              <b>Salary:</b>{" "}
              {j.salary ? `₹${j.salary}` : "Not specified"}
            </div>

            <button
              style={{
                marginTop: "14px",
                background:
                  selectedJobId === j.id ? "#374151" : "#2563eb",
                border: "none",
                padding: "8px 16px",
                borderRadius: "10px",
                color: "white",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() =>
                setSelectedJobId(
                  selectedJobId === j.id ? null : j.id
                )
              }
            >
              {selectedJobId === j.id
                ? "Hide Applicants"
                : "View Applicants"}
            </button>

            {selectedJobId === j.id && (
              <div style={{ marginTop: "15px" }}>
                <JobApplicants jobId={j.id} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
          color: "white",
        }}
      >
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          style={pagerBtn}
        >
          Prev
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages - 1}
          style={pagerBtn}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const pagerBtn = {
  background: "#1f2937",
  border: "1px solid #374151",
  padding: "8px 16px",
  borderRadius: "10px",
  color: "white",
  cursor: "pointer",
};
