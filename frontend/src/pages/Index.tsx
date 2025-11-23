import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { ImageWithDetections } from "@/components/ImageWithDetections";
import { StatisticsPanel } from "@/components/StatisticsPanel";
import { DetectionTable } from "@/components/DetectionTable";
import { Charts } from "@/components/Charts";
import { predictMicroplastics, getApiBaseUrl } from "@/utils/api";
import { PredictionResponse } from "@/types/detection";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, Download, Microscope } from "lucide-react";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsAnalyzing(true);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    try {
      const response = await predictMicroplastics(file);
      setResult(response);
      toast.success(`Analysis complete! Found ${response.detections.length} microplastics.`);
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      
      // Get the actual API URL being used for better error messages
      const apiUrl = getApiBaseUrl();
      
      let errorMessage = "Failed to analyze image.";
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.detail || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = `Cannot connect to backend server at ${apiUrl}. Please check if the backend is running and the VITE_API_BASE_URL environment variable is set correctly.`;
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
      setResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImageUrl("");
    setResult(null);
    setIsAnalyzing(false);
  };

  const handleDownloadReport = () => {
    if (!result) return;

    const reportData = {
      timestamp: new Date().toISOString(),
      totalDetections: result.detections.length,
      imageSize: { width: result.width, height: result.height },
      detections: result.detections.map((d, i) => ({
        id: i + 1,
        confidence: (d.score * 100).toFixed(2) + "%",
        bbox: d.bbox,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `microplastic-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20 shadow-sm">
                <Microscope className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Microplastic Detection
                </h1>
                <p className="text-xs text-muted-foreground">
                  Advanced AI-powered analysis
                </p>
              </div>
            </div>
            {result && (
              <div className="flex gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <Button
                  onClick={handleDownloadReport}
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </Button>
                <Button
                  onClick={handleReset}
                  size="sm"
                  className="gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Analysis
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {!result && !isAnalyzing ? (
          <div className="animate-in fade-in duration-500">
            <UploadZone onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Statistics */}
            {result && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
                <StatisticsPanel detections={result.detections} />
              </div>
            )}

            {/* Image with Detections - Centered */}
            {(imageUrl || isAnalyzing) && result && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                {/* Centered Image */}
                <div className="flex justify-center items-center px-4">
                  <div className="w-full max-w-5xl mx-auto">
                    <ImageWithDetections
                      imageUrl={imageUrl}
                      imageWidth={result.width}
                      imageHeight={result.height}
                      detections={result.detections}
                    />
                  </div>
                </div>

                {/* Analysis Summary and Bar Chart Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
                  {/* Analysis Summary */}
                  <div className="rounded-xl border border-border bg-card shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] hover:border-primary/30">
                    <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                      Analysis Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-border">
                        <span className="text-sm font-medium text-muted-foreground">Image Size</span>
                        <span className="text-sm text-foreground font-semibold bg-secondary/50 px-3 py-1 rounded-md">
                          {result.width} × {result.height}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-border">
                        <span className="text-sm font-medium text-muted-foreground">Detections</span>
                        <span className="text-primary font-bold text-xl bg-primary/10 px-3 py-1 rounded-md">
                          {result.detections.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Status</span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg text-xs font-semibold">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          Complete
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Score Distribution - Always Visible */}
                  {result.detections.length > 0 && (
                    <div className="relative min-h-[400px] rounded-xl border border-border bg-card shadow-lg transition-all duration-300">
                      <Charts 
                        detections={result.detections} 
                        showBarChartOnly={true}
                        showOnHover={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other Charts (Line and Pie Charts) */}
            {result && result.detections.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                <Charts detections={result.detections} showBarChartOnly={false} showOnHover={false} />
              </div>
            )}

            {/* Detection Table */}
            {result && result.detections.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
                <DetectionTable detections={result.detections} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-6 py-6 text-center text-xs text-muted-foreground">
          <p>
            Microplastic Detection System • Powered by Advanced AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
