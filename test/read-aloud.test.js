// Checks the "Read to me" button: it reads the storybook page, or what a friend
// is saying, out loud with the browser's own voice. The voice here is a pretend
// one that writes down what it was asked to say.
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { start as startPond } from '../public/game/pond-page.js';
import * as pebble from '../public/game/pond-quest.js';
import { sentences } from '../public/game/read-aloud.js';
import { start as startStory } from '../public/game/story-page.js';
import { loadPage } from './load-page.js';

const $ = (sel) => document.querySelector(sel);
const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

let voice;
beforeEach(() => {
  voice = {
    said: [],
    cancelled: 0,
    speak(utterance) {
      this.said.push(utterance);
    },
    cancel() {
      this.cancelled += 1;
    },
  };
  window.speechSynthesis = voice;
  window.SpeechSynthesisUtterance = class {
    constructor(text) {
      this.text = text;
    }
  };
});

afterEach(() => {
  delete window.speechSynthesis;
  delete window.SpeechSynthesisUtterance;
});

const heard = () => voice.said.map((utterance) => utterance.text);
const reading = () => $('.read-aloud').getAttribute('aria-pressed') === 'true';

describe('sentences', () => {
  it('splits words into sentences, keeping Mr. Froggles together', () => {
    expect(sentences('His name is Mr. Froggles. He can fly! Can you?')).toEqual([
      'His name is Mr. Froggles.',
      'He can fly!',
      'Can you?',
    ]);
  });
});

describe('Read to me, in the storybook', () => {
  beforeEach(() => {
    loadPage('story.html');
    startStory(document);
  });

  it('is a button with a name a screen reader can say', () => {
    expect($('.story-pages .read-aloud').getAttribute('aria-label')).toBe('Read to me');
    expect(reading()).toBe(false);
  });

  it('reads the page that is showing, title first', () => {
    tap($('.read-aloud'));
    expect(heard()[0]).toBe('The Legend of Mr. Froggles.');
    expect(heard()).toContain('His name is Mr. Froggles.');
    expect(reading()).toBe(true);
  });

  it('stops when tapped again', () => {
    tap($('.read-aloud'));
    tap($('.read-aloud'));
    expect(reading()).toBe(false);
    expect(voice.cancelled).toBeGreaterThan(1);
  });

  it('stops when the page turns, then reads the new page', () => {
    tap($('.read-aloud'));
    $('.story-next').click();
    expect(reading()).toBe(false);
    voice.said = [];
    tap($('.read-aloud'));
    expect(heard()[0]).toBe('The Home Pond.');
  });

  it('shows it is done once the last sentence has been read', () => {
    tap($('.read-aloud'));
    voice.said.at(-1).onend();
    expect(reading()).toBe(false);
  });
});

describe('Read to me, in a kingdom', () => {
  beforeEach(() => {
    loadPage('home-pond.html');
    startPond(document);
  });

  it('sits in the story box', () => {
    expect($('.story .read-aloud')).not.toBeNull();
  });

  it('reads who is talking, then what they say', () => {
    tap($('[data-quest="pebble"] .helper'));
    tap($('.read-aloud'));
    expect(heard()[0]).toBe(`${pebble.HELPER}.`);
    expect(heard().slice(1).join(' ')).toBe(pebble.LINES.asked);
  });

  it('stops when the words in the story box change', () => {
    tap($('.read-aloud'));
    tap($('[data-quest="pebble"] .helper'));
    expect(reading()).toBe(false);
  });
});

describe('Read to me, in a browser that cannot speak', () => {
  it('leaves the button out', () => {
    delete window.speechSynthesis;
    loadPage('story.html');
    startStory(document);
    expect($('.read-aloud')).toBeNull();
  });
});
