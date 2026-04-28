import { WindowManager, COLORS, BORDERS, ConsoleWindow } from "../index.js";

/**
 * @type {ConsoleWindow}
 */
let log_console;
const FPS = 1;

const window_manager = new WindowManager();

function setup_consoles() {
    console.clear();
    log_console = window_manager.createConsole("Log Info", 60, 29, 10, 10);
}

function run_my_stuff() {
    log_console.log("Hello World!");
}

setup_consoles();
run_my_stuff();

setInterval(() => {
    window_manager.render();
}, 1000 / FPS);
