// Checks Mr. Froggles casts each enchantment himself: on every quest he
// swoops over to hover near it, and sparkles fly from him to what he
// enchants.
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { start as startCloud } from '../public/game/cloud-page.js';
import { start as startMoonCave } from '../public/game/moon-cave-page.js';
import { start as startPond } from '../public/game/pond-page.js';
import { start as startWoods } from '../public/game/woods-page.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

// Each kingdom, and the root of each of its quests.
const KINGDOMS = [
  { page: 'cloud-kingdom.html', start: startCloud, roots: ['[data-quest="pip"]', '[data-quest="ginger"]'] },
  { page: 'home-pond.html', start: startPond, roots: ['svg.scene'] },
  { page: 'whispering-woods.html', start: startWoods, roots: ['[data-quest="hazel"]', '[data-quest="olive"]', '[data-quest="nutmeg"]'] },
  { page: 'moon-cave.html', start: startMoonCave, roots: ['[data-quest="flicker"]', '[data-quest="twinkle"]', '[data-quest="dot"]'] },
];

const POINT = /^\d+ \d+$/;

describe('Mr. Froggles casting enchantments', () => {
  for (const { page, start, roots } of KINGDOMS) {
    describe(page, () => {
      it('keeps him in a group that can swoop', () => {
        loadPage(page);
        expect($('svg.scene .froggles-swoop > image.froggles-flying')).not.toBeNull();
      });

      for (const root of roots) {
        it(`says where he hovers and where the sparkles land for ${root}`, () => {
          loadPage(page);
          expect($(root).dataset.frogglesTo).toMatch(POINT);
          expect($(root).dataset.enchantAt).toMatch(POINT);
        });

        it(`swoops him over and sends sparkles when ${root} is enchanted`, () => {
          loadPage(page);
          start(document);
          expect($('.froggles-swoop').classList.contains('casting')).toBe(false);
          tap($(`${root} .helper`));
          $('.enchant').click();

          const swoop = $('.froggles-swoop');
          const image = $('.froggles-flying');
          const [toX, toY] = $(root).dataset.frogglesTo.split(' ').map(Number);
          expect(swoop.classList.contains('casting')).toBe(true);
          expect(swoop.style.getPropertyValue('--swoop-x')).toBe(`${toX - (Number(image.getAttribute('x')) + 125)}px`);
          expect(swoop.style.getPropertyValue('--swoop-y')).toBe(`${toY - (Number(image.getAttribute('y')) + 162.5)}px`);

          const [atX] = $(root).dataset.enchantAt.split(' ').map(Number);
          const sparkles = $$('svg.scene .sparkles .sparkle');
          expect(sparkles).toHaveLength(8);
          expect(sparkles[1].style.getPropertyValue('--to-x')).toBe(`${atX}px`);
        });
      }
    });
  }

  it("doesn't cast when you only talk to someone", () => {
    loadPage('cloud-kingdom.html');
    startCloud(document);
    tap($('.helper'));
    expect($('.froggles-swoop').classList.contains('casting')).toBe(false);
    expect($$('.sparkle')).toHaveLength(0);
  });

  it("doesn't cast again when you tap someone you've already helped", () => {
    loadPage('cloud-kingdom.html');
    startCloud(document);
    tap($('.helper'));
    $('.enchant').click();
    $('.froggles-swoop').classList.remove('casting');
    tap($('.helper'));
    expect($('.froggles-swoop').classList.contains('casting')).toBe(false);
  });
});
