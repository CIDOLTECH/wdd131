// getdates.js
// Populates the footer copyright year and the document's last-modified date.
// Kept separate from app.js because it runs on every page, including the
// site plan and references pages that do not load the rest of the app logic.

function paintFooterDates() {
  const yearTarget = document.querySelector("[data-current-year]");
  const modifiedTarget = document.querySelector("[data-last-modified]");

  const now = new Date();

  if (yearTarget) {
    yearTarget.textContent = `${now.getFullYear()}`;
  }

  if (modifiedTarget) {
    const modified = new Date(document.lastModified);
    const isValidDate = !Number.isNaN(modified.getTime());
    modifiedTarget.textContent = isValidDate
      ? `Last updated ${modified.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
      : `Last updated recently`;
  }
}

document.addEventListener("DOMContentLoaded", paintFooterDates);
