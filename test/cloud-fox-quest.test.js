// Plays the second Cloud Kingdom quest on the page: Ginger the fox's kite
// won't fly with no wind, and once it's enchanted it soars into the sky.
// Also checks it and Pip's quest don't get in each other's way.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { start } from '../public/game/cloud-page.js';
import { ENCHANT, HELPER, LINES } from '../public/game/cloud-fox-quest.js';
import * as pip from '../public/game/cloud-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const ginger = () => $('[data-quest="ginger"] .helper');

let game;
beforeEach(() => {
  loadPage('cloud-kingdom.html');
  game = start(document);
});

describe('Cloud Kingdom fox quest', () => {
  it('starts with Ginger on the cloud, with a "!" over her', () => {
    expect($('[data-quest="ginger"]').dataset.step).toBe('waiting');
    expect($('[data-quest="ginger"] .helper .alert')).not.toBeNull();
    expect(game.stepOf('ginger')).toBe('waiting');
  });

  it('draws the kite on the cloud, and the breeze and string waiting to show', () => {
    expect($('[data-quest="ginger"] .kite-flight')).not.toBeNull();
    expect($('[data-quest="ginger"] .breeze')).not.toBeNull();
    expect($('[data-quest="ginger"] .kite-string')).not.toBeNull();
    expect($('[data-quest="ginger"] .enchant-swirl')).not.toBeNull();
  });

  it('makes Ginger work like a button', () => {
    expect(ginger().getAttribute('role')).toBe('button');
    expect(ginger().getAttribute('tabindex')).toBe('0');
    expect(ginger().getAttribute('aria-label')).toBe(`${HELPER} needs help. Tap to talk.`);
  });

  it('has Ginger explain the problem when tapped, and offers to enchant the kite', () => {
    tap(ginger());
    expect($('.story-speaker').textContent).toBe('Ginger the fox');
    expect($('.story-text').textContent).toBe(LINES.asked);
    expect($('.enchant').textContent).toBe(ENCHANT);
    expect($('.enchant').textContent).toBe('Enchant the kite');
    expect(document.activeElement).toBe($('.enchant'));
  });

  it('lets a keyboard talk to Ginger', () => {
    ginger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(game.stepOf('ginger')).toBe('asked');
  });

  it('flies the kite once it is enchanted', () => {
    tap(ginger());
    $('.enchant').click();
    expect($('[data-quest="ginger"]').dataset.step).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
  });

  it('stays helped, and tapping her again shows what she said', () => {
    tap(ginger());
    $('.enchant').click();
    expect(document.activeElement).toBe(ginger());
    tap(ginger());
    expect(game.stepOf('ginger')).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect(visible('.enchant')).toBe(false);
  });
});

describe('Cloud Kingdom with two quests', () => {
  it('says there are two friends to help', () => {
    expect($('.story-text').textContent).toBe(pip.LINES.waiting);
    expect(pip.LINES.waiting).toMatch(/^Two friends in the Cloud Kingdom need help/);
  });

  it('leaves Pip waiting while Ginger is helped', () => {
    tap(ginger());
    $('.enchant').click();
    expect($('[data-quest="pip"]').dataset.step).toBe('waiting');
  });

  it('can help both, one after the other', () => {
    tap($('[data-quest="pip"] .helper'));
    $('.enchant').click();
    tap(ginger());
    $('.enchant').click();
    expect(game.stepOf('pip')).toBe('done');
    expect(game.stepOf('ginger')).toBe('done');
  });
});
