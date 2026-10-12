// Checks the Frosty Peak screen: the mountains, Mr. Froggles, and a way back.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { loadPage } from './load-page.js';

beforeEach(() => {
  loadPage('frosty-peak.html');
});

describe('Frosty Peak screen', () => {
  it('is called Frosty Peak', () => {
    expect(document.querySelector('main.kingdom-screen h1').textContent).toBe('Frosty Peak');
  });

  it('uses the snowy colors', () => {
    expect(document.body.classList.contains('snow')).toBe(true);
  });

  it('shows the mountains, described for anyone who cannot see it', () => {
    const scene = document.querySelector('svg.scene');
    expect(scene.getAttribute('role')).toBe('group');
    expect(scene.getAttribute('aria-label')).toMatch(/Frosty Peak/);
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
