# The Legend of Mr. Froggles 🐸

> This is the legend of the flying frog that is magical and it can fly.

A browser game for kids starring Mr. Froggles, a magical frog who flies on bowtie wings and uses purple enchantments to transform the world around him. Aimed at young readers, a step up from [Build a Rainbow](https://github.com/jessicasogge/build-a-rainbow).

For now there's just the opening screen: Mr. Froggles, the legend, and a "Coming soon" note.

## Running it locally

The game is plain HTML, CSS and JavaScript in [`public/`](public/), with no build step and no backend. To run it with the included dev server:

```sh
npm install
npm run dev
```

Then open http://localhost:3001.

To run the tests:

```sh
npm test
```

## How the code is organized

- `public/index.html`: the opening screen.
- `public/mr-froggles.svg`: Mr. Froggles, drawn from the original marker picture.
- `public/styles.css`: one stylesheet.
- `public/sitemap.xml`: every page, for search engines. A new page goes here too (a test checks).
- `src/index.ts`: the local dev server. The published game doesn't use it; GitHub Pages serves `public/` as is.

## Fonts

Fredoka and Nunito, both under the SIL Open Font License. The license files are in [`public/fonts/`](public/fonts/).

## Credits

Made by Jessica Sogge.
Mr. Froggles and his legend by Caitlin Sogge.
