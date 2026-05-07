// Protect dashboard
if (!localStorage.getItem("piggyAdmin")) {
  window.location.href = "/admin/index.html";
}

// Load JSON files
async function load() {
  const files = ["specials", "menu", "site", "gallery"];
  for (let f of files) {
    const res = await fetch(`/data/${f}.json`);
    const json = await res.json();
    document.getElementById(f).value = JSON.stringify(json, null, 2);
  }
}
load();

// Save JSON to GitHub via API route
async function save(type) {
  const content = document.getElementById(type).value;

  const res = await fetch(`/api/save-${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });

  if (res.ok) {
    alert("Saved! Vercel will redeploy automatically.");
  } else {
    alert("Error saving file.");
  }
}

// Upload image to Cloudinary
async function uploadImage() {
  const file = document.getElementById("imageFile").files[0];
  if (!file) return alert("Choose an image first");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned"); // we will set this in Cloudinary

  const res = await fetch("/api/upload-image", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  document.getElementById("uploadResult").innerText = data.url;
}
