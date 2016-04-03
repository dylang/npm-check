'use strict';

const emoji = require('node-emoji');

let emojiEnabled = true;

function output(name) {
    if (emojiEnabled) {
        return emoji.emojify(name);
    }

    return '';
}

function enabled(val) {
    emojiEnabled = val;
}

module.exports = output;
module.exports.enabled = enabled;
