"use client";

import React, { useState, useEffect } from "react";
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
import { apiClient } from "@/lib/api-client";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: dashboardData, isLoading, isError, error } = useDashboard();

  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchProfile = async () => {
      try {
        const data = await apiClient.get<{ success: boolean; user: { name: string; email: string } }>("/api/users/me");
        if (active) {
          setProfile(data.user);
        }
      } catch (err: any) {
        if (active) {
          setProfileError(err.message || "Failed to fetch user profile");
        }
      } finally {
        if (active) {
          setIsProfileLoading(false);
        }
      }
    };
    fetchProfile();
    return () => {
      active = false;
    };
  }, []);

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
      {/* Welcome Section & Backend Profile */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-3 items-center">
        <div className="md:col-span-2 flex flex-col justify-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {profile?.name || session?.user?.name || "Student"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your study progress and AI insights.
          </p>
        </div>

        {/* Backend User Profile Card */}
        <Card className="bg-card/50 backdrop-blur-md border-border/80 relative overflow-hidden">
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Verified API Profile
              </span>
              {isProfileLoading ? (
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : profileError ? (
                <span className="inline-flex h-2 w-2 rounded-full bg-destructive animate-pulse" title="Backend connection failed" />
              ) : (
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Backend connection active" />
              )}
            </div>

            {isProfileLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ) : profileError ? (
              <div className="text-xs text-destructive flex items-center gap-1.5 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Error loading backend profile</span>
              </div>
            ) : profile ? (
              <div className="space-y-1">
                <div className="text-sm font-bold text-foreground truncate">{profile.name}</div>
                <div className="text-xs text-muted-foreground font-mono truncate">{profile.email}</div>
              </div>
            ) : null}
          </CardContent>
        </Card>
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
