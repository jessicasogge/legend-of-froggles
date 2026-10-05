// Plays the Whispering Woods quest on the page: Hazel the hedgehog needs a
// way across the stream to her family.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { start } from '../public/game/woods-page.js';
import { ENCHANT, HELPER, LEGEND_LINE, LINES } from '../public/game/woods-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

let game;
beforeEach(() => {
  loadPage('whispering-woods.html');
  game = start(document);
});

describe('Whispering Woods quest', () => {
  it('starts with Hazel waiting by the stream, with a "!" over her', () => {
    expect($('svg.scene').dataset.step).toBe('waiting');
    expect($('.helper .alert')).not.toBeNull();
    expect($('.story-text').textContent).toBe(LINES.waiting);
    expect(visible('.enchant')).toBe(false);
  });

  it('draws the stream, the little leaf, the hidden bridge and Hazel\'s family', () => {
    expect($('.fallen-leaf')).not.toBeNull();
    expect($('.leaf-bridge')).not.toBeNull();
    expect(document.querySelectorAll('svg.scene > use[href="#hedgehog"]')).toHaveLength(2);
  });

  it('makes Hazel work like a button, and lets screen readers reach her', () => {
    expect($('svg.scene').getAttribute('role')).toBe('group');
    expect($('.helper').getAttribute('role')).toBe('button');
    expect($('.helper').getAttribute('tabindex')).toBe('0');
    expect($('.helper').getAttribute('aria-label')).toBe(`${HELPER} needs help. Tap to talk.`);
  });

  it('has Hazel explain the problem when tapped, and offers to enchant the leaf', () => {
    tap($('.helper'));
    expect($('.story-speaker').textContent).toBe('Hazel the hedgehog');
    expect($('.story-text').textContent).toBe(LINES.asked);
    expect($('.enchant').textContent).toBe(ENCHANT);
    expect($('.enchant').textContent).toBe('Enchant the leaf');
    expect(document.activeElement).toBe($('.enchant'));
  });

  it('lets a keyboard talk to Hazel', () => {
    $('.helper').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(game.step).toBe('asked');
  });

  it('grows the bridge and adds to the legend once the leaf is enchanted', () => {
    tap($('.helper'));
    $('.enchant').click();
    expect($('svg.scene').dataset.step).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect($('.legend-line').textContent).toBe(LEGEND_LINE);
    expect(LEGEND_LINE).toMatch(/^The flying frog enchanted/);
  });

  it('can be played again', () => {
    tap($('.helper'));
    $('.enchant').click();
    $('.again').click();
    expect(game.step).toBe('waiting');
    expect(visible('.legend-line')).toBe(false);
  });
});
