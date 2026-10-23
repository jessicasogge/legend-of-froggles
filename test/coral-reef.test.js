// Checks the Coral Reef screen: under the sea, Mr. Froggles, and a way back.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { loadPage } from './load-page.js';

beforeEach(() => {
  loadPage('coral-reef.html');
});

describe('Coral Reef screen', () => {
  it('is called Coral Reef', () => {
    expect(document.querySelector('main.kingdom-screen h1').textContent).toBe('Coral Reef');
  });

  it('uses the under-the-sea colors', () => {
    expect(document.body.classList.contains('reef')).toBe(true);
  });

  it('shows the reef, described for anyone who cannot see it', () => {
    const scene = document.querySelector('svg.scene');
    expect(scene.getAttribute('role')).toBe('group');
    expect(scene.getAttribute('aria-label')).toMatch(/Coral Reef/);
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
