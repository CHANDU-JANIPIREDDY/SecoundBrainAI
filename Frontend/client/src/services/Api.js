import axios from "axios";

// Use environment variable if available, otherwise fallback to production URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://secoundbrainai.onrender.com";

const API_URL = `${API_BASE_URL}/api/knowledge`;

export const createNote = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const getNotes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const askAI = async (question) => {
  const response = await axios.post(`${API_URL}/ask`, { question });
  return response.data;
};

export const publicQuery = async (q) => {
  const response = await axios.get(`${API_URL}/query`, { params: { q } });
  return response.data;
};
