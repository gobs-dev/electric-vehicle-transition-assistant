import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer app-Z0ckUP0cx23TT1aS0bDVZ0dY`,
  },
});

export default axiosClient;
