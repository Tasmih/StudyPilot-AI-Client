"use client";

import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line 
} from "recharts";
import { ProgressDataPoint } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart2 } from "lucide-react";

interface DashboardChartsProps {
  data: ProgressDataPoint[];
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Study Hours Chart */}
      <Card className="border-0 shadow-md ring-1 ring-border/50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-semibold text-foreground">
            <Activity className="mr-2 h-5 w-5 text-secondary" />
            Weekly Study Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "8px", color: "#F8FAFC" }}
                  itemStyle={{ color: "#0EA5E9" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#0EA5E9" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Task Completion Chart */}
      <Card className="border-0 shadow-md ring-1 ring-border/50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-semibold text-foreground">
            <BarChart2 className="mr-2 h-5 w-5 text-primary" />
            Tasks Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: "rgba(79, 70, 229, 0.1)" }}
                  contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "8px", color: "#F8FAFC" }}
                  itemStyle={{ color: "#4F46E5" }}
                />
                <Bar dataKey="tasksCompleted" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
