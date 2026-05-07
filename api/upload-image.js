export const config = { api: { bodyParser: false } };

import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload failed" });

    const file = files.file.filepath;

    const upload = await cloudinary.uploader.upload(file, {
      folder: "piggy"
    });

    res.status(200).json({ url: upload.secure_url });
  });
}
