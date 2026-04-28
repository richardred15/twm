import { BORDERS, COLORS } from "../constants.js";
import { StringUtil } from "./StringUtil.js";
import { Spinner } from "./Spinner.js";
import { WMElement } from "./WMElement.js";

export class WMWindow extends WMElement {
    borders_enabled = true;
    z_index = 0;
    selected = false;
    /**
     * @type {Spinner[]}
     */
    spinners = [];
    /**
     * @type {Borders}
     */
    borders = structuredClone(BORDERS.default);
    /**
     * @type {Borders}
     */
    default_borders = structuredClone(BORDERS.default);
    /**
     * @param {string} title
     * @param {number} width
     * @param {number} height
     * @param {number} x
     * @param {number} y
     */
    constructor(title = "Window", width, height, x = 0, y = 0) {
        super();
        this.title = title;
        this.w = width;
        this.h = height;
        this.pos = {
            x: x,
            y: y,
        };
    }

    /**
     *
     * @param {number} x
     * @param {number} y
     * @returns
     */
    addSpinner(x, y) {
        let s = new Spinner(x, y);
        s.parent = this;
        this.spinners.push(s);
        return s;
    }

    /**
     *
     * @param {Borders} borders
     */
    setBorders(borders) {
        this.borders = structuredClone(borders);
        this.setDefaultBorders(borders);
    }

    /**
     *
     * @param {Borders} borders
     */
    setDefaultBorders(borders) {
        this.default_borders = structuredClone(borders);
    }

    enableBorders() {
        this.borders = Object.assign({}, this.default_borders);
        this.borders_enabled = true;
    }

    noBorders() {
        this.default_borders = Object.assign({}, this.borders);
        this.borders = {
            top: " ",
            bottom: " ",
            left: " ",
            right: " ",
        };
        this.borders_enabled = false;
    }

    /**
     *
     * @param {number} x
     * @param {number} y
     */
    click(x, y) {
        this.onclick({
            line: y,
            pos: {
                x: x,
                y: y,
            },
        });
    }

    /**
     *
     * @param {Object} data
     */
    onclick(data) {}

    /**
     *
     * @param {number} direction
     */
    scroll(direction) {}

    /**
     *
     * @param {number} line_index
     */
    renderSpinners(line_index) {
        for (let s = this.spinners.length - 1; s >= 0; s--) {
            let spinner = this.spinners[s];
            if (spinner.dead) {
                this.spinners.splice(s, 1);
                continue;
            }
            spinner.render(line_index);
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
            let bd_color = this.selected
                ? COLORS.FgWhite
                : COLORS.FgVeryDarkGrey;
            let title_color = this.selected
                ? COLORS.BgWhite
                : COLORS.BgDarkGrey;
            if (line_index == 0) {
                let message = StringUtil.fill_line(this.title, this.w - 4);
                process.stdout.write(
                    `${title_color}${COLORS.FgCyan}  ${message}  ${COLORS.Reset}`,
                );
            } else if (line_index == this.h) {
                let out = new Array(this.w);
                out.fill(this.borders.bottom);
                process.stdout.write(
                    `${bd_color}${out.join("")}${COLORS.Reset}`,
                );
            } else if (line_index < this.h) {
                let message = StringUtil.fill_line("", this.w - 4);
                process.stdout.write(
                    `${bd_color}${this.borders.left}${COLORS.Reset} ${message} ${bd_color}${this.borders.right}${COLORS.Reset}`,
                );
            }
        }
    }
}
