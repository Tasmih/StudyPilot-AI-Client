import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { itemService } from "@/services/itemService";
import { ItemFormData } from "@/schemas/item";
import { toast } from "react-toastify";

export function useItems() {
  const queryClient = useQueryClient();

  const getItemsQuery = useQuery({
    queryKey: ["items"],
    queryFn: () => itemService.getItems(),
  });

  const createItemMutation = useMutation({
    mutationFn: (data: ItemFormData) => itemService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Study item added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add study item.");
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => itemService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item deleted permanently.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete item.");
    },
  });

  return {
    items: getItemsQuery.data,
    isLoading: getItemsQuery.isLoading,
    isError: getItemsQuery.isError,
    error: getItemsQuery.error,
    createItem: createItemMutation.mutateAsync,
    isCreating: createItemMutation.isPending,
    deleteItem: deleteItemMutation.mutateAsync,
    isDeleting: deleteItemMutation.isPending,
  };
}
