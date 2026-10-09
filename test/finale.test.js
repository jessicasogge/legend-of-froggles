// Checks the end of each kingdom: once everyone is helped, Mr. Froggles
// twirls and flies off, then a closing card covers the picture, with a way
// to another kingdom or to stay and look.
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { start as startCloud } from '../public/game/cloud-page.js';
import { start as startMoonCave } from '../public/game/moon-cave-page.js';
import { start as startPond } from '../public/game/pond-page.js';
import { FINALE_AFTER } from '../public/game/quest-page.js';
import { start as startWoods } from '../public/game/woods-page.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const help = (root) => {
  tap($(`${root} .helper`));
  $('.enchant').click();
};

const KINGDOMS = [
  { page: 'cloud-kingdom.html', name: 'the Cloud Kingdom', start: startCloud, roots: ['[data-quest="pip"]', '[data-quest="ginger"]', '[data-quest="lulu"]'] },
  { page: 'home-pond.html', name: 'the Home Pond', start: startPond, roots: ['[data-quest="pebble"]', '[data-quest="wiggles"]', '[data-quest="bumble"]'] },
  { page: 'whispering-woods.html', name: 'the Whispering Woods', start: startWoods, roots: ['[data-quest="hazel"]', '[data-quest="olive"]', '[data-quest="nutmeg"]'] },
  { page: 'moon-cave.html', name: 'the Moon Cave', start: startMoonCave, roots: ['[data-quest="flicker"]', '[data-quest="twinkle"]', '[data-quest="dot"]'] },
];

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe.each(KINGDOMS)('$page', ({ page, name, start, roots }) => {
  beforeEach(() => {
    loadPage(page);
    start(document);
  });

  it('has a closing card over the picture, hidden at first', () => {
    expect($('.scene-box > svg.scene')).not.toBeNull();
    expect($('.scene-box > .finale').hidden).toBe(true);
    expect($('.scene-box + .story')).not.toBeNull();
    expect($('.froggles-exit .froggles-swoop .froggles-flying')).not.toBeNull();
  });

  it("doesn't end until everyone is helped", () => {
    for (const root of roots.slice(0, -1)) help(root);
    vi.advanceTimersByTime(FINALE_AFTER * 2);
    expect($('svg.scene').hasAttribute('data-finale')).toBe(false);
    expect($('.finale').hidden).toBe(true);
  });

  it('sends Mr. Froggles off, then shows the closing card, once everyone is helped', () => {
    for (const root of roots) help(root);
    expect($('svg.scene').hasAttribute('data-finale')).toBe(true);
    expect($('.finale').hidden).toBe(true);

    vi.advanceTimersByTime(FINALE_AFTER);
    expect($('.finale').hidden).toBe(false);
    expect($('.finale').getAttribute('role')).toBe('dialog');
    expect($('#finale-title').textContent).toBe('You did it!');
    expect($('.finale-card p').textContent).toContain(`Everyone in ${name} is happy again.`);
    expect($('.finale-next').getAttribute('href')).toBe('./next.html');
    expect(document.activeElement).toBe($('.finale-next'));
  });

  it('can be closed to stay and look at the picture', () => {
    for (const root of roots) help(root);
    vi.advanceTimersByTime(FINALE_AFTER);
    $('.finale-stay').click();
    expect($('.finale').hidden).toBe(true);
    expect(document.activeElement).toBe($(`${roots.at(-1)} .helper`));
  });
});
