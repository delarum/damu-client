import { api } from "./api";

export const hospitalApi = {
  createProfile: (payload) => api.post("/hospitals/profile/", payload),
  getProfile: () => api.get("/hospitals/profile/me/"),
  updateProfile: (payload) => api.patch("/hospitals/profile/update/", payload),
  deleteProfile: () => api.delete("/hospitals/profile/delete/"),
  uploadLicense: (formData) =>
    api.post("/hospitals/upload-license/", formData, { isForm: true }),
  dashboardStats: () => api.get("/hospitals/admin/dashboard/"),
  staff: {
    list: () => api.get("/hospitals/staff/"),
    add: (payload) => api.post("/hospitals/staff/add/", payload),
    remove: (id) => api.delete(`/hospitals/staff/${id}/remove/`),
  },
  subscription: {
    current: () => api.get("/subscriptions/current/"),
    create: (payload) => api.post("/subscriptions/", payload),
    cancel: () => api.post("/subscriptions/cancel/"),
  },
  search: {
    blood: (params) => api.get("/matching/search/blood/", { params }),
    organs: (params) => api.get("/matching/search/organs/", { params }),
  },
  donors: {
    map: (params) => api.get("/matching/donors/map/", { params }),
    details: (donorId) => api.get(`/donors/profile/${donorId}/hospital-view/`),
  },
  contactRequests: {
    list: () => api.get("/matching/contact-requests/"),
  },
};

export const verificationApi = {
  uploadId: (formData) => api.post("/verification/upload-id/", formData, { isForm: true }),
  status: () => api.get("/verification/status/"),
};

export const paymentsApi = {
  mpesaStkPush: (payload) => api.post("/payments/mpesa/stk-push/", payload),
  stripeSubscribe: (payload) => api.post("/payments/stripe/subscribe/", payload),
  history: () => api.get("/payments/history/"),
};

export const notificationsApi = {
  sendSms: (payload) => api.post("/notifications/sms/", payload),
  sendEmail: (payload) => api.post("/notifications/email/", payload),
  history: () => api.get("/notifications/history/"),
};

export const thirdPartyApi = {
  apply: (payload) => api.post("/third-party/apply/", payload),
  myApplications: () => api.get("/third-party/applications/"),
  datasets: () => api.get("/third-party/datasets/"),
};

export const adminApi = {
  hospitals: {
    list: () => api.get("/admin/hospitals/"),
    approve: (id) => api.post(`/admin/hospitals/${id}/approve/`),
    reject: (id, reason) => api.post(`/admin/hospitals/${id}/reject/`, { reason }),
  },
  auditLogs: () => api.get("/admin/audit-logs/"),
  metrics: () => api.get("/admin/metrics/"),
  users: {
    list: (params) => api.get("/admin/users/", { params }),
    update: (id, payload) => api.patch(`/admin/users/${id}/`, payload),
    remove: (id) => api.delete(`/admin/users/${id}/`),
    resetPassword: (id, payload) => api.post(`/admin/users/${id}/reset-password/`, payload),
  },
};
