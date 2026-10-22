import * as crumb from './candy-quest.js';
import * as taffy from './candy-mouse-quest.js';
import * as puff from './candy-snowman-quest.js';
import { startQuests } from './quest-page.js';

export const start = (doc) => startQuests(doc, [crumb, taffy, puff]);
