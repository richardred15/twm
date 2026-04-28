export class WMElement {
    dirty = false;
    /**
     * @type {WMElement|null}
     */
    parent = null;
    constructor() {}
    markDirty() {
        this.dirty = true;
        if (this.parent) this.parent.markDirty();
        else this.render();
    }

    /**
     *
     * @param {...*} args
     */
    render(...args) {
        this.dirty = false;
    }
}
