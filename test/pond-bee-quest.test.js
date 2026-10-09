// Plays the third Home Pond quest on the page: Bumble the bee is hungry but the
// water lily is shut tight, and once it's enchanted it blooms. Also checks all
// three Home Pond quests can be helped.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { start } from '../public/game/pond-page.js';
import { ENCHANT, HELPER, LINES } from '../public/game/pond-bee-quest.js';
import * as pebble from '../public/game/pond-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const friend = () => $('[data-quest="bumble"] .helper');

let game;
beforeEach(() => {
  loadPage('home-pond.html');
  game = start(document);
});

describe('Home Pond bee quest', () => {
  it('starts with Bumble waiting, with a "!" over her', () => {
    expect($('[data-quest="bumble"]').dataset.step).toBe('waiting');
    expect($('[data-quest="bumble"] .helper .alert')).not.toBeNull();
    expect(game.stepOf('bumble')).toBe('waiting');
  });

  it('draws the shut water lily, the bloom waiting to open, and her flight into it', () => {
    expect($('[data-quest="bumble"] .lily-bud')).not.toBeNull();
    expect($('[data-quest="bumble"] .lily-bloom')).not.toBeNull();
    expect($('[data-quest="bumble"] .bee-flight .helper')).not.toBeNull();
    expect($('[data-quest="bumble"] .enchant-swirl')).not.toBeNull();
  });

  it('makes Bumble work like a button', () => {
    expect(friend().getAttribute('role')).toBe('button');
    expect(friend().getAttribute('tabindex')).toBe('0');
    expect(friend().getAttribute('aria-label')).toBe(`${HELPER} needs help. Tap to talk.`);
  });

  it('has Bumble explain the problem when tapped, and offers to enchant the water lily', () => {
    tap(friend());
    expect($('.story-speaker').textContent).toBe('Bumble the bee');
    expect($('.story-text').textContent).toBe(LINES.asked);
    expect($('.enchant').textContent).toBe(ENCHANT);
    expect($('.enchant').textContent).toBe('Enchant the water lily');
    expect(document.activeElement).toBe($('.enchant'));
  });

  it('lets a keyboard talk to Bumble', () => {
    friend().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(game.stepOf('bumble')).toBe('asked');
  });

  it('opens the water lily once it is enchanted', () => {
    tap(friend());
    $('.enchant').click();
    expect($('[data-quest="bumble"]').dataset.step).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
  });

  it('stays helped, and tapping her again shows what she said', () => {
    tap(friend());
    $('.enchant').click();
    expect(document.activeElement).toBe(friend());
    tap(friend());
    expect(game.stepOf('bumble')).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect(visible('.enchant')).toBe(false);
  });

  it('leaves Pebble waiting while Bumble is helped', () => {
    tap(friend());
    $('.enchant').click();
    expect($('[data-quest="pebble"]').dataset.step).toBe('waiting');
  });
});

describe('Home Pond with three quests', () => {
  it('says there are three friends to help', () => {
    expect($('.story-text').textContent).toBe(pebble.LINES.waiting);
    expect(pebble.LINES.waiting).toMatch(/^Three friends at the Home Pond need help/);
  });

  it('can help all three, one after another', () => {
    for (const id of ['bumble', 'wiggles', 'pebble']) {
      tap($(`[data-quest="${id}"] .helper`));
      $('.enchant').click();
    }
    expect(['pebble', 'wiggles', 'bumble'].map(game.stepOf)).toEqual(['done', 'done', 'done']);
  });
});
