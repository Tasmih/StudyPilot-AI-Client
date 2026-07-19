"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  RefreshCw,
  Clock,
  Compass,
  Smile,
  BookOpen,
  Calendar,
  AlertCircle,
  ArrowRight,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface RecommendationTopic {
  topic: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

interface RecommendationAction {
  title: string;
  description: string;
  type: "study" | "revision" | "practice" | "review";
  estimatedMinutes: number;
  priority: "high" | "medium" | "low";
}

interface RecommendationData {
  summary: string;
  priorityTopics: RecommendationTopic[];
  recommendedActions: RecommendationAction[];
  studyStrategy: string[];
  encouragement: string;
  generatedAt: string;
}

export default function RecommendationsPage() {
  const [data, setData] = useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const res = isRefresh
        ? await apiClient.post<{ success: boolean; data: RecommendationData | null }>(
            "/api/recommendations/refresh"
          )
        : await apiClient.get<{ success: boolean; data: RecommendationData | null }>(
            "/api/recommendations"
          );

      if (res.success) {
        setData(res.data);
        if (isRefresh) {
          toast.success("AI Recommendations refreshed!");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load study recommendations");
      toast.error(err.message || "Could not generate suggestions");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Priority color theme mappings
  const priorityColors = {
    high: "bg-red-500/10 text-red-500 border border-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20",
    low: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  };

  // Action type iconography mappings
  const getActionIcon = (type: string) => {
    switch (type) {
      case "study":
        return <BookOpen className="h-4 w-4" />;
      case "revision":
        return <RefreshCw className="h-4 w-4 animate-spin-slow" />;
      case "practice":
        return <TrendingUp className="h-4 w-4" />;
      case "review":
        return <Compass className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  // 1. Loading Skeleton state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 px-4 py-6">
        <div className="h-10 bg-muted rounded-lg w-1/3 animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/2 animate-pulse mt-2" />

        <div className="animate-pulse space-y-6 pt-4">
          <Card className="border-0 shadow-md">
            <CardContent className="h-28 bg-muted/30 rounded-xl" />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-md">
                <CardContent className="h-64 bg-muted/30 rounded-xl" />
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="h-64 bg-muted/30 rounded-xl" />
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="border-0 shadow-md">
                <CardContent className="h-48 bg-muted/30 rounded-xl" />
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="h-48 bg-muted/30 rounded-xl" />
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error state
  if (error) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <Card className="border-destructive/30 ring-1 ring-destructive/20 text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">Recommendation Engine Error</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => fetchRecommendations()} variant="outline" className="mt-2">
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. Empty state (No study plans exist)
  if (!data) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <Card className="border-dashed border-2 text-center p-8 space-y-6 bg-card/50 backdrop-blur-md">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Compass className="h-7 w-7 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">No Active Study Plans Found</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We analyze task progress and weak topics in your study plans to provide personalized AI recommendations. Create your first roadmap to start!
            </p>
          </div>
          <Link href="/planner" className="inline-block">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Initialize Study Plan
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // 4. Completed/Ready state
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-6 px-4 py-4"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Adaptive Recommendations
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time personalized study strategies and topics customized to your tasks progress.
          </p>
        </div>

        <Button
          onClick={() => fetchRecommendations(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          <span>{isRefreshing ? "Regenerating..." : "Refresh Insights"}</span>
        </Button>
      </div>

      {/* Overview / Summary Card */}
      <Card className="bg-card/50 backdrop-blur-md border-border/80 relative overflow-hidden shadow-md">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-secondary" />
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div className="space-y-2 flex-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI Study Assessment
            </span>
            <p className="text-base md:text-lg text-foreground font-medium leading-relaxed">
              {data.summary}
            </p>
          </div>
          {data.generatedAt && (
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40 w-full md:w-auto">
              <Calendar className="h-4 w-4" />
              <span>
                Generated: {new Date(data.generatedAt).toLocaleDateString()}{" "}
                {new Date(data.generatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Secondary layouts columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Priority Topics & Recommended Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Priority Topics Card */}
          <Card className="bg-card/50 backdrop-blur-md border-border/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Urgent Priority Topics
              </CardTitle>
              <CardDescription>Topics identified from your study planner needing attention or revision</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.priorityTopics && data.priorityTopics.length > 0 ? (
                <div className="grid gap-3">
                  {data.priorityTopics.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-muted/30 rounded-xl border border-border/40 flex flex-col sm:flex-row sm:items-start justify-between gap-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-foreground">{item.topic}</div>
                        <div className="text-xs text-muted-foreground leading-normal">{item.reason}</div>
                      </div>
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider self-start sm:self-auto border shrink-0 text-center",
                          priorityColors[item.priority] || priorityColors.low
                        )}
                      >
                        {item.priority} Priority
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No pending priority topics detected.</p>
              )}
            </CardContent>
          </Card>

          {/* Recommended Study Actions Card */}
          <Card className="bg-card/50 backdrop-blur-md border-border/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" />
                Recommended Actions
              </CardTitle>
              <CardDescription>Specific concrete learning steps you should take now</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.recommendedActions && data.recommendedActions.length > 0 ? (
                <div className="grid gap-4">
                  {data.recommendedActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/10 transition-colors flex items-start gap-4"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                        {getActionIcon(action.type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-bold text-foreground text-sm truncate">
                            {action.title}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-md text-3xs font-bold uppercase tracking-wider border",
                                priorityColors[action.priority] || priorityColors.low
                              )}
                            >
                              {action.priority}
                            </span>
                            <span className="inline-flex items-center gap-1 text-3xs text-muted-foreground font-semibold px-2 py-0.5 bg-muted rounded-md">
                              <Clock className="h-3 w-3" />
                              {action.estimatedMinutes} mins
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No study actions generated.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Strategies & Motivation Sidebar column */}
        <div className="space-y-6">
          
          {/* Study Strategy Card */}
          <Card className="bg-card/50 backdrop-blur-md border-border/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                Suggested Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.studyStrategy && data.studyStrategy.length > 0 ? (
                <ul className="space-y-2.5">
                  {data.studyStrategy.map((strat, idx) => (
                    <li key={idx} className="flex gap-2 text-xs text-muted-foreground items-start">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0 mt-1.5" />
                      <span className="leading-normal">{strat}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No strategies defined.</p>
              )}
            </CardContent>
          </Card>

          {/* Motivation / Encouragement Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                <Smile className="h-5 w-5" />
                Tutor Encouragement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-foreground/80 leading-relaxed italic">
                "{data.encouragement}"
              </p>
            </CardContent>
          </Card>

          {/* Quick link shortcuts card */}
          <Card className="bg-card/30 backdrop-blur-sm border-border/60">
            <CardContent className="p-4 space-y-3">
              <div className="text-xs font-bold text-foreground">Next Steps:</div>
              <div className="grid gap-2">
                <Link href="/planner">
                  <Button variant="outline" size="sm" className="w-full justify-between text-xs">
                    <span>Manage Study Planner</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href="/assistant">
                  <Button variant="outline" size="sm" className="w-full justify-between text-xs">
                    <span>Ask AI Tutor details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
