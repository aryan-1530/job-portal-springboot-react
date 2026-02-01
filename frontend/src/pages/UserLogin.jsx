import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import api from "../api/axiosConfig";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);

      window.location.href = "/user/dashboard";
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          alert("Invalid email or password");
        } else if (err.response.status === 403) {
          alert("Your account has been blocked by admin");
        } else {
          alert("Login failed. Try again.");
        }
      } else {
        alert("Server not reachable");
      }
    }
  };

  return (
    <AuthLayout
      title="Sign in as Job Seeker"
      subtitle="Find jobs and track your applications"
    >
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={input}
      />

      <button onClick={login} style={btn}>
        Sign In
      </button>
    </AuthLayout>
  );
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #1f2937",
  background: "#020617",
  color: "#e5e7eb",
};

const btn = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
};

export default UserLogin;
