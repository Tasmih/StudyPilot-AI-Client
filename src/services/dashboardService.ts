import { apiClient } from "./apiClient";
import { DashboardData } from "@/types/dashboard";

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      // In a fully integrated environment, we would fetch from the backend API:
      // return await apiClient.get<DashboardData>("/dashboard");
      
      // Simulating network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Returning mock data conforming to the DashboardData architecture
      return {
        stats: {
          totalStudyPlans: 12,
          completedTasks: 45,
          studyHours: 120,
          aiConversations: 34,
        },
        progressChart: [
          { day: "Mon", hours: 2, tasksCompleted: 3 },
          { day: "Tue", hours: 4, tasksCompleted: 5 },
          { day: "Wed", hours: 3, tasksCompleted: 4 },
          { day: "Thu", hours: 5, tasksCompleted: 7 },
          { day: "Fri", hours: 2, tasksCompleted: 2 },
          { day: "Sat", hours: 6, tasksCompleted: 8 },
          { day: "Sun", hours: 4, tasksCompleted: 5 },
        ],
        recentActivity: [
          {
            id: "1",
            type: "plan",
            title: "Advanced Calculus Plan Generated",
            description: "AI created a 4-week roadmap.",
            timestamp: "2 hours ago",
          },
          {
            id: "2",
            type: "chat",
            title: "Tutor Chat: Photosynthesis",
            description: "Resolved doubts regarding the Calvin cycle.",
            timestamp: "5 hours ago",
          },
          {
            id: "3",
            type: "item",
            title: "Added Essay Draft",
            description: "History 101 final essay uploaded.",
            timestamp: "1 day ago",
          },
        ],
        insights: [
          {
            id: "1",
            type: "suggestion",
            content: "You've been studying heavily in the evenings. Try shifting complex problem solving to the morning for better retention.",
            impact: "high",
          },
          {
            id: "2",
            type: "tip",
            content: "Use active recall to review your Biology notes.",
            impact: "medium",
          },
        ],
      };
    } catch (error) {
      throw error;
    }
  },
};
