// The legend as a storybook: shows one page at a time, with buttons (and the
// arrow keys) to turn the pages.
export function start(doc) {
  const pages = [...doc.querySelectorAll('.story-page')];
  const nav = doc.querySelector('.story-nav');
  const prev = doc.querySelector('.story-prev');
  const nextButton = doc.querySelector('.story-next');
  const count = doc.querySelector('.story-count');
  let page = 0;

  function show(focus) {
    pages.forEach((section, i) => {
      section.hidden = i !== page;
    });
    // Turned off (and invisible) at the first and last page, but still
    // holding their places, so the other buttons don't jump around.
    prev.disabled = page === 0;
    nextButton.disabled = page === pages.length - 1;
    count.textContent = `Page ${page + 1} of ${pages.length}`;
    // Start reading the new page from the top, at its heading.
    if (focus) {
      (doc.scrollingElement ?? doc.documentElement).scrollTop = 0;
      pages[page].querySelector('h2').focus({ preventScroll: true });
    }
  }

  function turn(to) {
    const was = page;
    page = Math.max(0, Math.min(pages.length - 1, to));
    if (page !== was) show(true);
  }

  prev.addEventListener('click', () => turn(page - 1));
  nextButton.addEventListener('click', () => turn(page + 1));
  doc.querySelector('.story-again').addEventListener('click', () => turn(0));
  doc.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') turn(page + 1);
    if (event.key === 'ArrowLeft') turn(page - 1);
  });

  doc.querySelector('.story-pages').classList.add('one-at-a-time');
  nav.hidden = false;
  show(false);
  return {
    get page() { return page; },
    turn,
  };
}
