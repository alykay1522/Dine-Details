import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { STATIC_MENU } from "../data/static-menu";
import { isStaticShimMode } from "@/lib/api-config";
import { apiFetch } from "@/lib/api-fetch";

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
  return useQuery<MenuCategoryData[]>({
    queryKey: [...MENU_KEY],
    queryFn: () =>
      isStaticShimMode() ? Promise.resolve(STATIC_MENU) : fetchMenu(),
    initialData: isStaticShimMode() ? STATIC_MENU : undefined,
    staleTime: isStaticShimMode() ? Infinity : 30_000,
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
