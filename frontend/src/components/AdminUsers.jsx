import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  blockUser,
  activateUser,
} from "../services/adminService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    getAllUsers().then(setUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ================= ACTION HANDLERS =================

  const handleDelete = async (user) => {
    const confirm = window.confirm(
      `Are you sure you want to DELETE this user?\n\n${user.name}\n${user.email}`
    );
    if (!confirm) return;

    await deleteUser(user.id);
    alert("User deleted successfully");
    loadUsers();
  };

  const handleBlock = async (user) => {
    const confirm = window.confirm(
      `Are you sure you want to BLOCK this user?\n\n${user.name}`
    );
    if (!confirm) return;

    await blockUser(user.id);
    alert("User blocked");
    loadUsers();
  };

  const handleActivate = async (user) => {
    const confirm = window.confirm(
      `Activate this user again?\n\n${user.name}`
    );
    if (!confirm) return;

    await activateUser(user.id);
    alert("User activated");
    loadUsers();
  };

  // ================= UI =================

  return (
    <div
      style={{
        padding: "30px",
        background: "#0f172a",
        minHeight: "100vh",
        color: "#e5e7eb",
      }}
    >
      <h2 style={{ marginBottom: "25px", fontWeight: "600" }}>
        User Management
      </h2>

      <div style={{ display: "grid", gap: "15px" }}>
        {users.map((u) => (
          <div
            key={u.id}
            style={{
              background: "#020617",
              borderRadius: "12px",
              padding: "18px 22px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            }}
          >
            {/* LEFT */}
            <div>
              <div style={{ fontSize: "16px", fontWeight: "600" }}>
                {u.name || "Unnamed User"}
              </div>
              <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                {u.email}
              </div>

              <div style={{ marginTop: "6px", display: "flex", gap: "8px" }}>
                <span style={rolePill(u.role)}>{u.role}</span>
                <span style={statusPill(u.active)}>
                  {u.active ? "ACTIVE" : "BLOCKED"}
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ display: "flex", gap: "10px" }}>
              {u.role !== "ADMIN" && (
                <>
                  {u.active ? (
                    <button
                      onClick={() => handleBlock(u)}
                      style={btn("#7f1d1d")}
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(u)}
                      style={btn("#064e3b")}
                    >
                      Activate
                    </button>
                  )}
                </>
              )}

              {u.role !== "ADMIN" && (
                <button
                  onClick={() => handleDelete(u)}
                  style={btn("#374151")}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const btn = (bg) => ({
  background: bg,
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  color: "white",
  fontSize: "13px",
  cursor: "pointer",
});

const rolePill = (role) => ({
  fontSize: "11px",
  padding: "4px 10px",
  borderRadius: "20px",
  background:
    role === "ADMIN"
      ? "#7f1d1d"
      : role === "EMPLOYER"
      ? "#1e3a8a"
      : "#78350f",
});

const statusPill = (active) => ({
  fontSize: "11px",
  padding: "4px 10px",
  borderRadius: "20px",
  background: active ? "#064e3b" : "#4b5563",
});

export default AdminUsers;
