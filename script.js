const menu = document.querySelector(".menu");
const menuToggle = document.querySelector(".menu-toggle");
const menuLinks = document.querySelectorAll("#menu-links a");

const updateMenuState = () => {
    if (menu) {
        menu.classList.toggle("menu-stuck", menu.getBoundingClientRect().top <= 0);
    }
};

updateMenuState();
window.addEventListener("scroll", updateMenuState, { passive: true });

if (menu && menuToggle) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("menu-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            menu.classList.remove("menu-open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}