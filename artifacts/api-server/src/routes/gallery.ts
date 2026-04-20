import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, galleryTable } from "@workspace/db";
import {
  CreateGalleryPhotoBody,
  DeleteGalleryPhotoParams,
  ListGalleryResponse,
  ListGalleryResponseItem,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/gallery", async (_req, res): Promise<void> => {
  const photos = await db
    .select()
    .from(galleryTable)
    .orderBy(asc(galleryTable.sortOrder), asc(galleryTable.createdAt));

  const mapped = photos.map((p) => ({
    ...p,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
  }));

  res.json(ListGalleryResponse.parse(mapped));
});

router.post("/gallery", async (req, res): Promise<void> => {
  const parsed = CreateGalleryPhotoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [photo] = await db
    .insert(galleryTable)
    .values({
      imageUrl: parsed.data.imageUrl,
      caption: parsed.data.caption ?? null,
      category: parsed.data.category ?? null,
      sortOrder: parsed.data.sortOrder,
    })
    .returning();

  const mapped = {
    ...photo,
    createdAt: photo.createdAt instanceof Date ? photo.createdAt.toISOString() : String(photo.createdAt),
  };

  res.status(201).json(ListGalleryResponseItem.parse(mapped));
});

router.delete("/gallery/:id", async (req, res): Promise<void> => {
  const params = DeleteGalleryPhotoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(galleryTable)
    .where(eq(galleryTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Photo not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
