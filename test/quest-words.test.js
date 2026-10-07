// Checks every quest's words: the opening line tells kids to tap the "!",
// which is the same in every kingdom, rather than naming the animal, and the
// friend's thank-you is the only thing said at the end.
import { describe, expect, it } from 'vitest';
import * as cloud from '../public/game/cloud-quest.js';
import * as moonCaveBat from '../public/game/moon-cave-bat-quest.js';
import * as moonCave from '../public/game/moon-cave-quest.js';
import * as moonCaveStar from '../public/game/moon-cave-star-quest.js';
import * as pond from '../public/game/pond-quest.js';
import * as woodsOwl from '../public/game/woods-owl-quest.js';
import * as woods from '../public/game/woods-quest.js';
import * as woodsSquirrel from '../public/game/woods-squirrel-quest.js';

const QUESTS = { cloud, pond, woods, woodsOwl, woodsSquirrel, moonCave, moonCaveStar, moonCaveBat };

describe.each(Object.entries(QUESTS))('%s quest', (_, quest) => {
  it('says to tap the exclamation point', () => {
    expect(quest.LINES.waiting).toMatch(/Tap (the|an) exclamation point to find out who\.$/);
  });

  it('ends with just the thank-you, with no second line saying the same thing', () => {
    expect(quest.LINES.done).toMatch(/Thank you, Mr\. Froggles!$/);
    expect(quest).not.toHaveProperty('LEGEND_LINE');
  });
});
