import readline from "readline";
import keypress from "keypress";
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

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
});

const window_manager = new WindowManager();

function initConsoles() {
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

function timestr() {
    let date = new Date();

    return `${zeros(date.getHours().toString())}:${zeros(date.getMinutes().toString())}:${zeros(date.getSeconds().toString())}`;
}

/**
 *
 * @param {string} string
 * @param {number} len
 * @returns
 */
function zeros(string, len = 2) {
    let fill = new Array(len).fill(0).join("");
    return `${fill}${string}`.slice(-len);
}

function c_render() {
    status_console.title = ` Server Status ${timestr()}`;
    rl.pause();
    let pos = rl.getCursorPos();
    window_manager.render();
    let window_size = process.stdout.getWindowSize();
    let size = {
        w: window_size[0],
        h: window_size[1],
    };
    process.stdout.cursorTo(0, size.h);
    process.stdout.write("> ");
    process.stdout.cursorTo(pos.cols, size.h);
    rl.resume();
    if (do_render) {
        setTimeout(c_render, 1000 / FPS);
    }
}

rl.on("line", function (string) {
    let reg = /("([^"])+")/gim;
    let matches = string.match(reg);
    if (matches) {
        for (let match of matches) {
            let updated = match.replaceAll(" ", "_");
            string = string.replace(match, updated);
        }
    }
    log_console.log(string);
    let parts = string.split(" ");

    switch (parts[0]) {
        case "focus":
            break;
        case "display":
            break;
        case "list":
            break;
        case "config":
            break;
        case "get":
            break;
        case "set":
            break;
        default:
            cmd_console.log("Command not found");
            break;
    }
    c_render();
}).on("close", () => {
    process.exit(0);
});

setTimeout(c_render, 1000 / FPS);
let spinner;

setTimeout(() => {
    let str = `WM loaded!`;
    status_console.log(str);
    spinner = status_console.addSpinner(status_console.pos.x + 1, 0);
    spinner.fg_color = COLORS.FgWhite;
    spinner.bg_color = COLORS.BgDarkGrey;
    /* setTimeout(() => {
        spinner.remove();
    }, 10000); */
    c_render();
}, 1000);

// make `process.stdin` begin emitting "mousepress" (and "keypress") events
keypress(process.stdin);
// you must enable the mouse events before they will begin firing
keypress.enableMouse(process.stdout);

let s_x = {
    x: 0,
    y: 0,
};

process.stdin.on("keypress", function (ch, key) {
    if (key) {
        if (!key.meta) {
        }
    }
});

process.stdin.on("mousepress", function (info) {
    if (info.scroll == 0) {
        if (!info.release) {
            window_manager.click(info.x, info.y);
            s_x = {
                x: info.x,
                y: info.y,
            };
        }
    } else {
        window_manager.scroll(info.scroll, info.x, info.y);
    }
});

process.on("exit", function () {
    // disable mouse on exit, so that the state
    // is back to normal for the terminal
    keypress.disableMouse(process.stdout);
    console.clear();
    console.log("Have a great day!");
});

console.clear();
initConsoles();
