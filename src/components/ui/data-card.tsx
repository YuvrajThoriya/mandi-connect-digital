
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number | React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function DataCard({
  title,
  value,
  description,
  icon,
  footer,
  trend,
  className,
  ...props
}: DataCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {icon && <div className="w-8 h-8 flex items-center justify-center">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {trend && (
            <span
              className={cn(
                "ml-2 text-sm",
                trend.positive ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.positive ? "+" : "-"}
              {trend.value}%
            </span>
          )}
        </div>
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
