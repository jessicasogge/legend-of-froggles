// Plays the three Candy Hills quests on the page: a gumdrop covers Crumb the
// gingerbread kid's house in candy, the lollipop tree gets its colors back for
// Taffy the mouse, and a cotton candy cloud shades Puff the marshmallow
// snowman so he puffs back up.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import * as taffy from '../public/game/candy-mouse-quest.js';
import { start } from '../public/game/candy-page.js';
import * as crumb from '../public/game/candy-quest.js';
import * as puff from '../public/game/candy-snowman-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

let game;
beforeEach(() => {
  loadPage('candy-hills.html');
  game = start(document);
});

const QUESTS = [
  { quest: crumb, enchant: 'Enchant the gumdrop', drawn: ['.lone-gumdrop', '.house-candy', '.crumb-hop .helper'] },
  { quest: taffy, enchant: 'Enchant the lollipop tree', drawn: ['.lolly-tree', '.lolly-tree .lolly-color', '.lolly-drop', '.taffy-hop .helper'] },
  { quest: puff, enchant: 'Enchant the cotton candy cloud', drawn: ['.candy-cloud', '.helper .puff-melted', '.helper .puff-whole'] },
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

describe('Candy Hills with three quests', () => {
  it('says there are three friends to help', () => {
    expect($('.story-text').textContent).toBe(crumb.LINES.waiting);
    expect(crumb.LINES.waiting).toMatch(/^Three friends in Candy Hills need help/);
  });

  it('leaves Puff melted until he is helped', () => {
    tap($('[data-quest="crumb"] .helper'));
    $('.enchant').click();
    expect($('[data-quest="puff"]').dataset.step).toBe('waiting');
  });

  it('can help all three, one after another', () => {
    for (const id of ['puff', 'taffy', 'crumb']) {
      tap($(`[data-quest="${id}"] .helper`));
      $('.enchant').click();
    }
    expect(['crumb', 'taffy', 'puff'].map(game.stepOf)).toEqual(['done', 'done', 'done']);
  });
});
