// Checks the opening screen has what it needs.
// @vitest-environment jsdom
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { loadPage } from './load-page.js';

const file = (name) => join(process.cwd(), 'public', name);
let html;
beforeEach(() => {
  html = loadPage('index.html');
});

describe('title screen', () => {
  it('has the game name', () => {
    expect(document.querySelector('h1.logo').textContent).toBe('The Legend of Mr. Froggles');
  });

  it('shows Mr. Froggles, with words for anyone who cannot see the picture', () => {
    const img = document.querySelector('img.froggles');
    expect(img.getAttribute('src')).toBe('./mr-froggles.svg');
    expect(img.getAttribute('alt')).toMatch(/Mr\. Froggles/);
    expect(existsSync(file('mr-froggles.svg'))).toBe(true);
  });

  it('tells the legend in the words it was first written in', () => {
    expect(document.querySelector('.tagline').textContent).toBe(
      'This is the legend of the flying frog that is magical and it can fly.',
    );
  });

  it('credits the original drawing the game is based on', () => {
    expect(document.querySelector('.credit').textContent).toBe(
      'A game based on an original drawing by Caitlin Sogge',
    );
  });

  it('says the game is coming soon, and Coming soon goes to the next screen', () => {
    const link = document.querySelector('a.coming-soon');
    expect(link.textContent).toBe('Coming soon');
    expect(link.getAttribute('href')).toBe('./next.html');
    expect(existsSync(file('next.html'))).toBe(true);
  });

  it('keeps the enchantments out of the way of screen readers', () => {
    expect(document.querySelector('.enchantments').getAttribute('aria-hidden')).toBe('true');
  });

  it('is signed at the foot', () => {
    expect(html).toContain('<footer class="signature">jsogge 2026</footer>');
  });

  it('has the tab icon and the fonts it loads', () => {
    expect(existsSync(file('favicon.svg'))).toBe(true);
    expect(existsSync(file('fonts/fredoka-700.woff2'))).toBe(true);
    expect(existsSync(file('fonts/nunito-700.woff2'))).toBe(true);
  });
});

describe('Mr. Froggles picture', () => {
  const svg = () => {
    document.body.innerHTML = readFileSync(file('mr-froggles.svg'), 'utf8');
    return document.querySelector('svg');
  };

  it('has a title naming him', () => {
    expect(svg().querySelector('title').textContent).toMatch(/Mr\. Froggles/);
  });

  it('is drawn in Froggles green, with a purple enchantment squiggle', () => {
    const colors = [...svg().querySelectorAll('[fill], [stroke]')].flatMap((el) => [
      el.getAttribute('fill'),
      el.getAttribute('stroke'),
    ]);
    expect(colors).toContain('#1F8A4C');
    expect(colors).toContain('#5B2A9E');
  });

  it('has two bowtie wings', () => {
    const wings = [...svg().querySelectorAll('path')].filter((p) => / Z$/.test(p.getAttribute('d')) && p.getAttribute('fill') === '#1F8A4C');
    expect(wings).toHaveLength(2);
  });
});
