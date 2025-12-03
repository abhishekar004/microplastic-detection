import axios from "axios";
import { PredictionResponse } from "@/types/detection";

// Resolve API base URL with priority:
// 1) build-time: import.meta.env.VITE_API_BASE_URL (set during `vite build` - REQUIRED for production)
// 2) localhost: http://127.0.0.1:8000 (for local development only)
const buildTimeUrl = import.meta.env.VITE_API_BASE_URL;
const isLocalDev = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const localDefault = "http://127.0.0.1:8000";

// Determine API URL
let API_BASE_URL: string;
if (buildTimeUrl) {
  // Production: Use environment variable (set in Vercel)
  API_BASE_URL = buildTimeUrl;
} else if (isLocalDev) {
  // Local development: Use localhost
  API_BASE_URL = localDefault;
} else {
  // Production without env var: This is an error, but we'll use a fallback with warning
  console.error(
    "⚠️ VITE_API_BASE_URL is not set! " +
    "Please set it in your Vercel environment variables. " +
    "Falling back to localhost (this will likely fail in production)."
  );
  API_BASE_URL = localDefault;
}

// Log the API URL being used (helpful for debugging)
if (typeof window !== "undefined") {
  console.log(`🔗 API Base URL: ${API_BASE_URL}`);
}

// Export API URL for use in error messages
export const getApiBaseUrl = (): string => API_BASE_URL;

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
