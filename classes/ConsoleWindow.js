import util from "util";
import { StringUtil } from "./StringUtil.js";
import { WMWindow } from "./WMWindow.js";

export class ConsoleWindow extends WMWindow {
    /**
     * @type {String[]}
     */
    messages = [];
    scroll_offset = 0;
    /**
     * @type {NodeJS.Timeout|undefined}
     */
    render_timeout = undefined;
    /**
     *
     * @param {string} title
     * @param {number} width
     * @param {number} height
     * @param {number} x
     * @param {number} y
     */
    constructor(title, width, height, x = 0, y = 0) {
        super(title, width, height, x, y);
    }

    clear() {
        this.messages = [];
        this.markDirty();
    }

    /**
     *
     * @param {String} message
     */
    log(message) {
        clearTimeout(this.render_timeout);
        if (typeof message == "string") {
            this.messages.push(message);
        } else {
            message = util.inspect(message, {
                showHidden: false,
                depth: 2,
                colors: true,
                breakLength: this.w - 4,
            });
            let lines = message.split("\n");
            this.messages = this.messages.concat(...lines);
        }
        this.markDirty();
    }

    /**
     *
     * @param {number} direction
     */
    scroll(direction) {
        super.scroll(direction);
        if (direction < 0) {
            let h = this.h - 2;
            if (this.messages.length - h - (this.scroll_offset - direction)) {
                this.scroll_offset -= direction;
            }
        } else {
            if (this.scroll_offset > 0) {
                this.scroll_offset--;
            }
        }
        this.markDirty();
    }

    getVisible() {
        let h = this.h - 2;
        if (this.messages.length <= h) {
            return this.messages;
        } else {
            let o = this.messages.length - h;
            return this.messages.slice(o - 1 - this.scroll_offset);
        }
    }

    /**
     *
     * @param {number} line_index
     */
    render(line_index) {
        super.render(line_index);
        if (line_index >= this.pos.y) {
            line_index -= this.pos.y;
            process.stdout.cursorTo(this.pos.x + 1);
            if (line_index > 0 && line_index < this.h) {
                let messages = this.getVisible();
                let message = "";
                if (messages.length + 1 > line_index) {
                    message = StringUtil.fill_line(
                        messages[line_index - 1],
                        this.w - 4,
                    );
                } else {
                    message = StringUtil.fill_line(message, this.w - 4);
                }
                process.stdout.write(` ${message}`);
            }
            this.renderSpinners(line_index);
        }
    }
}
