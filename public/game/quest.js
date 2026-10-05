// The steps every quest follows:
//   waiting -> (talk) -> asked -> (enchant) -> done -> (again) -> waiting

export const START = 'waiting';

const NEXT = {
  waiting: { talk: 'asked' },
  asked: { enchant: 'done' },
  done: { again: 'waiting' },
};

export function next(step, action) {
  return NEXT[step]?.[action] ?? step;
}
