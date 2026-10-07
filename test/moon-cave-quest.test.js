// Plays the Moon Cave quest's rules directly, without a page.
import { describe, expect, it } from 'vitest';
import { LINES, START, next } from '../public/game/moon-cave-quest.js';

describe('Moon Cave quest rules', () => {
  it('starts with someone waiting for help', () => {
    expect(START).toBe('waiting');
  });

  it('goes talk, then enchant, then done', () => {
    let step = START;
    step = next(step, 'talk');
    expect(step).toBe('asked');
    step = next(step, 'enchant');
    expect(step).toBe('done');
  });

  it("can't be enchanted before you've talked to Flicker", () => {
    expect(next('waiting', 'enchant')).toBe('waiting');
  });

  it('ignores talking again once Flicker has asked', () => {
    expect(next('asked', 'talk')).toBe('asked');
  });

  it('stays done once Flicker has been helped', () => {
    for (const action of ['talk', 'enchant', 'again']) expect(next('done', action)).toBe('done');
  });

  it('has something to say at every step', () => {
    for (const step of ['waiting', 'asked', 'done']) expect(LINES[step].length).toBeGreaterThan(10);
  });
});
