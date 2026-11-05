/**
 * columns — section heading + intro over two (or more) columns of rich text
 * (source .th-two-column-text-block / .th-block__two-columns / .th-content).
 *
 * Authoring:
 *   head row (one cell, optional): h2 + intro paragraph(s).
 *   column rows: one cell per column — h3 sub-headings, paragraphs, lists, links.
 *   Columns stack below 1024 px and sit side by side from 1024 px.
 * @variants with-icon — the head cell opens with an icon paragraph (:th-house:), rendered
 *   above the heading (source .th-block__icon, 50 px, brand colour).
 */

// ── block head (section h2 + introduction), moved, never copied (EW1/EW2) ──
function buildHead(cell, withIcon) {
  const out = [];
  if (!cell) return out;
  const nodes = [...cell.children];
  const first = nodes[0];
  const isIconP = !!first && first.tagName === 'P' && !first.querySelector('a')
    && (!!first.querySelector('span[class*="icon-th-"]')
      || /^\s*:[a-z0-9-]+:\s*$/.test(first.textContent));
  if (withIcon && isIconP) {
    const iconP = nodes.shift();
    const icon = iconP.querySelector('span[class*="icon-th-"]');
    if (icon) icon.classList.add('th-icon-50', 'th-icon-primary');
    const w = document.createElement('div');
    w.className = 'th-block-icon';
    w.append(iconP);
    out.push(w);
  }
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

export default function decorate(block) {
  const parts = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      parts.push(...buildHead(cells[0], block.classList.contains('with-icon')));
      return;
    }
    const columns = document.createElement('div');
    columns.className = 'th-block-two-columns';
    cells.forEach((cell) => {
      const col = document.createElement('div');
      col.className = 'th-content';
      col.append(...cell.children);
      columns.append(col);
    });
    parts.push(columns);
  });
  block.classList.add('th-block', 'th-two-column-text-block');
  block.replaceChildren(...parts);
}
