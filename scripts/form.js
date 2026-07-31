// ==========================================================================
// form.html behavior (scripts/form.js):
// 1. Populate the Product Name <select> from the products data array.
// 2. Fill in the footer's copyright year / last-modified date.
// ==========================================================================

const products = [
  {
    id: "fc-1888",
    name: "flux capacitor",
    averagerating: 4.5
  },
  {
    id: "fc-2050",
    name: "power laces",
    averagerating: 4.7
  },
  {
    id: "fs-1987",
    name: "time circuits",
    averagerating: 3.5
  },
  {
    id: "ac-2000",
    name: "low voltage reactor",
    averagerating: 3.9
  },
  {
    id: "jj-1969",
    name: "warp equalizer",
    averagerating: 5.0
  }
];

/**
 * Builds one <option> per product and appends it to the select element.
 *
 * NOTE ON VALUES: the assignment's JavaScript instructions say to use each
 * product's "id" field as the option's value attribute and its "name" field
 * as the visible text. That is what this function does below. If your
 * instructor's rubric instead expects the *value* to be the product's name
 * (as stated elsewhere in the assignment sheet), just swap `product.id` for
 * `product.name` on the line marked below.
 */
function populateProductOptions() {
  const select = document.getElementById("product-name");
  if (!select) return;

  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;        // <-- swap to product.name if your rubric requires it
    option.textContent = product.name;
    select.appendChild(option);
  });
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
  populateProductOptions();
  stampFooterInfo();
});
