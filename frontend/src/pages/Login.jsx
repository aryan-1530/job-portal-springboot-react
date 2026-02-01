import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(email, password);

      // 🔴 CRITICAL CHECK
      if (!data.userId) {
        alert("Login failed: userId not received");
        return;
      }

      // Only JOB_SEEKER allowed here
      if (data.role !== "JOB_SEEKER") {
        alert("Not a User account");
        localStorage.clear();
        return;
      }

      navigate("/user/dashboard");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>User Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
