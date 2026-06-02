// Protect dashboard
if (!localStorage.getItem("piggyAdmin")) {
    window.location.href = "/admin/index.html";
}

// Load JSON data from API
async function load() {
    const types = ["specials", "menu", "site", "gallery"];
    for (const type of types) {
          try {
                  const res = await fetch(`/api/data/${type}`);
                  if (!res.ok) throw new Error(`HTTP ${res.status}`);
                  const json = await res.json();
                  document.getElementById(type).value = JSON.stringify(json, null, 2);
          } catch (err) {
                  console.error(`Failed to load ${type}:`, err);
                  document.getElementById(type).value = `// Error loading ${type}: ${err.message}`;
          }
    }
}
load();

// Save JSON data via API
async function save(type) {
    const raw = document.getElementById(type).value;
    let content;
    try {
          content = JSON.parse(raw);
    } catch (e) {
          alert(`Invalid JSON in ${type}: ${e.message}`);
          return;
    }

  try {
        const res = await fetch(`/api/data/${type}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content)
        });
        if (!res.ok) {
                const err = await res.json().catch(() => ({ error: res.statusText }));
                throw new Error(err.error || res.statusText);
        }
        alert(`Saved ${type}! Vercel will redeploy automatically.`);
  } catch (err) {
        alert(`Error saving ${type}: ${err.message}`);
  }
}

// Upload image to Cloudinary
async function uploadImage() {
    const file = document.getElementById("imageFile").files[0];
    if (!file) return alert("Choose an image first");

  const formData = new FormData();
    formData.append("file", file);

  try {
        const res = await fetch("/api/upload-image", {
                method: "POST",
                body: formData
        });
        if (!res.ok) {
                const err = await res.json().catch(() => ({ error: res.statusText }));
                throw new Error(err.error || res.statusText);
        }
        const data = await res.json();
        document.getElementById("uploadResult").innerText = data.url;
  } catch (err) {
        alert(`Upload failed: ${err.message}`);
        document.getElementById("uploadResult").innerText = `Error: ${err.message}`;
  }
}
