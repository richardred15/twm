import { COLORS, BORDERS } from "../constants.js";
import { StringUtil } from "../classes/StringUtil.js";
import { WMElement } from "./WMElement.js";

export class Button extends WMElement {
    /**
     *
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Function} onclick
     */
    constructor(text = "Button", x, y, width, height, onclick = () => {}) {
        super();
        this.pos = {
            x: x,
            y: y,
        };
        this.w = width;
        this.h = height;
        this.onclick = onclick;
        this.text = text;
    }

    /**
     *
     * @param {number} x
     * @param {number} y
     */
    click(x, y) {
        if (this.pos.x < x && this.pos.x + this.w > x) {
            if (this.pos.y < y && this.pos.y + this.h > y) {
                this.onclick(this);
            }
        }
    }

    /**
     *
     * @param {number} line_index
     */
    render(line_index) {
        super.render();
        if (line_index >= this.pos.y) {
            line_index -= this.pos.y;
            process.stdout.cursorTo(this.pos.x);
            if (line_index == 0) {
                let out = new Array(this.w);
                out.fill(BORDERS.button.top);
                process.stdout.write(out.join(""));
            } else if (line_index == this.h) {
                let out = new Array(this.w);
                out.fill(BORDERS.button.bottom);
                process.stdout.write(out.join(""));
            } else if (line_index < this.h) {
                let message = StringUtil.fill_line(
                    this.text,
                    this.w - 4,
                    "center",
                );
                process.stdout.write(
                    `${BORDERS.button.left} ${message} ${COLORS.Reset}${BORDERS.button.right}`,
                );
            }
        }
    }
}
