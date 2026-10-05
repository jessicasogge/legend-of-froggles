// Checks the Whispering Woods screen: the forest, Mr. Froggles, and a way back.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { loadPage } from './load-page.js';

beforeEach(() => {
  loadPage('whispering-woods.html');
});

describe('Whispering Woods screen', () => {
  it('is called Whispering Woods', () => {
    expect(document.querySelector('main.kingdom-screen h1').textContent).toBe('Whispering Woods');
  });

  it('uses the forest colors', () => {
    expect(document.body.classList.contains('forest')).toBe(true);
  });

  it('shows the woods, described for anyone who cannot see it', () => {
    const scene = document.querySelector('svg.scene');
    expect(scene.getAttribute('role')).toBe('img');
    expect(scene.getAttribute('aria-label')).toMatch(/Whispering Woods/);
  });

  it('has Mr. Froggles in the scene', () => {
    expect(document.querySelector('svg.scene image.froggles-flying').getAttribute('href')).toBe('./mr-froggles.svg');
  });

  it('has a Back button that goes to the kingdom picker', () => {
    const back = document.querySelector('a.back');
    expect(back.textContent.trim()).toBe('Back');
    expect(back.getAttribute('href')).toBe('./next.html');
  });
});
