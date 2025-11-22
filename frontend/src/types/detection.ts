export interface Detection {
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
  score: number;
  label: number;
}

export interface PredictionResponse {
  width: number;
  height: number;
  detections: Detection[];
}
