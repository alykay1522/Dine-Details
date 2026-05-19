import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DEFAULT_HOURS_LINE } from "@/data/site-hours";
import { apiFetch } from "@/lib/api-fetch";
import { useApiQueryWithStaticFallback } from "@/lib/use-api-query";

export type SiteSettings = {
  hours_weekday: string;
  hours_weekend: string;
  hours_sunday: string;
  announcement_active: string;
  announcement_title: string;
  announcement_body: string;
  story_text: string;
};

const SETTINGS_KEY = ["settings"] as const;

export const STATIC_SETTINGS: SiteSettings = {
  hours_weekday: DEFAULT_HOURS_LINE,
  hours_weekend: "",
  hours_sunday: "",
  announcement_active: "true",
  announcement_title: "Now Making Homemade Jerky!",
  announcement_body:
    "Little Piggy's own handcrafted beef jerky — bold flavor, made right here in Canyon, TX. Call us for details, flavors & ordering!",
  story_text:
    "Tim and Rene Vogler started This Little Piggy as a food truck with a simple dream — bring bold, satisfying food to the Texas Panhandle. From wings and burgers to pizza and baked potatoes, every dish is made with love at their restaurant on Chaparral Road in Canyon, TX.",
};

async function fetchSettings(): Promise<SiteSettings> {
  return apiFetch<SiteSettings>("/settings");
}

export function useSettings() {
  return useApiQueryWithStaticFallback({
    queryKey: SETTINGS_KEY,
    staticData: STATIC_SETTINGS,
    fetchFn: fetchSettings,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<SiteSettings>) =>
      apiFetch<SiteSettings>("/settings", {
        method: "PUT",
        body: JSON.stringify(updates),
      }),
    onSuccess: (data) => {
      qc.setQueryData(SETTINGS_KEY, data);
    },
  });
}
