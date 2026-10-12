import * as pom from './frosty-quest.js';
import * as bo from './frosty-bear-quest.js';
import * as mitten from './frosty-hare-quest.js';
import { startQuests } from './quest-page.js';

export const start = (doc) => startQuests(doc, [pom, bo, mitten]);
