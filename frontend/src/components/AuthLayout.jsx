import React from "react";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#020617",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          color: "#e5e7eb",
        }}
      >
        <h2>{title}</h2>
        <p style={{ color: "#9ca3af", marginBottom: "30px" }}>
          {subtitle}
        </p>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
