// A "Read to me" button that reads words out loud with the browser's own
// voice (the Web Speech API), for kids who can't read yet. It's built into
// browsers, so there's nothing to download. If a browser can't speak, there's
// no button.

const ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="read-aloud-speaker" d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4Z" /><path class="read-aloud-waves" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></svg>';

// Some browsers stop partway through a long passage, so it's read a sentence
// at a time. "Mr." doesn't end a sentence, so Mr. Froggles stays together.
export function sentences(text) {
  return text
    .split(/(?<=[.!?])(?<!\bMrs?\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

// Adds the button to `into`. `words` is called on each tap and returns what to
// read. Returns { button, stop }, or null if the browser can't speak.
export function addReadAloud(doc, into, words) {
  const win = doc.defaultView;
  const voice = win?.speechSynthesis;
  if (!voice || !win.SpeechSynthesisUtterance) return null;

  const button = doc.createElement('button');
  button.type = 'button';
  button.className = 'read-aloud';
  button.setAttribute('aria-label', 'Read to me');
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = ICON;

  // The last sentence queued: when it ends, the reading is done.
  let last = null;
  const reading = (on) => button.setAttribute('aria-pressed', String(on));

  function stop() {
    last = null;
    voice.cancel();
    reading(false);
  }

  button.addEventListener('click', () => {
    if (last) {
      stop();
      return;
    }
    voice.cancel();
    for (const sentence of sentences(words())) {
      const said = new win.SpeechSynthesisUtterance(sentence);
      said.lang = 'en-US';
      // A little slower than usual, for young listeners.
      said.rate = 0.9;
      said.onend = said.onerror = () => {
        if (said === last) stop();
      };
      last = said;
      voice.speak(said);
    }
    reading(Boolean(last));
  });

  // Don't keep talking after leaving the page.
  win.addEventListener('pagehide', stop);

  into.append(button);
  return { button, stop };
}
