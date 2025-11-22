import { useEffect, useRef, useState } from "react";
import { Detection } from "@/types/detection";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageWithDetectionsProps {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  detections: Detection[];
}

const COLORS = [
  "rgba(96, 165, 250, 0.9)", // Blue
  "rgba(147, 197, 253, 0.9)", // Light Blue
  "rgba(59, 130, 246, 0.9)", // Primary Blue
  "rgba(125, 211, 252, 0.9)", // Sky
  "rgba(56, 189, 248, 0.9)", // Bright Blue
];

export const ImageWithDetections = ({
  imageUrl,
  imageWidth,
  imageHeight,
  detections,
}: ImageWithDetectionsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredDetection, setHoveredDetection] = useState<number | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && !isMinimized) {
        const containerWidth = containerRef.current.clientWidth;
        const aspectRatio = imageWidth / imageHeight;
        const displayWidth = Math.min(containerWidth, imageWidth);
        const displayHeight = displayWidth / aspectRatio;
        setDisplaySize({ width: displayWidth, height: displayHeight });
      }
    };

    if (!isMinimized) {
      // Small delay to ensure container is rendered
      const timeoutId = setTimeout(updateSize, 10);
      window.addEventListener("resize", updateSize);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", updateSize);
      };
    }
  }, [imageWidth, imageHeight, isMinimized]);

  useEffect(() => {
    if (!canvasRef.current || displaySize.width === 0 || isMinimized) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;

    // Draw image
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw image at original display size
      ctx.drawImage(img, 0, 0, displaySize.width, displaySize.height);

      // Calculate scale factors
      const scaleX = displaySize.width / imageWidth;
      const scaleY = displaySize.height / imageHeight;

      // Draw bounding boxes
      detections.forEach((detection, index) => {
        const [x1, y1, x2, y2] = detection.bbox;
        const scaledX1 = x1 * scaleX;
        const scaledY1 = y1 * scaleY;
        const scaledX2 = x2 * scaleX;
        const scaledY2 = y2 * scaleY;
        const width = scaledX2 - scaledX1;
        const height = scaledY2 - scaledY1;

        const color = COLORS[index % COLORS.length];
        const isHovered = hoveredDetection === index;
        const lineWidth = isHovered ? 3 : 2;

        // Draw box with glow effect if hovered
        if (isHovered) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(scaledX1, scaledY1, width, height);
        ctx.shadowBlur = 0;

        // Draw label background
        const label = `${(detection.score * 100).toFixed(1)}%`;
        ctx.font = "600 14px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
        const textMetrics = ctx.measureText(label);
        const textHeight = 20;
        const padding = 10;

        ctx.fillStyle = color;
        ctx.fillRect(
          scaledX1,
          scaledY1 - textHeight - padding,
          textMetrics.width + padding * 2,
          textHeight + padding
        );

        // Draw label text
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, scaledX1 + padding, scaledY1 - padding - 2);
      });
    };
  }, [imageUrl, detections, displaySize, imageWidth, imageHeight, hoveredDetection, isMinimized]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(3, prev * 1.2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, prev / 1.2));
  };

  const handleToggleMinimize = () => {
    const newMinimizedState = !isMinimized;
    setIsMinimized(newMinimizedState);
    
    if (newMinimizedState) {
      // Reset zoom and position when minimizing
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      // When maximizing, trigger a resize to recalculate display size
      setTimeout(() => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const aspectRatio = imageWidth / imageHeight;
          const displayWidth = Math.min(containerWidth, imageWidth);
          const displayHeight = displayWidth / aspectRatio;
          setDisplaySize({ width: displayWidth, height: displayHeight });
        }
      }, 50);
    }
  };

  return (
    <div ref={containerRef} className="w-full space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl bg-card group">
        {!isMinimized && (
          <>
            <div
              className="relative overflow-hidden cursor-move"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                style={{
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  transformOrigin: 'top left',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto"
                  style={{ 
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
              {detections.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/95 backdrop-blur-sm">
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground text-sm font-medium">No microplastics detected</p>
                    <p className="text-muted-foreground text-xs">The image appears to be free of microplastics</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 bg-card/90 backdrop-blur-sm border border-border hover:bg-card"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 bg-card/90 backdrop-blur-sm border border-border hover:bg-card"
                onClick={handleZoomIn}
                disabled={scale >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 bg-card/90 backdrop-blur-sm border border-border hover:bg-card"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 bg-card/90 backdrop-blur-sm border border-border hover:bg-card"
                onClick={handleToggleMinimize}
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Scale indicator */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-lg text-xs font-medium text-foreground">
              {Math.round(scale * 100)}%
            </div>
          </>
        )}

        {/* Minimized View */}
        {isMinimized && (
          <div className="p-4 flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-secondary/50 rounded-lg flex items-center justify-center border border-border overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Detection preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Detection Image
                </p>
                <p className="text-xs text-muted-foreground">
                  {detections.length} microplastic{detections.length !== 1 ? 's' : ''} detected
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9"
              onClick={handleToggleMinimize}
              title="Maximize"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Detection count badge */}
      {detections.length > 0 && (
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-foreground">
            <span className="text-primary font-bold text-base">{detections.length}</span> microplastic{detections.length !== 1 ? 's' : ''} detected
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span>Scroll to zoom</span>
            <span>•</span>
            <span>Click and drag to pan</span>
          </p>
        </div>
      )}
    </div>
  );
};
