import { Router, type IRouter } from "express";
import { db, settingsTable } from "@workspace/db";

const router: IRouter = Router();

const DEFAULTS: Record<string, string> = {
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

async function ensureDefaults() {
  const existing = await db.select().from(settingsTable);
  const existingKeys = new Set(existing.map((s) => s.key));
  const missing = Object.entries(DEFAULTS).filter(([k]) => !existingKeys.has(k));
  if (missing.length > 0) {
    await db.insert(settingsTable).values(
      missing.map(([key, value]) => ({ key, value, updatedAt: new Date() }))
    );
  }
}

router.get("/settings", async (_req, res): Promise<void> => {
  await ensureDefaults();
  const rows = await db.select().from(settingsTable);
  const obj = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  res.json(obj);
});

router.put("/settings", async (req, res): Promise<void> => {
  const updates = req.body as Record<string, string>;
  if (!updates || typeof updates !== "object") {
    res.status(400).json({ error: "Body must be a JSON object" });
    return;
  }
  for (const [key, value] of Object.entries(updates)) {
    if (typeof value !== "string") continue;
    await db
      .insert(settingsTable)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: settingsTable.key,
        set: { value, updatedAt: new Date() },
      });
  }
  const rows = await db.select().from(settingsTable);
  const obj = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  res.json(obj);
});

export default router;
