import * as hazel from './woods-quest.js';
import * as olive from './woods-owl-quest.js';
import { startQuests } from './quest-page.js';

export const start = (doc) => startQuests(doc, [hazel, olive]);
