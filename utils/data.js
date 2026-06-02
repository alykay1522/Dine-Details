import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const VALID_TYPES = ["specials", "menu", "site", "gallery"];

function publicId(type) {
  return `thislilpiggy/${type}.json`;
}

export async function loadData(type) {
  if (!VALID_TYPES.includes(type)) throw new Error(`Invalid type: ${type}`);
  try {
    const resource = await cloudinary.api.resource(publicId(type), {
      resource_type: "raw",
    });
    const res = await fetch(resource.secure_url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
  } catch (err) {
    if (err?.error?.http_code === 404) return {};
    throw err;
  }
}

export async function saveData(type, content) {
  if (!VALID_TYPES.includes(type)) throw new Error(`Invalid type: ${type}`);
  const jsonString = JSON.stringify(content, null, 2);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: publicId(type), resource_type: "raw", overwrite: true },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(Buffer.from(jsonString, "utf8"));
  });
}
