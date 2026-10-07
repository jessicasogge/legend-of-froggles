// Plays the second Moon Cave quest on the page: Twinkle the little star has
// fallen onto the hill, and the moonlight carries her back up into the sky.
// Also checks it and Flicker's quest don't get in each other's way.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { start } from '../public/game/moon-cave-page.js';
import { ENCHANT, HELPER, LEGEND_LINE, LINES } from '../public/game/moon-cave-star-quest.js';
import * as flicker from '../public/game/moon-cave-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const twinkle = () => $('[data-quest="twinkle"] .helper');

let game;
beforeEach(() => {
  loadPage('moon-cave.html');
  game = start(document);
});

describe('Moon Cave star quest', () => {
  it('starts with Twinkle on the hilltop, with a "!" over her', () => {
    expect($('[data-quest="twinkle"]').dataset.step).toBe('waiting');
    expect($('[data-quest="twinkle"] .helper .alert')).not.toBeNull();
    expect(game.stepOf('twinkle')).toBe('waiting');
  });

  it('draws the moonbeam waiting to shine, and the lift that carries her up', () => {
    expect($('[data-quest="twinkle"] .moonbeam')).not.toBeNull();
    expect($('[data-quest="twinkle"] .star-lift .helper')).not.toBeNull();
    expect($('[data-quest="twinkle"] .enchant-swirl')).not.toBeNull();
  });

  it('makes Twinkle work like a button', () => {
    expect(twinkle().getAttribute('role')).toBe('button');
    expect(twinkle().getAttribute('tabindex')).toBe('0');
    expect(twinkle().getAttribute('aria-label')).toBe(`${HELPER} needs help. Tap to talk.`);
  });

  it('has Twinkle explain the problem when tapped, and offers to enchant the moonlight', () => {
    tap(twinkle());
    expect($('.story-speaker').textContent).toBe('Twinkle the star');
    expect($('.story-text').textContent).toBe(LINES.asked);
    expect($('.enchant').textContent).toBe(ENCHANT);
    expect($('.enchant').textContent).toBe('Enchant the moonlight');
    expect(document.activeElement).toBe($('.enchant'));
  });

  it('lets a keyboard talk to Twinkle', () => {
    twinkle().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(game.stepOf('twinkle')).toBe('asked');
  });

  it('carries her up and adds to the legend once the moonlight is enchanted', () => {
    tap(twinkle());
    $('.enchant').click();
    expect($('[data-quest="twinkle"]').dataset.step).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect($('.legend-line').textContent).toBe(LEGEND_LINE);
    expect(LEGEND_LINE).toMatch(/^The flying frog enchanted the moonlight/);
  });

  it('stays helped, and tapping her again shows what she said', () => {
    tap(twinkle());
    $('.enchant').click();
    expect(document.activeElement).toBe(twinkle());
    tap(twinkle());
    expect(game.stepOf('twinkle')).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect(visible('.enchant')).toBe(false);
  });
});

describe('Moon Cave with two quests', () => {
  it('says there are three friends to help', () => {
    expect($('.story-text').textContent).toBe(flicker.LINES.waiting);
    expect(flicker.LINES.waiting).toMatch(/^Three friends need help tonight/);
  });

  it('keeps the cave dark while Twinkle is helped', () => {
    tap(twinkle());
    $('.enchant').click();
    expect($('[data-quest="flicker"]').dataset.step).toBe('waiting');
    expect($('[data-quest="flicker"] .cave-glow')).not.toBeNull();
  });

  it('can help both, one after the other', () => {
    tap($('.firefly'));
    $('.enchant').click();
    tap(twinkle());
    $('.enchant').click();
    expect(game.stepOf('flicker')).toBe('done');
    expect(game.stepOf('twinkle')).toBe('done');
  });
});
