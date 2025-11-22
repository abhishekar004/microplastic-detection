import { Detection } from "@/types/detection";
import { Activity, TrendingUp, TrendingDown, Target, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface StatisticsPanelProps {
  detections: Detection[];
}

export const StatisticsPanel = ({ detections }: StatisticsPanelProps) => {
  const [animatedValues, setAnimatedValues] = useState({
    totalCount: 0,
    avgConfidence: 0,
    maxConfidence: 0,
    minConfidence: 0,
  });

  const totalCount = detections.length;
  const scores = detections.map((d) => d.score);
  const avgConfidence = scores.length > 0
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : 0;
  const maxConfidence = scores.length > 0 ? Math.max(...scores) : 0;
  const minConfidence = scores.length > 0 ? Math.min(...scores) : 0;

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        totalCount: Math.round(totalCount * easeOut),
        avgConfidence: avgConfidence * easeOut,
        maxConfidence: maxConfidence * easeOut,
        minConfidence: minConfidence * easeOut,
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [totalCount, avgConfidence, maxConfidence, minConfidence]);

  const stats = [
    {
      label: "Total Detected",
      value: animatedValues.totalCount,
      displayValue: animatedValues.totalCount.toString(),
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      gradient: "from-blue-500/20 to-blue-500/5",
    },
    {
      label: "Average Confidence",
      value: animatedValues.avgConfidence,
      displayValue: `${(animatedValues.avgConfidence * 100).toFixed(1)}%`,
      icon: Activity,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      gradient: "from-emerald-500/20 to-emerald-500/5",
    },
    {
      label: "Highest Confidence",
      value: animatedValues.maxConfidence,
      displayValue: `${(animatedValues.maxConfidence * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      gradient: "from-amber-500/20 to-amber-500/5",
    },
    {
      label: "Lowest Confidence",
      value: animatedValues.minConfidence,
      displayValue: `${(animatedValues.minConfidence * 100).toFixed(1)}%`,
      icon: TrendingDown,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      gradient: "from-purple-500/20 to-purple-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`
              rounded-xl p-6 bg-gradient-to-br ${stat.gradient} 
              border ${stat.borderColor} shadow-lg hover:shadow-xl 
              transition-all duration-300 hover:scale-[1.02] 
              animate-in fade-in slide-in-from-bottom-4
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor} shadow-sm`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {index === 0 && totalCount > 0 && (
                <Sparkles className={`w-4 h-4 ${stat.color} animate-pulse`} />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${stat.color} transition-all duration-300`}>
                {stat.displayValue}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
