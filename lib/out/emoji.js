import emoji from 'node-emoji';

let emojiEnabled = true;

function output(name) {
    if (emojiEnabled) {
        return emoji.emojify(name);
    }

    return '';
}

export function enabled(value) {
    emojiEnabled = value;
}

export default output;
