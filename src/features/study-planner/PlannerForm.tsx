"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Target, Calendar as CalendarIcon, Clock, Activity, Wand2 } from "lucide-react";

import { plannerSchema, PlannerFormData } from "@/schemas/planner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";

interface PlannerFormProps {
  onSubmit: (data: PlannerFormData) => Promise<void>;
  isLoading: boolean;
}

export function PlannerForm({ onSubmit, isLoading }: PlannerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlannerFormData>({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      skillLevel: "beginner",
      dailyStudyTime: 2,
    },
  });

  return (
    <Card className="border-0 shadow-xl ring-1 ring-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Wand2 className="mr-3 h-6 w-6 text-primary" />
          Generate Study Plan
        </CardTitle>
        <CardDescription>
          Tell our AI about your learning goals and current schedule to get a personalized roadmap.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Subject Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subject to Master</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="e.g. Advanced Calculus, Python Programming"
                  className="pl-9"
                  disabled={isLoading}
                  {...register("subject")}
                />
              </div>
              {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
            </div>

            {/* Exam Date Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target / Exam Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-9"
                  disabled={isLoading}
                  {...register("examDate")}
                />
              </div>
              {errors.examDate && <p className="text-sm text-destructive">{errors.examDate.message}</p>}
            </div>
            
            {/* Skill Level Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Current Skill Level</label>
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
              {errors.skillLevel && <p className="text-sm text-destructive">{errors.skillLevel.message}</p>}
            </div>

            {/* Daily Study Time Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Daily Study Hours</label>
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
              {errors.dailyStudyTime && <p className="text-sm text-destructive">{errors.dailyStudyTime.message}</p>}
            </div>
          </div>

          {/* Goal Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Primary Goal</label>
            <div className="relative">
              <Target className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                rows={3}
                placeholder="What exactly do you want to achieve? E.g. 'I want to score 90%+ on my final exam and understand machine learning algorithms deeply.'"
                className="flex w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                disabled={isLoading}
                {...register("goal")}
              />
            </div>
            {errors.goal && <p className="text-sm text-destructive">{errors.goal.message}</p>}
          </div>

          <Button 
            type="submit" 
            size="lg"
            className="w-full text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loading size="sm" className="p-0 mr-2" />
                Analyzing requirements...
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
