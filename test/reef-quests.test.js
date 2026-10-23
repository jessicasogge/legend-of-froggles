// Plays the three Coral Reef quests on the page: a treasure chest pops open
// for Pearl the seahorse, the seaweed lets go of Inky the octopus's arms, and
// a big bubble floats Bubbles the little fish up to his school.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import * as bubbles from '../public/game/reef-fish-quest.js';
import * as inky from '../public/game/reef-octopus-quest.js';
import { start } from '../public/game/reef-page.js';
import * as pearl from '../public/game/reef-quest.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const visible = (sel) => !$(sel).hidden;
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

let game;
beforeEach(() => {
  loadPage('coral-reef.html');
  game = start(document);
});

const QUESTS = [
  { quest: pearl, enchant: 'Enchant the treasure chest', drawn: ['.chest-lid', '.chest-pearls', '.pearl-bob .helper'] },
  { quest: inky, enchant: 'Enchant the seaweed', drawn: ['.inky-wiggle .helper', '.helper .arms-tangled', '.helper .arms-free', '.helper .weed-tangle', '.helper .weed-free'] },
  { quest: bubbles, enchant: 'Enchant the bubble', drawn: ['.school', '.bubbles-rise .helper', '.helper .big-bubble'] },
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

describe('The Coral Reef with three quests', () => {
  it('says there are three friends to help', () => {
    expect($('.story-text').textContent).toBe(pearl.LINES.waiting);
    expect(pearl.LINES.waiting).toMatch(/^Three friends in the Coral Reef need help/);
  });

  it('keeps Inky tangled until he is helped', () => {
    tap($('[data-quest="pearl"] .helper'));
    $('.enchant').click();
    expect($('[data-quest="inky"]').dataset.step).toBe('waiting');
  });

  it('swims Mr. Froggles in a bubble that taps go through', () => {
    expect($('.froggles-swoop .froggles-bubble')).not.toBeNull();
  });

  it('can help all three, one after another', () => {
    for (const id of ['bubbles', 'inky', 'pearl']) {
      tap($(`[data-quest="${id}"] .helper`));
      $('.enchant').click();
    }
    expect(['pearl', 'inky', 'bubbles'].map(game.stepOf)).toEqual(['done', 'done', 'done']);
  });
});
