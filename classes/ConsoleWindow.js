import util from "util";
import { StringUtil } from "./StringUtil.js";
import { WMWindow } from "./WMWindow.js";
import { COLORS } from "../constants.js";

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
     * @param {any} message
     */
    log(message) {
        clearTimeout(this.render_timeout);
        if (typeof message == "string") {
            let lines = message.split("\n");
            let previous_color = "";
            for (let line of lines) {
                line = line.replaceAll("\t", "   ");
                let colors = line.match(/\x1b\[[0-9;]*m/g);
                if (colors != null) {
                    let color = colors.slice(-1)[0];
                    if (color == COLORS.Reset) {
                        previous_color = "";
                    } else {
                        previous_color = color;
                    }
                }
                this.messages.push(previous_color + line);
                if (this.scroll_offset > 0) this.scroll_offset++;
            }
        } else {
            message = util.inspect(message, {
                showHidden: false,
                depth: 2,
                colors: true,
                breakLength: this.w - 4,
            });
            let lines = message.split("\n").map((/** @type {any} */ line) => {
                return line.replaceAll("\t", "   ");
            });
            this.messages = this.messages.concat(...lines);
            if (this.scroll_offset > 0) this.scroll_offset += lines.length;
        }
        this.markDirty();
    }

    /**
     *
     * @param {string} message
     */
    error(message) {
        this.log(message);
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
                let inner_height = this.h - 1;
                let scroll_bar = "";

                if (this.messages.length > inner_height) {
                    let bar_height = Math.max(
                        1,
                        Math.floor(
                            (inner_height / this.messages.length) *
                                inner_height,
                        ),
                    );
                    let max_scroll_offset = Math.max(
                        0,
                        this.messages.length - inner_height,
                    );
                    let scroll_offset_ratio =
                        this.scroll_offset / max_scroll_offset;
                    let bar_pos = this.h - bar_height;
                    let scroll_offset = Math.floor(
                        (inner_height - bar_height) * scroll_offset_ratio,
                    );
                    bar_pos -= scroll_offset;
                    let scroll_bar_color = this.selected
                        ? COLORS.FgWhite
                        : COLORS.FgVeryDarkGrey;
                    scroll_bar = `${scroll_bar_color} ${this.borders.scroll_bar_track}`;
                    if (
                        line_index >= bar_pos &&
                        line_index < bar_pos + bar_height
                    )
                        scroll_bar = `${scroll_bar_color} ${this.borders.scroll_bar}`;
                }
                process.stdout.write(` ${message}${scroll_bar}`);
            }
            this.renderSpinners(line_index);
        }
    }
}
