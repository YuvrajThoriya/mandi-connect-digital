
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string;
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const variantMap: Record<string, string> = {
    // Product Statuses
    draft: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    auction: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    sold: "bg-green-100 text-green-800 hover:bg-green-100",
    canceled: "bg-red-100 text-red-800 hover:bg-red-100",
    
    // Auction Statuses
    upcoming: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    active: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    completed: "bg-green-100 text-green-800 hover:bg-green-100",
    
    // Order Statuses
    paid: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    shipped: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    delivered: "bg-teal-100 text-teal-800 hover:bg-teal-100",
    
    // Appointment Statuses
    confirmed: "bg-green-100 text-green-800 hover:bg-green-100",
    
    // Grade
    A: "bg-green-100 text-green-800 hover:bg-green-100",
    B: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    C: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  };

  // Format status for display
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge
      variant="outline"
      className={cn(
        "uppercase text-xs font-medium",
        variantMap[status] || "bg-gray-100 text-gray-800 hover:bg-gray-100",
        className
      )}
      {...props}
    >
      {displayStatus}
    </Badge>
  );
}
