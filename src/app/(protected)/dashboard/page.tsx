"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";
import { Loading } from "@/components/ui/loading";
import { 
  BookOpen, Activity, Award, ListTodo, CheckCircle2, Percent,
  AlertCircle, ArrowRight, PlayCircle, PlusCircle, CheckSquare, Square, Sparkles, Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { toast } from "react-toastify";
import Link from "next/link";

interface BackendTask {
  id: string;
  title: string;
  completed: boolean;
}

interface BackendStudyPlan {
  _id: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  topics?: string[];
  tasks?: BackendTask[];
  createdAt?: string;
  updatedAt?: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [plans, setPlans] = useState<BackendStudyPlan[]>([]);
  const [isPlansLoading, setIsPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState<string | null>(null);

  const [recommendations, setRecommendations] = useState<any | null>(null);
  const [isRecsLoading, setIsRecsLoading] = useState(true);

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

  const fetchData = async () => {
    setIsProfileLoading(true);
    setIsPlansLoading(true);
    setIsRecsLoading(true);
    setProfileError(null);
    setPlansError(null);

    // Fetch Profile
    try {
      const data = await apiClient.get<{ success: boolean; user: { name: string; email: string } }>("/api/users/me");
      setProfile(data.user);
    } catch (err: any) {
      console.error(err);
      setProfileError(err.message || "Failed to fetch user profile");
    } finally {
      setIsProfileLoading(false);
    }

    // Fetch Plans
    try {
      const data = await apiClient.get<{ success: boolean; data: BackendStudyPlan[] }>("/api/study-plans");
      setPlans(data.data);
    } catch (err: any) {
      console.error(err);
      setPlansError(err.message || "Failed to fetch study plans");
    } finally {
      setIsPlansLoading(false);
    }

    // Fetch Recommendations
    try {
      const data = await apiClient.get<{ success: boolean; data: any }>("/api/recommendations");
      if (data.success) {
        setRecommendations(data.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch dashboard recommendations:", err);
    } finally {
      setIsRecsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleDashboardTask = async (planId: string, taskId: string, currentCompleted: boolean) => {
    const planToUpdate = plans.find(p => p._id === planId);
    if (!planToUpdate) return;

    const updatedTasks = (planToUpdate.tasks || []).map(t => 
      t.id === taskId ? { ...t, completed: !currentCompleted } : t
    );

    const updatedPlan = { ...planToUpdate, tasks: updatedTasks };

    // Optimistically update local state
    setPlans(prev => prev.map(p => p._id === planId ? updatedPlan : p));

    try {
      await apiClient.patch(`/api/study-plans/${planId}`, {
        tasks: updatedTasks
      });
      toast.success("Task progress synced!");
    } catch (err: any) {
      console.error("Failed to sync task progress:", err);
      toast.error("Failed to sync task progress with backend.");
      // Rollback
      fetchData();
    }
  };

  if (isProfileLoading || isPlansLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background fixed inset-0 z-50">
        <div className="flex flex-col items-center space-y-4">
          <Loading size="lg" className="text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading your study dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (plansError) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <Card className="border-destructive ring-1 ring-destructive/50 max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-4" />
            <p className="text-lg font-semibold text-foreground">Failed to load study data</p>
            <p className="text-sm text-muted-foreground mt-1">{plansError}</p>
            <Button onClick={fetchData} className="mt-4" variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate dynamic stats from actual user plans
  const totalStudyPlans = plans.length;
  const completedStudyPlans = plans.filter(p => p.tasks && p.tasks.length > 0 && p.tasks.every(t => t.completed)).length;
  const activeStudyPlans = totalStudyPlans - completedStudyPlans;
  const totalTasks = plans.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  const completedTasks = plans.reduce((acc, p) => acc + (p.tasks?.filter(t => t.completed).length || 0), 0);
  const overallTaskCompletionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Reconstruct chart data from plans
  const chartData = plans.map(p => {
    const total = p.tasks?.length || 0;
    const completed = p.tasks?.filter(t => t.completed).length || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      name: p.title.replace("Study Plan: ", ""),
      progress: percentage
    };
  });

  // Find the first active study plan with incomplete tasks to set as "Current Focus"
  const activePlan = plans.find(p => p.tasks && p.tasks.some(t => !t.completed));
  const nextTask = activePlan?.tasks?.find(t => !t.completed);

  const statsCards = [
    { title: "Total Study Plans", value: totalStudyPlans, icon: BookOpen, color: "text-primary bg-primary/10" },
    { title: "Active Plans", value: activeStudyPlans, icon: Activity, color: "text-secondary bg-secondary/10" },
    { title: "Completed Plans", value: completedStudyPlans, icon: Award, color: "text-accent bg-accent/10" },
    { title: "Total Tasks", value: totalTasks, icon: ListTodo, color: "text-primary bg-primary/10" },
    { title: "Completed Tasks", value: completedTasks, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
    { title: "Task Completion %", value: `${overallTaskCompletionPercentage}%`, icon: Percent, color: "text-secondary bg-secondary/10" },
  ];

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
              {profileError ? (
                <span className="inline-flex h-2 w-2 rounded-full bg-destructive animate-pulse" title="Backend connection failed" />
              ) : (
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Backend connection active" />
              )}
            </div>

            {profileError ? (
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
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="border-0 shadow-md ring-1 ring-border/50">
              <CardContent className="flex items-center p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {totalStudyPlans === 0 ? (
        // Empty state
        <motion.div variants={itemVariants}>
          <Card className="border-dashed border-2 p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">No Saved Roadmaps</h3>
              <p className="text-sm text-muted-foreground">
                You haven't generated any study plans yet. Create a roadmap now to track your tasks and visual charts.
              </p>
            </div>
            <Link href="/planner">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Create Study Plan
              </Button>
            </Link>
          </Card>
        </motion.div>
      ) : (
        // Active plans dashboard grid
        <div className="grid gap-6 md:grid-cols-3">
          {/* Recharts progress chart */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="bg-card/50 backdrop-blur-md border-border/80 h-full">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Study Plans Progress
                </CardTitle>
                <CardDescription>Visual overview of task completion percentage per plan</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                    <Tooltip
                      cursor={{ fill: "rgba(14, 165, 233, 0.05)" }}
                      contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "8px", color: "#F8FAFC" }}
                      itemStyle={{ color: "#0EA5E9" }}
                    />
                    <Bar dataKey="progress" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="Progress (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Focus / Continue Learning */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-md border-border/80 flex flex-col justify-between h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-accent animate-pulse" />
                  Current Focus
                </CardTitle>
                <CardDescription>The next task pending on your studies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                {nextTask && activePlan ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-muted/40 rounded-lg border border-border/50">
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                        Active Study Plan
                      </div>
                      <div className="text-sm font-bold text-foreground">{activePlan.title}</div>
                    </div>

                    <button 
                      onClick={() => handleToggleDashboardTask(activePlan._id, nextTask.id, nextTask.completed)}
                      className="w-full flex items-start gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-xl border border-primary/20 text-left transition-colors cursor-pointer group"
                    >
                      <div className="h-5 w-5 rounded border border-primary text-primary flex items-center justify-center mt-0.5 shrink-0 bg-background group-hover:border-foreground">
                        <Square className="h-3.5 w-3.5 opacity-0 group-hover:opacity-30" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-foreground leading-snug">{nextTask.title}</div>
                        <div className="text-xs text-muted-foreground">Click to mark task as completed</div>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span>All active roadmap tasks are fully completed!</span>
                  </div>
                )}
                
                <Link href="/planner" className="block pt-4 border-t mt-4">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-1.5 text-xs font-bold">
                    Go to Planner <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* AI Recommendations Preview Widget */}
      {totalStudyPlans > 0 && recommendations && (
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-md border-border/80 relative overflow-hidden shadow-md">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-secondary" />
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Adaptive AI Study Recommendations
              </CardTitle>
              <CardDescription>AI insight analysis of your active task lists and study plans progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {recommendations.summary}
              </p>
              
              {recommendations.recommendedActions && recommendations.recommendedActions.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {recommendations.recommendedActions.slice(0, 2).map((action: any, idx: number) => {
                    const priorityClass = 
                      action.priority === "high" 
                        ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                        : action.priority === "medium"
                        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20"
                        : "bg-blue-500/10 text-blue-500 border border-blue-500/20";
                    
                    return (
                      <div key={idx} className="p-3 rounded-lg border border-border/50 bg-background/50 flex flex-col justify-between gap-2">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-foreground line-clamp-1">{action.title}</div>
                          <div className="text-[10px] text-muted-foreground line-clamp-1">{action.description}</div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] pt-1">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${priorityClass}`}>
                            {action.priority}
                          </span>
                          <span className="text-muted-foreground font-semibold flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {action.estimatedMinutes} mins
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <Link href="/recommendations" className="block pt-2">
                <Button size="sm" className="w-full sm:w-auto text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-1.5 shadow-sm">
                  View Full Recommendations Report <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Actual saved plans list section */}
      {totalStudyPlans > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-secondary" />
            Your Study Roadmaps
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {plans.map(p => {
              const completedCount = p.tasks?.filter(t => t.completed).length || 0;
              const totalCount = p.tasks?.length || 0;
              const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
              return (
                <Card key={p._id} className="bg-card/40 backdrop-blur-md border-border/80">
                  <CardContent className="p-4 space-y-3">
                    <div className="text-sm font-bold text-foreground truncate">{p.title}</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span>{completedCount}/{totalCount} Tasks</span>
                      <Link href="/planner" className="text-primary hover:underline font-bold">
                        Open Planner
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
