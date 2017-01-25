import emoji from 'node-emoji';

let emojiEnabled = true;

export default function output(name) {
  return emojiEnabled
    ? emoji.emojify(name)
    : '';
}

export function enabled(val) {
  emojiEnabled = val;
}
