import React from "react";
import { AddItemForm } from "@/features/items/AddItemForm";

export default function AddItemPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Add Study Item</h1>
        <p className="text-muted-foreground">
          Create a new task, document link, or assignment to track in your hub.
        </p>
      </div>
      
      <AddItemForm />
    </div>
  );
}
