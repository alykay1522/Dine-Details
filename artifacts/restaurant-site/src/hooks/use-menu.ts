import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { STATIC_MENU } from "../data/static-menu";
import { apiFetch } from "@/lib/api-fetch";
import { useApiQueryWithStaticFallback } from "@/lib/use-api-query";

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
  return apiFetch<MenuCategoryData[]>("/menu");
}

export function useMenu() {
  return useApiQueryWithStaticFallback({
    queryKey: MENU_KEY,
    staticData: STATIC_MENU,
    fetchFn: fetchMenu,
  });
}

/** Admin editor — always hits the API (no static fallback). */
export function useMenuAdmin() {
  return useQuery({
    queryKey: [...MENU_KEY, "admin"] as const,
    queryFn: fetchMenu,
    retry: 1,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MenuCategoryData, "id" | "items">) =>
      apiFetch<MenuCategoryData>("/menu/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<MenuCategoryData> & { id: number }) => {
      const { id, ...body } = data;
      return apiFetch<MenuCategoryData>(`/menu/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<{ ok: boolean }>(`/menu/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useCreateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MenuItemData, "id">) =>
      apiFetch<MenuItemData>("/menu/items", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<MenuItemData> & { id: number }) => {
      const { id, ...body } = data;
      return apiFetch<MenuItemData>(`/menu/items/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<{ ok: boolean }>(`/menu/items/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}
