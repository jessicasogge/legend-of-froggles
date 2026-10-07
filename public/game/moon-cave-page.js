import * as flicker from './moon-cave-quest.js';
import * as twinkle from './moon-cave-star-quest.js';
import * as dot from './moon-cave-bat-quest.js';
import { startQuests } from './quest-page.js';

export const start = (doc) => startQuests(doc, [flicker, twinkle, dot]);
