import React, { useEffect, useState, useCallback } from "react";
import {
  getApplicantsByJob,
  shortlistApplicant,
  rejectApplicant,
  scheduleInterview,
  hireApplicant,
  markInterviewed,
} from "../services/employerService";
import api from "../api/axiosConfig";

const JobApplicants = ({ jobId, onCountChange }) => {
  const [apps, setApps] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  const loadApplicants = useCallback(() => {
    getApplicantsByJob(jobId).then((res) => {
      const data = res.data || [];
      setApps(data);
      onCountChange?.(jobId, data.length);
    });
  }, [jobId, onCountChange]);

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);

  /* ================= VIEW RESUME ================= */

  const viewResume = async (id, uploaded) => {
    if (!uploaded) return;

    const res = await api.get(`/applications/${id}/resume`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );
    window.open(url, "_blank");
  };

  /* ================= CONFIRM INTERVIEW ================= */

  const confirmSchedule = async () => {
    if (!scheduledAt) {
      alert("Please select interview date & time");
      return;
    }

    await scheduleInterview(selectedAppId, {
      scheduledAt,
      mode: "ONLINE",
      meetingLink,
    });

    alert("Interview scheduled successfully");
    setShowSchedule(false);
    setSelectedAppId(null);
    setScheduledAt("");
    setMeetingLink("");
    loadApplicants();
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h4>Applicants</h4>

      {apps.length === 0 && (
        <div style={{ color: "#9ca3af" }}>No applicants yet</div>
      )}

      {apps.map((a) => {
        const status = a.status?.toUpperCase();

        return (
          <div key={a.id} style={card}>
            <div>
              <div style={{ fontWeight: 600 }}>{a.jobTitle}</div>
              <div style={muted}>Applicant ID: {a.userId}</div>

              <span style={statusPill(status)}>{status}</span>

              {a.interviewScheduled && (
                <div style={{ fontSize: 12, marginTop: 6, color: "#22c55e" }}>
                  📅 Interview: {new Date(a.interviewAt).toLocaleString()}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {/* VIEW RESUME */}
              <button
                disabled={!a.resumeUploaded}
                onClick={() => viewResume(a.id, a.resumeUploaded)}
                style={btn(a.resumeUploaded ? "#2563eb" : "#374151")}
              >
                View Resume
              </button>

              {/* APPLIED */}
              {status === "APPLIED" && (
                <>
                  <button
                    onClick={() =>
                      shortlistApplicant(a.id).then(loadApplicants)
                    }
                    style={btn("#064e3b")}
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() =>
                      rejectApplicant(a.id).then(loadApplicants)
                    }
                    style={btn("#7f1d1d")}
                  >
                    Reject
                  </button>
                </>
              )}

              {/* SHORTLISTED → SCHEDULE INTERVIEW */}
              {status === "SHORTLISTED" && !a.interviewScheduled && (
                <button
                  onClick={() => {
                    setSelectedAppId(a.id);
                    setShowSchedule(true);
                  }}
                  style={btn("#2563eb")}
                >
                  Schedule Interview
                </button>
              )}

              {/* SHORTLISTED + INTERVIEW DONE → MARK INTERVIEWED */}
              {status === "SHORTLISTED" && a.interviewScheduled && (
                <>
                  <button
                    onClick={() =>
                      markInterviewed(a.id).then(loadApplicants)
                    }
                    style={btn("#1e40af")}
                  >
                    Mark Interview Completed
                  </button>

                  <button
                    onClick={() =>
                      rejectApplicant(a.id).then(loadApplicants)
                    }
                    style={btn("#7f1d1d")}
                  >
                    Reject
                  </button>
                </>
              )}

              {/* INTERVIEWED → FINAL DECISION */}
              {status === "INTERVIEWED" && (
                <>
                  <button
                    onClick={() =>
                      hireApplicant(a.id).then(loadApplicants)
                    }
                    style={btn("#16a34a")}
                  >
                    Hire
                  </button>

                  <button
                    onClick={() =>
                      rejectApplicant(a.id).then(loadApplicants)
                    }
                    style={btn("#7f1d1d")}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* ================= SCHEDULE INTERVIEW ================= */}
      {showSchedule && (
        <div style={scheduleBox}>
          <h4>Schedule Interview</h4>

          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />

          <input
            placeholder="Meeting link (optional)"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
          />

          <button onClick={confirmSchedule} style={btn("#16a34a")}>
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */

const card = {
  background: "#020617",
  padding: "14px 18px",
  borderRadius: "10px",
  marginBottom: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "white",
};

const muted = { fontSize: "12px", color: "#9ca3af" };

const btn = (bg) => ({
  background: bg,
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
});

const statusPill = (status) => ({
  fontSize: "11px",
  padding: "4px 10px",
  borderRadius: "20px",
  background:
    status === "INTERVIEWED"
      ? "#1e40af"
      : status === "SHORTLISTED"
      ? "#064e3b"
      : status === "REJECTED"
      ? "#7f1d1d"
      : status === "HIRED"
      ? "#14532d"
      : "#374151",
});

const scheduleBox = {
  marginTop: "20px",
  background: "#020617",
  padding: "16px",
  borderRadius: "10px",
  color: "white",
};

export default JobApplicants;
