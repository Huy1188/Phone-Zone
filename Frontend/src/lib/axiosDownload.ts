import axios from "axios";

export const axiosDownload = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:YOUR_BE_PORT",
  withCredentials: true,
});
