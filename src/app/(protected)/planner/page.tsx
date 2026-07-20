"use client";

import React, { useState, useEffect } from "react";
import { PlannerForm } from "@/features/study-planner/PlannerForm";
import { PlannerRoadmap } from "@/features/study-planner/PlannerRoadmap";
import { PlannerFormData, PlannerResponse } from "@/schemas/planner";
import { showSuccess, showError, confirmDelete } from "@/utils/notifications";
import { apiClient } from "@/lib/api-client";
import { Loading } from "@/components/ui/loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Trash2, Calendar, Award, ChevronRight, ArrowLeft, AlertCircle, RefreshCw, Save, X } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  // States for preview & regeneration workflows
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewPlan, setPreviewPlan] = useState<PlannerResponse | null>(null);
  const [originalFormData, setOriginalFormData] = useState<PlannerFormData | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Load plans on mount
  useEffect(() => {
    fetchPlans();
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("subject")) {
        setIsFormVisible(true);
      }
    }
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
    setPreviewPlan(null);
    setOriginalFormData(null);
    try {
      // Call secure server-side AI generation endpoint
      const genRes = await apiClient.post<{ success: boolean; data: PlannerResponse }>(
        "/api/study-plans/generate",
        formData
      );

      if (genRes.success) {
        setPreviewPlan(genRes.data);
        setOriginalFormData(formData);
        setIsFormVisible(false);
        showSuccess("AI Study Plan preview generated!");
      }
    } catch (err: any) {
      showError(err.message || "Failed to generate AI study plan.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!originalFormData) return;
    setIsGenerating(true);
    try {
      const genRes = await apiClient.post<{ success: boolean; data: PlannerResponse }>(
        "/api/study-plans/generate",
        originalFormData
      );

      if (genRes.success) {
        setPreviewPlan(genRes.data);
        showSuccess("New AI Study Plan regenerated!");
      }
    } catch (err: any) {
      showError(err.message || "Failed to regenerate study plan.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!previewPlan || !originalFormData) return;
    setIsSaving(true);
    try {
      const descriptionObj = {
        subject: originalFormData.subject,
        goal: originalFormData.goal,
        skillLevel: originalFormData.skillLevel,
        dailyStudyTime: originalFormData.dailyStudyTime,
        preferredStudyDays: originalFormData.preferredStudyDays,
        weakTopics: originalFormData.weakTopics,
        strongTopics: originalFormData.strongTopics,
        preferredLearningStyle: originalFormData.preferredLearningStyle,
        additionalInstructions: originalFormData.additionalInstructions,
        planLength: originalFormData.planLength,
        revisionStrategy: previewPlan.revisionStrategy,
        dailySchedule: previewPlan.dailySchedule,
        roadmap: previewPlan.roadmap,
      };

      const tasksPayload = previewPlan.roadmap.flatMap((phase) =>
        phase.tasks.map((t) => ({
          id: t.id,
          title: t.title,
          completed: false,
        }))
      );

      // Create new study plan in Express backend
      const res = await apiClient.post<{ success: boolean; data: BackendStudyPlan }>("/api/study-plans", {
        title: `Study Plan: ${originalFormData.subject}`,
        description: JSON.stringify(descriptionObj),
        startDate: new Date(),
        endDate: new Date(originalFormData.examDate),
        topics: previewPlan.dailySchedule,
        tasks: tasksPayload,
      });

      if (res.success) {
        setPlans((prev) => [res.data, ...prev]);
        setSelectedPlan(res.data);
        setPreviewPlan(null);
        setOriginalFormData(null);
        showSuccess("Study plan saved successfully!");
      }
    } catch (err: any) {
      showError(err.message || "Failed to save study plan.");
    } finally {
      setIsSaving(false);
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
      showSuccess("Task status updated!");
    } catch (err: any) {
      console.error("Failed to update task:", err);
      showError("Failed to sync task status with backend.");
      fetchPlans();
    }
  };

  const handleDeletePlan = async (planId: string) => {
    const isConfirmed = await confirmDelete(
      "Delete Study Plan?",
      "Are you sure you want to delete this study plan? This action cannot be undone."
    );
    if (!isConfirmed) return;

    try {
      await apiClient.delete(`/api/study-plans/${planId}`);
      setPlans((prev) => prev.filter((p) => p._id !== planId));
      if (selectedPlan?._id === planId) {
        setSelectedPlan(null);
      }
      showSuccess("Study plan deleted.");
    } catch (err: any) {
      console.error("Failed to delete study plan:", err);
      showError("Failed to delete study plan.");
    }
  };

  const getReconstructedPlanResponse = (plan: BackendStudyPlan): PlannerResponse | null => {
    if (!plan.description) {
      return {
        roadmap: [
          {
            phaseName: "General Study Phase",
            tasks: (plan.tasks || []).map((t) => ({
              id: t.id,
              title: t.title,
              completed: t.completed,
              description: "",
              estimatedHours: 1,
            })),
          },
        ],
        dailySchedule: plan.topics || [],
        revisionStrategy: "No strategy details provided.",
      };
    }

    try {
      const details = JSON.parse(plan.description);
      if (!details || typeof details !== "object") {
        throw new Error("Parsed description is not an object");
      }

      const reconstructedRoadmap = (details.roadmap || [
        {
          phaseName: "General Study Phase",
          tasks: (plan.tasks || []).map((t: any) => ({
            id: t.id,
            title: t.title,
            completed: t.completed || false,
            description: t.description || "",
            estimatedHours: t.estimatedHours || 1,
          })),
        }
      ]).map((phase: any) => ({
        phaseName: phase.phaseName || "Study Phase",
        tasks: (phase.tasks || []).map((t: any) => {
          const backendTask = plan.tasks?.find((bt) => bt.id === t.id);
          return {
            id: t.id,
            title: t.title || "Study Task",
            description: t.description || "",
            estimatedHours: t.estimatedHours || 1,
            completed: backendTask ? backendTask.completed : false,
          };
        }),
      }));

      return {
        roadmap: reconstructedRoadmap,
        dailySchedule: details.dailySchedule || plan.topics || [],
        revisionStrategy: details.revisionStrategy || "Review your study plan tasks regularly.",
      };
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Planner] plan.description is not valid JSON, returning fallback configuration:", err);
      }
      
      // Plain text or malformed JSON fallback
      return {
        roadmap: [
          {
            phaseName: "General Study Phase",
            tasks: (plan.tasks || []).map((t) => ({
              id: t.id,
              title: t.title,
              completed: t.completed,
              description: "",
              estimatedHours: 1,
            })),
          },
        ],
        dailySchedule: plan.topics || [],
        revisionStrategy: plan.description,
      };
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
        {!selectedPlan && !previewPlan && !isFormVisible && !isGenerating && (
          <Button onClick={() => setIsFormVisible(true)} className="flex items-center gap-2">
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
        <div className="flex flex-col items-center justify-center p-20 space-y-4 border border-dashed rounded-xl bg-card/30 backdrop-blur-sm">
          <RefreshCw className="h-12 w-12 text-primary animate-spin" />
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-foreground">AI Architect is Reasoning</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Analyzing subject materials, allocating study time limits, and prioritizing weak concepts...
            </p>
          </div>
        </div>
      ) : previewPlan && originalFormData ? (
        // Generated plan preview state
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/40 rounded-xl border border-border/80">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-semibold text-foreground">Unsaved Study Plan Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setPreviewPlan(null); setOriginalFormData(null); }} className="flex items-center gap-1.5">
                <X className="h-4 w-4" /> Discard
              </Button>
              <Button variant="outline" size="sm" onClick={handleRegenerate} className="flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4" /> Regenerate
              </Button>
              <Button size="sm" onClick={handleSavePlan} disabled={isSaving} className="flex items-center gap-1.5">
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save to Study Plans
              </Button>
            </div>
          </div>

          <div className="p-5 bg-card/40 backdrop-blur-md rounded-xl border border-border/80 space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Study Plan: {originalFormData.subject}</h2>
            <p className="text-sm text-muted-foreground">Goal: {originalFormData.goal}</p>
          </div>

          <PlannerRoadmap plan={previewPlan} />
        </div>
      ) : isFormVisible ? (
        <div className="space-y-4">
          <button
            onClick={() => setIsFormVisible(false)}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back to saved plans
          </button>
          <PlannerForm onSubmit={handleGeneratePlan} isLoading={isGenerating} />
        </div>
      ) : selectedPlan ? (
        // Saved plan details view
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
        <Card className="border-dashed border-2 p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto bg-card/30">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">No Study Plans Found</h3>
            <p className="text-sm text-muted-foreground">
              You haven't generated any study plans yet. Create one now to map out your study goals!
            </p>
          </div>
          <Button onClick={() => setIsFormVisible(true)} className="flex items-center gap-2">
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
                className="bg-card/50 backdrop-blur-md border-border/80 hover:border-primary/50 transition-all flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md"
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
                        className="h-full bg-primary transition-all duration-500"
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
