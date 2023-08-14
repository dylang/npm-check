import { emojify } from 'node-emoji';

let emojiEnabled = true;

export default function output(name) {
    if (emojiEnabled) {
        return emojify(name);
    }

    return '';
}

export function enabled(val) {
    emojiEnabled = val;
}
