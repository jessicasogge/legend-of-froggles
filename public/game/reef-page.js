import * as pearl from './reef-quest.js';
import * as inky from './reef-octopus-quest.js';
import * as bubbles from './reef-fish-quest.js';
import { startQuests } from './quest-page.js';

export const start = (doc) => startQuests(doc, [pearl, inky, bubbles]);
