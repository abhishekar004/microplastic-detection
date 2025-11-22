import { Detection } from "@/types/detection";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DetectionTableProps {
  detections: Detection[];
}

type SortField = "id" | "confidence" | "x1" | "y1" | "x2" | "y2";
type SortDirection = "asc" | "desc";

export const DetectionTable = ({ detections }: DetectionTableProps) => {
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [confidenceFilter, setConfidenceFilter] = useState<string>("all");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedDetections = useMemo(() => {
    // Create indexed array first to preserve original indices
    const indexedDetections = detections.map((detection, idx) => ({
      detection,
      originalIndex: idx,
    }));

    // Search filter (by ID)
    let filtered = indexedDetections;
    if (searchTerm) {
      filtered = filtered.filter((item) => 
        (item.originalIndex + 1).toString().includes(searchTerm)
      );
    }

    // Filter by confidence
    if (confidenceFilter !== "all") {
      filtered = filtered.filter((item) => {
        if (confidenceFilter === "high") return item.detection.score >= 0.8;
        if (confidenceFilter === "medium") return item.detection.score >= 0.5 && item.detection.score < 0.8;
        return item.detection.score < 0.5;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortField) {
        case "id":
          aValue = a.originalIndex;
          bValue = b.originalIndex;
          break;
        case "confidence":
          aValue = a.detection.score;
          bValue = b.detection.score;
          break;
        case "x1":
          aValue = a.detection.bbox[0];
          bValue = b.detection.bbox[0];
          break;
        case "y1":
          aValue = a.detection.bbox[1];
          bValue = b.detection.bbox[1];
          break;
        case "x2":
          aValue = a.detection.bbox[2];
          bValue = b.detection.bbox[2];
          break;
        case "y2":
          aValue = a.detection.bbox[3];
          bValue = b.detection.bbox[3];
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered.map((item) => item.detection);

  }, [detections, sortField, sortDirection, searchTerm, confidenceFilter]);

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1 hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className={cn(
        "h-3 w-3 transition-opacity",
        sortField === field ? "opacity-100" : "opacity-0 group-hover:opacity-50"
      )} />
      {sortField === field && (
        <span className="text-xs text-primary">
          {sortDirection === "asc" ? "↑" : "↓"}
        </span>
      )}
    </Button>
  );

  return (
    <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-card to-card/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Detection Details
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              All detected microplastics with coordinates and confidence scores
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedDetections.length} of {detections.length}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by confidence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Confidence</SelectItem>
              <SelectItem value="high">High (≥80%)</SelectItem>
              <SelectItem value="medium">Medium (50-80%)</SelectItem>
              <SelectItem value="low">Low (&lt;50%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[450px]">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                <SortButton field="id">ID</SortButton>
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                Label
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                <SortButton field="confidence">Confidence</SortButton>
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                <SortButton field="x1">X1</SortButton>
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                <SortButton field="y1">Y1</SortButton>
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                <SortButton field="x2">X2</SortButton>
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                <SortButton field="y2">Y2</SortButton>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedDetections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <p className="text-muted-foreground">No detections found matching your filters</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedDetections.map((detection, index) => {
                const originalIndex = detections.indexOf(detection);
                const confidencePercent = detection.score * 100;
                const confidenceColor =
                  confidencePercent >= 80
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : confidencePercent >= 50
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20";

                return (
                  <TableRow
                    key={originalIndex}
                    className="border-border hover:bg-muted/40 transition-colors group"
                  >
                    <TableCell className="font-mono text-sm font-semibold text-foreground">
                      #{(originalIndex + 1).toString().padStart(3, "0")}
                    </TableCell>
                    <TableCell className="text-sm text-foreground font-medium">
                      Microplastic
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center px-3 py-1 rounded-lg font-semibold text-sm border",
                          confidenceColor
                        )}
                      >
                        {confidencePercent.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {Math.round(detection.bbox[0])}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {Math.round(detection.bbox[1])}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {Math.round(detection.bbox[2])}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {Math.round(detection.bbox[3])}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
