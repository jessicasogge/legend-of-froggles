// Checks you can tap Mr. Froggles in every kingdom: he does a flip and says
// hello in a speech bubble, without changing anyone's quest.
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { start as startBeach } from '../public/game/beach-page.js';
import { start as startCandy } from '../public/game/candy-page.js';
import { start as startReef } from '../public/game/reef-page.js';
import { start as startCloud } from '../public/game/cloud-page.js';
import { start as startFrosty } from '../public/game/frosty-page.js';
import { start as startMoonCave } from '../public/game/moon-cave-page.js';
import { start as startPond } from '../public/game/pond-page.js';
import { HELLOS } from '../public/game/quest-page.js';
import { start as startWoods } from '../public/game/woods-page.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

const KINGDOMS = [
  { page: 'cloud-kingdom.html', start: startCloud },
  { page: 'home-pond.html', start: startPond },
  { page: 'whispering-woods.html', start: startWoods },
  { page: 'moon-cave.html', start: startMoonCave },
  { page: 'frosty-peak.html', start: startFrosty },
  { page: 'seashell-beach.html', start: startBeach },
  { page: 'candy-hills.html', start: startCandy },
  { page: 'coral-reef.html', start: startReef },
];

describe.each(KINGDOMS)('Mr. Froggles in $page', ({ page, start }) => {
  const begin = () => {
    loadPage(page);
    return start(document);
  };

  it('works like a button, and still swoops to cast', () => {
    begin();
    const hello = $('.froggles-swoop .froggles-flip .froggles-hello');
    expect(hello.getAttribute('role')).toBe('button');
    expect(hello.getAttribute('tabindex')).toBe('0');
    expect(hello.getAttribute('aria-label')).toBe('Mr. Froggles. Tap to say hello.');
    expect($('.froggles-swoop .froggles-flip image.froggles-flying')).not.toBeNull();
  });

  it('does a flip and says hello when tapped', () => {
    begin();
    tap($('.froggles-hello'));
    expect($('.froggles-flip').classList.contains('flipping')).toBe(true);
    expect($('.froggles-says').classList.contains('saying')).toBe(true);
    expect($('.froggles-says text').textContent).toBe(HELLOS[0]);
  });

  it('says something new each tap, then starts over', () => {
    begin();
    const said = [];
    for (let i = 0; i <= HELLOS.length; i += 1) {
      tap($('.froggles-hello'));
      said.push($('.froggles-says text').textContent);
    }
    expect(said).toEqual([...HELLOS, HELLOS[0]]);
  });

  it('can be tapped with a keyboard', () => {
    begin();
    $('.froggles-hello').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect($('.froggles-flip').classList.contains('flipping')).toBe(true);
  });

  it('leaves the story and the quests alone', () => {
    const game = begin();
    const before = $('.story-text').textContent;
    tap($('.froggles-hello'));
    expect($('.story-text').textContent).toBe(before);
    expect(game.step).toBe('waiting');
  });

  it('stays quiet once he is flying off at the end', () => {
    begin();
    $('svg.scene').dataset.finale = '';
    tap($('.froggles-hello'));
    expect($('.froggles-flip').classList.contains('flipping')).toBe(false);
  });
});
