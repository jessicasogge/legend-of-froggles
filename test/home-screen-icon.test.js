// Checks every page has the picture and name an iPhone or iPad uses when the
// game is saved to the home screen.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const publicDir = join(process.cwd(), 'public');
const pages = readdirSync(publicDir).filter((f) => f.endsWith('.html') && !f.startsWith('google')).sort();

describe('home screen icon', () => {
  it('is a 180 by 180 picture', () => {
    const png = readFileSync(join(publicDir, 'apple-touch-icon.png'));
    // A PNG's width and height are at bytes 16 to 23.
    expect(png.subarray(1, 4).toString()).toBe('PNG');
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([180, 180]);
  });

  it.each(pages)('is linked from %s, named Mr. Froggles', (page) => {
    const html = readFileSync(join(publicDir, page), 'utf8');
    expect(html).toContain('<link rel="apple-touch-icon" href="./apple-touch-icon.png" />');
    expect(html).toContain('<meta name="apple-mobile-web-app-title" content="Mr. Froggles" />');
  });
});
