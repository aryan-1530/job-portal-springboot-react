import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== ADMIN APIs ==========

export const getAllUsers = async () => {
  const res = await API.get("/api/admin/users");
  return res.data;
};

export const deleteUser = async (id) => {
  return API.delete(`/api/admin/user/${id}`);
};

export const getAllJobs = async (page = 0) => {
  const res = await API.get(`/api/jobs?page=${page}&size=5`);
  return res.data;
};

// 🔴 TRY DELETE
export const deleteJob = async (id) => {
  return API.delete(`/api/admin/job/${id}`);
};

// 🟡 CLOSE JOB (ADMIN)
export const closeJobByAdmin = async (id) => {
  return API.put(`/api/admin/job/${id}/close`);
};

export const getAdminDashboard = async () => {
  const res = await API.get("/api/admin/dashboard");
  return res.data;
};

export const blockUser = async (id) => {
  return API.put(`/api/admin/user/${id}/block`);
};

export const activateUser = async (id) => {
  return API.put(`/api/admin/user/${id}/activate`);
};

export const getAdminAnalytics = async () => {
  const res = await API.get("/api/admin/analytics");
  return res.data;
};
