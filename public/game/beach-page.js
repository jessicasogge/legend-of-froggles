import * as tilly from './beach-quest.js';
import * as splash from './beach-dolphin-quest.js';
import * as shelly from './beach-crab-quest.js';
import { startQuests } from './quest-page.js';

export const start = (doc) => startQuests(doc, [tilly, splash, shelly]);
