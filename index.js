import readline from "readline";
import keypress from "keypress";
export { COLORS, BORDERS } from "./constants.js";
import { WMWindow } from "./classes/WMWindow.js";
import { ConsoleWindow } from "./classes/ConsoleWindow.js";
export { ConsoleWindow } from "./classes/ConsoleWindow.js";
import { ControlStrip } from "./classes/ControlStrip.js";
export { ControlStrip } from "./classes/ControlStrip.js";
import { WMElement } from "./classes/WMElement.js";

export class WindowManager extends WMElement {
    /**
     * @type {WMWindow[]}
     */
    windows = [];
    /**
     * @type {readline.Interface|null}
     */
    rl = null;
    /**
     * @type {Object<string, Function[]>}
     */
    listeners = {};
    control_input = true;
    constructor(control_input = true) {
        super();
        this.control_input = control_input;
        if (control_input) {
            this.setup_environment();
            console.clear();
        }
    }

    setup_environment() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
        });

        this.rl.on("line", (string) => {
            this.fire_event("line", string);
            this.render();
        });

        // make `process.stdin` begin emitting "mousepress" (and "keypress") events
        keypress(process.stdin);
        // you must enable the mouse events before they will begin firing
        keypress.enableMouse(process.stdout);

        process.stdin.on("keypress", function (ch, key) {
            if (key) {
                if (!key.meta) {
                }
            }
        });

        process.stdin.on("mousepress", (info) => {
            if (info.scroll == 0) {
                if (!info.release) {
                    this.click(info.x, info.y);
                }
            } else {
                this.scroll(info.scroll, info.x, info.y);
            }
        });

        process.stdout.on("resize", () => {
            this.render();
        });

        process.on("exit", () => {
            // disable mouse on exit, so that the state
            // is back to normal for the terminal
            keypress.disableMouse(process.stdout);
            this.fire_event("exit");
        });
    }

    /**
     *
     * @param {string} event
     * @param  {...any} args
     */
    fire_event(event, ...args) {
        if (this.listeners[event]) {
            for (let callback of this.listeners[event]) {
                callback(...args);
            }
        }
    }

    /**
     *
     * @param {string} event
     * @param {Function} callback
     */
    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        } else {
            this.listeners[event] = [callback];
        }
        return this;
    }

    /**
     * @param {string} title
     * @param {number} width
     * @param {number} height
     * @param {number} x
     * @param {number} y
     * @returns
     */
    createConsole(title = "", width, height, x, y) {
        let console_window = new ConsoleWindow(title, width, height, x, y);
        console_window.parent = this;
        this.windows.push(console_window);
        return console_window;
    }

    /**
     *
     * @param {string} title
     * @param {number} width
     * @param {number} height
     * @param {number} x
     * @param {number} y
     * @returns
     */
    createControlStrip(title, width, height, x, y) {
        let control_strip = new ControlStrip(title, width, height, x, y);
        control_strip.parent = this;
        this.windows.push(control_strip);
        return control_strip;
    }

    cursor = {
        show: () => {
            process.stderr.write("\x1B[?25l");
        },
        hide: () => {
            process.stderr.write("\x1B[?25h");
        },
    };

    /**
     *
     * @param {number} x
     * @param {number} y
     */
    click(x, y) {
        this.windows = this.windows.sort((a, b) => a.z_index - b.z_index);
        for (let wind of this.windows) {
            wind.selected = false;
            if (wind.pos.x + wind.w >= x && wind.pos.x <= x) {
                if (wind.pos.y + wind.h >= y && wind.pos.y <= y) {
                    wind.click(x - wind.pos.x - 1, y - wind.pos.y - 2);
                    wind.selected = true;
                }
            }
        }
        this.render();
    }

    /**
     *
     * @param {number} direction
     * @param {number} x
     * @param {number} y
     */
    scroll(direction, x, y) {
        this.windows = this.windows.sort((a, b) => a.z_index - b.z_index);
        for (let wind of this.windows) {
            wind.selected = false;
            if (wind.pos.x + wind.w >= x && wind.pos.x <= x) {
                if (wind.pos.y + wind.h >= y && wind.pos.y <= y) {
                    wind.scroll(direction);
                    wind.selected = true;
                }
            }
        }
        this.render();
    }

    render() {
        super.render();
        let pos;
        if (this.rl) {
            this.rl.pause();
            pos = this.rl.getCursorPos();
        }
        process.stdout.cursorTo(0, 0);
        let window_size = process.stdout.getWindowSize();
        let size = {
            x: window_size[0],
            y: window_size[1],
        };
        this.windows = this.windows.sort((a, b) => a.z_index - b.z_index);
        for (let l = 0; l < size.y - 1; l++) {
            process.stdout.cursorTo(0, l);
            process.stdout.write(new Array(size.x).fill(" ").join(""));
            process.stdout.cursorTo(0, l);
            for (let con of this.windows) {
                con.render(l);
            }
        }
        if (this.rl) {
            process.stdout.cursorTo(0, size.x);
            process.stdout.write("> ");
            if (pos) process.stdout.cursorTo(pos.cols, size.y);
            this.rl.resume();
        }
    }
}
