import { Level } from "./Game.js";
import blueprints from "./blueprints.js";

function main() {
    const gameContainer  = document.getElementById("game-container");
    if (!gameContainer) return;

    const levelList      = document.getElementById("level-list");
    const levelIndicator = document.getElementById("level-indicator");
    const winOverlay     = document.getElementById("win-overlay");
    const resetBtn       = document.getElementById("reset-button");
    const prevBtn        = document.getElementById("prev-button");
    const nextBtn        = document.getElementById("next-button");
    const winNextBtn     = document.getElementById("win-next");
    const winResetBtn    = document.getElementById("win-reset");

    const TOTAL = blueprints.length;
    let currentIndex = 0;
    let level;

    // Build level list
    blueprints.forEach((_, i) => {
        const li = document.createElement("li");
        const a  = document.createElement("a");
        a.href = "#";
        a.dataset.level = i;
        a.textContent = `Niveau ${String(i + 1).padStart(2, "0")}`;
        li.appendChild(a);
        levelList.appendChild(li);
    });

    function loadLevel(index) {
        currentIndex = Math.max(0, Math.min(index, TOTAL - 1));
        level = new Level(blueprints[currentIndex]);

        levelIndicator.textContent =
            `NIVEAU ${String(currentIndex + 1).padStart(2, "0")} / ${String(TOTAL).padStart(2, "0")}`;

        document.querySelectorAll("#level-list a").forEach((a, i) => {
            a.classList.toggle("active", i === currentIndex);
        });

        const active = document.querySelector("#level-list a.active");
        if (active) active.scrollIntoView({ block: "nearest", inline: "nearest" });

        winOverlay.classList.remove("visible");
        renderLevel();
    }

    function renderLevel() {
        gameContainer.innerHTML = "";
        const table = document.createElement("table");

        const imgMap = {
            "#": ["wall.png",      "Mur"],
            "$": ["box.png",       "Caisse"],
            "@": ["player.png",    "Gardien"],
            ".": ["target.png",    "Cible"],
            "*": ["boxmarked.png", "Caisse sur cible"],
            " ": ["blank.png",     "Sol"],
            "+": ["player.png",    "Gardien sur cible"],
        };

        level.board.forEach(row => {
            const tr = document.createElement("tr");
            row.forEach(cell => {
                const td  = document.createElement("td");
                const def = imgMap[cell] ?? imgMap[" "];
                const img = document.createElement("img");
                img.src = `assets/images/${def[0]}`;
                img.alt = def[1];
                td.appendChild(img);
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        gameContainer.appendChild(table);
    }

    function move(direction) {
        level.movePlayer(direction);
        renderLevel();
        if (level.isComplete()) {
            setTimeout(() => winOverlay.classList.add("visible"), 200);
        }
    }

    // Keyboard
    window.addEventListener("keydown", e => {
        if (!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) return;
        e.preventDefault();
        move(e.key);
    });

    // D-pad
    document.querySelectorAll(".dpad-btn[data-dir]").forEach(btn => {
        btn.addEventListener("click", () => move(btn.dataset.dir));
    });

    // Controls
    resetBtn.addEventListener("click",   () => loadLevel(currentIndex));
    prevBtn.addEventListener("click",    () => loadLevel(currentIndex - 1));
    nextBtn.addEventListener("click",    () => loadLevel(currentIndex + 1));
    winNextBtn.addEventListener("click", () => loadLevel(currentIndex + 1));
    winResetBtn.addEventListener("click",() => loadLevel(currentIndex));

    // Level list
    levelList.addEventListener("click", e => {
        const a = e.target.closest("a[data-level]");
        if (!a) return;
        e.preventDefault();
        loadLevel(parseInt(a.dataset.level));
    });

    loadLevel(0);
}

main();
