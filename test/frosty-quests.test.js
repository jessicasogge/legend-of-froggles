// Plays the three Frosty Peak quests on the page: Pom the penguin's bumpy hill
// becomes an ice slide, Bo the polar bear cub's snowball becomes an igloo,
// and a snowflake becomes a red scarf for Mitten the snow hare.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import * as bo from '../public/game/frosty-bear-quest.js';
import * as mitten from '../public/game/frosty-hare-quest.js';
import { start } from '../public/game/frosty-page.js';
import * as pom from '../public/game/frosty-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

let game;
beforeEach(() => {
  loadPage('frosty-peak.html');
  game = start(document);
});

const QUESTS = [
  { quest: pom, enchant: 'Enchant the rocks', drawn: ['.frost-rocks', '.ice-slide', '.pom-ride .helper'] },
  { quest: bo, enchant: 'Enchant the snowball', drawn: ['.snowball', '.igloo', '.bo-walk .helper .shiver'] },
  { quest: mitten, enchant: 'Enchant the snowflake', drawn: ['.big-snowflake', '.helper .scarf'] },
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

describe('Frosty Peak with three quests', () => {
  it('says there are three friends to help', () => {
    expect($('.story-text').textContent).toBe(pom.LINES.waiting);
    expect(pom.LINES.waiting).toMatch(/^Three friends on Frosty Peak need help/);
  });

  it('keeps Bo shivering until he is helped', () => {
    tap($('[data-quest="pom"] .helper'));
    $('.enchant').click();
    expect($('[data-quest="bo"]').dataset.step).toBe('waiting');
  });

  it('can help all three, one after another', () => {
    for (const id of ['mitten', 'bo', 'pom']) {
      tap($(`[data-quest="${id}"] .helper`));
      $('.enchant').click();
    }
    expect(['pom', 'bo', 'mitten'].map(game.stepOf)).toEqual(['done', 'done', 'done']);
  });
});
