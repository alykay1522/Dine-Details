/**
 * Static shim for @workspace/api-client-react
 * Replaces all backend API calls with static no-op implementations
 * so the site works without a running Express server or database.
 */

import { useQuery, useMutation } from "@tanstack/react-query";

/* ── Specials ── */

export type Special = {
  id: number;
  title: string;
  description: string;
  price: string | null;
  imageUrl: string | null;
  category: string;
  isActive: boolean;
  featuredDate: string;
};

const SPECIALS_KEY = ["specials"] as const;
const GALLERY_KEY = ["gallery"] as const;
const SPECIALS_STORAGE_KEY = "tlp_specials";

export class ApiError<T = unknown> extends Error {
  readonly status: number;
  readonly data: T | null;

  constructor(status: number, message: string, data: T | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function loadSpecials(): Special[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(SPECIALS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Special[]) : [];
  } catch {
    return [];
  }
}

function saveSpecials(specials: Special[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SPECIALS_STORAGE_KEY, JSON.stringify(specials));
}

function normalizeNewSpecial(data: Partial<Special>, id: number): Special {
  return {
    id,
    title: data.title?.trim() ?? "",
    description: data.description?.trim() ?? "",
    price: data.price ?? null,
    imageUrl: data.imageUrl ?? null,
    category: data.category ?? "daily",
    isActive: data.isActive ?? true,
    featuredDate: data.featuredDate ?? new Date().toISOString().slice(0, 10),
  };
}

export function getListSpecialsQueryKey() {
  return [...SPECIALS_KEY];
}

export function useListSpecials() {
  return useQuery<Special[]>({
    queryKey: [...SPECIALS_KEY],
    queryFn: () => Promise.resolve(loadSpecials()),
    staleTime: Infinity,
  });
}

export function useGetCurrentSpecials() {
  return useQuery<Special[]>({
    queryKey: ["currentSpecials"],
    queryFn: () => {
      const today = new Date().toISOString().slice(0, 10);
      return Promise.resolve(
        loadSpecials().filter((s) => s.isActive && (s.featuredDate === today || s.category === "weekly")),
      );
    },
    staleTime: Infinity,
  });
}

export function useCreateSpecial() {
  return useMutation({
    mutationFn: (vars: { data: Partial<Special> }) => {
      const specials = loadSpecials();
      const nextId = specials.reduce((max, s) => Math.max(max, s.id), 0) + 1;
      const created = normalizeNewSpecial(vars.data, nextId);

      if (!created.title || !created.description) {
        throw new ApiError(400, "Title and description are required.");
      }

      const next = [created, ...specials];
      saveSpecials(next);
      return Promise.resolve(created);
    },
  });
}

export function useUpdateSpecial() {
  return useMutation({
    mutationFn: (vars: { id: number; data: Partial<Special> }) => {
      const specials = loadSpecials();
      const index = specials.findIndex((s) => s.id === vars.id);
      if (index === -1) throw new ApiError(404, "Special not found.");

      const merged = {
        ...specials[index],
        ...vars.data,
      } satisfies Special;

      specials[index] = merged;
      saveSpecials(specials);
      return Promise.resolve(merged);
    },
  });
}

export function useDeleteSpecial() {
  return useMutation({
    mutationFn: (vars: { id: number }) => {
      const specials = loadSpecials();
      const next = specials.filter((s) => s.id !== vars.id);
      saveSpecials(next);
      return Promise.resolve({ ok: true });
    },
  });
}

/* ── Gallery ── */

export type GalleryPhoto = {
  id: number;
  imageUrl: string;
  caption: string | null;
  category: string | null;
  sortOrder: number;
};

export function getListGalleryQueryKey() {
  return [...GALLERY_KEY];
}

export function useListGallery() {
  return useQuery<GalleryPhoto[]>({
    queryKey: [...GALLERY_KEY],
    queryFn: () => Promise.resolve([]),
    staleTime: Infinity,
  });
}

export function useCreateGalleryPhoto() {
  return useMutation({
    mutationFn: (_vars: { data: Partial<GalleryPhoto> }) =>
      Promise.resolve({} as GalleryPhoto),
  });
}

export function useDeleteGalleryPhoto() {
  return useMutation({
    mutationFn: (_vars: { id: number }) => Promise.resolve({ ok: true }),
  });
}
