import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  uploadResume,
} from "../services/userService";
import { getMyApplications } from "../services/JobSeekerService";

const UserProfile = () => {
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getUserProfile(userId).then((res) => {
      setUser(res.data);
      setName(res.data.name || "");
    });

    getMyApplications(userId).then((res) => {
      setApplications(res.data || []);
    });
  }, [userId]);

  const handleUpdate = () => {
    updateUserProfile(userId, { name, password }).then(() => {
      alert("Profile updated successfully");
      setPassword("");
    });
  };

  const handleResumeUpload = async () => {
    if (!resume) {
      alert("Please select a resume first");
      return;
    }

    try {
      setUploading(true);
      await uploadResume(resume);
      alert("Resume uploaded successfully");
      setResume(null);
    } catch (err) {
      alert("Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ background: "#020617", minHeight: "100vh", paddingBottom: "60px" }}>
      {/* PROFILE */}
      <div
        style={{
          maxWidth: "600px",
          margin: "60px auto",
          background: "#020617",
          borderRadius: "16px",
          padding: "40px",
          color: "#e5e7eb",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>My Profile</h2>

        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={input} />

        <label>Email</label>
        <input
          value={user.email || ""}
          disabled
          style={{ ...input, background: "#0f172a", color: "#9ca3af" }}
        />

        <label>Role</label>
        <input
          value={user.role || ""}
          disabled
          style={{ ...input, background: "#0f172a", color: "#9ca3af" }}
        />

        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <label>Resume</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files[0])}
        />

        <button onClick={handleResumeUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload / Replace Resume"}
        </button>

        <button onClick={handleUpdate} style={{ marginTop: "12px" }}>
          Save Changes
        </button>
      </div>

      {/* APPLICATION TRACKING */}
      <div
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          background: "#020617",
          borderRadius: "16px",
          padding: "30px",
          color: "#e5e7eb",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>My Applications</h3>

        {applications.length === 0 && (
          <p style={{ color: "#9ca3af" }}>No applications yet</p>
        )}

        {applications.map((app) => (
          <div
            key={app.id}
            style={{
              background: "#020617",
              border: "1px solid #1f2937",
              padding: "14px",
              borderRadius: "10px",
              marginBottom: "12px",
            }}
          >
            <strong>{app.jobTitle}</strong> – {app.company}
            <div style={{ fontSize: "13px", marginTop: "4px" }}>
              Status: <b>{app.status}</b>
            </div>

            {app.interviewScheduled && (
              <div style={{ marginTop: "6px", color: "#22c55e" }}>
                📅 Interview on{" "}
                {new Date(app.interviewAt).toLocaleString()}
              </div>
            )}

            {!app.interviewScheduled && app.status === "SHORTLISTED" && (
              <div style={{ marginTop: "6px", color: "#facc15" }}>
                ⏳ Interview not scheduled yet
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const input = {
  width: "100%",
  padding: "10px 12px",
  marginTop: "6px",
  borderRadius: "8px",
  border: "1px solid #1f2937",
  background: "#020617",
  color: "#e5e7eb",
};

export default UserProfile;
