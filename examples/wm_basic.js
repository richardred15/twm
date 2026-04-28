/*
Only import what you need
import { WindowManager } from "twm"; - This will do what you need most of the time

CommonJS:

const {
    WindowManager,
    COLORS,
    BORDERS,
    ConsoleWindow,
    ControlStrip,
} = require("../index.js");
*/
import { WindowManager, COLORS, BORDERS, ConsoleWindow } from "../index.js";

/**
 * @type {ConsoleWindow}
 */
let log_window;

const window_manager = new WindowManager();

function setup_consoles() {
    console.clear();
    log_window = window_manager.createConsole("Info Log", 60, 29, 10, 10);
}

function run_my_stuff() {
    log_window.log("Hello World!");
}

setup_consoles();
window_manager.render();
run_my_stuff();
