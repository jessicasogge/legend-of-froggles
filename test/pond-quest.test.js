// Plays the Home Pond quest on the page: Pebble the snail is stuck on a rock
// in the water, and the rock becomes a lily pad.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { start } from '../public/game/pond-page.js';
import { ENCHANT, HELPER, LINES } from '../public/game/pond-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

let game;
beforeEach(() => {
  loadPage('home-pond.html');
  game = start(document);
});

describe('Home Pond quest', () => {
  it('starts with Pebble on the rock, with a "!" over her', () => {
    expect($('svg.scene').dataset.step).toBe('waiting');
    expect($('.helper .alert')).not.toBeNull();
    expect($('.story-text').textContent).toBe(LINES.waiting);
    expect(visible('.enchant')).toBe(false);
  });

  it('draws the rock, and the lily pad waiting to take its place', () => {
    expect($('.pond-rock')).not.toBeNull();
    expect($('.snail-raft .new-pad')).not.toBeNull();
    expect($('.snail-raft .helper')).not.toBeNull();
  });

  it('makes Pebble work like a button, and lets screen readers reach her', () => {
    expect($('svg.scene').getAttribute('role')).toBe('group');
    expect($('.helper').getAttribute('role')).toBe('button');
    expect($('.helper').getAttribute('tabindex')).toBe('0');
    expect($('.helper').getAttribute('aria-label')).toBe(`${HELPER} needs help. Tap to talk.`);
  });

  it('has Pebble explain the problem when tapped, and offers to enchant the rock', () => {
    tap($('.helper'));
    expect($('.story-speaker').textContent).toBe('Pebble the snail');
    expect($('.story-text').textContent).toBe(LINES.asked);
    expect($('.enchant').textContent).toBe(ENCHANT);
    expect($('.enchant').textContent).toBe('Enchant the rock');
    expect(document.activeElement).toBe($('.enchant'));
  });

  it('lets a keyboard talk to Pebble', () => {
    $('.helper').dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(game.step).toBe('asked');
  });

  it('turns the rock into a lily pad once it is enchanted', () => {
    tap($('.helper'));
    $('.enchant').click();
    expect($('svg.scene').dataset.step).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
  });

  it('stays helped, and tapping her again shows what she said', () => {
    tap($('.helper'));
    $('.enchant').click();
    expect(document.activeElement).toBe($('.helper'));
    tap($('.helper'));
    expect(game.step).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect(visible('.enchant')).toBe(false);
  });
});
