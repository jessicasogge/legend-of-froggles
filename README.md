# The Legend of Mr. Froggles 🐸

> This is the legend of the flying frog that is magical and it can fly.

A game based on an original drawing by Caitlin Sogge.

A browser game for kids starring Mr. Froggles, a magical frog who flies on bowtie wings and uses purple enchantments to transform the world around him. Aimed at young readers, a step up from [Build a Rainbow](https://github.com/jessicasogge/build-a-rainbow).

For now there's the opening screen (Mr. Froggles, the legend, the credit for the original drawing, and a "Coming soon" button), a next screen where you pick one of four kingdoms, and a screen for each kingdom. Every kingdom has a quest.

## Running it locally

The game is plain HTML, CSS and JavaScript in [`public/`](public/), with no build step and no backend. To run it with the included dev server:

```sh
npm install
npm run dev
```

Then open http://localhost:3003.

To run the tests:

```sh
npm test
```

## How the code is organized

- `public/index.html`: the opening screen.
- `public/next.html`: the screen Coming soon leads to: pick one of the four kingdoms (Home Pond, Whispering Woods, Cloud Kingdom, Moon Cave). Each kingdom opens its own screen.
- `public/home-pond.html`: the Home Pond, lily pads, a water lily, cattails and tadpoles with Mr. Froggles flying over, a Back button to the kingdom picker, and a quest: Pebble the snail is stuck on a rock in the water, so tap her, read what she needs, and enchant the rock into a lily pad that floats her to shore.
- `public/whispering-woods.html`: the Whispering Woods, round trees and spotted mushrooms with Mr. Froggles flying through, a Back button to the kingdom picker, and two quests: Hazel the hedgehog can't cross the stream to her family, so tap her, read what she needs, and enchant the little leaf into a bridge; and Olive the owl has tumbled out of her nest, so enchant the mushroom she's sitting on to grow tall and carry her back up.
- `public/cloud-kingdom.html`: the Cloud Kingdom, a castle on a cloud with Mr. Froggles flying by, a Back button to the kingdom picker, and a quest: a rain cloud won't stop raining on Pip the bluebird, so tap her, read what she needs, and enchant the rain cloud into a rainbow so she can fly again.
- `public/moon-cave.html`: the Moon Cave, with Mr. Froggles flying by, a Back button to the kingdom picker, and the first quest: Flicker the firefly's light has gone out, so tap her, read what she needs, and enchant the cave to make it glow.
- `public/game/quest.js`: the steps every quest follows (talk, then enchant, then done). It doesn't touch the page, so the tests can play it directly.
- `public/game/quest-page.js`: draws a page's quests and handles the taps and keys. A kingdom with more than one quest gives each its own group in the picture (`data-quest`).
- `public/game/<kingdom>-quest.js`: one quest's words: who needs help, what they say, the button, and the legend line. `moon-cave-quest.js`, `woods-quest.js` and `woods-owl-quest.js`, `pond-quest.js` and `cloud-quest.js`.
- `public/game/<kingdom>-page.js`: starts that kingdom's quest on its page.
- `public/mr-froggles.svg`: Mr. Froggles, drawn from the original marker picture.
- `public/kingdoms/`: a picture of each kingdom, in the same marker-drawing style.
- `public/styles.css`: one stylesheet.
- `public/sitemap.xml`: every page, for search engines. A new page goes here too (a test checks).
- `src/index.ts`: the local dev server. The published game doesn't use it; GitHub Pages serves `public/` as is.

## Fonts

Fredoka and Nunito, both under the SIL Open Font License. The license files are in [`public/fonts/`](public/fonts/).

## Credits

Made by Jessica Sogge.
Mr. Froggles and his legend by Caitlin Sogge.
