import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020617, #020617)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <div style={{ maxWidth: "900px", width: "100%", padding: "40px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: "800" }}>
          JobSpring
        </h1>

        <p style={{ marginTop: "10px", color: "#9ca3af", fontSize: "18px" }}>
          Hire smarter. Apply faster. Manage everything in one place.
        </p>

        {/* LOGIN ROLE SELECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            marginTop: "50px",
          }}
        >
          <Card
            title="Job Seeker"
            desc="Browse jobs, apply, and track your applications."
            action={() => navigate("/user")}
            color="#38bdf8"
          />

          <Card
            title="Employer"
            desc="Post jobs and manage applicants in one dashboard."
            action={() => navigate("/employer")}
            color="#22c55e"
          />

          <Card
            title="Admin"
            desc="Manage users, jobs, and view platform analytics."
            action={() => navigate("/admin")}
            color="#facc15"
          />
        </div>

        {/* REGISTER SECTION */}
        <div
          style={{
            marginTop: "70px",
            padding: "30px",
            borderRadius: "18px",
            background: "#020617",
            border: "1px solid #1f2937",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "26px", marginBottom: "10px" }}>
            New here?
          </h2>

          <p style={{ color: "#9ca3af", marginBottom: "25px" }}>
            Create an account to get started
          </p>

          <button
            onClick={() => navigate("/register")}
            style={btn("#38bdf8")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, desc, action, color }) => (
  <div
    onClick={action}
    style={{
      background: "#020617",
      padding: "30px",
      borderRadius: "18px",
      cursor: "pointer",
      boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
      transition: "0.3s",
      border: `2px solid ${color}`,
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.transform = "scale(1.04)")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.transform = "scale(1)")
    }
  >
    <h3 style={{ color }}>{title}</h3>
    <p style={{ marginTop: "10px", color: "#9ca3af" }}>{desc}</p>
  </div>
);

const btn = (bg) => ({
  background: bg,
  border: "none",
  padding: "12px 26px",
  borderRadius: "10px",
  color: "#020617",
  fontWeight: "600",
  fontSize: "15px",
  cursor: "pointer",
});
