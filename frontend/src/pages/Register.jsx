import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { registerUser } from "../services/userService";

const Register = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const roleFromUrl = params.get("role") || "JOB_SEEKER";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(roleFromUrl);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(roleFromUrl);
  }, [roleFromUrl]);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name,
        email,
        password,
        role,
      });

      alert("Registration successful! Please login.");

      // 🔁 Redirect based on role
      if (role === "EMPLOYER") {
        navigate("/employer");
      } else {
        navigate("/user");
      }

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "30px",
          borderRadius: "16px",
          background: "#020617",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          border: "1px solid #1f2937",
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          Register
        </h2>

        <label>Name</label>
        <input
          style={input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          style={input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          style={input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Register as</label>
        <select
          style={input}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="JOB_SEEKER">Job Seeker</option>
          <option value="EMPLOYER">Employer</option>
        </select>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "#22c55e",
            color: "#020617",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {loading ? "Registering..." : "Create Account"}
        </button>

        <p
          style={{
            marginTop: "15px",
            fontSize: "13px",
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <span
            onClick={() =>
              navigate(role === "EMPLOYER" ? "/employer" : "/user")
            }
            style={{ color: "#38bdf8", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  marginBottom: "14px",
  borderRadius: "8px",
  border: "1px solid #1f2937",
  background: "#020617",
  color: "white",
};

export default Register;
