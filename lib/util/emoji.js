'use strict';

const emoji = require('node-emoji');
const figures = require('figures');
const supportsColor = require('supports-color');

// this is just a guess that terms without good color support probably also can't do emoji
// see https://github.com/sindresorhus/module-requests/issues/64
const emojiSupported = supportsColor.level >= 2;

let emojiEnabled = emojiSupported;

const emojiNamesForFigures = {
    heart: 'heart',
    worried: 'pointerSmall',
    heart_eyes: 'heart',
    confused: 'smiley',
    no_entry: 'checkboxCircleOn',
    warning: 'warning',
    amazing: 'tick',
    sunglasses: 'play'
};

function output(name) {
    if (emojiSupported && emojiEnabled) {
        return emoji.get(name);
    }

    return figures[emojiNamesForFigures[name]] || ' ';
}

function enabled(val) {
    emojiEnabled = val;
}

module.exports = output;
module.exports.enabled = enabled;
