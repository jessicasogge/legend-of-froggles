// Checks the Seashell Beach screen: the beach, Mr. Froggles, and a way back.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { loadPage } from './load-page.js';

beforeEach(() => {
  loadPage('seashell-beach.html');
});

describe('Seashell Beach screen', () => {
  it('is called Seashell Beach', () => {
    expect(document.querySelector('main.kingdom-screen h1').textContent).toBe('Seashell Beach');
  });

  it('uses the sunny beach colors', () => {
    expect(document.body.classList.contains('beach')).toBe(true);
  });

  it('shows the beach, described for anyone who cannot see it', () => {
    const scene = document.querySelector('svg.scene');
    expect(scene.getAttribute('role')).toBe('group');
    expect(scene.getAttribute('aria-label')).toMatch(/Seashell Beach/);
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
