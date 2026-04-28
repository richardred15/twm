export class StringUtil {
    /**
     *
     * @param {String} string
     * @returns
     */
    static true_len(string) {
        return string.replace(
            /[[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/gim,
            "",
        ).length;
    }

    /**
     *
     * @param {string} message
     * @param {number} length
     * @returns
     */
    static truncate(message, length) {
        let len = this.true_len(message);
        /**
         * @type {String}
         */
        let out = message.slice(0, length);
        if (len > length) {
            out = out.slice(0, -3) + `...`;
        }
        /* if (out.length < len) {
            message = message.slice(0, length - 3) + "...";
        } */
        return out;
    }
    /**
     *
     * @param {string} message
     * @param {number} length
     * @param {string} mode
     * @returns
     */
    static fillLine(message, length, mode = "left") {
        message = this.truncate(message, length);
        let len = this.true_len(message);
        if (len < length) {
            let rspacing = length - len;
            let lspacing = 0;
            if (mode == "center") {
                lspacing = Math.floor(rspacing / 2);
                rspacing -= lspacing;
            }
            let right = new Array(rspacing);
            let left = new Array(lspacing);
            right.fill(" ");
            left.fill(" ");
            let left_padding = left.join("");
            let right_padding = right.join("");
            return `${left_padding}${message}${right_padding}`;
        } else {
            return message;
        }
    }
}
