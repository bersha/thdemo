/**
 * hero — full-bleed image band with a centred h1 and an optional app (quick-quote widget).
 *
 * Authoring (cells are queried by content, not position):
 *   - one or more pictures: one picture = every width; two or more = the FIRST is the
 *     small-screen rendition (< 768 px, the source's focal crop), the LAST the large one.
 *   - the page h1 (any heading is accepted).
 *   - optional: a paragraph holding only a /widgets/… link
 *     (e.g. /widgets/quick-quote/vehicle-quote.html)
 *     → rendered as the hero app under the heading (scripts.js turns it into a widget block).
 *   - optional: further paragraphs (intro / CTA) are kept under the heading.
 * @variants large (taller overlay, source --large), top-aligned (heading at the top, source
 *   --top-aligned) — the home hero is `hero large top-aligned` (its tabset block follows it).
 *   with-cta — the app is a CTA panel: the cta-text block authored right after the hero in
 *   the same section moves into the hero app (program siblings hem/villa/barn).
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

export default async function decorate(block) {
  const pictures = [...block.querySelectorAll('picture')];
  const heading = block.querySelector('h1, h2, h3');
  const widget = block.querySelector('.widget');
  const widgetLink = widget ? null : block.querySelector('a[href*="/widgets/"]');
  const extras = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture')
    && !(widgetLink && p.contains(widgetLink)) && p.textContent.trim());

  block.classList.add('th-hero');

  const media = document.createElement('div');
  media.className = 'th-hero-media';
  media.setAttribute('aria-hidden', 'true');
  pictures.forEach((picture, i) => {
    let cls = 'th-hero-image';
    if (pictures.length > 1 && i === 0) cls += ' th-hero-image-small';
    if (pictures.length > 1 && i === pictures.length - 1) cls += ' th-hero-image-large';
    const img = picture.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.setAttribute('fetchpriority', 'high');
    }
    media.append(wrapNode(picture, cls));
  });

  const overlay = document.createElement('div');
  overlay.className = 'th-hero-content-overlay';
  ['large', 'top-aligned'].forEach((v) => {
    if (block.classList.contains(v)) overlay.classList.add(`th-hero-content-overlay-${v}`);
  });
  if (heading) overlay.append(wrapNode(heading, 'th-hero-heading'));
  if (extras.length) {
    const text = document.createElement('div');
    text.className = 'th-hero-text';
    text.append(...extras);
    overlay.append(text);
  }

  let app = null;
  const next = block.classList.contains('with-cta') && block.parentElement
    ? block.parentElement.nextElementSibling : null;
  if (next && next.querySelector(':scope > .cta-text')) {
    app = next;
    app.classList.add('th-hero-app');
    overlay.append(app);
    block.classList.add('th-hero-with-app');
  } else if (widget || widgetLink) {
    app = document.createElement('div');
    app.className = 'th-hero-app';
    if (widget) {
      widget.classList.add('th-app-wrapper');
      app.append(widget);
    } else {
      app.append(widgetLink.closest('p') || widgetLink);
    }
    overlay.append(app);
    block.classList.add('th-hero-with-app');
  }

  block.replaceChildren(...(pictures.length ? [media] : []), overlay);

  if (widget && !widget.dataset.blockStatus) {
    const { decorateBlock, loadBlock } = await import(`${window.hlx.codeBasePath}/scripts/aem.js`);
    decorateBlock(widget);
    await loadBlock(widget);
  }
}
