// The steps every quest follows:
//   waiting -> (talk) -> asked -> (enchant) -> done
// Once someone has been helped, they stay helped.

export const START = 'waiting';

const NEXT = {
  waiting: { talk: 'asked' },
  asked: { enchant: 'done' },
};

export function next(step, action) {
  return NEXT[step]?.[action] ?? step;
}
