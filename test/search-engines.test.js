// Checks every page has what search engines read, and that the sitemap lists
// every page, so a new page can't be left out by mistake.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SITE = 'https://jessicasogge.github.io/legend-of-froggles/';
const publicDir = join(process.cwd(), 'public');
// Google Search Console's file proving the site is ours. It's not a page of
// the game, so it isn't checked like one or listed in the sitemap.
const VERIFICATION = 'google32efa8321a61b455.html';
const pages = readdirSync(publicDir).filter((f) => f.endsWith('.html') && f !== VERIFICATION).sort();
const read = (name) => readFileSync(join(publicDir, name), 'utf8');
const addressOf = (page) => (page === 'index.html' ? SITE : SITE + page);

describe.each(pages)('%s', (page) => {
  const html = read(page);

  it('has a title naming the game', () => {
    expect(html).toMatch(/<title>[^<]*Mr\. Froggles[^<]*<\/title>/);
  });

  it('has a description', () => {
    const description = html.match(/<meta name="description" content="([^"]+)" \/>/)?.[1];
    expect(description?.length).toBeGreaterThan(40);
  });

  it('gives its one official address', () => {
    expect(html).toContain(`<link rel="canonical" href="${addressOf(page)}" />`);
  });

  it('shows the preview picture, its title and description when its link is shared', () => {
    const meta = (attr, name) => html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1];
    expect(meta('property', 'og:url')).toBe(addressOf(page));
    expect(meta('property', 'og:title')).toBe(html.match(/<title>([^<]+)<\/title>/)[1]);
    expect(meta('property', 'og:description')).toBe(meta('name', 'description'));
    // Apps need the picture's full address, not one relative to the page.
    expect(meta('property', 'og:image')).toBe(`${SITE}social-preview.png`);
    expect(meta('property', 'og:image:alt')).toMatch(/Mr\. Froggles/);
    expect(meta('name', 'twitter:card')).toBe('summary_large_image');
  });
});

describe('the picture shown when a link is shared', () => {
  it('is a 1200 by 630 PNG, the size link previews use', () => {
    const png = readFileSync(join(publicDir, 'social-preview.png'));
    expect(png.subarray(1, 4).toString()).toBe('PNG');
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  });
});

describe('sitemap', () => {
  it('lists every page, and nothing else', () => {
    const listed = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect([...listed].sort()).toEqual(pages.map(addressOf).sort());
  });
});

describe('Google Search Console', () => {
  // Google checks this file from time to time, so changing or deleting it
  // would undo the verification.
  it('keeps the verification file, exactly as Google gave it', () => {
    expect(read(VERIFICATION)).toBe(`google-site-verification: ${VERIFICATION}`);
  });
});
