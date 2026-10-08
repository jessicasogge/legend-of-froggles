// Plays the third Cloud Kingdom quest on the page: Lulu the unicorn has no
// wings, and once her little feather is enchanted it becomes wings and she
// flies up over the castle. Also checks all three Cloud Kingdom quests can
// be helped.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { start } from '../public/game/cloud-page.js';
import { ENCHANT, HELPER, LINES } from '../public/game/cloud-unicorn-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const lulu = () => $('[data-quest="lulu"] .helper');

let game;
beforeEach(() => {
  loadPage('cloud-kingdom.html');
  game = start(document);
});

describe('Cloud Kingdom unicorn quest', () => {
  it('starts with Lulu on the cloud, with a "!" over her', () => {
    expect($('[data-quest="lulu"]').dataset.step).toBe('waiting');
    expect($('[data-quest="lulu"] .helper .alert')).not.toBeNull();
    expect(game.stepOf('lulu')).toBe('waiting');
  });

  it('draws the little feather, the wings waiting to grow, and the flight up', () => {
    expect($('[data-quest="lulu"] .lone-feather')).not.toBeNull();
    expect($('[data-quest="lulu"] .helper .unicorn-wings')).not.toBeNull();
    expect($('[data-quest="lulu"] .unicorn-flight .helper')).not.toBeNull();
    expect($('[data-quest="lulu"] .enchant-swirl')).not.toBeNull();
  });

  it('makes Lulu work like a button', () => {
    expect(lulu().getAttribute('role')).toBe('button');
    expect(lulu().getAttribute('tabindex')).toBe('0');
    expect(lulu().getAttribute('aria-label')).toBe(`${HELPER} needs help. Tap to talk.`);
  });

  it('has Lulu explain the problem when tapped, and offers to enchant the feather', () => {
    tap(lulu());
    expect($('.story-speaker').textContent).toBe('Lulu the unicorn');
    expect($('.story-text').textContent).toBe(LINES.asked);
    expect($('.enchant').textContent).toBe(ENCHANT);
    expect($('.enchant').textContent).toBe('Enchant the feather');
    expect(document.activeElement).toBe($('.enchant'));
  });

  it('lets a keyboard talk to Lulu', () => {
    lulu().dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(game.stepOf('lulu')).toBe('asked');
  });

  it('gives her wings once the feather is enchanted', () => {
    tap(lulu());
    $('.enchant').click();
    expect($('[data-quest="lulu"]').dataset.step).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
  });

  it('stays helped, and tapping her again shows what she said', () => {
    tap(lulu());
    $('.enchant').click();
    expect(document.activeElement).toBe(lulu());
    tap(lulu());
    expect(game.stepOf('lulu')).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect(visible('.enchant')).toBe(false);
  });
});

describe('Cloud Kingdom with three quests', () => {
  it('can help all three, one after another', () => {
    for (const id of ['lulu', 'ginger', 'pip']) {
      tap($(`[data-quest="${id}"] .helper`));
      $('.enchant').click();
    }
    expect(['pip', 'ginger', 'lulu'].map(game.stepOf)).toEqual(['done', 'done', 'done']);
  });
});
