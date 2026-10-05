// Checks the Home Pond screen: the pond, Mr. Froggles, and a way back.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { loadPage } from './load-page.js';

beforeEach(() => {
  loadPage('home-pond.html');
});

describe('Home Pond screen', () => {
  it('is called Home Pond', () => {
    expect(document.querySelector('main.kingdom-screen h1').textContent).toBe('Home Pond');
  });

  it('uses the pond colors', () => {
    expect(document.body.classList.contains('pond')).toBe(true);
  });

  it('shows the pond, described for anyone who cannot see it', () => {
    const scene = document.querySelector('svg.scene');
    expect(scene.getAttribute('role')).toBe('group');
    expect(scene.getAttribute('aria-label')).toMatch(/Home Pond/);
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
