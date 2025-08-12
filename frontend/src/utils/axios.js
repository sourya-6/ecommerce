import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1",
  withCredentials: true, // important for sending cookies (JWT)
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptor for handling 401s globally
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.error("Unauthorized - redirecting to login");
      // Optional: redirect to login
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
