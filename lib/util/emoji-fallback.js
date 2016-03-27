'use strict';

const emoji = require('node-emoji');
const figures = require('figures');
const supportsColor = require('supports-color');
const options = require('./options');

// this is just a guess that terms without good color support probably also can't do emoji
// see https://github.com/sindresorhus/module-requests/issues/64
const emojiSupported = supportsColor.level > 2;

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
    if (emojiSupported && !options.get('noEmoji')) {
        return emoji.get(name);
    }

    return figures[emojiNamesForFigures[name]];
}

module.exports = output;
module.exports.get = output;
