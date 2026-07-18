import { z } from "zod";

export const itemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.enum(["Math", "Science", "History", "Literature", "Programming", "Other"], {
    message: "Please select a valid category.",
  }),
  priority: z.enum(["Low", "Medium", "High"], {
    message: "Please select a priority level.",
  }),
  date: z.string().min(1, "Please select a date."),
  imageUrl: z.string().url("Please provide a valid image URL.").optional().or(z.literal("")),
});

export type ItemFormData = z.infer<typeof itemSchema>;

export interface StudyItem extends ItemFormData {
  id: string;
  createdAt: string;
  userId: string;
}
