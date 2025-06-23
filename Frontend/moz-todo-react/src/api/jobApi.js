import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const getJobs = () => axios.get(`${API}/jobs`);
export const addJob = (jobData, token) => axios.post(`${API}/jobs`, jobData, {
  headers: { Authorization: `Bearer ${token}` }
});
export const loginAdmin = (email, password) => axios.post(`${API}/auth/login`, { email, password });
