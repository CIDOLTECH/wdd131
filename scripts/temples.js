// Dynamic Footer Dates

const year = document.querySelector("#currentyear");
const modified = document.querySelector("#lastModified");

year.textContent = new Date().getFullYear();

modified.textContent =
    `Last Modification: ${document.lastModified}`;


// Hamburger Menu

const menuButton = document.querySelector("#menuButton");
const navigation = document.querySelector("#primaryNav");

menuButton.addEventListener("click", () => {

    navigation.classList.toggle("open");

    const isOpen = navigation.classList.contains("open");

    menuButton.textContent = isOpen ? "✕" : "☰";

    menuButton.setAttribute(
        "aria-expanded",
        isOpen
    );
});