import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { STATIC_MENU } from "../data/static-menu";

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

/* ── Hook: returns static data instantly ── */

export function useMenu() {
  return useQuery<MenuCategoryData[]>({
    queryKey: [...MENU_KEY],
    queryFn: () => Promise.resolve(STATIC_MENU),
    staleTime: Infinity,
    initialData: STATIC_MENU,
  });
}

/* ── Mutation stubs (admin panel — no-op without backend) ── */

function noopMutation<TData, TVars>(label: string) {
  return useMutation<TData, Error, TVars>({
    mutationFn: () => {
      console.warn(`[static-mode] ${label} is disabled without a backend.`);
      return Promise.reject(new Error("Editing is disabled in static mode."));
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_data: Omit<MenuCategoryData, "id" | "items">) =>
      Promise.reject(new Error("Disabled in static mode")),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_data: Partial<MenuCategoryData> & { id: number }) =>
      Promise.reject(new Error("Disabled in static mode")),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_id: number) =>
      Promise.reject(new Error("Disabled in static mode")),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useCreateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_data: Omit<MenuItemData, "id">) =>
      Promise.reject(new Error("Disabled in static mode")),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_data: Partial<MenuItemData> & { id: number }) =>
      Promise.reject(new Error("Disabled in static mode")),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_id: number) =>
      Promise.reject(new Error("Disabled in static mode")),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}
