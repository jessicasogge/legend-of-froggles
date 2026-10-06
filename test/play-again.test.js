// Checks Play again sits under the story box on every kingdom, not inside
// it, so it doesn't read as something the friend is saying.
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { loadPage } from './load-page.js';

const PAGES = ['cloud-kingdom.html', 'home-pond.html', 'whispering-woods.html', 'moon-cave.html'];

describe('Play again', () => {
  for (const page of PAGES) {
    it(`is under the story box, not in it, on ${page}`, () => {
      loadPage(page);
      const again = document.querySelector('.again');
      expect(again.textContent).toBe('Play again');
      expect(again.closest('.story')).toBeNull();
      expect(document.querySelector('.story + .again')).toBe(again);
    });
  }
});
