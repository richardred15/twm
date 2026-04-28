## NodeJS Terminal Window Manager

Need some windows in your terminal for your NodeJS apps? Well here you go!

Check out the examples for now

```
git clone https://github.com/richardred15/twm.git
cd twm
npm install
node ./examples/wm_full.js
```

### wm_basic.js:

```javascript
/*
Only import what you need
import { WindowManager } from "twm"; - This will do what you need most of the time

CommonJS:
const {
    WindowManager,
    COLORS,
    BORDERS,
    ConsoleWindow,
    ControlStrip,
} = require("../index.js");
*/
import {
    WindowManager,
    COLORS,
    BORDERS,
    ConsoleWindow,
    Color,
} from "../index.js";

/**
 * @type {ConsoleWindow}
 */
let log_window;

const window_manager = new WindowManager();

function setup_consoles() {
    console.clear();
    log_window = window_manager.createConsole("Info Log", 60, 29, 10, 10);
}

function run_my_stuff() {
    log_window.log(Color.fromHex("#FF8822") + "Hello World!" + COLORS.Reset);
}

setup_consoles();
window_manager.render();
run_my_stuff();
```
