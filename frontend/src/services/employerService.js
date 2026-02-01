import api from "../api/axiosConfig";

/* ================= JOBS ================= */

export const getEmployerJobs = () => {
  return api.get("/jobs/employer");
};

export const closeJob = (jobId) => {
  return api.put(`/jobs/${jobId}/close`);
};

/* ================= APPLICATIONS ================= */

export const getApplicantsByJob = (jobId) => {
  return api.get(`/applications/job/${jobId}`);
};

export const shortlistApplicant = (id) => {
  return api.put(`/applications/${id}/shortlist`);
};

export const markInterviewed = (id) => {
  return api.put(`/applications/${id}/interviewed`);
};

export const hireApplicant = (id) => {
  return api.put(`/applications/${id}/hire`);
};

export const rejectApplicant = (id) => {
  return api.put(`/applications/${id}/reject`);
};

/* ================= INTERVIEW ================= */

export const scheduleInterview = (applicationId, payload) => {
  return api.post("/interviews/schedule", {
    applicationId,
    ...payload,
  });
};
