// ==========================================================================
// review.html behavior (scripts/review.js):
// 1. Read the submitted form data from the URL's query string (the form
//    uses method="get", so every field arrives as ?name=value&...).
// 2. Render a human-readable summary of what was submitted.
// 3. Use localStorage to track and display how many reviews have been
//    completed, incrementing the count every time this page loads.
// ==========================================================================

// Same product data source as form.html, used here to translate a
// submitted product id back into a readable product name.
const products = [
  { id: "fc-1888", name: "flux capacitor", averagerating: 4.5 },
  { id: "fc-2050", name: "power laces", averagerating: 4.7 },
  { id: "fs-1987", name: "time circuits", averagerating: 3.5 },
  { id: "ac-2000", name: "low voltage reactor", averagerating: 3.9 },
  { id: "jj-1969", name: "warp equalizer", averagerating: 5.0 }
];

function lookupProductName(idOrName) {
  const match = products.find((p) => p.id === idOrName || p.name === idOrName);
  return match ? match.name : idOrName;
}

function starDisplay(ratingValue) {
  const rating = parseInt(ratingValue, 10);
  if (!rating) return "Not rated";
  const filled = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return `${filled}${empty} (${rating}/5)`;
}

function formatDate(dateString) {
  if (!dateString) return "Not provided";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function buildSummaryRow(label, value) {
  const li = document.createElement("li");

  const labelSpan = document.createElement("span");
  labelSpan.className = "summary-label";
  labelSpan.textContent = label;

  const valueSpan = document.createElement("span");
  valueSpan.className = "summary-value";
  valueSpan.textContent = value;

  li.appendChild(labelSpan);
  li.appendChild(valueSpan);
  return li;
}

function renderSummary() {
  const params = new URLSearchParams(window.location.search);
  const list = document.getElementById("summary-list");
  if (!list) return;

  const productValue = params.get("productName");
  const rating = params.get("rating");
  const installDate = params.get("installDate");
  const features = params.getAll("features");
  const writtenReview = params.get("writtenReview");
  const userName = params.get("userName");

  const rows = [
    ["Product", productValue ? lookupProductName(productValue) : "Not provided"],
    ["Rating", starDisplay(rating)],
    ["Installed On", formatDate(installDate)],
    ["Useful Features", features.length ? features.join(", ") : "None selected"],
    ["Written Review", writtenReview && writtenReview.trim() ? writtenReview : "No written review provided"],
    ["Submitted By", userName && userName.trim() ? userName : "Anonymous"]
  ];

  rows.forEach(([label, value]) => {
    list.appendChild(buildSummaryRow(label, value));
  });
}

function updateReviewCounter() {
  const counterEl = document.getElementById("review-counter");
  if (!counterEl) return;

  const storageKey = "reviewCount";
  const current = parseInt(localStorage.getItem(storageKey), 10) || 0;
  const updated = current + 1;

  localStorage.setItem(storageKey, updated);
  counterEl.textContent = updated;
}

function stampFooterInfo() {
  const yearSpan = document.getElementById("copy-year");
  const modifiedSpan = document.getElementById("last-modified");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  if (modifiedSpan) {
    modifiedSpan.textContent = document.lastModified;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderSummary();
  updateReviewCounter();
  stampFooterInfo();
});
