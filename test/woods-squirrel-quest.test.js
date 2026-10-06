// Plays the third Whispering Woods quest on the page: Nutmeg the squirrel has
// no acorns for winter, and the big oak tree grows lots. Also checks all
// three quests can be helped.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { start } from '../public/game/woods-page.js';
import { ENCHANT, HELPER, LEGEND_LINE, LINES } from '../public/game/woods-squirrel-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const nutmeg = () => $('[data-quest="nutmeg"] .helper');

let game;
beforeEach(() => {
  loadPage('whispering-woods.html');
  game = start(document);
});

describe('Whispering Woods squirrel quest', () => {
  it('starts with Nutmeg under the oak tree, with a "!" over her', () => {
    expect($('[data-quest="nutmeg"]').dataset.step).toBe('waiting');
    expect($('[data-quest="nutmeg"] .helper .alert')).not.toBeNull();
    expect(game.stepOf('nutmeg')).toBe('waiting');
  });

  it('draws the acorns waiting to grow, and the one that drops to her', () => {
    expect(document.querySelectorAll('[data-quest="nutmeg"] .acorns .acorn').length).toBeGreaterThan(3);
    expect($('[data-quest="nutmeg"] .acorn-drop')).not.toBeNull();
    expect($('[data-quest="nutmeg"] .enchant-swirl')).not.toBeNull();
  });

  it('makes Nutmeg work like a button', () => {
    expect(nutmeg().getAttribute('role')).toBe('button');
    expect(nutmeg().getAttribute('tabindex')).toBe('0');
    expect(nutmeg().getAttribute('aria-label')).toBe(`${HELPER} needs help. Tap to talk.`);
  });

  it('has Nutmeg explain the problem when tapped, and offers to enchant the oak tree', () => {
    tap(nutmeg());
    expect($('.story-speaker').textContent).toBe('Nutmeg the squirrel');
    expect($('.story-text').textContent).toBe(LINES.asked);
    expect($('.enchant').textContent).toBe(ENCHANT);
    expect($('.enchant').textContent).toBe('Enchant the oak tree');
    expect(document.activeElement).toBe($('.enchant'));
  });

  it('lets a keyboard talk to Nutmeg', () => {
    nutmeg().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(game.stepOf('nutmeg')).toBe('asked');
  });

  it('grows the acorns and adds to the legend once the tree is enchanted', () => {
    tap(nutmeg());
    $('.enchant').click();
    expect($('[data-quest="nutmeg"]').dataset.step).toBe('done');
    expect($('.story-text').textContent).toBe(LINES.done);
    expect($('.legend-line').textContent).toBe(LEGEND_LINE);
    expect(LEGEND_LINE).toMatch(/^The flying frog enchanted a big oak tree/);
  });

  it('can be played again', () => {
    tap(nutmeg());
    $('.enchant').click();
    $('.again').click();
    expect(game.stepOf('nutmeg')).toBe('waiting');
    expect(visible('.legend-line')).toBe(false);
  });
});

describe('Whispering Woods with three quests', () => {
  it('says there are three friends to help', () => {
    expect($('.story-text').textContent).toMatch(/^Three friends in the woods need help/);
  });

  it('can help all three, one after another', () => {
    for (const id of ['nutmeg', 'olive', 'hazel']) {
      tap($(`[data-quest="${id}"] .helper`));
      $('.enchant').click();
    }
    expect(['hazel', 'olive', 'nutmeg'].map(game.stepOf)).toEqual(['done', 'done', 'done']);
  });
});
