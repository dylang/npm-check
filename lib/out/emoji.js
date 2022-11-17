'use strict';

import emoji from "node-emoji";

let emojiEnabled = true;

function output(name) {
    if (emojiEnabled) {
        return emoji.emojify(name);
    }

    return '';
}

export function enabled(val) {
    emojiEnabled = val;
}

export default output;
