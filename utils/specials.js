import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// The RAW JSON file in Cloudinary
const SPECIALS_FILE = "specials.json";
const SPECIALS_FOLDER = "thislilpiggy";
const PUBLIC_ID = `${SPECIALS_FOLDER}/${SPECIALS_FILE}`;

// ------------------------------
// Load specials from Cloudinary
// ------------------------------
export async function loadSpecials() {
  try {
    const file = await cloudinary.api.resource(PUBLIC_ID, {
      resource_type: "raw",
    });

    const url = file.secure_url;
    const res = await fetch(url);
    const json = await res.json();

    return json.specials || [];
  } catch (err) {
    console.error("loadSpecials() failed:", err);
    return [];
  }
}

// ------------------------------
// Save specials back to Cloudinary
// ------------------------------
export async function saveSpecials(specials) {
  try {
    const jsonString = JSON.stringify({ specials }, null, 2);

    await cloudinary.uploader.upload_stream(
      {
        public_id: PUBLIC_ID,
        resource_type: "raw",
        overwrite: true,
      },
      (error) => {
        if (error) {
          console.error("saveSpecials() upload failed:", error);
          throw error;
        }
      }
    ).end(jsonString);

    return true;
  } catch (err) {
    console.error("saveSpecials() failed:", err);
    return false;
  }
}

// ------------------------------
// Get all specials
// ------------------------------
export async function getSpecials() {
  return await loadSpecials();
}

// ------------------------------
// Get one special
// ------------------------------
export async function getSpecial(id) {
  const specials = await loadSpecials();
  return specials.find((s) => s.id === id) || null;
}

// ------------------------------
// Create a new special
// ------------------------------
export async function createSpecial(data) {
  const specials = await loadSpecials();

  const newSpecial = {
    id: crypto.randomUUID(),
    title: data.title || "",
    description: data.description || "",
    price: data.price || "",
    day: data.day || "",
    image: data.image || "",
    createdAt: Date.now(),
  };

  specials.push(newSpecial);
  await saveSpecials(specials);

  return newSpecial;
}

// ------------------------------
// Update a special
// ------------------------------
export async function updateSpecial(id, data) {
  const specials = await loadSpecials();
  const index = specials.findIndex((s) => s.id === id);

  if (index === -1) return null;

  specials[index] = {
    ...specials[index],
    ...data,
    updatedAt: Date.now(),
  };

  await saveSpecials(specials);
  return specials[index];
}

// ------------------------------
// Delete a special
// ------------------------------
export async function deleteSpecial(id) {
  const specials = await loadSpecials();
  const filtered = specials.filter((s) => s.id !== id);

  await saveSpecials(filtered);

  return { deleted: id };
}

// ------------------------------
// Get today's special
// ------------------------------
export async function getCurrentSpecial() {
  const specials = await loadSpecials();

  const today = new Date().toLocaleString("en-US", {
    weekday: "long",
  });

  return specials.find((s) => s.day === today) || null;
}

// ------------------------------
// Force re-sync (manual trigger)
// ------------------------------
export async function syncSpecials() {
  const specials = await loadSpecials();
  await saveSpecials(specials);
  return { count: specials.length };
}
