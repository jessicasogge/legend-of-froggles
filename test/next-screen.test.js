// Checks the screen you reach by pressing Coming soon.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { loadPage } from './load-page.js';

beforeEach(() => {
  loadPage('next.html');
});

describe('next screen', () => {
  it('has the game name', () => {
    expect(document.querySelector('main.next-screen h1').textContent).toBe('The Legend of Mr. Froggles');
  });
});
