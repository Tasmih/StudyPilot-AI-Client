"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { Pencil, Link as LinkIcon, FileText, LayoutList, Calendar as CalendarIcon, Tag, Loader2, ArrowLeft, AlertCircle } from "lucide-react";

import { itemSchema, ItemFormData } from "@/schemas/item";
import { useItems } from "@/hooks/useItems";
import { itemService } from "@/services/itemService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { updateItem, isUpdating } = useItems();
  const [isLoadingItem, setIsLoadingItem] = useState(true);
  const [itemError, setItemError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
  });

  useEffect(() => {
    async function loadItem() {
      try {
        setIsLoadingItem(true);
        setItemError(null);
        const item = await itemService.getItem(id);
        reset({
          title: item.title,
          description: item.description,
          category: item.category,
          priority: item.priority,
          date: item.date,
          imageUrl: item.imageUrl || "",
        });
      } catch (err: any) {
        console.error("Error loading item for edit:", err);
        setItemError(err.message || "Failed to load the study item details.");
      } finally {
        setIsLoadingItem(false);
      }
    }
    if (id) {
      loadItem();
    }
  }, [id, reset]);

  const onSubmit = async (data: ItemFormData) => {
    try {
      await updateItem({ id, data });
      router.push("/items/manage");
    } catch (error) {
      // Error notifications handled centrally in the useItems hook
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      
      {/* Back navigation link */}
      <div className="flex items-center">
        <Link href="/items/manage">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Manage Items
          </Button>
        </Link>
      </div>

      {isLoadingItem ? (
        <Card className="border-0 shadow-xl ring-1 ring-border/50 max-w-3xl mx-auto bg-card/50 backdrop-blur-sm p-12 text-center flex flex-col items-center justify-center space-y-4">
          <Loading size="lg" className="text-primary" />
          <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading item details...</p>
        </Card>
      ) : itemError ? (
        <Card className="border-destructive/30 text-center max-w-md mx-auto shadow-lg bg-card/50">
          <CardContent className="pt-10 pb-10 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">Could Not Load Item</h3>
              <p className="text-sm text-muted-foreground">{itemError}</p>
            </div>
            <Link href="/items/manage" className="block pt-2">
              <Button>Return to List</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-xl ring-1 ring-border/50 max-w-3xl mx-auto bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-foreground">
              <Pencil className="mr-3 h-5.5 w-5.5 text-primary" />
              Edit Study Item
            </CardTitle>
            <CardDescription>
              Update your study material, priority constraints, or resource target dates.
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
                    className="pl-9 text-foreground"
                    disabled={isUpdating}
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
                  disabled={isUpdating}
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
                      disabled={isUpdating}
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
                      disabled={isUpdating}
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
                      className="pl-9 text-foreground"
                      disabled={isUpdating}
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
                      className="pl-9 text-foreground"
                      disabled={isUpdating}
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
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Updating Item...
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Update Study Item
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
