import { useNavigate } from "react-router-dom";

export default function Navbar({ filters, setFilters }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleChange = (e) => {
    if (!setFilters) return;

    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const logout = () => {
    localStorage.clear();
    navigate("/user");
  };

  return (
    <div
      style={{
        padding: "14px 30px",
        background: "#020617",
        color: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #1f2937",
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <h3
          style={{ margin: 0, cursor: "pointer" }}
          onClick={() => {
            if (role === "ADMIN") navigate("/admin/dashboard");
            if (role === "EMPLOYER") navigate("/employer/dashboard");
            if (role === "JOB_SEEKER") navigate("/user/dashboard");
          }}
        >
          JobSpring
        </h3>

        {/* ✅ SEARCH FILTERS (ONLY WHEN filters EXIST) */}
        {filters && setFilters && (
          <>
            <input
              type="text"
              name="keyword"
              placeholder="Search jobs"
              value={filters.keyword}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleChange}
              style={inputStyle}
            />

            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">All Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
        {role === "JOB_SEEKER" && (
          <>
            <NavBtn text="Dashboard" onClick={() => navigate("/user/dashboard")} />
            <NavBtn text="Profile" onClick={() => navigate("/user/profile")} />
          </>
        )}

        {role === "EMPLOYER" && (
          <NavBtn text="Dashboard" onClick={() => navigate("/employer/dashboard")} />
        )}

        {role === "ADMIN" && (
          <>
            <NavBtn text="Dashboard" onClick={() => navigate("/admin/dashboard")} />
            <NavBtn text="Users" onClick={() => navigate("/admin/users")} />
            <NavBtn text="Jobs" onClick={() => navigate("/admin/jobs")} />
          </>
        )}

        <span style={{ fontSize: "12px", color: "#9ca3af" }}>{role}</span>

        <button
          onClick={logout}
          style={{
            background: "#7f1d1d",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "6px 10px",
  borderRadius: "8px",
  border: "1px solid #1f2937",
  background: "#020617",
  color: "#e5e7eb",
};

const NavBtn = ({ text, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: "transparent",
      border: "none",
      color: "#e5e7eb",
      cursor: "pointer",
      fontSize: "14px",
    }}
  >
    {text}
  </button>
);
