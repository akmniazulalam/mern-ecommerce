import axios from "axios";
import { API_BASE_URL } from "@/lib/productApi";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 120000,
});

export default apiClient;
