import axios from "axios";
import { PredictionResponse } from "@/types/detection";

// Resolve API base URL with simple priority:
// 1) build-time: import.meta.env.VITE_API_BASE_URL (set during `vite build`)
// 2) same-origin: window.location.origin (works for production on Vercel/Render)
// 3) fallback: http://127.0.0.1:8000 (for local development)
const buildTimeUrl = import.meta.env.VITE_API_BASE_URL;
const sameOrigin = typeof window !== "undefined" ? window.location.origin : undefined;
const localDefault = "http://127.0.0.1:8000";
const API_BASE_URL = buildTimeUrl || sameOrigin || localDefault;

export const predictMicroplastics = async (file: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<PredictionResponse>(
    `${API_BASE_URL}/predict`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
