// Checks the storybook: the whole legend, one page at a time, with every
// friend from the game in it.
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import * as cloudFox from '../public/game/cloud-fox-quest.js';
import * as cloud from '../public/game/cloud-quest.js';
import * as cloudUnicorn from '../public/game/cloud-unicorn-quest.js';
import * as moonCaveBat from '../public/game/moon-cave-bat-quest.js';
import * as moonCave from '../public/game/moon-cave-quest.js';
import * as moonCaveStar from '../public/game/moon-cave-star-quest.js';
import * as pondBee from '../public/game/pond-bee-quest.js';
import * as pond from '../public/game/pond-quest.js';
import * as pondTadpole from '../public/game/pond-tadpole-quest.js';
import { start } from '../public/game/story-page.js';
import * as woodsOwl from '../public/game/woods-owl-quest.js';
import * as woods from '../public/game/woods-quest.js';
import * as woodsSquirrel from '../public/game/woods-squirrel-quest.js';
import { loadPage } from './load-page.js';

const FRIENDS = [pond, pondTadpole, pondBee, woods, woodsOwl, woodsSquirrel, cloud, cloudFox, cloudUnicorn, moonCave, moonCaveStar, moonCaveBat].map((quest) => quest.HELPER);

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const shown = () => $$('.story-page').filter((page) => !page.hidden);

let book;
beforeEach(() => {
  loadPage('story.html');
  book = start(document);
});

describe('The story', () => {
  it('opens on the first page, with the legend line', () => {
    expect(shown()).toHaveLength(1);
    expect(shown()[0].textContent).toContain('This is the legend of the flying frog that is magical and it can fly.');
    expect($('.story-count').textContent).toBe('Page 1 of 6');
    expect($('.story-prev').disabled).toBe(true);
    expect($('.story-next').disabled).toBe(false);
  });

  it('has a page for each kingdom, in order, and an ending', () => {
    expect($$('.story-page h2').map((h) => h.textContent)).toEqual([
      'The Legend of Mr. Froggles', 'The Home Pond', 'The Whispering Woods', 'The Cloud Kingdom', 'The Moon Cave', 'The End',
    ]);
  });

  it('tells about every friend in the game', () => {
    const story = $('.story-pages').textContent;
    for (const friend of FRIENDS) expect(story).toContain(friend);
  });

  it('turns the pages with Next and Back, and starts reading each page at its heading', () => {
    $('.story-next').click();
    expect(book.page).toBe(1);
    expect(shown()[0].querySelector('h2').textContent).toBe('The Home Pond');
    expect(document.activeElement).toBe(shown()[0].querySelector('h2'));
    expect($('.story-count').textContent).toBe('Page 2 of 6');
    $('.story-prev').click();
    expect(book.page).toBe(0);
  });

  it('turns the pages with the arrow keys too', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(book.page).toBe(2);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(book.page).toBe(1);
  });

  it('ends with a way to play the game or read it again', () => {
    for (let i = 0; i < 10; i += 1) $('.story-next').click();
    expect(book.page).toBe(5);
    expect($('.story-next').disabled).toBe(true);
    expect($('.story-play').getAttribute('href')).toBe('./next.html');
    $('.story-again').click();
    expect(book.page).toBe(0);
  });

  it('has a Back button to the opening screen', () => {
    expect($('a.back').getAttribute('href')).toBe('./');
    expect($('a.back').textContent.trim()).toBe('Back');
  });
});
