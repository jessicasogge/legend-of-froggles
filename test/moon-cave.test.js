// Checks the Moon Cave screen: the cave, Mr. Froggles, and a way back.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { loadPage } from './load-page.js';

beforeEach(() => {
  loadPage('moon-cave.html');
});

describe('Moon Cave screen', () => {
  it('is called Moon Cave', () => {
    expect(document.querySelector('main.kingdom-screen h1').textContent).toBe('Moon Cave');
  });

  it('shows the cave, described for anyone who cannot see it', () => {
    const scene = document.querySelector('svg.scene');
    expect(scene.getAttribute('role')).toBe('img');
    expect(scene.getAttribute('aria-label')).toMatch(/Moon Cave/);
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
