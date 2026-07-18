"use client";

import React, { useState } from "react";
import { PlannerForm } from "@/features/study-planner/PlannerForm";
import { PlannerRoadmap } from "@/features/study-planner/PlannerRoadmap";
import { PlannerFormData, PlannerResponse } from "@/schemas/planner";
import { toast } from "react-toastify";

export default function PlannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState<PlannerResponse | null>(null);

  const handleGeneratePlan = async (data: PlannerFormData) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual backend API call
      // const response = await apiClient.post<PlannerResponse>("/ai/planner", data);
      
      // Simulating AI generation delay
      await new Promise((resolve) => setTimeout(resolve, 2500));
      
      // Simulated response matching the requested schema
      const mockResponse: PlannerResponse = {
        roadmap: [
          {
            phaseName: "Phase 1: Foundations & Core Concepts",
            tasks: [
              {
                id: "1",
                title: "Understand the Basics",
                description: "Read introductory chapters and memorize key terminology.",
                estimatedHours: 4,
              },
              {
                id: "2",
                title: "Practice Exercises",
                description: "Complete foundational exercises to solidify understanding.",
                estimatedHours: 6,
              },
            ],
          },
          {
            phaseName: "Phase 2: Advanced Application",
            tasks: [
              {
                id: "3",
                title: "Complex Problem Solving",
                description: "Tackle advanced scenarios and case studies.",
                estimatedHours: 8,
              },
              {
                id: "4",
                title: "Mock Assessment",
                description: "Take a timed practice test covering all previous materials.",
                estimatedHours: 3,
              },
            ],
          },
        ],
        dailySchedule: [
          `Allocate ${data.dailyStudyTime} hours strictly to deep work without distractions.`,
          "First 30 mins: Review notes from the previous day.",
          "Middle blocks (45 min each): Focus on new material and active recall.",
          "Last 15 mins: Summarize what you learned today.",
        ],
        revisionStrategy: "Implement spaced repetition by reviewing difficult concepts 1 day, 3 days, and 1 week after first learning them. Focus heavily on practice testing rather than passive reading.",
      };

      setStudyPlan(mockResponse);
      toast.success("AI Study Plan generated successfully!");
      
    } catch (error: any) {
      toast.error(error.message || "Failed to generate study plan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Study Planner</h1>
        <p className="text-muted-foreground mt-2">
          Let our AI analyze your goals and generate a custom-tailored learning roadmap.
        </p>
      </div>

      {!studyPlan ? (
        <PlannerForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => setStudyPlan(null)}
            className="text-sm font-medium text-primary hover:underline"
          >
            &larr; Generate a new plan
          </button>
          <PlannerRoadmap plan={studyPlan} />
        </div>
      )}
    </div>
  );
}
