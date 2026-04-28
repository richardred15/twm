export class Color {
    /**
     *
     * @param {string} hex
     * @returns {string}
     */
    static fromHex(hex) {
        // Remove '#' if present
        const cleanHex = hex.replace("#", "");

        // Convert hex to RGB
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);

        // \x1b[38;2;R;G;Bm is the sequence for foreground color
        // \x1b[0m is the sequence to reset formatting
        return `\x1b[38;2;${r};${g};${b}m`;
    }
}
