"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Target, Calendar as CalendarIcon, Clock, Activity, Wand2, Compass, CheckSquare, Sparkles } from "lucide-react";

import { plannerSchema, PlannerFormData } from "@/schemas/planner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";

interface PlannerFormProps {
  onSubmit: (data: PlannerFormData) => Promise<void>;
  isLoading: boolean;
}

const studyDaysList = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" }
];

export function PlannerForm({ onSubmit, isLoading }: PlannerFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlannerFormData>({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      skillLevel: "beginner",
      dailyStudyTime: 2,
      preferredLearningStyle: "standard",
      planLength: "standard",
      preferredStudyDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  });

  const selectedDays = watch("preferredStudyDays") || [];

  const handleDayToggle = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      setValue("preferredStudyDays", selectedDays.filter(d => d !== dayId));
    } else {
      setValue("preferredStudyDays", [...selectedDays, dayId]);
    }
  };

  return (
    <Card className="border-0 shadow-xl ring-1 ring-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl text-foreground font-bold">
          <Wand2 className="mr-3 h-6 w-6 text-primary" />
          Generate Personalized Study Plan
        </CardTitle>
        <CardDescription>
          Configure details on your subject, goals, availability, and learning preferences for our AI model.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Subject Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Subject to Master</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="e.g. Advanced Calculus, Node.js API Design"
                  className="pl-9"
                  disabled={isLoading}
                  {...register("subject")}
                />
              </div>
              {errors.subject && <p className="text-xs text-destructive font-medium">{errors.subject.message}</p>}
            </div>

            {/* Exam Date Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Target / Exam Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-9"
                  disabled={isLoading}
                  {...register("examDate")}
                />
              </div>
              {errors.examDate && <p className="text-xs text-destructive font-medium">{errors.examDate.message}</p>}
            </div>
            
            {/* Skill Level Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Current Skill Level</label>
              <div className="relative">
                <Activity className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                  disabled={isLoading}
                  {...register("skillLevel")}
                >
                  <option value="beginner">Beginner (Starting from scratch)</option>
                  <option value="intermediate">Intermediate (Know the basics)</option>
                  <option value="advanced">Advanced (Looking for mastery)</option>
                </select>
              </div>
              {errors.skillLevel && <p className="text-xs text-destructive font-medium">{errors.skillLevel.message}</p>}
            </div>

            {/* Daily Study Time Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Daily Study Hours</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="1"
                  max="24"
                  placeholder="Hours per day"
                  className="pl-9"
                  disabled={isLoading}
                  {...register("dailyStudyTime", { valueAsNumber: true })}
                />
              </div>
              {errors.dailyStudyTime && <p className="text-xs text-destructive font-medium">{errors.dailyStudyTime.message}</p>}
            </div>

            {/* Preferred Learning Style Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Preferred Learning Style</label>
              <div className="relative">
                <Compass className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                  disabled={isLoading}
                  {...register("preferredLearningStyle")}
                >
                  <option value="standard">Standard (Mixed Visual & Practical)</option>
                  <option value="visual">Visual (Diagrams & Flowcharts)</option>
                  <option value="auditory">Auditory (Lectures & Explanations)</option>
                  <option value="readwrite">Reading / Writing (Summaries & Text)</option>
                  <option value="kinesthetic">Kinesthetic (Practical Labs & Exercises)</option>
                </select>
              </div>
              {errors.preferredLearningStyle && <p className="text-xs text-destructive font-medium">{errors.preferredLearningStyle.message}</p>}
            </div>

            {/* Plan Length Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Plan Detail Level</label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                  disabled={isLoading}
                  {...register("planLength")}
                >
                  <option value="short">Short Roadmap (2 core phases)</option>
                  <option value="standard">Standard Roadmap (3 core phases)</option>
                  <option value="detailed">Detailed Roadmap (5 detailed phases)</option>
                </select>
              </div>
              {errors.planLength && <p className="text-xs text-destructive font-medium">{errors.planLength.message}</p>}
            </div>
          </div>

          {/* Preferred Study Days Checkboxes */}
          <div className="space-y-2 border-t pt-4">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <CheckSquare className="h-4.5 w-4.5 text-primary" />
              Preferred Study Days
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {studyDaysList.map((day) => {
                const isChecked = selectedDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleDayToggle(day.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      isChecked 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weak / Strong Topics */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 border-t pt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Weak Topics (Needs heavy focus)</label>
              <textarea
                rows={2}
                placeholder="List topics you find difficult, comma-separated (e.g. recursion, data structures)"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                disabled={isLoading}
                {...register("weakTopics")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Strong Topics (Fast-track cover)</label>
              <textarea
                rows={2}
                placeholder="List topics you are confident in, comma-separated (e.g. OOP, general databases)"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                disabled={isLoading}
                {...register("strongTopics")}
              />
            </div>
          </div>

          {/* Goal Field */}
          <div className="space-y-2 border-t pt-4">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Target className="h-4.5 w-4.5 text-accent" />
              Primary Goal
            </label>
            <textarea
              rows={3}
              placeholder="What exactly do you want to achieve? E.g. 'I want to score 90%+ on my final exam and understand machine learning algorithms deeply.'"
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
              disabled={isLoading}
              {...register("goal")}
            />
            {errors.goal && <p className="text-xs text-destructive font-medium">{errors.goal.message}</p>}
          </div>

          {/* Additional Instructions */}
          <div className="space-y-2 border-t pt-4">
            <label className="text-sm font-semibold text-foreground">Additional Instructions (Optional)</label>
            <textarea
              rows={3}
              placeholder="E.g. 'Please prioritize weekend studies and structure tasks as practical hands-on labs.'"
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
              disabled={isLoading}
              {...register("additionalInstructions")}
            />
          </div>

          <Button 
            type="submit" 
            size="lg"
            className="w-full text-base font-semibold pt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loading size="sm" className="p-0 mr-2" />
                Analyzing and constructing roadmap...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                Generate AI Study Plan
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
