import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Failed to load settings");
  return res.json();
}

async function putSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to save settings");
  return res.json();
}

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: fetchSettings,
    staleTime: 60_000,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: putSettings,
    onSuccess: (data) => {
      qc.setQueryData(SETTINGS_KEY, data);
    },
  });
}
