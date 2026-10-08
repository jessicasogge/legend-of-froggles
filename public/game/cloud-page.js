import * as pip from './cloud-quest.js';
import * as ginger from './cloud-fox-quest.js';
import { startQuests } from './quest-page.js';

export const start = (doc) => startQuests(doc, [pip, ginger]);
