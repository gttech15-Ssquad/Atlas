import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  month: string;
  spend: number;
  limit: number;
}

interface SpendingChartProps {
  data: ChartData[];
  title?: string;
  height?: number;
}

export const SpendingChart = ({
  data,
  title = "Monthly Spending vs Limit",
  height = 300,
}: SpendingChartProps) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar
            dataKey="spend"
            fill="#E15C42"
            name="Spending"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="limit"
            fill="#E5E7EB"
            name="Limit"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface TransactionTrendProps {
  data: { date: string; amount: number }[];
  title?: string;
  height?: number;
}

export const TransactionTrend = ({
  data,
  title = "Transaction Trend",
  height = 250,
}: TransactionTrendProps) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="date" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#E15C42"
            strokeWidth={2}
            dot={{ fill: "#E15C42", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
