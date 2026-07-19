"use client";

import React, { useState, useEffect } from "react";
import { PlannerForm } from "@/features/study-planner/PlannerForm";
import { PlannerRoadmap } from "@/features/study-planner/PlannerRoadmap";
import { PlannerFormData, PlannerResponse } from "@/schemas/planner";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api-client";
import { Loading } from "@/components/ui/loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Trash2, Calendar, Award, ChevronRight, ArrowLeft, AlertCircle } from "lucide-react";

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

export default function PlannerPage() {
  const [plans, setPlans] = useState<BackendStudyPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<BackendStudyPlan | null>(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load plans on mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setIsLoadingPlans(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: BackendStudyPlan[] }>("/api/study-plans");
      if (response.success) {
        setPlans(response.data);
      }
    } catch (err: any) {
      console.error("Error loading plans:", err);
      setError(err.message || "Failed to load study plans.");
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handleGeneratePlan = async (formData: PlannerFormData) => {
    setIsGenerating(true);
    try {
      // Simulating AI generation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulated response matching the requested schema
      const mockResponse: PlannerResponse = {
        roadmap: [
          {
            phaseName: "Phase 1: Foundations & Core Concepts",
            tasks: [
              {
                id: `${Date.now()}-1`,
                title: "Understand the Basics",
                description: `Read introductory chapters on ${formData.subject} and memorize key terminology.`,
                estimatedHours: 4,
              },
              {
                id: `${Date.now()}-2`,
                title: "Practice Exercises",
                description: `Complete foundational exercises on ${formData.subject} to solidify understanding.`,
                estimatedHours: 6,
              },
            ],
          },
          {
            phaseName: "Phase 2: Advanced Application",
            tasks: [
              {
                id: `${Date.now()}-3`,
                title: "Complex Problem Solving",
                description: `Tackle advanced scenarios and case studies for ${formData.subject}.`,
                estimatedHours: 8,
              },
              {
                id: `${Date.now()}-4`,
                title: "Mock Assessment",
                description: "Take a timed practice test covering all previous materials.",
                estimatedHours: 3,
              },
            ],
          },
        ],
        dailySchedule: [
          `Allocate ${formData.dailyStudyTime} hours strictly to deep work without distractions.`,
          "First 30 mins: Review notes from the previous day.",
          "Middle blocks (45 min each): Focus on new material and active recall.",
          "Last 15 mins: Summarize what you learned today.",
        ],
        revisionStrategy: "Implement spaced repetition by reviewing difficult concepts 1 day, 3 days, and 1 week after first learning them. Focus heavily on practice testing rather than passive reading.",
      };

      // Store plan details in serialized description to keep original schema representation intact
      const descriptionObj = {
        subject: formData.subject,
        goal: formData.goal,
        skillLevel: formData.skillLevel,
        dailyStudyTime: formData.dailyStudyTime,
        revisionStrategy: mockResponse.revisionStrategy,
        dailySchedule: mockResponse.dailySchedule,
        roadmap: mockResponse.roadmap,
      };

      const tasksPayload = mockResponse.roadmap.flatMap((phase) =>
        phase.tasks.map((t) => ({
          id: t.id,
          title: t.title,
          completed: false,
        }))
      );

      // Create new study plan in Express backend
      const res = await apiClient.post<{ success: boolean; data: BackendStudyPlan }>("/api/study-plans", {
        title: `Study Plan: ${formData.subject}`,
        description: JSON.stringify(descriptionObj),
        startDate: new Date(),
        endDate: new Date(formData.examDate),
        topics: mockResponse.dailySchedule,
        tasks: tasksPayload,
      });

      if (res.success) {
        setPlans((prev) => [res.data, ...prev]);
        setSelectedPlan(res.data);
        setIsGenerating(false);
        toast.success("Study plan generated and saved successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate and save study plan.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (!selectedPlan) return;

    // Optimistically update local state
    const updatedTasks = (selectedPlan.tasks || []).map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    const updatedPlan = { ...selectedPlan, tasks: updatedTasks };
    setSelectedPlan(updatedPlan);
    setPlans((prev) => prev.map((p) => (p._id === selectedPlan._id ? updatedPlan : p)));

    try {
      await apiClient.patch(`/api/study-plans/${selectedPlan._id}`, {
        tasks: updatedTasks,
      });
      toast.success("Task status updated!");
    } catch (err: any) {
      console.error("Failed to update task:", err);
      toast.error("Failed to sync task status with backend.");
      // Rollback on error
      fetchPlans();
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this study plan?")) return;

    try {
      await apiClient.delete(`/api/study-plans/${planId}`);
      setPlans((prev) => prev.filter((p) => p._id !== planId));
      if (selectedPlan?._id === planId) {
        setSelectedPlan(null);
      }
      toast.success("Study plan deleted.");
    } catch (err: any) {
      console.error("Failed to delete study plan:", err);
      toast.error("Failed to delete study plan.");
    }
  };

  // Reconstruct PlannerResponse schema from serialized description object and current task status
  const getReconstructedPlanResponse = (plan: BackendStudyPlan): PlannerResponse | null => {
    try {
      const details = JSON.parse(plan.description);
      const reconstructedRoadmap = details.roadmap.map((phase: any) => ({
        phaseName: phase.phaseName,
        tasks: phase.tasks.map((t: any) => {
          const backendTask = plan.tasks?.find((bt) => bt.id === t.id);
          return {
            ...t,
            completed: backendTask ? backendTask.completed : false,
          };
        }),
      }));

      return {
        roadmap: reconstructedRoadmap,
        dailySchedule: details.dailySchedule || [],
        revisionStrategy: details.revisionStrategy || "",
      };
    } catch (err) {
      console.error("Reconstruction error:", err);
      return null;
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            AI Study Planner
          </h1>
          <p className="text-muted-foreground mt-2">
            Let our AI analyze your goals and generate a custom-tailored learning roadmap.
          </p>
        </div>
        {!selectedPlan && !isGenerating && plans.length > 0 && (
          <Button onClick={() => setIsGenerating(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Generate New Plan
          </Button>
        )}
      </div>

      {isLoadingPlans ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loading size="lg" className="text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading your study plans...
          </p>
        </div>
      ) : error ? (
        <Card className="border-destructive ring-1 ring-destructive/50">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-4" />
            <p className="text-lg font-semibold text-foreground">Failed to load study plans</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <Button onClick={fetchPlans} className="mt-4" variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : isGenerating ? (
        <PlannerForm onSubmit={handleGeneratePlan} isLoading={isGenerating} />
      ) : selectedPlan ? (
        // Detailed roadmap view
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedPlan(null)}
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to saved plans
            </button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeletePlan(selectedPlan._id)}
              className="flex items-center gap-1.5"
            >
              <Trash2 className="h-4 w-4" /> Delete Plan
            </Button>
          </div>

          <div className="p-5 bg-card/40 backdrop-blur-md rounded-xl border border-border/80 space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{selectedPlan.title}</h2>
            {selectedPlan.endDate && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-accent" />
                Target Exam Date: {new Date(selectedPlan.endDate).toLocaleDateString()}
              </p>
            )}
            <div className="flex gap-2 pt-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                Tasks: {selectedPlan.tasks?.filter((t) => t.completed).length || 0} / {selectedPlan.tasks?.length || 0} completed
              </span>
            </div>
          </div>

          {getReconstructedPlanResponse(selectedPlan) ? (
            <PlannerRoadmap
              plan={getReconstructedPlanResponse(selectedPlan)!}
              onToggleTask={handleToggleTask}
            />
          ) : (
            <div className="p-8 text-center bg-muted/30 border border-dashed rounded-lg">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-foreground">Could not load this study plan details.</p>
            </div>
          )}
        </div>
      ) : plans.length === 0 ? (
        // Empty state
        <Card className="border-dashed border-2 p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">No Study Plans Found</h3>
            <p className="text-sm text-muted-foreground">
              You haven't generated any study plans yet. Create one now to map out your study goals!
            </p>
          </div>
          <Button onClick={() => setIsGenerating(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Your First Plan
          </Button>
        </Card>
      ) : (
        // Grid list of study plans
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {plans.map((plan) => {
            const completedCount = plan.tasks?.filter((t) => t.completed).length || 0;
            const totalCount = plan.tasks?.length || 0;
            const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <Card
                key={plan._id}
                onClick={() => setSelectedPlan(plan)}
                className="bg-card/50 backdrop-blur-md border-border/80 hover:border-primary/50 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-bold text-foreground line-clamp-2">
                      {plan.title}
                    </CardTitle>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlan(plan._id);
                      }}
                      className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                      title="Delete study plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {plan.endDate && (
                    <CardDescription className="text-xs flex items-center gap-1 mt-1 font-medium text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-accent" />
                      Exam: {new Date(plan.endDate).toLocaleDateString()}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground">{percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500 animate-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                    <span>
                      {completedCount}/{totalCount} Tasks
                    </span>
                    <span className="text-primary group-hover:underline flex items-center gap-0.5 font-bold">
                      View Roadmap <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
