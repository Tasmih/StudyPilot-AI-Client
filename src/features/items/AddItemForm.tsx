"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { PlusCircle, Link as LinkIcon, FileText, LayoutList, Calendar as CalendarIcon, Tag, Loader2 } from "lucide-react";

import { itemSchema, ItemFormData } from "@/schemas/item";
import { useItems } from "@/hooks/useItems";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AddItemForm() {
  const router = useRouter();
  const { createItem, isCreating } = useItems();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      category: "Math",
      priority: "Medium",
    },
  });

  const onSubmit = async (data: ItemFormData) => {
    try {
      await createItem(data);
      reset();
      router.push("/items");
    } catch (error) {
      // Handled by global toast inside useItems hook
    }
  };

  return (
    <Card className="border-0 shadow-xl ring-1 ring-border/50 max-w-3xl mx-auto bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <PlusCircle className="mr-3 h-6 w-6 text-primary" />
          Add New Study Item
        </CardTitle>
        <CardDescription>
          Record a new assignment, resource, or study material to your learning hub.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="e.g. Chapter 4 Math Homework"
                className="pl-9"
                disabled={isCreating}
                {...register("title")}
              />
            </div>
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              rows={4}
              placeholder="Detailed description of the study material or task..."
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
              disabled={isCreating}
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <div className="relative">
                <LayoutList className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                  disabled={isCreating}
                  {...register("category")}
                >
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Literature">Literature</option>
                  <option value="Programming">Programming</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Priority</label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                  disabled={isCreating}
                  {...register("priority")}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-9"
                  disabled={isCreating}
                  {...register("date")}
                />
              </div>
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Image/Resource URL (Optional)</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://example.com/resource"
                  className="pl-9"
                  disabled={isCreating}
                  {...register("imageUrl")}
                />
              </div>
              {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg"
            className="w-full text-base font-semibold"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving Item...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Study Item
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
