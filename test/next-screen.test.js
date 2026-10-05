// Checks the screen you reach by pressing Coming soon: pick a kingdom.
// @vitest-environment jsdom
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { loadPage } from './load-page.js';

const css = readFileSync(join(process.cwd(), 'public', 'styles.css'), 'utf8');

// How readable white text is on a color (WCAG contrast ratio).
function contrastWithWhite(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 1.05 / (0.2126 * r + 0.7152 * g + 0.0722 * b + 0.05);
}

const kingdoms = () => [...document.querySelectorAll('.kingdoms button.kingdom')];

beforeEach(() => {
  loadPage('next.html');
});

describe('pick a kingdom', () => {
  it('asks where Mr. Froggles will fly', () => {
    expect(document.querySelector('main.next-screen h1').textContent).toBe('Where will Mr. Froggles fly?');
  });

  it('offers the four kingdoms, in order', () => {
    expect(kingdoms().map((b) => b.textContent.trim())).toEqual(['Home Pond', 'Whispering Woods', 'Cloud Kingdom', 'Moon Cave']);
  });

  it('shows a picture of each kingdom, left out for screen readers since the name says it', () => {
    const pictures = kingdoms().map((b) => b.querySelector('img.kingdom-art'));
    expect(pictures.map((img) => img.getAttribute('src'))).toEqual([
      './kingdoms/home-pond.svg',
      './kingdoms/whispering-woods.svg',
      './kingdoms/cloud-kingdom.svg',
      './kingdoms/moon-cave.svg',
    ]);
    for (const img of pictures) {
      expect(img.getAttribute('alt')).toBe('');
      expect(existsSync(join(process.cwd(), 'public', img.getAttribute('src')))).toBe(true);
    }
  });

  it('has every kingdom open, with none locked', () => {
    for (const b of kingdoms()) expect(b.disabled).toBe(false);
  });

  it('makes each choice a real button, so it works with a keyboard', () => {
    for (const b of kingdoms()) expect(b.getAttribute('type')).toBe('button');
  });

  it('gives each kingdom its own color, dark enough for white text', () => {
    const colorOf = (cls) => {
      const hex = css.match(new RegExp(`\\.${cls} \\{ background: (#[0-9a-f]{6}|var\\(--enchantment\\)); \\}`))?.[1];
      return hex === 'var(--enchantment)' ? css.match(/--enchantment: (#[0-9a-f]{6})/)[1] : hex;
    };
    const colors = kingdoms().map((b) => colorOf([...b.classList].find((c) => c !== 'kingdom')));
    expect(new Set(colors).size).toBe(4);
    for (const c of colors) expect(contrastWithWhite(c)).toBeGreaterThanOrEqual(4.5);
  });
});
