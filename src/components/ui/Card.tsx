import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-white border border-neutral-200 rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }: CardProps) => {
  return <div className={cn("mb-4 pb-4", className)}>{children}</div>;
};

export const CardBody = ({ children, className = "" }: CardProps) => {
  return <div className={cn("", className)}>{children}</div>;
};

export const CardFooter = ({ children, className = "" }: CardProps) => {
  return (
    <div className={cn("border-t border-neutral-200 pt-4 mt-4", className)}>
      {children}
    </div>
  );
};

// Summary Card for dashboard
export const SummaryCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  className = "",
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | null;
  trendLabel?: string;
  className?: string;
}) => {
  return (
    <Card className={cn("", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
          {trendLabel && (
            <p
              className={cn("text-sm mt-2", {
                "text-green-600": trend === "up",
                "text-red-600": trend === "down",
              })}
            >
              {trendLabel}
            </p>
          )}
        </div>
        {Icon && <div className="text-primary text-2xl">{Icon}</div>}
      </div>
    </Card>
  );
};
