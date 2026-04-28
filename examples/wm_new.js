import { WindowManager, COLORS, BORDERS, ConsoleWindow } from "../index.js";

let do_render = true;
/**
 * @type {ConsoleWindow}
 */
let status_console;
let conf_console;
/**
 * @type {ConsoleWindow}
 */
let log_console;
/**
 * @type {ConsoleWindow}
 */
let chat_info_console;
/**
 * @type {ConsoleWindow}
 */
let cmd_console;
let control_strip;
const FPS = 1;

const window_manager = new WindowManager();

function initConsoles() {
    console.clear();
    status_console = window_manager.createConsole(
        " Server Status",
        60,
        10,
        0,
        0,
    );
    conf_console = window_manager.createConsole("AI Config", 40, 16, 61, 0);
    log_console = window_manager.createConsole("Chat Log", 60, 29, 0, 11);
    log_console.z_index = 2;
    chat_info_console = window_manager.createConsole(
        "User Information",
        40,
        23,
        61,
        17,
    );
    cmd_console = window_manager.createConsole("Command Output", 99, 3, 1, 46);
    cmd_console.setBorders(BORDERS.bold);
    //witai.setLogger(cmd_con);
    control_strip = window_manager.createControlStrip("Controls", 99, 4, 1, 41);
    control_strip.addButton("Clear", 3, 0, 9, 2, () => {
        chat_info_console.clear();
        log_console.clear();
    });
    control_strip.addButton("L_Mode", 14, 0, 10, 2, () => {});
    control_strip.addButton("Goober", 26, 0, 12, 2, () => {
        status_console.log("GOOBER");
    });
    control_strip.addButton("Speak", 40, 0, 12, 2, () => {});
    control_strip.addButton("Latest", 54, 0, 12, 2, () => {});
    control_strip.addButton("<<", 68, 0, 8, 2, () => {});
    control_strip.addButton(">>", 78, 0, 8, 2, () => {});
    control_strip.addButton("🎲", 88, 0, 6, 2, () => {});
}

function c_render() {
    window_manager.render();
    if (do_render) {
        setTimeout(c_render, 1000 / FPS);
    }
}

window_manager
    .on("line", (/** @type {string} */ line) => {
        log_console.log(line);
    })
    .on("close", () => {
        process.exit(0);
    });

initConsoles();

setTimeout(c_render, 1000 / FPS);

setTimeout(() => {
    let str = `WM loaded!`;
    status_console.log(str);
}, 1000);
