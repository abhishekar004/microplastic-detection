import axios from "axios";
import { PredictionResponse } from "@/types/detection";

// Resolve API base URL with simple priority:
// 1) build-time: import.meta.env.VITE_API_BASE_URL (set during `vite build`)
// 2) localhost: http://127.0.0.1:8000 (for local development with Vite dev server)
// 3) same-origin: window.location.origin (for production deployments)
const buildTimeUrl = import.meta.env.VITE_API_BASE_URL;
const isLocalDev = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const localDefault = "http://127.0.0.1:8000";
const sameOrigin = typeof window !== "undefined" ? window.location.origin : undefined;
const API_BASE_URL = buildTimeUrl || (isLocalDev ? localDefault : sameOrigin) || localDefault;

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
