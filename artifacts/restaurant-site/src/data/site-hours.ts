/** Default hours shown on site and seeded into the API. */
export const DEFAULT_HOURS_LINE = "Thursday–Sunday: 11am – 8pm";

/** Lines for footer / home when settings are loaded. */
export function getHoursDisplayLines(settings?: {
  hours_weekday?: string;
  hours_weekend?: string;
  hours_sunday?: string;
}): string[] {
  const lines = [
    settings?.hours_weekday?.trim(),
    settings?.hours_weekend?.trim(),
    settings?.hours_sunday?.trim(),
  ].filter((line): line is string => Boolean(line));
  return lines.length > 0 ? lines : [DEFAULT_HOURS_LINE];
}
