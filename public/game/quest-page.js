// Draws a page's quests and handles the taps. Each kingdom's page passes in
// its quests (who needs help, what they say, the legend line).
//
// With one quest, its step is kept on the scene. With more, each quest has an
// ID and its own group in the picture (data-quest="<ID>") holding its helper
// and drawings, and its step is kept there, so each quest's picture changes
// on its own. They share the story box, which shows whoever was tapped last.
import { START, next } from './quest.js';

export function startQuests(doc, quests) {
  const scene = doc.querySelector('svg.scene');
  const speaker = doc.querySelector('.story-speaker');
  const text = doc.querySelector('.story-text');
  const enchant = doc.querySelector('.enchant');
  const again = doc.querySelector('.again');
  const legend = doc.querySelector('.legend-line');

  const roots = quests.map((quest) => (quest.ID ? doc.querySelector(`[data-quest="${quest.ID}"]`) : scene));
  const helpers = roots.map((root) => root.querySelector('.helper'));
  const steps = quests.map(() => START);
  let current = 0;

  function show() {
    quests.forEach((quest, i) => {
      // The picture changes through CSS, keyed off this one attribute.
      roots[i].dataset.step = steps[i];
      helpers[i].setAttribute('aria-label', steps[i] === 'waiting' ? `${quest.HELPER} needs help. Tap to talk.` : quest.HELPER);
    });

    const { HELPER, LINES, LEGEND_LINE, ENCHANT } = quests[current];
    const step = steps[current];
    speaker.hidden = step === 'waiting';
    speaker.textContent = HELPER;
    text.textContent = LINES[step];
    enchant.textContent = ENCHANT;
    enchant.hidden = step !== 'asked';
    again.hidden = step !== 'done';
    legend.hidden = step !== 'done';
    legend.textContent = LEGEND_LINE;
  }

  function act(action, i = current) {
    const was = steps[i];
    const switched = i !== current;
    current = i;
    steps[i] = next(was, action);
    if (steps[i] === was && !switched) return;
    show();
    // Keep keyboard users where the next thing to do is.
    if (steps[i] === 'asked') enchant.focus();
    if (steps[i] === 'done') again.focus();
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
  again.addEventListener('click', () => act('again'));

  show();
  return {
    act,
    // The step of the quest in the story box.
    get step() { return steps[current]; },
    stepOf: (id) => steps[quests.findIndex((quest) => quest.ID === id)],
  };
}

export const startQuest = (doc, quest) => startQuests(doc, [quest]);
