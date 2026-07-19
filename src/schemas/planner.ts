import { z } from "zod";

export const plannerSchema = z.object({
  subject: z.string().min(2, "Subject must be at least 2 characters."),
  goal: z.string().min(10, "Please describe your goal in more detail."),
  examDate: z.string().min(1, "Please select an exam date."),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"], {
    message: "Please select your current skill level.",
  }),
  dailyStudyTime: z.number().min(1, "You must study for at least 1 hour.").max(24, "Invalid study time."),
  preferredStudyDays: z.array(z.string()).optional(),
  weakTopics: z.string().optional(),
  strongTopics: z.string().optional(),
  preferredLearningStyle: z.enum(["visual", "auditory", "readwrite", "kinesthetic", "standard"], {
    message: "Please select your learning style.",
  }).optional(),
  additionalInstructions: z.string().optional(),
  planLength: z.enum(["short", "standard", "detailed"], {
    message: "Please select a plan length.",
  }),
});

export type PlannerFormData = z.infer<typeof plannerSchema>;

// Mock Response Type for AI Roadmap
export interface StudyTask {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  completed?: boolean;
}

export interface RoadmapPhase {
  phaseName: string;
  tasks: StudyTask[];
}

export interface PlannerResponse {
  roadmap: RoadmapPhase[];
  dailySchedule: string[];
  revisionStrategy: string;
}
