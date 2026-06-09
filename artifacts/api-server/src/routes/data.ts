import { Router, type IRouter, type Request, type Response } from "express";

const VALID_TYPES = ["specials", "menu", "site", "gallery"];
const router: IRouter = Router();

async function getCloudinary() {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;  // Fixed: was CLOUDINARY_SECRET
    if (!cloud_name || !api_key || !api_secret) return null;
    const { v2: cloudinary } = await import("cloudinary");
    cloudinary.config({ cloud_name, api_key, api_secret });
    return cloudinary;
}

router.get("/data/:type", async (req: Request, res: Response) => {
    const { type } = req.params;
    if (!VALID_TYPES.includes(type)) {
          res.status(400).json({ error: "Invalid type" });
          return;
    }
    const cloudinary = await getCloudinary();
    if (!cloudinary) {
          res.status(503).json({ error: "Cloudinary not configured" });
          return;
    }
    try {
          const publicId = `thislilpiggy/${type}.json`;
          const url = cloudinary.url(publicId, { resource_type: "raw", sign_url: false });
          const fetchRes = await fetch(url);
          if (!fetchRes.ok) {
                  if (fetchRes.status === 404) { res.json([]); return; }
                  throw new Error(`Cloudinary fetch failed: ${fetchRes.status}`);
          }
          const data = await fetchRes.json();
          res.json(data);
    } catch (error) {
          console.error("Error loading data:", error);
          res.json([]);
    }
});

router.post("/data/:type", async (req: Request, res: Response) => {
    const { type } = req.params;
    if (!VALID_TYPES.includes(type)) {
          res.status(400).json({ error: "Invalid type" });
          return;
    }
    const cloudinary = await getCloudinary();
    if (!cloudinary) {
          res.status(503).json({ error: "Cloudinary not configured" });
          return;
    }
    try {
          const content = JSON.stringify(req.body);
          const buffer = Buffer.from(content, "utf-8");
          await new Promise<void>((resolve, reject) => {  // Fixed: was Promise>void>
                  const stream = cloudinary.uploader.upload_stream(
                    { public_id: `thislilpiggy/${type}.json`, resource_type: "raw", overwrite: true },
                            (err, result) => {
                                        if (err || !result) reject(err ?? new Error("Upload failed"));
                                        else resolve();
                            }
                          );
                  stream.end(buffer);
          });
          res.json({ success: true });
    } catch (error) {
          console.error("Error saving data:", error);
          res.status(500).json({ error: "Failed to save data" });
    }
});

export default router;
