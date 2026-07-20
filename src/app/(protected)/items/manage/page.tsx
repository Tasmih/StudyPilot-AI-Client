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
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Items</h1>
          <p className="text-muted-foreground">
            View, filter, and organize all your study materials and tasks.
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
