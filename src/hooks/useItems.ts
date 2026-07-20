import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { itemService } from "@/services/itemService";
import { ItemFormData } from "@/schemas/item";
import { showSuccess, showError } from "@/utils/notifications";

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
      showSuccess("Study item added successfully!");
    },
    onError: (error: any) => {
      showError(error.message || "Failed to add study item.");
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ItemFormData }) => 
      itemService.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      showSuccess("Item updated successfully!");
    },
    onError: (error: any) => {
      showError(error.message || "Failed to update item.");
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => itemService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      showSuccess("Item deleted permanently.");
    },
    onError: (error: any) => {
      showError(error.message || "Failed to delete item.");
    },
  });

  return {
    items: getItemsQuery.data,
    isLoading: getItemsQuery.isLoading,
    isError: getItemsQuery.isError,
    error: getItemsQuery.error,
    createItem: createItemMutation.mutateAsync,
    isCreating: createItemMutation.isPending,
    updateItem: updateItemMutation.mutateAsync,
    isUpdating: updateItemMutation.isPending,
    deleteItem: deleteItemMutation.mutateAsync,
    isDeleting: deleteItemMutation.isPending,
  };
}
