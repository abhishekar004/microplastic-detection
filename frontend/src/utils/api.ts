import axios from "axios";
import { PredictionResponse } from "@/types/detection";

// Resolve API base URL in priority order:
// 1) build-time: import.meta.env.VITE_API_BASE_URL (set during `vite build`)
// 2) runtime override: window.__API_BASE_URL__ (injected in index.html)
// 3) local backend when running on localhost: use http://127.0.0.1:8000
// 4) same-origin: window.location.origin
// 5) fallback to localhost (for environments without window)
const buildTimeUrl = import.meta.env.VITE_API_BASE_URL;
const runtimeOverride = typeof window !== "undefined" ? (window as any).__API_BASE_URL__ : undefined;
const localBackend = "http://127.0.0.1:8000";
const origin = typeof window !== "undefined" ? window.location.origin : localBackend;
const isLocalHost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
// Correct fallback order:
// 1) build-time `VITE_API_BASE_URL`
// 2) runtime override `window.__API_BASE_URL__`
// 3) if running on localhost -> `localBackend`
// 4) otherwise use `origin`
// 5) final fallback to `localBackend`
// If running locally prefer the local backend before honoring any runtime override.
// This ensures local development hits the local API even if a runtime override
// was accidentally injected into the page.
const API_BASE_URL =
  buildTimeUrl || (isLocalHost ? localBackend : runtimeOverride || origin) || localBackend;

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
