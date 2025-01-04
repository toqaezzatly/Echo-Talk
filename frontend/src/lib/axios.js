import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000', // Ensure this matches your backend URL
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
