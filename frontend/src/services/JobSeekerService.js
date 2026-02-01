import api from "../api/axiosConfig";

export const applyJob = (jobId) => {
  return api.post(`/applications/apply?jobId=${jobId}`);
};

export const getMyApplications = (userId) => {
  return api.get(`/applications/user/${userId}`);
};
