// Checks the Cloud Kingdom screen: the castle, Mr. Froggles, and a way back.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { loadPage } from './load-page.js';

beforeEach(() => {
  loadPage('cloud-kingdom.html');
});

describe('Cloud Kingdom screen', () => {
  it('is called Cloud Kingdom', () => {
    expect(document.querySelector('main.kingdom-screen h1').textContent).toBe('Cloud Kingdom');
  });

  it('uses the daytime colors', () => {
    expect(document.body.classList.contains('day')).toBe(true);
  });

  it('shows the castle on its cloud, described for anyone who cannot see it', () => {
    const scene = document.querySelector('svg.scene');
    expect(scene.getAttribute('role')).toBe('group');
    expect(scene.getAttribute('aria-label')).toMatch(/castle on a big fluffy cloud/);
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
