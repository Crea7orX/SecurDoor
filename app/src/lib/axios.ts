"use client";

import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "https://www.securdoor.eu/api"
    : "http://localhost:3000/api";

axios.defaults.withCredentials = true;

export const axiosInstance = axios.create();
