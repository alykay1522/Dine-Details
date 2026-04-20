import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type MenuItemData = {
  id: number;
  categoryId: number;
  name: string;
  description?: string | null;
  price?: string | null;
  note?: string | null;
  sortOrder: number;
};

export type MenuCategoryData = {
  id: number;
  name: string;
  subtitle?: string | null;
  icon?: string | null;
  color: string;
  sortOrder: number;
  items: MenuItemData[];
};

const MENU_KEY = ["menu"] as const;

async function fetchMenu(): Promise<MenuCategoryData[]> {
  const res = await fetch("/api/menu");
  if (!res.ok) throw new Error("Failed to load menu");
  return res.json();
}

export function useMenu() {
  return useQuery({ queryKey: MENU_KEY, queryFn: fetchMenu, staleTime: 30_000 });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MenuCategoryData, "id" | "items">) =>
      fetch("/api/menu/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<MenuCategoryData> & { id: number }) =>
      fetch(`/api/menu/categories/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/menu/categories/${id}`, { method: "DELETE" }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useCreateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MenuItemData, "id">) =>
      fetch("/api/menu/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<MenuItemData> & { id: number }) =>
      fetch(`/api/menu/items/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/menu/items/${id}`, { method: "DELETE" }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}
