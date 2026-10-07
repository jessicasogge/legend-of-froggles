// Checks the Moon Cave screen: the cave, Mr. Froggles, a way back, and the
// first quest played through on the page.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { start } from '../public/game/moon-cave-page.js';
import { LINES } from '../public/game/moon-cave-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const press = (el, key) => el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

let game;
beforeEach(() => {
  loadPage('moon-cave.html');
  game = start(document);
});

describe('Moon Cave screen', () => {
  it('is called Moon Cave', () => {
    expect($('main.kingdom-screen h1').textContent).toBe('Moon Cave');
  });

  it('shows the cave, described for anyone who cannot see it', () => {
    const scene = $('svg.scene');
    expect(scene.getAttribute('role')).toBe('group');
    expect(scene.getAttribute('aria-label')).toMatch(/Moon Cave/);
  });

  it('has Mr. Froggles in the scene', () => {
    expect($('svg.scene image.froggles-flying').getAttribute('href')).toBe('./mr-froggles.svg');
  });

  it('has a Back button that goes to the kingdom picker', () => {
    const back = $('a.back');
    expect(back.textContent.trim()).toBe('Back');
    expect(back.getAttribute('href')).toBe('./next.html');
  });
});

describe('Moon Cave quest, on the page', () => {
  it('starts with Flicker waiting, a "!" over her, and only a hint to read', () => {
    expect($('[data-quest="flicker"]').dataset.step).toBe('waiting');
    expect($('.firefly .alert')).not.toBeNull();
    expect($('.story-text').textContent).toBe(LINES.waiting);
    expect(visible('.story-speaker')).toBe(false);
    expect(visible('.enchant')).toBe(false);
  });

  it('makes Flicker work like a button, for taps and keyboards', () => {
    const firefly = $('.firefly');
    expect(firefly.getAttribute('role')).toBe('button');
    expect(firefly.getAttribute('tabindex')).toBe('0');
    expect(firefly.getAttribute('aria-label')).toMatch(/needs help/);
  });

  it('has Flicker ask for help when tapped, and offers to enchant the cave', () => {
    $('.firefly').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect($('[data-quest="flicker"]').dataset.step).toBe('asked');
    expect($('.story-speaker').textContent).toBe('Flicker the firefly');
    expect($('.story-text').textContent).toBe(LINES.asked);
    expect(visible('.enchant')).toBe(true);
    expect($('.enchant').textContent).toBe('Enchant the cave');
    expect(document.activeElement).toBe($('.enchant'));
  });

  it('lets a keyboard talk to Flicker with Enter or Space', () => {
    press($('.firefly'), 'Enter');
    expect(game.step).toBe('asked');
    loadPage('moon-cave.html');
    game = start(document);
    press($('.firefly'), ' ');
    expect(game.step).toBe('asked');
  });

  it('lights the cave once it is enchanted', () => {
    $('.firefly').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    $('.enchant').click();
    expect($('[data-quest="flicker"]').dataset.step).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect(visible('.enchant')).toBe(false);
    expect($('.cave-glow')).not.toBeNull();
    expect($('.enchant-swirl')).not.toBeNull();
  });

  it('stays helped, and tapping her again shows what she said', () => {
    tap($('.firefly'));
    $('.enchant').click();
    expect(document.activeElement).toBe($('.firefly'));
    tap($('.firefly'));
    expect(game.stepOf('flicker')).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect(visible('.enchant')).toBe(false);
  });

  it('reads each change aloud to screen readers', () => {
    expect($('.story').getAttribute('aria-live')).toBe('polite');
  });
});
