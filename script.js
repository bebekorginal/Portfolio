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

const gameShowcase = document.querySelector(".game-showcase");
const gameImage = document.querySelector("#game-image");
const gameCount = document.querySelector("#game-count");
const gameName = document.querySelector("#game-name");
const gameDescription = document.querySelector("#game-description");
const gameTechnologies = document.querySelector("#game-technologies");
const gameLink = document.querySelector("#game-link");
const previousGameButton = document.querySelector("#game-previous");
const nextGameButton = document.querySelector("#game-next");

let games = [];
let currentGameIndex = 0;
let gameTimer;

const showGame = (index, animate = true) => {
    const game = games[index];

    if (!game) {
        return;
    }

    currentGameIndex = index;
    gameImage.src = game["img-link"];
    gameImage.alt = `${game.name} screenshot`;
    gameCount.textContent = `${index + 1} / ${games.length}`;
    gameName.textContent = game.name;
    gameDescription.textContent = game["short description"];
    gameTechnologies.textContent = game.technologies;
    gameLink.href = game["page-link"];

    if (animate) {
        gameShowcase.classList.remove("is-changing");
        void gameShowcase.offsetWidth;
        gameShowcase.classList.add("is-changing");
    }
};

const startGameTimer = () => {
    window.clearInterval(gameTimer);

    if (games.length === 0) {
        return;
    }

    gameTimer = window.setInterval(() => {
        showGame((currentGameIndex + 1) % games.length);
    }, 5000);
};

if (gameShowcase) {
    fetch("assets/json/games.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Could not load games (${response.status})`);
            }
            return response.json();
        })
        .then((loadedGames) => {
            if (!Array.isArray(loadedGames) || loadedGames.length === 0) {
                throw new Error("The games list is empty");
            }

            games = loadedGames;
            showGame(0, false);
            startGameTimer();
        })
        .catch((error) => {
            gameShowcase.textContent = "Games could not be loaded right now.";
            console.error(error);
        });

    previousGameButton.addEventListener("click", () => {
        showGame((currentGameIndex - 1 + games.length) % games.length);
        startGameTimer();
    });

    nextGameButton.addEventListener("click", () => {
        showGame((currentGameIndex + 1) % games.length);
        startGameTimer();
    });

    gameShowcase.addEventListener("mouseenter", () => window.clearInterval(gameTimer));
    gameShowcase.addEventListener("mouseleave", startGameTimer);
    gameShowcase.addEventListener("focusin", () => window.clearInterval(gameTimer));
    gameShowcase.addEventListener("focusout", (event) => {
        if (!gameShowcase.contains(event.relatedTarget)) {
            startGameTimer();
        }
    });
}