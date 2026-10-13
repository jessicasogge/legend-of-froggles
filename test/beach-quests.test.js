// Plays the three Seashell Beach quests on the page: a wave carries Tilly the
// sea turtle into the sea, the palm tree tosses Splash the dolphin's beach
// ball back to her, and a tiny shell grows into a new shell for Shelly the
// hermit crab.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import * as shelly from '../public/game/beach-crab-quest.js';
import * as splash from '../public/game/beach-dolphin-quest.js';
import { start } from '../public/game/beach-page.js';
import * as tilly from '../public/game/beach-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

let game;
beforeEach(() => {
  loadPage('seashell-beach.html');
  game = start(document);
});

const QUESTS = [
  { quest: tilly, enchant: 'Enchant the wave', drawn: ['.big-wave', '.tilly-ripples', '.tilly-swim .helper'] },
  { quest: splash, enchant: 'Enchant the palm tree', drawn: ['.palm-toss', '.splash-jump .helper', '.splash-jump .ball-arc'] },
  { quest: shelly, enchant: 'Enchant the little shell', drawn: ['.little-shell', '.shelly-dance .helper .tiny-shell', '.helper .big-shell'] },
];

describe.each(QUESTS)('$quest.HELPER', ({ quest, enchant, drawn }) => {
  const root = `[data-quest="${quest.ID}"]`;
  const friend = () => $(`${root} .helper`);

  it('starts waiting, with a "!" over them', () => {
    expect($(root).dataset.step).toBe('waiting');
    expect($(`${root} .helper .alert`)).not.toBeNull();
  });

  it('draws what gets enchanted, and what it becomes', () => {
    for (const sel of drawn) expect($(`${root} ${sel}`)).not.toBeNull();
    expect($(`${root} .enchant-swirl`)).not.toBeNull();
  });

  it('works like a button', () => {
    expect(friend().getAttribute('role')).toBe('button');
    expect(friend().getAttribute('tabindex')).toBe('0');
    expect(friend().getAttribute('aria-label')).toBe(`${quest.HELPER} needs help. Tap to talk.`);
  });

  it('explains the problem when tapped, and offers the right enchantment', () => {
    tap(friend());
    expect($('.story-speaker').textContent).toBe(quest.HELPER);
    expect($('.story-text').textContent).toBe(quest.LINES.asked);
    expect($('.enchant').textContent).toBe(enchant);
    expect(document.activeElement).toBe($('.enchant'));
  });

  it('can be talked to with a keyboard', () => {
    friend().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(game.stepOf(quest.ID)).toBe('asked');
  });

  it('is helped once enchanted, and stays helped', () => {
    tap(friend());
    $('.enchant').click();
    expect($(root).dataset.step).toBe('done');
    expect($('.story-text').textContent).toBe(quest.LINES.done);
    tap(friend());
    expect(game.stepOf(quest.ID)).toBe('done');
    expect(visible('.enchant')).toBe(false);
  });
});

describe('Seashell Beach with three quests', () => {
  it('says there are three friends to help', () => {
    expect($('.story-text').textContent).toBe(tilly.LINES.waiting);
    expect(tilly.LINES.waiting).toMatch(/^Three friends at Seashell Beach need help/);
  });

  it('leaves the ball in the palm tree until Splash is helped', () => {
    tap($('[data-quest="tilly"] .helper'));
    $('.enchant').click();
    expect($('[data-quest="splash"]').dataset.step).toBe('waiting');
  });

  it('can help all three, one after another', () => {
    for (const id of ['shelly', 'splash', 'tilly']) {
      tap($(`[data-quest="${id}"] .helper`));
      $('.enchant').click();
    }
    expect(['tilly', 'splash', 'shelly'].map(game.stepOf)).toEqual(['done', 'done', 'done']);
  });
});
