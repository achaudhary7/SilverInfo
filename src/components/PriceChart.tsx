"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { HistoricalPrice } from "@/lib/metalApi";

interface PriceChartProps {
  data: HistoricalPrice[];
  height?: number;
  showControls?: boolean;
}

type TimeRange = "7d" | "30d" | "90d" | "1y";

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
];

export default function PriceChart({ data, height = 300, showControls = true }: PriceChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("30d");
  
  // Filter data based on selected range
  const getFilteredData = () => {
    const days = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };
    return data.slice(-days[selectedRange]);
  };
  
  const filteredData = getFilteredData();
  
  // Calculate stats
  const prices = filteredData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const startPrice = prices[0];
  const endPrice = prices[prices.length - 1];
  const priceChange = endPrice - startPrice;
  const percentChange = ((priceChange / startPrice) * 100).toFixed(2);
  
  const isPositive = priceChange >= 0;
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">
            {new Date(label || "").toLocaleDateString("en-IN", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            ₹{payload[0].value.toFixed(2)}/g
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Price History</h3>
          <p className="text-sm text-gray-500">Silver price trend in INR</p>
        </div>
        
        {showControls && (
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedRange(range.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedRange === range.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? "#10b981" : "#ef4444"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? "#10b981" : "#ef4444"} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
              }}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis
              domain={[minPrice * 0.99, maxPrice * 1.01]}
              tickFormatter={(value) => `₹${value.toFixed(0)}`}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">Period Change</p>
          <p className={`text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "+" : ""}{priceChange.toFixed(2)} ({percentChange}%)
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Low</p>
          <p className="text-sm font-semibold text-gray-900">₹{minPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">High</p>
          <p className="text-sm font-semibold text-gray-900">₹{maxPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Average</p>
          <p className="text-sm font-semibold text-gray-900">₹{avgPrice.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Data Source */}
      <p className="mt-4 text-xs text-gray-400 text-center">
        Historical data from COMEX Silver Futures (SI=F) • Converted to INR with import duties •{" "}
        <a href="/how-we-calculate" className="underline hover:text-gray-600">
          Methodology
        </a>
      </p>
    </div>
  );
}

// Mini chart for homepage
export function MiniPriceChart({ data }: { data: HistoricalPrice[] }) {
  const last7Days = data.slice(-7);
  const prices = last7Days.map((d) => d.price);
  const startPrice = prices[0];
  const endPrice = prices[prices.length - 1];
  const isPositive = endPrice >= startPrice;
  
  // Calculate min/max with padding to show variations
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.2 || 5; // 20% padding or ₹5 minimum
  
  return (
    <div className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={last7Days} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
              <stop 
                offset="5%" 
                stopColor={isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0.3}
              />
              <stop 
                offset="95%" 
                stopColor={isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <YAxis 
            domain={[minPrice - padding, maxPrice + padding]} 
            hide 
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            fill="url(#miniGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
