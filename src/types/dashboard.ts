export interface DashboardStats {
  totalStudyPlans: number;
  completedTasks: number;
  studyHours: number;
  aiConversations: number;
}

export interface ProgressDataPoint {
  day: string;
  hours: number;
  tasksCompleted: number;
}

export interface RecentActivity {
  id: string;
  type: "plan" | "chat" | "item";
  title: string;
  description: string;
  timestamp: string;
}

export interface AIInsight {
  id: string;
  type: "suggestion" | "tip" | "recommendation";
  content: string;
  impact: "high" | "medium" | "low";
}

export interface DashboardData {
  stats: DashboardStats;
  progressChart: ProgressDataPoint[];
  recentActivity: RecentActivity[];
  insights: AIInsight[];
}
