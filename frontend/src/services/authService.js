import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";
import api from "../api/axiosConfig";

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  // 🔴 CRITICAL: DO NOT SKIP THIS
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("role", response.data.role);
  localStorage.setItem("userId", response.data.userId); // must exist

  return response.data;
};

export const logout = () => {
  localStorage.clear();
};
