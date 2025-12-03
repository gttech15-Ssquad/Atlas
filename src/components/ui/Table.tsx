import React from "react";
import { cn } from "@/lib/utils";

interface TableProps {
  headers: string[];
  rows: React.ReactNode[][];
  compact?: boolean;
  hoverable?: boolean;
}

export const Table = ({
  headers,
  rows,
  compact = false,
  hoverable = true,
}: TableProps) => {
  return (
    <div className="overflow-x-auto border border-neutral-200 rounded-lg bg-white">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200 sticky top-0">
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className={cn(
                  "text-left font-semibold text-neutral-700 bg-neutral-50",
                  compact ? "px-3 py-2 text-sm" : "px-4 py-3"
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={cn(
                "border-b border-neutral-200",
                hoverable && "hover:bg-neutral-50 transition"
              )}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    "text-neutral-800",
                    compact ? "px-3 py-2 text-sm" : "px-4 py-3"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          No data available
        </div>
      )}
    </div>
  );
};
