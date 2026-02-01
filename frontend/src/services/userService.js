import api from "../api/axiosConfig";

// ================= REGISTER =================
export const registerUser = (data) => {
  return api.post("/users/register", data);
};

// ================= PROFILE =================
export const getUserProfile = (userId) => {
  return api.get(`/users/${userId}`);
};

export const updateUserProfile = (userId, data) => {
  return api.put(`/users/${userId}`, data);
};

// ================= RESUME UPLOAD =================
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/users/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
