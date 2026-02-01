import api from "../api/axiosConfig";

// ================= EMPLOYER JOBS =================
export const getEmployerJobs = () => {
  return api.get("/jobs/employer");
};

// ================= CLOSE JOB =================
export const closeJob = (jobId) => {
  return api.put(`/jobs/${jobId}/close`);
};

// ================= JOB SEEKER: APPLY TO JOB =================
// ❗ NO userId is sent — backend uses JWT
export const applyJob = (jobId) => {
  return api.post(`/applications/apply?jobId=${jobId}`);
};

// ================= APPLICATION ACTIONS =================
export const getApplicantsByJob = (jobId) => {
  return api.get(`/applications/job/${jobId}`);
};

export const shortlistApplicant = (applicationId) => {
  return api.put(`/applications/${applicationId}/shortlist`);
};

export const rejectApplicant = (applicationId) => {
  return api.put(`/applications/${applicationId}/reject`);
};
