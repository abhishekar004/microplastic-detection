import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon, FileImage, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const UploadZone = ({ onFileSelect, isAnalyzing }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newCount = prev + 1;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0 && newCount === 1) {
        setIsDragging(true);
      }
      return newCount;
    });
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newCount = prev - 1;
      if (newCount === 0) {
        setIsDragging(false);
      }
      return newCount;
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">
      <div className="w-full max-w-3xl space-y-6">
        <div
          className={cn(
            "relative w-full rounded-xl border-2 border-dashed transition-all duration-300",
            "bg-gradient-to-br from-card via-card to-card/50 shadow-lg backdrop-blur-sm",
            isDragging
              ? "border-primary shadow-2xl shadow-primary/20 scale-[1.01] bg-primary/5"
              : "border-border hover:border-primary/50 hover:shadow-xl",
            isAnalyzing && "pointer-events-none"
          )}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 bg-primary/10 rounded-xl animate-pulse" />
          )}
          
          <label className="flex flex-col items-center justify-center gap-8 p-16 cursor-pointer relative z-10">
            <div className="relative">
              <div className={cn(
                "relative bg-gradient-to-br from-primary/20 to-primary/5 p-6 rounded-2xl border border-primary/20",
                "transition-all duration-300",
                isDragging && "scale-110 rotate-3 shadow-lg shadow-primary/30",
                isAnalyzing && "animate-pulse"
              )}>
                {isAnalyzing ? (
                  <div className="relative">
                    <ImageIcon className="w-14 h-14 text-primary animate-pulse" />
                    <Sparkles className="w-6 h-6 text-primary absolute -top-1 -right-1 animate-spin" />
                  </div>
                ) : (
                  <Upload className={cn(
                    "w-14 h-14 text-primary transition-transform duration-300",
                    isDragging && "scale-110"
                  )} />
                )}
              </div>
            </div>

            <div className="text-center space-y-3">
              <h3 className={cn(
                "text-2xl font-bold text-foreground transition-colors",
                isDragging && "text-primary"
              )}>
                {isAnalyzing ? "Analyzing Image..." : "Upload Microplastic Image"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {isAnalyzing
                  ? "Detecting microplastics in your sample using advanced AI"
                  : "Drag & drop an image here, or click to browse from your device"}
              </p>
            </div>

            {!isAnalyzing && (
              <>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
                <div className="flex flex-wrap gap-2 justify-center">
                  {["PNG", "JPG", "JPEG", "WEBP"].map((format) => (
                    <span
                      key={format}
                      className="px-3 py-1.5 bg-secondary/50 border border-border rounded-lg font-medium text-xs text-foreground/80 hover:bg-secondary transition-colors"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </>
            )}

            {isAnalyzing && (
              <div className="w-full max-w-xs space-y-3">
                <Progress value={undefined} className="h-2" />
                <div className="flex gap-2 justify-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Processing your image...
                </p>
              </div>
            )}
          </label>
        </div>

        {!isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
              <FileImage className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">High Accuracy</p>
                <p className="text-xs text-muted-foreground">AI-powered detection</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Fast Analysis</p>
                <p className="text-xs text-muted-foreground">Real-time processing</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
              <ImageIcon className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Detailed Reports</p>
                <p className="text-xs text-muted-foreground">Export & download</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
