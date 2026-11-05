/**
 * cards — card list (source .th-card-list-block / .th-cards / .th-card).
 *
 * Authoring:
 *   head row(s) (one cell, before the cards, optional): an h2 first = the section heading; any
 *     other content (or everything when the cell does not start with an h2) = the introduction
 *     (a card list may be intro-only, e.g. a rating image + heading + text).
 *   card rows: cell 1 = icon (:th-award2:) or picture | cell 2 = h3, optional text paragraph,
 *     link paragraph (the whole card is clickable through that link).
 *   CTA row (after the cards, optional): a link paragraph — bold+italic = accent button,
 *     bold = primary button (large, centred).
 * @variants block class: small (default none) — small = compact icon cards (heading + link only);
 *   icon / image layouts are detected from the card content.
 */

// ── block head (section h2 + introduction), moved, never copied (EW1/EW2) ──
function buildHead(cell) {
  const out = [];
  if (!cell) return out;
  const nodes = [...cell.children];
  if (nodes[0] && nodes[0].tagName === 'H2') {
    const h = document.createElement('div');
    h.className = 'th-heading th-block-heading';
    h.append(nodes.shift());
    out.push(h);
  }
  if (nodes.length) {
    const intro = document.createElement('div');
    intro.className = 'th-block-introduction';
    intro.append(...nodes);
    out.push(intro);
  }
  return out;
}

// ── CTA paragraphs (decorateButtons already ran) move as their <p> (EW3) ──
function buildActions(paragraphs) {
  const actions = document.createElement('div');
  actions.className = 'th-block-actions';
  actions.append(...paragraphs);
  return actions;
}

const isCtaP = (n) => {
  const a = n.matches('p') ? n.querySelector('a') : null;
  return !!a && n.textContent.trim() === a.textContent.trim()
    && !!n.querySelector('a.button, strong a, em a');
};
const isCtaRow = (row) => {
  const els = [...row.querySelectorAll(':scope > div > *')];
  return els.length > 0 && els.every(isCtaP);
};

const isIconCell = (cell) => !cell.querySelector('h1, h2, h3, h4, picture')
  && (!!cell.querySelector('span[class*="icon-th-"]') || /^\s*:[a-z0-9-]+:\s*$/.test(cell.textContent));

function wrapNodes(nodes, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(...nodes);
  return w;
}

function buildCard(cells) {
  const li = document.createElement('li');
  li.className = 'th-cards-item';
  const card = document.createElement('div');
  card.className = 'th-card';
  let kind = '';
  const nodes = [];
  cells.forEach((cell) => {
    if (isIconCell(cell)) {
      const icon = cell.querySelector('span[class*="icon-th-"]');
      if (icon) icon.classList.add('th-icon-50', 'th-icon-primary');
      card.append(wrapNodes([...cell.children], 'th-card-icon'));
      kind = 'icon';
    } else nodes.push(...cell.children);
  });
  const pictures = [];
  nodes.forEach((n) => {
    if (n.matches('picture') || (n.matches('p') && n.querySelector('picture') && !n.textContent.trim())) {
      pictures.push(n);
    } else if (/^H[1-6]$/.test(n.tagName)) {
      card.append(wrapNodes([n], 'th-heading-small th-card-heading'));
    } else if (n.matches('p') && n.querySelector('a') && n.textContent.trim() === n.querySelector('a').textContent.trim()) {
      card.append(wrapNodes([n], 'th-card-link-text'));
    } else {
      card.append(wrapNodes([n], 'th-card-text'));
    }
  });
  if (pictures.length) {
    card.append(wrapNodes(pictures, 'th-card-image'));
    if (!kind) kind = 'image';
  }
  li.append(card);
  return { li, kind };
}

export default function decorate(block) {
  const rows = [...block.children];
  const head = [];
  const ctas = [];
  const list = document.createElement('ul');
  list.className = 'th-cards';
  const kinds = new Set();
  rows.forEach((row) => {
    const cells = [...row.children];
    if (isCtaRow(row)) {
      ctas.push(...row.querySelectorAll(':scope > div > p'));
    } else if (cells.length > 1 || (list.children.length && row.querySelector('h3'))) {
      const { li, kind } = buildCard(cells);
      if (kind) kinds.add(kind);
      list.append(li);
    } else {
      head.push(...buildHead(cells[0]));
    }
  });
  if (block.classList.contains('small')) list.classList.add('th-cards-small');
  if (kinds.has('icon')) list.classList.add('th-cards-with-icon');
  else if (kinds.has('image')) list.classList.add('th-cards-with-image');

  block.classList.add('th-block', 'th-card-list-block');
  const parts = [...head];
  if (list.children.length) parts.push(list);
  if (ctas.length) parts.push(buildActions(ctas));
  block.replaceChildren(...parts);
}
