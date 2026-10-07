// Plays the second Whispering Woods quest on the page: Olive the owl has
// tumbled out of her nest, and the mushroom she's on grows tall enough to
// carry her back up. Also checks it and Hazel's quest don't get in each
// other's way.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { start } from '../public/game/woods-page.js';
import { ENCHANT, HELPER, LINES } from '../public/game/woods-owl-quest.js';
import * as hazel from '../public/game/woods-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const olive = () => $('[data-quest="olive"] .helper');
const hazelHelper = () => $('[data-quest="hazel"] .helper');

let game;
beforeEach(() => {
  loadPage('whispering-woods.html');
  game = start(document);
});

describe('Whispering Woods owl quest', () => {
  it('starts with Olive on the mushroom, with a "!" over her', () => {
    expect($('[data-quest="olive"]').dataset.step).toBe('waiting');
    expect($('[data-quest="olive"] .helper .alert')).not.toBeNull();
    expect(game.stepOf('olive')).toBe('waiting');
  });

  it('draws the mushroom that lifts her, and her nest', () => {
    expect($('[data-quest="olive"] .mushroom-lift .helper')).not.toBeNull();
    expect($('[data-quest="olive"] .enchant-swirl')).not.toBeNull();
  });

  it('makes Olive work like a button', () => {
    expect(olive().getAttribute('role')).toBe('button');
    expect(olive().getAttribute('tabindex')).toBe('0');
    expect(olive().getAttribute('aria-label')).toBe(`${HELPER} needs help. Tap to talk.`);
  });

  it('has Olive explain the problem when tapped, and offers to enchant the mushroom', () => {
    tap(olive());
    expect($('.story-speaker').textContent).toBe('Olive the owl');
    expect($('.story-text').textContent).toBe(LINES.asked);
    expect($('.enchant').textContent).toBe(ENCHANT);
    expect($('.enchant').textContent).toBe('Enchant the mushroom');
    expect(document.activeElement).toBe($('.enchant'));
  });

  it('lets a keyboard talk to Olive', () => {
    olive().dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(game.stepOf('olive')).toBe('asked');
  });

  it('grows the mushroom once it is enchanted', () => {
    tap(olive());
    $('.enchant').click();
    expect($('[data-quest="olive"]').dataset.step).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
  });

  it('stays helped, and tapping her again shows what she said', () => {
    tap(olive());
    $('.enchant').click();
    expect(document.activeElement).toBe(olive());
    tap(olive());
    expect(game.stepOf('olive')).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect(visible('.enchant')).toBe(false);
  });
});

describe('Whispering Woods with two quests', () => {
  it('leaves Hazel waiting while Olive is helped', () => {
    tap(olive());
    $('.enchant').click();
    expect($('[data-quest="hazel"]').dataset.step).toBe('waiting');
    expect(hazelHelper().getAttribute('aria-label')).toBe(`${hazel.HELPER} needs help. Tap to talk.`);
  });

  it('switches the story box to whoever was tapped last', () => {
    tap(hazelHelper());
    tap(olive());
    expect($('.story-speaker').textContent).toBe('Olive the owl');
    expect($('.enchant').textContent).toBe(ENCHANT);
    $('.enchant').click();
    expect(game.stepOf('olive')).toBe('done');
    expect(game.stepOf('hazel')).toBe('asked');

    tap(hazelHelper());
    expect($('.story-text').textContent).toBe(hazel.LINES.asked);
    expect($('.enchant').textContent).toBe(hazel.ENCHANT);
  });

  it('can help both, one after the other', () => {
    tap(hazelHelper());
    $('.enchant').click();
    tap(olive());
    $('.enchant').click();
    expect($('[data-quest="hazel"]').dataset.step).toBe('done');
    expect($('[data-quest="olive"]').dataset.step).toBe('done');
  });

  it('shows each friend\'s own words when tapped after both are helped', () => {
    tap(hazelHelper());
    $('.enchant').click();
    tap(olive());
    $('.enchant').click();
    tap(hazelHelper());
    expect($('.story-text').textContent).toBe(hazel.LINES.done);
  });
});
