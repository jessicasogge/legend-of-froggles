// Draws any quest and handles the taps. Each kingdom's page passes in its
// quest (who needs help, what they say, the legend line).
import { START, next } from './quest.js';

export function startQuest(doc, { HELPER, LINES, LEGEND_LINE, ENCHANT }) {
  const scene = doc.querySelector('svg.scene');
  const helper = doc.querySelector('.helper');
  const speaker = doc.querySelector('.story-speaker');
  const text = doc.querySelector('.story-text');
  const enchant = doc.querySelector('.enchant');
  const again = doc.querySelector('.again');
  const legend = doc.querySelector('.legend-line');

  let step = START;
  enchant.textContent = ENCHANT;

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
    helper.setAttribute('aria-label', step === 'waiting' ? `${HELPER} needs help. Tap to talk.` : HELPER);
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

  // The helper is drawn in the picture, so it's made to work like a button.
  helper.addEventListener('click', () => act('talk'));
  helper.addEventListener('keydown', (event) => {
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
