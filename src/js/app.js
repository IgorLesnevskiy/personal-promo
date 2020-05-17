import "modernizr";
import * as Wow from "wow.js";

import "../styles/app.scss";

const AppModule = function () {
    return {
        init() {
            initAnimations();
            initConsoleEasterEgg();
        },
    };

    function initAnimations() {
        new Wow().init();
    }

    function initConsoleEasterEgg() {
        /* eslint-disable-next-line */
        console.log(
            `%c
            _________________________________
            < Hello! Looking for something? >
            ---------------------------------
                    \\   ^__^
                     \\  (oo)\\_______
                        (__)\\       )\\/\\
                            ||----w |
                            ||     ||`,
            "font-family:monospace; font-size: 16px; color: #0079c1;"
        );
    }
};

const app = new AppModule();

window.addEventListener("load", () => {
    app.init();
});
