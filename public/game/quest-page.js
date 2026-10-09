// Draws a page's quests and handles the taps. Each kingdom's page passes in
// its quests (who needs help and what they say).

import { START, next } from './quest.js';

const SVG = 'http://www.w3.org/2000/svg';
// How long after the last enchantment the closing card shows: his last cast
// (3.8s), then twirling and flying off (2.4s). See styles.css.
export const FINALE_AFTER = 6400;
const SPARKLE = 'M0 -22 L6 -6 L22 0 L6 6 L0 22 L-6 6 L-22 0 L-6 -6 Z';

// "x y" in the picture's units, from a data attribute.
function point(text) {
  const [x, y] = (text ?? '').split(' ').map(Number);
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}

export function startQuests(doc, quests) {
  const scene = doc.querySelector('svg.scene');
  const speaker = doc.querySelector('.story-speaker');
  const text = doc.querySelector('.story-text');
  const enchant = doc.querySelector('.enchant');

  const roots = quests.map((quest) => (quest.ID ? doc.querySelector(`[data-quest="${quest.ID}"]`) : scene));
  const helpers = roots.map((root) => root.querySelector('.helper'));
  const steps = quests.map(() => START);
  let current = 0;

  // Mr. Froggles swoops to data-froggles-to; sparkles land at data-enchant-at.
  // Quest-root coordinates use picture units; styles.css animates both.
  const swoop = scene.querySelector('.froggles-swoop');
  const froggles = swoop?.querySelector('.froggles-flying');
  const sparkles = doc.createElementNS(SVG, 'g');
  sparkles.classList.add('sparkles');
  scene.append(sparkles);

  function cast(root) {
    const to = point(root.dataset.frogglesTo);
    const at = point(root.dataset.enchantAt);
    if (!froggles || !to || !at) return;
    const middle = (name, size) => Number(froggles.getAttribute(name)) + Number(froggles.getAttribute(size)) / 2;
    swoop.style.setProperty('--swoop-x', `${to.x - middle('x', 'width')}px`);
    swoop.style.setProperty('--swoop-y', `${to.y - middle('y', 'height')}px`);
    // Start the swoop over, even if he's still flying from the last one.
    swoop.classList.remove('casting');
    void scene.getBoundingClientRect();
    swoop.classList.add('casting');

    sparkles.replaceChildren();
    for (let i = 0; i < 8; i += 1) {
      const sparkle = doc.createElementNS(SVG, 'path');
      sparkle.classList.add('sparkle');
      sparkle.setAttribute('d', SPARKLE);
      // Spread them out a little, so they stream rather than stack.
      const spread = ((i % 3) - 1) * 24;
      sparkle.style.setProperty('--from-x', `${to.x + spread}px`);
      sparkle.style.setProperty('--from-y', `${to.y - spread}px`);
      sparkle.style.setProperty('--to-x', `${at.x - spread}px`);
      sparkle.style.setProperty('--to-y', `${at.y + spread / 2}px`);
      sparkle.style.animationDelay = `${0.35 + i * 0.09}s`;
      sparkles.append(sparkle);
    }
  }

  // Once everyone is helped, Mr. Froggles twirls and flies off (CSS, keyed off
  // data-finale), then the closing card covers the picture.
  const finale = doc.querySelector('.finale');
  let finished = false;

  function finish() {
    finished = true;
    scene.dataset.finale = '';
    setTimeout(() => {
      finale.hidden = false;
      finale.querySelector('.finale-next').focus();
    }, FINALE_AFTER);
  }

  function show() {
    quests.forEach((quest, i) => {
      // The picture changes through CSS, keyed off this one attribute.
      roots[i].dataset.step = steps[i];
      helpers[i].setAttribute('aria-label', steps[i] === 'waiting' ? `${quest.HELPER} needs help. Tap to talk.` : quest.HELPER);
    });

    const { HELPER, LINES, ENCHANT } = quests[current];
    const step = steps[current];
    speaker.hidden = step === 'waiting';
    speaker.textContent = HELPER;
    text.textContent = LINES[step];
    enchant.textContent = ENCHANT;
    enchant.hidden = step !== 'asked';
  }

  function act(action, i = current) {
    const was = steps[i];
    const switched = i !== current;
    current = i;
    steps[i] = next(was, action);
    if (steps[i] === was && !switched) return;
    show();
    if (action === 'enchant' && steps[i] === 'done') cast(roots[i]);
    // Keep keyboard users where the next thing to do is: the Enchant button,
    // then back in the picture with whoever they just helped.
    if (steps[i] === 'asked') enchant.focus();
    if (action === 'enchant' && steps[i] === 'done') helpers[i].focus();
    if (finale && !finished && steps.every((step) => step === 'done')) finish();
  }

  // Helpers are drawn in the picture, so they're made to work like buttons.
  helpers.forEach((helper, i) => {
    helper.addEventListener('click', () => act('talk', i));
    helper.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        act('talk', i);
      }
    });
  });
  enchant.addEventListener('click', () => act('enchant'));
  finale?.querySelector('.finale-stay').addEventListener('click', () => {
    finale.hidden = true;
    helpers[current].focus();
  });

  show();
  return {
    act,
    // The step of the quest in the story box.
    get step() { return steps[current]; },
    stepOf: (id) => steps[quests.findIndex((quest) => quest.ID === id)],
  };
}

export const startQuest = (doc, quest) => startQuests(doc, [quest]);
