import { Router, type IRouter } from "express";
import multer from "multer";
import { isDevUploadMode, saveDevUpload } from "../lib/dev-uploads";

const router: IRouter = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});

async function getConfiguredCloudinary() {
    const {
          CLOUDINARY_CLOUD_NAME,
          CLOUDINARY_API_KEY,
          CLOUDINARY_API_SECRET,  // Fixed: was CLOUDINARY_SECRET (wrong name)
    } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
          return null;
    }
    if (process.env.CLOUDINARY_URL?.includes(">")) {
          delete process.env.CLOUDINARY_URL;
    }
    const { v2: cloudinary } = await import("cloudinary");
    cloudinary.config({
          cloud_name: CLOUDINARY_CLOUD_NAME,
          api_key: CLOUDINARY_API_KEY,
          api_secret: CLOUDINARY_API_SECRET,  // Fixed: was CLOUDINARY_SECRET
    });
    return cloudinary;
}

/** Multipart image upload for admin gallery (Vercel / Cloudinary). */
router.post("/upload-image", upload.single("file"), async (req, res): Promise<void> => {
    const file = req.file;
  if (!file) {
        res.status(400).json({ error: "No file provided. Use field name 'file'." });
        return;
  }
  const cloudinary = await getConfiguredCloudinary();
  if (!cloudinary) {
        if (isDevUploadMode()) {
                try {
                          const url = await saveDevUpload(file.buffer, file.originalname);
                          res.json({ url });
                          return;
                } catch (error) {
                          console.error("Dev upload save failed", error);
                          res.status(500).json({ error: "Upload failed" });
                          return;
                }
        }
        res.status(503).json({
                error: "Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Vercel.",
        });
        return;
  }
  try {
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { folder: "piggy", resource_type: "image" },
                          (err, uploaded) => {
                                      if (err || !uploaded?.secure_url) {
                                                    reject(err ?? new Error("Upload failed"));
                                                    return;
                                      }
                                      resolve({ secure_url: uploaded.secure_url });
                          },
                        );
                stream.end(file.buffer);
        });
        res.json({ url: result.secure_url });
  } catch (error) {
        console.error("Cloudinary upload failed", error);
        res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
