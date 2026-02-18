import axios from "axios";

const API_URL = "http://localhost:5000/api/knowledge";

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
