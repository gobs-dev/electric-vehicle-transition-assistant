import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
axiosClient.interceptors.response.use((response) => response.data);

export default axiosClient;
