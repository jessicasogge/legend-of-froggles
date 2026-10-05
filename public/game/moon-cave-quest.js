
export const HELPER = 'Flicker the firefly';

export const LINES = {
  waiting: 'Someone by the cave needs help. Tap the firefly to find out who.',
  asked: 'Help! My light went out, and the Moon Cave is too dark. I can’t find my way home!',
  done: 'My light is back on! Thank you, Mr. Froggles!',
};

export const LEGEND_LINE = 'The flying frog enchanted the dark Moon Cave, and it glowed so Flicker could find her way home.';

export const START = 'waiting';

const NEXT = {
  waiting: { talk: 'asked' },
  asked: { enchant: 'done' },
  done: { again: 'waiting' },
};

export function next(step, action) {
  return NEXT[step]?.[action] ?? step;
}
