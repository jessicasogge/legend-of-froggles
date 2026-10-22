// Checks the Candy Hills screen: the hills, Mr. Froggles, and a way back.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { loadPage } from './load-page.js';

beforeEach(() => {
  loadPage('candy-hills.html');
});

describe('Candy Hills screen', () => {
  it('is called Candy Hills', () => {
    expect(document.querySelector('main.kingdom-screen h1').textContent).toBe('Candy Hills');
  });

  it('uses the candy colors', () => {
    expect(document.body.classList.contains('candy')).toBe(true);
  });

  it('shows the hills, described for anyone who cannot see it', () => {
    const scene = document.querySelector('svg.scene');
    expect(scene.getAttribute('role')).toBe('group');
    expect(scene.getAttribute('aria-label')).toMatch(/Candy Hills/);
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
