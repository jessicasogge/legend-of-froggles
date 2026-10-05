// The Moon Cave's first quest: just the rules. It doesn't touch the page, so
// the tests can play it directly. moon-cave-page.js draws it.
//
// Flicker the firefly's light has gone out, and the cave is too dark for her
// to find her way home. Talk to her, then enchant the cave so it glows.
//
//   waiting -> (talk) -> asked -> (enchant) -> done -> (again) -> waiting

export const HELPER = 'Flicker the firefly';

// What the story box says at each step.
export const LINES = {
  waiting: 'Someone by the cave needs help. Tap the firefly to find out who.',
  asked: 'Help! My light went out, and the Moon Cave is too dark. I can’t find my way home!',
  done: 'My light is back on! Thank you, Mr. Froggles!',
};

// The line this quest adds to the legend once it's done.
export const LEGEND_LINE = 'The flying frog enchanted the dark Moon Cave, and it glowed so Flicker could find her way home.';

export const START = 'waiting';

// Each step, and where each action takes it. An action that doesn't fit the
// step (enchanting before talking, say) leaves things as they are.
const NEXT = {
  waiting: { talk: 'asked' },
  asked: { enchant: 'done' },
  done: { again: 'waiting' },
};

export function next(step, action) {
  return NEXT[step]?.[action] ?? step;
}
