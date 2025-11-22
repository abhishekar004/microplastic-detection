import { Detection } from "@/types/detection";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils.ts";

interface ChartsProps {
  detections: Detection[];
  showBarChartOnly?: boolean;
  showOnHover?: boolean;
}

const CHART_COLORS = ["#60a5fa", "#93c5fd", "#3b82f6", "#7dd3fc", "#38bdf8"];

export const Charts = ({ detections, showBarChartOnly = false, showOnHover = false }: ChartsProps) => {
  // Bar chart data - confidence scores
  const barData = detections.map((d, index) => ({
    id: `#${(index + 1).toString().padStart(3, "0")}`,
    confidence: +(d.score * 100).toFixed(1),
  }));

  // Line chart data - confidence trend (sorted)
  const lineData = [...detections]
    .sort((a, b) => a.score - b.score)
    .map((d, index) => ({
      index: index + 1,
      confidence: +(d.score * 100).toFixed(1),
    }));

  // Pie chart data - confidence ranges
  const confidenceRanges = {
    high: detections.filter((d) => d.score >= 0.8).length,
    medium: detections.filter((d) => d.score >= 0.5 && d.score < 0.8).length,
    low: detections.filter((d) => d.score < 0.5).length,
  };

  const pieData = [
    { name: "High (≥80%)", value: confidenceRanges.high },
    { name: "Medium (50-80%)", value: confidenceRanges.medium },
    { name: "Low (<50%)", value: confidenceRanges.low },
  ].filter((d) => d.value > 0);


  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl backdrop-blur-sm">
          <p className="text-foreground font-semibold text-sm mb-1">{label || `Index ${payload[0].payload?.index || ''}`}</p>
          <p className="text-primary font-bold text-base">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  // Bar Chart Component
  const BarChartComponent = ({ gradientId = "colorGradient" }: { gradientId?: string }) => (
    <div className="rounded-xl border border-border bg-card shadow-lg p-6 hover:shadow-xl transition-all duration-300 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          Confidence Score Distribution
        </h3>
        <p className="text-sm text-muted-foreground">
          Individual confidence scores for each detected microplastic
        </p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="id"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickLine={{ stroke: "hsl(var(--border))" }}
            label={{ value: "Confidence (%)", angle: -90, position: "insideLeft", style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--primary))", opacity: 0.1 }} />
          <Bar 
            dataKey="confidence" 
            fill={`url(#${gradientId})`}
            radius={[6, 6, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  // If only showing bar chart (for side-by-side layout)
  if (showBarChartOnly) {
    return (
      <div className="relative h-full min-h-[400px]">
        <BarChartComponent gradientId="barChartGradientSide" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Only show Line and Pie Charts, not the Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="rounded-xl border border-border bg-card shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Confidence Trend (Sorted)
            </h3>
            <p className="text-sm text-muted-foreground">
              Confidence scores sorted from lowest to highest
            </p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="index"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                label={{ value: "Detection Index", position: "insideBottom", offset: -5, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={3}
                dot={{ fill: "hsl(142, 71%, 45%)", r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                activeDot={{ r: 6, stroke: "hsl(142, 71%, 45%)", strokeWidth: 2 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="rounded-xl border border-border bg-card shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              Confidence Range Distribution
            </h3>
            <p className="text-sm text-muted-foreground">
              Distribution of detections by confidence level
            </p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, value }) => 
                  value > 0 ? `${name}\n${value} (${(percent * 100).toFixed(0)}%)` : ''
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
                        <p className="text-foreground font-semibold text-sm">{payload[0].name}</p>
                        <p className="text-primary font-bold text-base">{payload[0].value} detections</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
