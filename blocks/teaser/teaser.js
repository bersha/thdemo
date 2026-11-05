/**
 * teaser — centred promo: optional icon, heading, intro and CTA (source .th-teaser-block).
 *
 * Authoring (one cell, classified by content): an icon paragraph (:th-savepercent:), an h2,
 * intro paragraph(s), and a bold link paragraph (large primary button).
 * @variants content — the source .th-content-block: left-aligned heading + intro, image
 *   paragraph(s) after the intro (a picture-only paragraph is kept out of the intro).
 * @variants with-list (with content) — the source .th-content-block body list: an ol/ul in the
 *   cell is placed after the introduction as a direct child of the block (numbered steps).
 */

const isCtaP = (n) => {
  const a = n.matches('p') ? n.querySelector('a') : null;
  return !!a && n.textContent.trim() === a.textContent.trim()
    && !!n.querySelector('a.button, strong a, em a');
};
const isPictureP = (n) => (n.matches('picture') || (n.matches('p') && !!n.querySelector('picture')))
  && !n.textContent.trim();
const isIconP = (n) => n.matches('p') && (!!n.querySelector('span[class*="icon-th-"]')
  || /^\s*:[a-z0-9-]+:\s*$/.test(n.textContent)) && !n.querySelector('a');

export default function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const iconP = nodes.find(isIconP);
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const ctas = nodes.filter(isCtaP);
  const isContent = block.classList.contains('content');
  const media = isContent ? nodes.filter(isPictureP) : [];
  const lists = block.classList.contains('with-list') ? nodes.filter((n) => n.matches('ol, ul')) : [];
  const intro = nodes.filter((n) => n !== iconP && n !== heading && !ctas.includes(n)
    && !media.includes(n) && !lists.includes(n));

  block.classList.add('th-block', isContent ? 'th-content-block' : 'th-teaser-block');
  const parts = [];
  if (iconP) {
    const icon = iconP.querySelector('span[class*="icon-th-"]');
    if (icon) icon.classList.add('th-icon-50', 'th-icon-primary');
    const w = document.createElement('div');
    w.className = 'th-block-icon';
    w.append(iconP);
    parts.push(w);
  }
  if (heading) {
    const h = document.createElement('div');
    h.className = 'th-heading th-block-heading';
    if (isContent) h.classList.add('th-heading-align-left');
    h.append(heading);
    parts.push(h);
  }
  if (intro.length) {
    const w = document.createElement('div');
    w.className = 'th-block-introduction';
    if (isContent) w.classList.add('th-block-introduction-align-left');
    w.append(...intro);
    parts.push(w);
  }
  parts.push(...lists);
  if (media.length) {
    const w = document.createElement('div');
    w.className = 'th-content-block-media';
    w.append(...media);
    parts.push(w);
  }
  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'th-block-actions';
    actions.append(...ctas);
    parts.push(actions);
  }
  block.replaceChildren(...parts);
}
