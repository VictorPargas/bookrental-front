import { Card } from "react-bootstrap";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number; // Percentual de variação
  trendPositive?: boolean; // True se a variação for positiva
}

export default function StatsCard({ title, value, icon: Icon, trend, trendPositive }: StatsCardProps) {
  return (
    <Card className="p-3 shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="text-muted fw-bold">{title}</h6>
        <Icon size={24} className="text-primary" />
      </div>
      <h2 className="fw-bold">{value}</h2>

      {trend !== undefined && (
        <span className={`badge ${trendPositive ? "bg-success" : "bg-danger"} mt-2`}>
          {trendPositive ? "▲" : "▼"} {trend.toFixed(1)}%
        </span>
      )}
    </Card>
  );
}
