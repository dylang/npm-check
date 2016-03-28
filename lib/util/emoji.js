'use strict';

const emoji = require('node-emoji');
const supportsColor = require('supports-color');

// this is just a guess that terms without good color support probably also can't do emoji
// see https://github.com/sindresorhus/module-requests/issues/64
const emojiSupported = supportsColor.level >= 2;

let emojiEnabled = emojiSupported;

function output(name) {
    if (emojiSupported && emojiEnabled) {
        return emoji.emojify(name);
    }

    return '';
}

function enabled(val) {
    emojiEnabled = val;
}

module.exports = output;
module.exports.enabled = enabled;
