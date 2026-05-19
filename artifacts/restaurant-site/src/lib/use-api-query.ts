import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { isStaticShimMode } from "./api-config";

/**
 * Fetches from the API when available; falls back to bundled static data so
 * the public site never goes blank when /api is missing or misconfigured.
 */
export function useApiQueryWithStaticFallback<T>({
  queryKey,
  staticData,
  fetchFn,
  staleTime = 30_000,
}: {
  queryKey: readonly unknown[];
  staticData: T;
  fetchFn: () => Promise<T>;
  staleTime?: number;
}) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      if (isStaticShimMode()) return staticData;
      try {
        const data = await fetchFn();
        if (Array.isArray(data) && data.length === 0) return staticData;
        return data;
      } catch (err) {
        console.warn("[api] Using static fallback:", err);
        return staticData;
      }
    },
    placeholderData: staticData,
    staleTime: isStaticShimMode() ? Infinity : staleTime,
  } satisfies UseQueryOptions<T>);
}
