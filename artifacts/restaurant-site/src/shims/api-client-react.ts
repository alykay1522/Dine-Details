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

export function getListSpecialsQueryKey() {
  return [...SPECIALS_KEY];
}

export function useListSpecials() {
  return useQuery<Special[]>({
    queryKey: [...SPECIALS_KEY],
    queryFn: () => Promise.resolve([]),
    staleTime: Infinity,
  });
}

export function useGetCurrentSpecials() {
  return useQuery<Special[]>({
    queryKey: ["currentSpecials"],
    queryFn: () => Promise.resolve([]),
    staleTime: Infinity,
  });
}

export function useCreateSpecial() {
  return useMutation({
    mutationFn: (_vars: { data: Partial<Special> }) =>
      Promise.resolve({} as Special),
  });
}

export function useUpdateSpecial() {
  return useMutation({
    mutationFn: (_vars: { id: number; data: Partial<Special> }) =>
      Promise.resolve({} as Special),
  });
}

export function useDeleteSpecial() {
  return useMutation({
    mutationFn: (_vars: { id: number }) => Promise.resolve({ ok: true }),
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
