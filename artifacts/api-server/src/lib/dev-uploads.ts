import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const uploadsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../uploads",
);

export function isDevUploadMode(): boolean {
  return process.env.NODE_ENV === "development";
}

export function getDevUploadsDir(): string {
  return uploadsDir;
}

/** Saves under artifacts/api-server/uploads and returns a path served at /api/uploads/… */
export async function saveDevUpload(
  buffer: Buffer,
  originalName: string,
): Promise<string> {
  await mkdir(uploadsDir, { recursive: true });
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  const safeExt = /^\.(jpe?g|png|gif|webp|avif)$/i.test(ext) ? ext : ".jpg";
  const filename = `${randomUUID()}${safeExt}`;
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/api/uploads/${filename}`;
}
