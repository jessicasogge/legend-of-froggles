export const START = 'waiting';

const NEXT = {
  waiting: { talk: 'asked' },
  asked: { enchant: 'done' },
};

export function next(step, action) {
  return NEXT[step]?.[action] ?? step;
}
