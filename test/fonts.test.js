// Checks every page starts loading the fonts it uses right away, so the titles and
// words don't flash in a plain font first.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const publicDir = join(process.cwd(), 'public');
const pages = readdirSync(publicDir).filter((f) => f.endsWith('.html') && !f.startsWith('google')).sort();
const FONTS = ['fonts/fredoka-700.woff2', 'fonts/nunito-700.woff2'];
// The kingdom picker only has titles and kingdom names, so it only uses the
// title font, and loading the other would be a wasted download.
const fontsOn = (page) => (page === 'next.html' ? FONTS.slice(0, 1) : FONTS);

describe('fonts', () => {
  it.each(FONTS)('has %s', (font) => {
    expect(existsSync(join(publicDir, font))).toBe(true);
  });

  it.each(pages)('%s preloads the fonts it uses, before the styles', (page) => {
    const html = readFileSync(join(publicDir, page), 'utf8');
    const styles = html.indexOf('<link rel="stylesheet" href="./styles.css" />');
    for (const font of FONTS) {
      const preload = html.indexOf(`<link rel="preload" href="./${font}" as="font" type="font/woff2" crossorigin />`);
      if (!fontsOn(page).includes(font)) {
        expect(preload).toBe(-1);
        continue;
      }
      expect(preload).toBeGreaterThan(-1);
      expect(preload).toBeLessThan(styles);
    }
  });
});
