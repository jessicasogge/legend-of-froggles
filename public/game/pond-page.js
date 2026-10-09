import * as pebble from './pond-quest.js';
import * as wiggles from './pond-tadpole-quest.js';
import * as bumble from './pond-bee-quest.js';
import { startQuests } from './quest-page.js';

export const start = (doc) => startQuests(doc, [pebble, wiggles, bumble]);
