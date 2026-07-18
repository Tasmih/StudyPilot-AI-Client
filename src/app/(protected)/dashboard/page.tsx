"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { useDashboard } from "@/hooks/useDashboard";
import { DashboardStats } from "@/features/dashboard/DashboardStats";
import { DashboardCharts } from "@/features/dashboard/DashboardCharts";
import { DashboardActivity } from "@/features/dashboard/DashboardActivity";
import { DashboardInsights } from "@/features/dashboard/DashboardInsights";
import { Loading } from "@/components/ui/loading";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: dashboardData, isLoading, isError, error } = useDashboard();

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loading size="lg" className="text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <Card className="border-destructive ring-1 ring-destructive/50 max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-4" />
            <p className="text-lg font-semibold text-foreground">Failed to load data</p>
            <p className="text-sm text-muted-foreground mt-1">
              {(error as Error)?.message || "An unexpected error occurred while fetching dashboard data."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {session?.user?.name || "Student"}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your study progress and AI insights.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <DashboardStats stats={dashboardData.stats} />
      </motion.div>

      {/* Analytics Charts */}
      <motion.div variants={itemVariants}>
        <DashboardCharts data={dashboardData.progressChart} />
      </motion.div>

      {/* Bottom Grid: Activity & Insights */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
        <DashboardActivity activities={dashboardData.recentActivity} />
        <DashboardInsights insights={dashboardData.insights} />
      </motion.div>
    </motion.div>
  );
}
