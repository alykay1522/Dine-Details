import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isStaticShimMode } from "@/lib/api-config";
import { apiFetch } from "@/lib/api-fetch";

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

const STATIC_SETTINGS: SiteSettings = {
  hours_weekday: "Mon–Thu: 11am – 9pm",
  hours_weekend: "Fri–Sat: 11am – 10pm",
  hours_sunday: "Sun: 10am – 8pm",
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
  return useQuery<SiteSettings>({
    queryKey: [...SETTINGS_KEY],
    queryFn: () =>
      isStaticShimMode() ? Promise.resolve(STATIC_SETTINGS) : fetchSettings(),
    initialData: isStaticShimMode() ? STATIC_SETTINGS : undefined,
    staleTime: isStaticShimMode() ? Infinity : 30_000,
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
