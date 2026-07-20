"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Trash2, Calendar, LayoutList, Tag, Pencil } from "lucide-react";
import { useItems } from "@/hooks/useItems";
import { StudyItem } from "@/schemas/item";
import { Loading } from "@/components/ui/loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { confirmDelete } from "@/utils/notifications";
import Link from "next/link";

export function ManageItemsList() {
  const { items, isLoading, isError, deleteItem, isDeleting } = useItems();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loading size="lg" className="text-primary" />
      </div>
    );
  }

  if (isError || !items) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-destructive">
        <p>Failed to load items. Please try again.</p>
      </div>
    );
  }

  const handleDelete = async (id: string, title: string) => {
    const isConfirmed = await confirmDelete(
      "Are you sure?",
      `Do you really want to delete "${title}"? This action cannot be undone.`
    );
    if (isConfirmed) {
      deleteItem(id);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search items..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Literature">Literature</option>
            <option value="Programming">Programming</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center bg-card/30">
          <LayoutList className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No items found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border-0 shadow-md ring-1 ring-border/50 flex flex-col group hover:shadow-lg transition-shadow">
                  {item.imageUrl && (
                    <div className="h-32 w-full overflow-hidden rounded-t-xl bg-muted">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/600x400/1E293B/F8FAFC?text=Study+Material";
                        }}
                      />
                    </div>
                  )}
                  <CardContent className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground">
                        {item.title}
                      </h3>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0",
                        item.priority === "High" ? "bg-destructive/10 text-destructive" :
                        item.priority === "Medium" ? "bg-accent/10 text-accent" :
                        "bg-secondary/10 text-secondary"
                      )}>
                        {item.priority}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                      {item.description}
                    </p>
                    
                    <div className="mt-auto space-y-3 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                        <span className="flex items-center">
                          <Tag className="mr-1.5 h-3.5 w-3.5" />
                          {item.category}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="mr-1.5 h-3.5 w-3.5" />
                          {item.date}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <Link href={`/items/edit/${item.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-xs font-semibold"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isDeleting}
                          onClick={() => handleDelete(item.id, item.title)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
