import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, specialsTable } from "@workspace/db";
import {
  CreateSpecialBody,
  UpdateSpecialBody,
  GetSpecialParams,
  UpdateSpecialParams,
  DeleteSpecialParams,
  ListSpecialsResponse,
  GetCurrentSpecialsResponse,
  GetSpecialResponse,
  UpdateSpecialResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapSpecial(s: typeof specialsTable.$inferSelect) {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    price: s.price ?? null,
    imageUrl: s.imageUrl ?? null,
    category: s.category,
    isActive: s.isActive,
    featuredDate: String(s.featuredDate),
    createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : String(s.createdAt),
  };
}

router.get("/specials", async (_req, res): Promise<void> => {
  const specials = await db
    .select()
    .from(specialsTable)
    .orderBy(desc(specialsTable.featuredDate));

  res.json(ListSpecialsResponse.parse(specials.map(mapSpecial)));
});

router.get("/specials/current", async (_req, res): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];

  const specials = await db
    .select()
    .from(specialsTable)
    .where(eq(specialsTable.isActive, true))
    .orderBy(desc(specialsTable.featuredDate));

  const current = specials.filter((s) => {
    const date = String(s.featuredDate);
    return date === today || s.category === "weekly";
  });

  res.json(GetCurrentSpecialsResponse.parse(current.map(mapSpecial)));
});

router.get("/specials/:id", async (req, res): Promise<void> => {
  const params = GetSpecialParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [special] = await db
    .select()
    .from(specialsTable)
    .where(eq(specialsTable.id, params.data.id));

  if (!special) {
    res.status(404).json({ error: "Special not found" });
    return;
  }

  res.json(GetSpecialResponse.parse(mapSpecial(special)));
});

router.post("/specials", async (req, res): Promise<void> => {
  const parsed = CreateSpecialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [special] = await db
    .insert(specialsTable)
    .values({
      title: parsed.data.title,
      description: parsed.data.description,
      price: parsed.data.price ?? null,
      imageUrl: parsed.data.imageUrl ?? null,
      category: parsed.data.category,
      isActive: parsed.data.isActive,
      featuredDate: parsed.data.featuredDate,
    })
    .returning();

  res.status(201).json(GetSpecialResponse.parse(mapSpecial(special)));
});

router.put("/specials/:id", async (req, res): Promise<void> => {
  const params = UpdateSpecialParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateSpecialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateValues: Partial<typeof specialsTable.$inferInsert> = {};
  if (parsed.data.title !== undefined) updateValues.title = parsed.data.title;
  if (parsed.data.description !== undefined) updateValues.description = parsed.data.description;
  if (parsed.data.price !== undefined) updateValues.price = parsed.data.price ?? null;
  if (parsed.data.imageUrl !== undefined) updateValues.imageUrl = parsed.data.imageUrl ?? null;
  if (parsed.data.category !== undefined) updateValues.category = parsed.data.category;
  if (parsed.data.isActive !== undefined) updateValues.isActive = parsed.data.isActive;
  if (parsed.data.featuredDate !== undefined) updateValues.featuredDate = parsed.data.featuredDate;

  const [special] = await db
    .update(specialsTable)
    .set(updateValues)
    .where(eq(specialsTable.id, params.data.id))
    .returning();

  if (!special) {
    res.status(404).json({ error: "Special not found" });
    return;
  }

  res.json(UpdateSpecialResponse.parse(mapSpecial(special)));
});

router.delete("/specials/:id", async (req, res): Promise<void> => {
  const params = DeleteSpecialParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(specialsTable)
    .where(eq(specialsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Special not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
