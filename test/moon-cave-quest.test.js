// Plays the Moon Cave quest's rules directly, without a page.
import { describe, expect, it } from 'vitest';
import { LEGEND_LINE, LINES, START, next } from '../public/game/moon-cave-quest.js';

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

  it('can be played again from the start', () => {
    expect(next('done', 'again')).toBe('waiting');
  });

  it('has something to say at every step', () => {
    for (const step of ['waiting', 'asked', 'done']) expect(LINES[step].length).toBeGreaterThan(10);
  });

  it('adds a line to the legend about what the flying frog did', () => {
    expect(LEGEND_LINE).toMatch(/^The flying frog enchanted/);
  });
});
