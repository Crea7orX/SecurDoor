"use client";

import { env } from "@/env";
import axios from "axios";

axios.defaults.baseURL = env.NEXT_PUBLIC_API_BASE_URL;
axios.defaults.withCredentials = true;

export const axiosInstance = axios.create();
