import { Button } from "./Button.js";
import { WMWindow } from "./WMWindow.js";

export class ControlStrip extends WMWindow {
    /**
     * @type {Button[]}
     */
    buttons = [];
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

    /**
     *
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Function} onclick
     */
    addButton(text, x, y, width, height, onclick) {
        let button = new Button(
            text,
            x + this.pos.x + 1,
            y + this.pos.y + 1,
            width,
            height,
            onclick,
        );
        button.parent = this;
        this.buttons.push(button);
    }

    /**
     *
     * @param {number} x
     * @param {number} y
     */
    click(x, y) {
        super.click(x, y);
        for (let button of this.buttons) {
            button.click(x + this.pos.x, y + 1 + this.pos.y);
        }
    }

    /**
     *
     * @param {number} line_index
     */
    render(line_index) {
        super.render(line_index);
        for (let button of this.buttons) {
            button.render(line_index);
        }
    }
}
