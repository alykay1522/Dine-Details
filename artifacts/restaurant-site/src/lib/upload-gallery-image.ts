import { apiUrl } from "./api-config";

/** Upload a gallery image via Cloudinary-backed API route. */
export async function uploadGalleryImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(apiUrl("/upload-image"), {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Upload failed (${res.status})`);
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) {
    throw new Error("Upload succeeded but no image URL was returned.");
  }
  return data.url;
}
