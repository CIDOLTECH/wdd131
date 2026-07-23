/* =========================================================
   Temple Album — data, rendering, and filtering
   Patterns used:
     - Factory (Creational)  -> createTempleCard()
     - Module/IIFE (Structural) -> keeps state out of global scope
     - Strategy (Behavioral) -> filterStrategies map
   ========================================================= */

(function () {
    "use strict";

    /* ---------------------------------------------------
       1. DATA
       --------------------------------------------------- */
    const temples = [
        {
            templeName: "Aba Nigeria",
            location: "Aba, Nigeria",
            dedicated: "2005, August, 7",
            area: 11500,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
        },
        {
            templeName: "Manti Utah",
            location: "Manti, Utah, United States",
            dedicated: "1888, May, 21",
            area: 74792,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
        },
        {
            templeName: "Payson Utah",
            location: "Payson, Utah, United States",
            dedicated: "2015, June, 7",
            area: 96630,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
        },
        {
            templeName: "Yigo Guam",
            location: "Yigo, Guam",
            dedicated: "2020, May, 2",
            area: 6861,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
        },
        {
            templeName: "Washington D.C.",
            location: "Kensington, Maryland, United States",
            dedicated: "1974, November, 19",
            area: 156558,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
        },
        {
            templeName: "Lima Perú",
            location: "Lima, Perú",
            dedicated: "1986, January, 10",
            area: 9600,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
        },
        {
            templeName: "Mexico City Mexico",
            location: "Mexico City, Mexico",
            dedicated: "1983, December, 2",
            area: 116642,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
        },
        // --- Added temples (at least 3 required) ---
        {
            templeName: "St. George Utah",
            location: "St. George, Utah, United States",
            dedicated: "1877, April, 6",
            area: 94000,
            imageUrl:
                "https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?auto=format&fit=crop&w=800&q=60"
        },
        {
            templeName: "Salt Lake",
            location: "Salt Lake City, Utah, United States",
            dedicated: "1893, April, 6",
            area: 253015,
            imageUrl:
                "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=60"
        },
        {
            templeName: "Rome Italy",
            location: "Rome, Italy",
            dedicated: "2019, March, 10",
            area: 41010,
            imageUrl:
                "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=60"
        },
        {
            templeName: "Cardston Alberta",
            location: "Cardston, Alberta, Canada",
            dedicated: "1923, August, 26",
            area: 62555,
            imageUrl:
                "https://upload.wikimedia.org/wikipedia/commons/a/af/Cardston_Alberta_Canada_Temple.jpg"
        }
    ];

    /* ---------------------------------------------------
       2. FACTORY — builds a single temple card element
       --------------------------------------------------- */
    function createTempleCard(temple) {
        const card = document.createElement("article");
        card.className = "temple-card";

        const heading = document.createElement("h2");
        heading.textContent = temple.templeName;

        const location = buildDetailLine("Location", temple.location);
        const dedicated = buildDetailLine("Dedicated", temple.dedicated);
        const size = buildDetailLine("Size", `${temple.area.toLocaleString()} sq ft`);

        const imageWrap = document.createElement("div");
        imageWrap.className = "image-wrap";

        const img = document.createElement("img");
        img.src = temple.imageUrl;
        img.alt = temple.templeName;
        img.loading = "lazy";
        img.width = 400;
        img.height = 250;

        imageWrap.appendChild(img);

        card.append(heading, location, dedicated, size, imageWrap);
        return card;
    }

    function buildDetailLine(labelText, valueText) {
        const p = document.createElement("p");
        p.className = "detail";

        const label = document.createElement("span");
        label.className = "label";
        label.textContent = `${labelText}: `;

        const value = document.createElement("span");
        value.className = "value";
        value.textContent = valueText;

        p.append(label, value);
        return p;
    }

    /* ---------------------------------------------------
       3. STRATEGY — one filter function per nav item
       --------------------------------------------------- */
    const filterStrategies = {
        home: () => temples,
        old: () => temples.filter((t) => getYear(t.dedicated) < 1900),
        new: () => temples.filter((t) => getYear(t.dedicated) > 2000),
        large: () => temples.filter((t) => t.area > 90000),
        small: () => temples.filter((t) => t.area < 10000)
    };

    function getYear(dedicatedString) {
        return parseInt(dedicatedString.split(",")[0], 10);
    }

    const headingText = {
        home: "Home",
        old: "Old Temples (before 1900)",
        new: "New Temples (after 2000)",
        large: "Large Temples (over 90,000 sq ft)",
        small: "Small Temples (under 10,000 sq ft)"
    };

    /* ---------------------------------------------------
       4. RENDERER — draws the gallery for a given filter
       --------------------------------------------------- */
    const gallery = document.querySelector("#templeGallery");
    const galleryHeading = document.querySelector("#galleryHeading");
    const resultCount = document.querySelector("#resultCount");
    const navLinks = document.querySelectorAll("#primaryNav a");

    function renderGallery(filterKey) {
        const results = filterStrategies[filterKey]();

        gallery.innerHTML = "";

        if (results.length === 0) {
            const empty = document.createElement("p");
            empty.className = "no-results";
            empty.textContent = "No temples match this filter.";
            gallery.appendChild(empty);
        } else {
            const fragment = document.createDocumentFragment();
            results.forEach((temple) => fragment.appendChild(createTempleCard(temple)));
            gallery.appendChild(fragment);
        }

        galleryHeading.textContent = headingText[filterKey] ?? "Home";
        resultCount.textContent = `${results.length} temple${results.length === 1 ? "" : "s"} shown`;

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.dataset.filter === filterKey);
            if (link.dataset.filter === filterKey) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    /* ---------------------------------------------------
       5. EVENTS — nav filtering + hamburger menu
       --------------------------------------------------- */
    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            renderGallery(link.dataset.filter);

            // Collapse mobile nav after a selection
            const nav = document.querySelector("#primaryNav");
            const menuButton = document.querySelector("#menuButton");
            if (nav.classList.contains("open")) {
                nav.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
            }
        });
    });

    const menuButton = document.querySelector("#menuButton");
    const navigation = document.querySelector("#primaryNav");

    menuButton.addEventListener("click", () => {
        navigation.classList.toggle("open");
        const isOpen = navigation.classList.contains("open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    /* ---------------------------------------------------
       6. FOOTER — dynamic copyright year + last modified
       --------------------------------------------------- */
    document.querySelector("#currentyear").textContent = new Date().getFullYear();
    document.querySelector("#lastModified").textContent =
        `Last Modification: ${document.lastModified}`;

    /* ---------------------------------------------------
       7. INITIAL RENDER
       --------------------------------------------------- */
    renderGallery("home");
})();
