import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true, // ✅ very important for session cookies
});

export default api;
