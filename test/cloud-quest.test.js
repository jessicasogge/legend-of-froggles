// Plays the Cloud Kingdom quest on the page: a rain cloud won't stop raining
// on Pip the bluebird, and the rain cloud becomes a rainbow.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { start } from '../public/game/cloud-page.js';
import { ENCHANT, HELPER, LINES } from '../public/game/cloud-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

let game;
beforeEach(() => {
  loadPage('cloud-kingdom.html');
  game = start(document);
});

describe('Cloud Kingdom quest', () => {
  it('starts with Pip under the rain cloud, with a "!" over her', () => {
    expect($('svg.scene').dataset.step).toBe('waiting');
    expect($('.helper .alert')).not.toBeNull();
    expect($('.story-text').textContent).toBe(LINES.waiting);
    expect(visible('.enchant')).toBe(false);
  });

  it('draws the rain cloud, and the rainbow waiting to take its place', () => {
    expect($('.rain-cloud .rain')).not.toBeNull();
    expect($('.rainbow')).not.toBeNull();
    expect($('.bird-flight .helper')).not.toBeNull();
  });

  it('makes Pip work like a button, and lets screen readers reach her', () => {
    expect($('svg.scene').getAttribute('role')).toBe('group');
    expect($('.helper').getAttribute('role')).toBe('button');
    expect($('.helper').getAttribute('tabindex')).toBe('0');
    expect($('.helper').getAttribute('aria-label')).toBe(`${HELPER} needs help. Tap to talk.`);
  });

  it('has Pip explain the problem when tapped, and offers to enchant the rain cloud', () => {
    tap($('.helper'));
    expect($('.story-speaker').textContent).toBe('Pip the bluebird');
    expect($('.story-text').textContent).toBe(LINES.asked);
    expect($('.enchant').textContent).toBe(ENCHANT);
    expect($('.enchant').textContent).toBe('Enchant the rain cloud');
    expect(document.activeElement).toBe($('.enchant'));
  });

  it('lets a keyboard talk to Pip', () => {
    $('.helper').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(game.step).toBe('asked');
  });

  it('turns the rain cloud into a rainbow once it is enchanted', () => {
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
