import api from "./api";

export const loginAPI = (data) => api.post("/auth/login", data);
export const registerAPI = (data) => api.post("/auth/register", data);
export const logoutAPI = () => api.post("/auth/logout");
export const getProfileAPI = () => api.get("/user/me");
export const updateProfileAPI = (data) => api.put("/user/me", data);
export const getTasksAPI = () => api.get("/tasks");
export const createTaskAPI = (data) => api.post("/tasks", data);
export const updateTaskAPI = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTaskAPI = (id) => api.delete(`/tasks/${id}`);