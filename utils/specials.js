import { v2 as cloudinary } from "cloudinary";

const PUBLIC_ID = "thislilpiggy/specials.json";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    const jsonString = JSON.stringify({ specials }, null, 2);
    return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
                      public_id: PUBLIC_ID,
                      resource_type: "raw",
                      overwrite: true,
            },
                  (error, result) => {
                            if (error) {
                                        console.error("saveSpecials() upload failed:", error);
                                        reject(error);
                            } else {
                                        resolve(result);
                            }
                  }
                );
          stream.end(jsonString);
    });
}

// ------------------------------
// CRUD helpers
// ------------------------------
export async function getSpecials() {
    return loadSpecials();
}

export async function getSpecial(id) {
    const specials = await loadSpecials();
    return specials.find((s) => s.id === id) || null;
}

export async function createSpecial(data) {
    const specials = await loadSpecials();
    const newSpecial = {
          id: crypto.randomUUID(),
          ...data,
          createdAt: new Date().toISOString(),
    };
    specials.push(newSpecial);
    await saveSpecials(specials);
    return newSpecial;
}

export async function updateSpecial(id, data) {
    const specials = await loadSpecials();
    const index = specials.findIndex((s) => s.id === id);
    if (index === -1) throw new Error(`Special ${id} not found`);
    specials[index] = { ...specials[index], ...data, updatedAt: new Date().toISOString() };
    await saveSpecials(specials);
    return specials[index];
}

export async function deleteSpecial(id) {
    const specials = await loadSpecials();
    const index = specials.findIndex((s) => s.id === id);
    if (index === -1) throw new Error(`Special ${id} not found`);
    const [deleted] = specials.splice(index, 1);
    await saveSpecials(specials);
    return deleted;
}

export async function getCurrentSpecial() {
    const specials = await loadSpecials();
    return specials.find((s) => s.isCurrent) || specials[0] || null;
}

export async function syncSpecials(incoming) {
    await saveSpecials(incoming);
    return incoming;
}
