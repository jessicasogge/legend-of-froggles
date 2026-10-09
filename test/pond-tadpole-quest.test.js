// Plays the second Home Pond quest on the page: Wiggles the tadpole wants to hop
// like Mr. Froggles, and once he's enchanted he becomes a little frog.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { start } from '../public/game/pond-page.js';
import { ENCHANT, HELPER, LINES } from '../public/game/pond-tadpole-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const friend = () => $('[data-quest="wiggles"] .helper');

let game;
beforeEach(() => {
  loadPage('home-pond.html');
  game = start(document);
});

describe('Home Pond tadpole quest', () => {
  it('starts with Wiggles waiting, with a "!" over him', () => {
    expect($('[data-quest="wiggles"]').dataset.step).toBe('waiting');
    expect($('[data-quest="wiggles"] .helper .alert')).not.toBeNull();
    expect(game.stepOf('wiggles')).toBe('waiting');
  });

  it('draws him as a tadpole, and as the little frog he becomes', () => {
    expect($('[data-quest="wiggles"] .helper .tadpole')).not.toBeNull();
    expect($('[data-quest="wiggles"] .helper .froglet')).not.toBeNull();
    expect($('[data-quest="wiggles"] .enchant-swirl')).not.toBeNull();
  });

  it('makes Wiggles work like a button', () => {
    expect(friend().getAttribute('role')).toBe('button');
    expect(friend().getAttribute('tabindex')).toBe('0');
    expect(friend().getAttribute('aria-label')).toBe(`${HELPER} needs help. Tap to talk.`);
  });

  it('has Wiggles explain the problem when tapped, and offers to enchant the tadpole', () => {
    tap(friend());
    expect($('.story-speaker').textContent).toBe('Wiggles the tadpole');
    expect($('.story-text').textContent).toBe(LINES.asked);
    expect($('.enchant').textContent).toBe(ENCHANT);
    expect($('.enchant').textContent).toBe('Enchant the tadpole');
    expect(document.activeElement).toBe($('.enchant'));
  });

  it('lets a keyboard talk to Wiggles', () => {
    friend().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(game.stepOf('wiggles')).toBe('asked');
  });

  it('turns him into a little frog once he is enchanted', () => {
    tap(friend());
    $('.enchant').click();
    expect($('[data-quest="wiggles"]').dataset.step).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
  });

  it('stays helped, and tapping him again shows what he said', () => {
    tap(friend());
    $('.enchant').click();
    expect(document.activeElement).toBe(friend());
    tap(friend());
    expect(game.stepOf('wiggles')).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect(visible('.enchant')).toBe(false);
  });

  it('leaves Pebble waiting while Wiggles is helped', () => {
    tap(friend());
    $('.enchant').click();
    expect($('[data-quest="pebble"]').dataset.step).toBe('waiting');
  });
});
