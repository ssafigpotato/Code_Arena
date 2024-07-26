import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});
api.defaults.headers.access = localStorage.getItem("access");
api.defaults.headers.refresh = localStorage.getItem("refresh");
api.defaults.withCredentials = true;
export default api;
