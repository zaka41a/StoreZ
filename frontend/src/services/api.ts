// api.ts
import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true, // ✅ essentiel pour Spring Session
});
