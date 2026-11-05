/**
 * document-list — heading + intro and a bordered list of document (PDF) links with a document
 * icon (source .th-document-block). The block is the page's #dokument anchor target.
 *
 * Authoring:
 *   head row (one cell): h2 + intro (an h3 and paragraphs are allowed).
 *   list row (one cell): a list (ul) with one link per document.
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

export default function decorate(block) {
  const rows = [...block.children];
  const listRow = rows.find((r) => r.querySelector('ul, ol'));
  const list = listRow ? listRow.querySelector('ul, ol') : null;
  const head = rows.filter((r) => r !== listRow).flatMap((r) => buildHead(r.firstElementChild));

  block.classList.add('th-block', 'th-document-block');
  if (!document.getElementById('dokument')) block.id = 'dokument';
  const parts = [...head];
  if (list) {
    list.querySelectorAll('li a').forEach((a) => {
      const label = document.createElement('span');
      label.className = 'th-document-list-label';
      label.append(...a.childNodes);
      const icon = document.createElement('span');
      icon.className = 'th-icon th-icon-20 icon-th-docpdf';
      a.append(icon, label);
    });
    const wrap = document.createElement('div');
    wrap.className = 'th-document-list';
    wrap.append(list);
    parts.push(wrap);
  }
  block.replaceChildren(...parts);
}
