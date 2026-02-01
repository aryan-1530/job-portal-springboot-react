import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const UserApplications = () => {
  const userId = localStorage.getItem("userId");
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get(`/applications/user/${userId}`).then((res) => {
      setApps(res.data);
    });
  }, [userId]);

  return (
    <div>
      <h3 style={{ marginBottom: "20px" }}>My Applications</h3>

      {apps.map((a) => (
        <div
          key={a.id}
          style={{
            background: "#020617",
            padding: "14px",
            borderRadius: "10px",
            marginBottom: "12px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ fontWeight: "600" }}>{a.jobTitle}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>{a.company}</div>

          <span
            style={{
              display: "inline-block",
              marginTop: "8px",
              padding: "5px 12px",
              borderRadius: "999px",
              fontSize: "11px",
              background:
                a.status === "SHORTLISTED"
                  ? "#064e3b"
                  : a.status === "REJECTED"
                  ? "#7f1d1d"
                  : "#374151",
            }}
          >
            {a.status}
          </span>
        </div>
      ))}

      {apps.length === 0 && (
        <div style={{ color: "#9ca3af" }}>No applications yet</div>
      )}
    </div>
  );
};

export default UserApplications;
