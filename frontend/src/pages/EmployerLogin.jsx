import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import AuthLayout from "../components/AuthLayout";

export default function EmployerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      if (res.data.role !== "EMPLOYER") {
        alert("This is not an Employer account");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);

      navigate("/employer/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <AuthLayout
      title="Sign in as Employer"
      subtitle="Post jobs and hire the right talent"
    >
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
          required
        />

        <button type="submit" style={btn}>
          Sign In
        </button>
      </form>
    </AuthLayout>
  );
}

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "16px",
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
  fontSize: "14px",
  cursor: "pointer",
};
