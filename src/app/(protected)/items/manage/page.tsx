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
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Items</h1>
          <p className="text-muted-foreground text-sm">
            Offline Sandbox: View, filter, and organize offline study materials or files. This is a standalone list stored locally in your browser (does not affect your AI-generated MongoDB study plans).
          </p>
        </div>
        <Link href="/items/add">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Item
          </Button>
        </Link>
      </div>
      
      <ManageItemsList />
    </div>
  );
}
