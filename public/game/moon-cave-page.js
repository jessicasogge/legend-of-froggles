// Draws the Moon Cave quest and handles the taps. The rules are in
// moon-cave-quest.js.
import { HELPER, LEGEND_LINE, LINES, START, next } from './moon-cave-quest.js';

export function start(doc) {
  const scene = doc.querySelector('svg.scene');
  const firefly = doc.querySelector('.firefly');
  const speaker = doc.querySelector('.story-speaker');
  const text = doc.querySelector('.story-text');
  const enchant = doc.querySelector('.enchant');
  const again = doc.querySelector('.again');
  const legend = doc.querySelector('.legend-line');

  let step = START;

  function show() {
    // The picture changes through CSS, keyed off this one attribute.
    scene.dataset.step = step;
    speaker.hidden = step === 'waiting';
    speaker.textContent = HELPER;
    text.textContent = LINES[step];
    enchant.hidden = step !== 'asked';
    again.hidden = step !== 'done';
    legend.hidden = step !== 'done';
    legend.textContent = LEGEND_LINE;
    firefly.setAttribute('aria-label', step === 'waiting' ? `${HELPER} needs help. Tap to talk.` : HELPER);
  }

  function act(action) {
    const was = step;
    step = next(step, action);
    if (step === was) return;
    show();
    // Keep keyboard users where the next thing to do is.
    if (step === 'asked') enchant.focus();
    if (step === 'done') again.focus();
  }

  // The firefly is drawn in the picture, so it's made to work like a button:
  // a tap, or Enter or Space when it has keyboard focus.
  firefly.addEventListener('click', () => act('talk'));
  firefly.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      act('talk');
    }
  });
  enchant.addEventListener('click', () => act('enchant'));
  again.addEventListener('click', () => act('again'));

  show();
  return { act, get step() { return step; } };
}
