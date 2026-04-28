import { COLORS } from "../constants.js";
import { WMElement } from "./WMElement.js";

export class Spinner extends WMElement {
    /**
     *
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        super();
        this.pos = {
            x: x,
            y: y,
        };
        this.frames = [
            "\u{1F55B}",
            "\u{1F550}",
            "\u{1F551}",
            "\u{1F552}",
            "\u{1F553}",
            "\u{1F554}",
            "\u{1F555}",
            "\u{1F556}",
            "\u{1F557}",
            "\u{1F558}",
            "\u{1F559}",
            "\u{1F55A}",
        ];
        //this.frames = ["|", "/", "-", "\\"]
        this.frame = 0;
        this.dead = false;
        this.hidden = false;
        this.fg_color = COLORS.FgWhite;
        this.bg_color = COLORS.BgBlack;
    }

    hide() {
        this.hidden = true;
    }

    show() {
        this.hidden = false;
    }

    toggle() {
        this.hidden = !this.hidden;
    }

    remove() {
        this.dead = true;
        this.markDirty();
    }

    /**
     *
     * @param {number} line_index
     */
    render(line_index) {
        super.render();
        if (!this.hidden && line_index == this.pos.y) {
            process.stdout.cursorTo(this.pos.x);
            process.stdout.write(
                `${this.fg_color}${this.bg_color}${this.frames[Math.floor(this.frame)]}${COLORS.Reset}`,
            );
            this.frame += 0.5;
            if (this.frame >= this.frames.length) {
                this.frame = 0;
            }
        }
    }
}
