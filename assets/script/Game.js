import blueprints from "./blueprints.js";

export class Level {
    /** @type {string[][]} */
    board = [];

    /**
     * @param {string} blueprint - level of game
     */
    constructor(blueprint) {
        this.convertToBoard(blueprint);
    }

    /**
     * @param {string} string - string for level game
     */
    convertToBoard(string) {
        const lignes = string.split("\n");
        for (const ligne of lignes) {
            this.board.push(ligne.split(""));
        }
    }
    get wherePlayer() {
        let y = 0;
        let x = 0;

        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i].includes("@")) {
                y = i;
                x = this.board[y].indexOf("@");
            } else if (this.board[i].includes("+")) {
                y = i;
                x = this.board[y].indexOf("+");
            }
        }

        return { y, x };
    }
    /**
     * @param {string} direction - where player move
     */
    movePlayer(direction) {
        const positionPLayer = this.wherePlayer;
        const { y, x } = positionPLayer;

        let nextX = x;
        let nextY = y;
        let dy = 0;
        let dx = 0;

        switch (direction) {
            case "ArrowDown":  nextY = y + 1; dy = 1;  break;
            case "ArrowUp":    nextY = y - 1; dy = -1; break;
            case "ArrowLeft":  nextX = x - 1; dx = -1; break;
            case "ArrowRight": nextX = x + 1; dx = 1;  break;
        }

        const nextCell = this.board[nextY][nextX];

        // If next cell is a box ($) or box-on-target (*), try to push it
        if (nextCell === "$" || nextCell === "*") {
            const boxNextY = nextY + dy;
            const boxNextX = nextX + dx;
            if (!this.isPossibleMove(boxNextY, boxNextX)) return this.board;

            // Move the box
            const boxNextCell = this.board[boxNextY][boxNextX];
            this.board[boxNextY][boxNextX] = boxNextCell === "." ? "*" : "$";
            this.board[nextY][nextX] = nextCell === "*" ? "." : " ";
        } else if (!this.isPossibleMove(nextY, nextX)) {
            return this.board;
        }

        // Move the player
        const playerOnTarget = this.board[y][x] === "+";
        this.board[y][x] = playerOnTarget ? "." : " ";

        const landingCell = this.board[nextY][nextX];
        this.board[nextY][nextX] = landingCell === "." ? "+" : "@";

        return this.board;
    }

    /**
     * @param {number} y - axe y level game
     * @param {number} x -  axe x level game
     * @returns {boolean}
     */
    isPossibleMove(y, x) {
        const char = this.board[y][x];
        switch (char) {
            case "#":  return false;
            case " ":  return true;
            case ".":  return true;
            default:   return false;
        }
    }

    /**
     * Check if the level is complete (no unplaced boxes remain)
     * @returns {boolean}
     */
    isComplete() {
        return !this.board.some(row => row.includes("$"));
    }
}
