// Plays the third Moon Cave quest on the page: Dot the bat has no branch to
// sleep upside down from, and a tiny twig grows into a tree for her. Also
// checks all three Moon Cave quests can be helped.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { start } from '../public/game/moon-cave-page.js';
import { ENCHANT, HELPER, LEGEND_LINE, LINES } from '../public/game/moon-cave-bat-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const dot = () => $('[data-quest="dot"] .helper');

let game;
beforeEach(() => {
  loadPage('moon-cave.html');
  game = start(document);
});

describe('Moon Cave bat quest', () => {
  it('starts with Dot on the hill, with a "!" over her', () => {
    expect($('[data-quest="dot"]').dataset.step).toBe('waiting');
    expect($('[data-quest="dot"] .helper .alert')).not.toBeNull();
    expect(game.stepOf('dot')).toBe('waiting');
  });

  it('draws the tiny twig, the tree waiting to grow, and the flight up to it', () => {
    expect($('[data-quest="dot"] .tiny-twig')).not.toBeNull();
    expect($('[data-quest="dot"] .bat-tree')).not.toBeNull();
    expect($('[data-quest="dot"] .bat-flight .helper')).not.toBeNull();
    expect($('[data-quest="dot"] .enchant-swirl')).not.toBeNull();
  });

  it('makes Dot work like a button', () => {
    expect(dot().getAttribute('role')).toBe('button');
    expect(dot().getAttribute('tabindex')).toBe('0');
    expect(dot().getAttribute('aria-label')).toBe(`${HELPER} needs help. Tap to talk.`);
  });

  it('has Dot explain the problem when tapped, and offers to enchant the twig', () => {
    tap(dot());
    expect($('.story-speaker').textContent).toBe('Dot the bat');
    expect($('.story-text').textContent).toBe(LINES.asked);
    expect($('.enchant').textContent).toBe(ENCHANT);
    expect($('.enchant').textContent).toBe('Enchant the twig');
    expect(document.activeElement).toBe($('.enchant'));
  });

  it('lets a keyboard talk to Dot', () => {
    dot().dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(game.stepOf('dot')).toBe('asked');
  });

  it('grows the tree and adds to the legend once the twig is enchanted', () => {
    tap(dot());
    $('.enchant').click();
    expect($('[data-quest="dot"]').dataset.step).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect($('.legend-line').textContent).toBe(LEGEND_LINE);
    expect(LEGEND_LINE).toMatch(/^The flying frog enchanted a tiny twig/);
  });

  it('stays helped, and tapping her again shows what she said', () => {
    tap(dot());
    $('.enchant').click();
    expect(document.activeElement).toBe(dot());
    tap(dot());
    expect(game.stepOf('dot')).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect(visible('.enchant')).toBe(false);
  });
});

describe('Moon Cave with three quests', () => {
  it('can help all three, one after another', () => {
    for (const id of ['dot', 'twinkle', 'flicker']) {
      tap($(`[data-quest="${id}"] .helper`));
      $('.enchant').click();
    }
    expect(['flicker', 'twinkle', 'dot'].map(game.stepOf)).toEqual(['done', 'done', 'done']);
  });
});
