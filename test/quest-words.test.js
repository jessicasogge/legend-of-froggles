// Checks every quest's words: the opening line tells kids to tap the "!",
// which is the same in every kingdom, rather than naming the animal, and the
// friend's thank-you is the only thing said at the end.
import { describe, expect, it } from 'vitest';
import * as cloudFox from '../public/game/cloud-fox-quest.js';
import * as cloud from '../public/game/cloud-quest.js';
import * as cloudUnicorn from '../public/game/cloud-unicorn-quest.js';
import * as beachCrab from '../public/game/beach-crab-quest.js';
import * as beachDolphin from '../public/game/beach-dolphin-quest.js';
import * as beach from '../public/game/beach-quest.js';
import * as candyMouse from '../public/game/candy-mouse-quest.js';
import * as candy from '../public/game/candy-quest.js';
import * as candySnowman from '../public/game/candy-snowman-quest.js';
import * as frostyBear from '../public/game/frosty-bear-quest.js';
import * as frostyHare from '../public/game/frosty-hare-quest.js';
import * as frosty from '../public/game/frosty-quest.js';
import * as moonCaveBat from '../public/game/moon-cave-bat-quest.js';
import * as moonCave from '../public/game/moon-cave-quest.js';
import * as moonCaveStar from '../public/game/moon-cave-star-quest.js';
import * as pondBee from '../public/game/pond-bee-quest.js';
import * as pond from '../public/game/pond-quest.js';
import * as pondTadpole from '../public/game/pond-tadpole-quest.js';
import * as woodsOwl from '../public/game/woods-owl-quest.js';
import * as woods from '../public/game/woods-quest.js';
import * as woodsSquirrel from '../public/game/woods-squirrel-quest.js';
import * as reefFish from '../public/game/reef-fish-quest.js';
import * as reefOctopus from '../public/game/reef-octopus-quest.js';
import * as reef from '../public/game/reef-quest.js';

const QUESTS = { cloud, cloudFox, cloudUnicorn, frosty, frostyBear, frostyHare, beach, beachDolphin, beachCrab, candy, candyMouse, candySnowman, reef, reefOctopus, reefFish, pond, pondTadpole, pondBee, woods, woodsOwl, woodsSquirrel, moonCave, moonCaveStar, moonCaveBat };

describe.each(Object.entries(QUESTS))('%s quest', (_, quest) => {
  it('says to tap the exclamation point', () => {
    expect(quest.LINES.waiting).toMatch(/Tap (the|an) exclamation point to find out who\.$/);
  });

  it('ends with just the thank-you, with no second line saying the same thing', () => {
    expect(quest.LINES.done).toMatch(/Thank you, Mr\. Froggles!$/);
    expect(quest).not.toHaveProperty('LEGEND_LINE');
  });
});
