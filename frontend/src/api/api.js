import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// User Authentication APIs
export const registerUser = (userData) => API.post('/register', userData);
export const loginUser = (credentials) => API.post('/login', credentials);

// Idea Submission APIs
export const submitIdea = (ideaData) => API.post('/submit-idea', ideaData);
export const getMVPPlan = (ideaId) => API.get(`/mvp-plan/${ideaId}`);

// Export PDF
export const exportPDF = (ideaId) => API.get(`/export-pdf/${ideaId}`, {
    responseType: 'blob'
});