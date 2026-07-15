/**
 * getdates.js
 * Populates the footer's copyright year and "last modified" date.
 * Kept intentionally small and dependency-free for performance.
 */
(function initFooterDates() {
  "use strict";

  const yearEl = document.getElementById("year");
  const modifiedEl = document.getElementById("last-modified");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (modifiedEl) {
    const formatter = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    modifiedEl.textContent = formatter.format(new Date(document.lastModified));
  }
})();
