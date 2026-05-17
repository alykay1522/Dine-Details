import { Router, type IRouter } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router: IRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return false;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  return true;
}

/** Multipart image upload for admin gallery (Vercel / Cloudinary). */
router.post("/upload-image", upload.single("file"), async (req, res): Promise<void> => {
  if (!configureCloudinary()) {
    res.status(503).json({
      error:
        "Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    });
    return;
  }

  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No file provided. Use field name 'file'." });
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
