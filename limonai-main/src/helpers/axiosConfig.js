import axios from "axios";

// Axios örneğini oluştur
const axiosInstance = axios.create({
  // baseURL: "http://localhost:3000/api", 
  baseURL: "https://limonianai.online/api",
});

// İstek interceptor'u: Tüm isteklere token ekler
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
