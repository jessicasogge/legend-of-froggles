# The Legend of Mr. Froggles 🐸

> This is the legend of the flying frog that is magical and it can fly.

A game based on an original drawing by Caitlin Sogge.

A browser game for kids starring Mr. Froggles, a magical frog who flies on bowtie wings and uses purple enchantments to transform the world around him. Aimed at young readers, a step up from [Build a Rainbow](https://github.com/jessicasogge/build-a-rainbow).

For now there's the opening screen (Mr. Froggles, the legend, the credit for the original drawing, and a "Coming soon" button), a next screen where you pick one of four kingdoms, and a screen for each kingdom. The Moon Cave and the Whispering Woods each have a quest.

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
- `public/home-pond.html`: the Home Pond, lily pads, a water lily, cattails and tadpoles with Mr. Froggles flying over, and a Back button to the kingdom picker.
- `public/whispering-woods.html`: the Whispering Woods, round trees and spotted mushrooms with Mr. Froggles flying through, a Back button to the kingdom picker, and a quest: Hazel the hedgehog can't cross the stream to her family, so tap her, read what she needs, and enchant the little leaf into a bridge.
- `public/cloud-kingdom.html`: the Cloud Kingdom, a castle on a cloud with Mr. Froggles flying by, and a Back button to the kingdom picker.
- `public/moon-cave.html`: the Moon Cave, with Mr. Froggles flying by, a Back button to the kingdom picker, and the first quest: Flicker the firefly's light has gone out, so tap her, read what she needs, and enchant the cave to make it glow.
- `public/game/quest.js`: the steps every quest follows (talk, then enchant, then done). It doesn't touch the page, so the tests can play it directly.
- `public/game/quest-page.js`: draws any quest and handles the taps and keys.
- `public/game/<kingdom>-quest.js`: one quest's words: who needs help, what they say, the button, and the legend line. `moon-cave-quest.js` and `woods-quest.js` so far.
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
