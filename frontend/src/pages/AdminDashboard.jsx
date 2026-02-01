import { useEffect, useState } from "react";
import { getAdminAnalytics, getAdminDashboard } from "../services/adminService";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  FunnelChart, Funnel, LabelList,
  RadialBarChart, RadialBar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getAdminDashboard().then(setStats);
    getAdminAnalytics().then(setAnalytics);
  }, []);

  if (!stats || !analytics) return null;

  /* ================= DERIVED METRICS ================= */

  const hireRate =
    stats.totalApplications > 0
      ? ((analytics.totalHired / stats.totalApplications) * 100).toFixed(1)
      : 0;

  const hireRateColor =
    hireRate >= 30 ? "#22c55e"
    : hireRate >= 15 ? "#facc15"
    : "#ef4444";

  /* ================= DATA ================= */

  const pieData = [
    { name: "Admins", value: stats.totalAdmins },
    { name: "Employers", value: stats.totalEmployers },
    { name: "Job Seekers", value: stats.totalJobSeekers },
  ];

  const funnelData = [
    { name: "Applied", value: stats.totalApplications, fill: "#38bdf8" },
    { name: "Shortlisted", value: analytics.totalShortlisted, fill: "#22c55e" },
    { name: "Interviewed", value: analytics.totalInterviewed, fill: "#facc15" },
    { name: "Hired", value: analytics.totalHired, fill: "#16a34a" },
  ];

  const hireGaugeData = [
    { name: "Hire Rate", value: Number(hireRate), fill: hireRateColor }
  ];

  const processRadarData = [
    { stage: "Applied", value: stats.totalApplications },
    { stage: "Shortlisted", value: analytics.totalShortlisted },
    { stage: "Interviewed", value: analytics.totalInterviewed },
    { stage: "Hired", value: analytics.totalHired },
  ];

  return (
    <div style={page}>
      <h2 style={title}>ADMIN CONTROL PANEL</h2>

      {/* ================= KPI STRIP ================= */}
      <div style={kpiStrip}>
        <MiniStat label="Users" value={stats.totalUsers} />
        <MiniStat label="Employers" value={stats.totalEmployers} />
        <MiniStat label="Seekers" value={stats.totalJobSeekers} />
        <MiniStat label="Jobs" value={stats.totalJobs} />
        <MiniStat label="Applications" value={stats.totalApplications} />
        <MiniStat label="Shortlisted" value={analytics.totalShortlisted} />
        <MiniStat
          label="Hire Rate"
          value={`${hireRate}%`}
          valueColor={hireRateColor}
        />
      </div>

      <div style={hudGrid}>

        {/* ================= FUNNEL ================= */}
        <HudCard title="Recruitment Funnel">
          <ResponsiveContainer width="100%" height={260}>
            <FunnelChart>
              <Tooltip />
              <Funnel data={funnelData} dataKey="value">
                <LabelList
                  dataKey="name"
                  position="inside"
                  fill="#020617"
                  fontSize={12}
                  fontWeight="600"
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </HudCard>

        {/* ================= HIRE RATE GAUGE ================= */}
        <HudCard title="Hiring Performance">
          <ResponsiveContainer width="100%" height={260}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              data={hireGaugeData}
            >
              <RadialBar dataKey="value" clockWise background />
              <text
                x="50%"
                y="52%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#e5e7eb"
                fontSize="26"
                fontWeight="700"
              >
                {hireRate}%
              </text>
              <text
                x="50%"
                y="66%"
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="12"
              >
                Hire Success Rate
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </HudCard>

        {/* ================= PROCESS RADAR ================= */}
        <HudCard title="Recruitment Process Strength">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={processRadarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis
                dataKey="stage"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
              />
              <PolarRadiusAxis
                tick={{ fill: "#9ca3af", fontSize: 10 }}
              />
              <Radar
                dataKey="value"
                stroke="#38bdf8"
                fill="#38bdf8"
                fillOpacity={0.5}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </HudCard>

        {/* ================= USER DISTRIBUTION ================= */}
        <HudCard title="User Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={90}>
                {pieData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={["#38bdf8", "#22c55e", "#facc15"][i]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </HudCard>

        {/* ================= JOBS PER EMPLOYER ================= */}
        <HudCard title="Jobs per Employer">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={analytics.jobsPerEmployer}
              layout="vertical"
              margin={{ left: 90 }}
            >
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis
                type="category"
                dataKey="employer"
                stroke="#9ca3af"
                width={160}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="total" fill="#38bdf8" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </HudCard>

        {/* ================= APPLICATIONS PER JOB ================= */}
        <HudCard title="Applications per Job">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={analytics.applicationsPerJob}
              margin={{ top: 20, bottom: 90 }}
            >
              <XAxis
                dataKey="job"
                stroke="#9ca3af"
                interval={0}
                angle={-35}
                textAnchor="end"
                tick={{ fontSize: 11 }}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="total"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </HudCard>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const MiniStat = ({ label, value, valueColor }) => (
  <div style={miniStat}>
    <div style={miniLabel}>{label}</div>
    <div style={{ ...miniValue, color: valueColor || "#38bdf8" }}>
      {value}
    </div>
  </div>
);

const HudCard = ({ title, children }) => (
  <div style={hudCard}>
    <div style={hudTitle}>{title}</div>
    {children}
  </div>
);

/* ================= STYLES ================= */

const page = {
  background: "radial-gradient(circle at top, #020617, #000)",
  minHeight: "100vh",
  padding: "28px",
  color: "white",
};

const title = {
  fontSize: "18px",
  letterSpacing: "2px",
  color: "#38bdf8",
  marginBottom: "20px",
};

const kpiStrip = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "12px",
  marginBottom: "22px",
};

const miniStat = {
  background: "rgba(15,23,42,0.85)",
  border: "1px solid rgba(56,189,248,0.25)",
  borderRadius: "12px",
  padding: "10px",
  textAlign: "center",
};

const miniLabel = {
  fontSize: "11px",
  color: "#9ca3af",
};

const miniValue = {
  fontSize: "20px",
  fontWeight: "700",
};

const hudGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "16px",
};

const hudCard = {
  background: "linear-gradient(145deg, #0f172a, #020617)",
  borderRadius: "16px",
  padding: "14px",
  border: "1px solid rgba(34,197,94,0.25)",
};

const hudTitle = {
  fontSize: "13px",
  letterSpacing: "1px",
  marginBottom: "8px",
  color: "#22c55e",
};
