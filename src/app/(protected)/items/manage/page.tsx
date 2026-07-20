import React from "react";
import Link from "next/link";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { ManageItemsList } from "@/features/items/ManageItemsList";
import { Button } from "@/components/ui/button";

export default function ManageItemsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      
      {/* Navigation action */}
      <div className="flex items-center">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/5 font-semibold transition-all">
            <ArrowLeft className="h-4 w-4 text-primary" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0 flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Items</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            My Items is your personal item/task area. You can manually add and manage your own items here. Create and manage your own personal study items, tasks, or notes. These items are separate from Explore templates and AI-generated Study Plans.
          </p>
        </div>
        <Link href="/items/add" className="shrink-0 whitespace-nowrap">
          <Button className="w-full sm:w-auto shrink-0 whitespace-nowrap min-w-[130px] px-5 py-2.5 flex items-center justify-center font-bold">
            <PlusCircle className="mr-2 h-5 w-5 shrink-0" />
            Add Item
          </Button>
        </Link>
      </div>
      
      <ManageItemsList />
    </div>
  );
}
