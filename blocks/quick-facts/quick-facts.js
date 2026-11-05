/**
 * quick-facts — heading + intro, a row of icon facts, optional CTA (source .th-quick-facts-block).
 *
 * Authoring:
 *   head row (one cell): h2 + intro paragraph(s).
 *   fact rows: cell 1 = icon (:th-checkmark:) | cell 2 = h3 + paragraph(s).
 *   CTA row: a bold link paragraph (rendered as the large primary button).
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

// an icon cell: an authored :th-name: icon (span after decorateIcons; raw text in a bare harness)
const isIconCell = (cell) => !cell.querySelector('h1, h2, h3, h4, picture')
  && (!!cell.querySelector('span[class*="icon-th-"]') || /^\s*:[a-z0-9-]+:\s*$/.test(cell.textContent));

export default function decorate(block) {
  const rows = [...block.children];
  const head = [];
  const items = [];
  const ctas = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (isCtaRow(row)) ctas.push(...row.querySelectorAll(':scope > div > p'));
    else if (cells.length > 1 || row.querySelector('h3')) items.push(cells);
    else head.push(...buildHead(cells[0]));
  });

  block.classList.add('th-block', 'th-quick-facts-block');
  const list = document.createElement('ul');
  list.className = 'th-quick-facts-block-list';
  items.forEach((cells) => {
    const li = document.createElement('li');
    li.className = 'th-quick-facts-block-item';
    const iconCell = cells.find(isIconCell);
    const textCell = cells.find((c) => c !== iconCell) || document.createElement('div');
    if (iconCell) {
      const icon = iconCell.querySelector('span[class*="icon-th-"]');
      if (icon) icon.classList.add('th-icon-50', 'th-icon-primary');
      const iconWrap = document.createElement('div');
      iconWrap.className = 'th-quick-facts-block-item-icon';
      iconWrap.append(...iconCell.children);
      li.append(iconWrap);
    }
    const body = document.createElement('div');
    body.className = 'th-quick-facts-block-item-body';
    const heading = textCell.querySelector('h2, h3, h4');
    if (heading) {
      const h = document.createElement('div');
      h.className = 'th-quick-facts-block-item-heading';
      h.append(heading);
      body.append(h);
    }
    const content = document.createElement('div');
    content.className = 'th-quick-facts-block-item-content';
    content.append(...textCell.children);
    body.append(content);
    li.append(body);
    list.append(li);
  });
  const parts = [...head];
  if (items.length) parts.push(list);
  if (ctas.length) parts.push(buildActions(ctas));
  block.replaceChildren(...parts);
}
