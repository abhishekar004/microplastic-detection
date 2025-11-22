import axios from "axios";
import { PredictionResponse } from "@/types/detection";

// Resolve API base URL in priority order:
// 1) build-time: import.meta.env.VITE_API_BASE_URL (set during `vite build`)
// 2) runtime override: window.__API_BASE_URL__ (injected in index.html)
// 3) same-origin: window.location.origin
// 4) fallback to localhost (for local development)
const buildTimeUrl = import.meta.env.VITE_API_BASE_URL;
const runtimeOverride = typeof window !== "undefined" ? (window as any).__API_BASE_URL__ : undefined;
const API_BASE_URL =
  buildTimeUrl || runtimeOverride || (typeof window !== "undefined" ? window.location.origin : "http://127.0.0.1:8000");

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
