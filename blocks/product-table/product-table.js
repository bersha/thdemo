/**
 * product-table — coverage/comparison table: one row per cover, an accordion with the cover's
 * description in the first column (>= 768 px) and a modal with the same text (< 768 px),
 * one value column per product (source .th-product-accordion-block).
 *
 * Authoring:
 *   head row (one cell, optional): h2 + intro paragraph(s).
 *   caption row (one cell, no heading) directly before the column-header row: the table's
 *     screen-reader caption.
 *   column-header row: one cell per column ("Det här ingår" | "Trafik" | "Halv" | "Hel").
 *   cover rows: cell 1 = h3 (cover name) + description paragraph(s); cells 2..n = value:
 *     :th-checkmark: (included), :th-minus: (not included) or a short text ("Tillägg").
 *   CTA row (optional, after the table): a bold link paragraph → large primary button.
 * @variants block class: lead (default none) — lead = the table block owns the section head
 *   (heading 32/42 and intro 22/30 from 768 px; author it in a `small` section); without it the
 *   head spans the section and the table + CTA sit in the narrow column below it.
 *   stacked (with lead) — several head-owning tables in one wide section, each 46.25rem centred
 *   (source product tables nested in a .th-block__two-columns column).
 * @ew-exempt <p> the modal copies of each cover's name and description are presentational
 *   clones (EW4) of the authored, editable accordion text.
 */

const ICON_LABELS = { checkmark: 'Ingår', minus: 'Ingår inte' };
const ICON_SIZES = { checkmark: 'th-icon-13', minus: 'th-icon-15' };

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  return el;
}

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

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

let collapseCount = 0;

// ── accordion item (source .th-collapse): the header is the source's <button> holding the
//    title and the chevron (the gate measures that control); the title stays the authored node ──
function buildCollapse(heading, bodyNodes, prefix) {
  collapseCount += 1;
  const id = `${prefix}-${collapseCount}`;
  const item = document.createElement('div');
  item.className = 'th-collapse th-accordion-item is-collapse-close';
  const header = document.createElement('button');
  header.type = 'button';
  header.className = 'th-collapse-header th-accordion-item-heading';
  header.setAttribute('aria-expanded', 'false');
  header.setAttribute('aria-controls', id);
  const title = document.createElement('div');
  title.className = 'th-accordion-item-title';
  if (heading) title.append(heading);
  const icon = document.createElement('span');
  icon.className = 'th-icon th-icon-12 th-icon-primary icon-th-arrow2 th-collapse-icon';
  header.append(title, icon);
  const body = document.createElement('div');
  body.className = 'th-collapse-body';
  const content = document.createElement('div');
  content.className = 'th-accordion-item-content';
  content.id = id;
  content.append(...bodyNodes);
  body.append(content);
  item.append(header, body);
  header.addEventListener('click', () => {
    const open = item.classList.toggle('is-collapse-open');
    item.classList.toggle('is-collapse-close', !open);
    header.setAttribute('aria-expanded', String(open));
  });
  return item;
}

let modalCount = 0;

/** Small-screen modal for one cover: presentational clones of the authored title + text. */
function buildRowModal(heading, bodyNodes) {
  modalCount += 1;
  const id = `product-table-modal-${modalCount}`;
  const wrap = document.createElement('div');
  wrap.className = 'th-product-accordion-list-item-block-modal';
  const label = heading ? heading.textContent : '';
  const open = document.createElement('button');
  open.type = 'button';
  open.className = 'th-button-link';
  open.textContent = label;
  const dialog = document.createElement('dialog');
  dialog.className = 'th-modal';
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', id);
  const content = document.createElement('div');
  content.className = 'th-modal-content';
  const header = document.createElement('div');
  header.className = 'th-modal-header';
  const h2 = document.createElement('h2');
  h2.className = 'th-heading th-modal-heading';
  h2.id = id;
  h2.textContent = label;
  const top = document.createElement('button');
  top.type = 'button';
  top.className = 'th-modal-button-top';
  top.setAttribute('aria-label', 'Stäng dialogruta');
  top.innerHTML = '<span class="th-icon th-icon-black th-icon-20 icon-th-cross"></span>';
  header.append(h2, top);
  const body = document.createElement('div');
  body.className = 'th-modal-body';
  bodyNodes.forEach((n) => body.append(stripInstrumentation(n.cloneNode(true))));
  const footer = document.createElement('div');
  footer.className = 'th-modal-footer';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'th-button-medium th-button-primary-brand';
  close.setAttribute('aria-label', 'Stäng dialogruta');
  close.textContent = 'Stäng';
  footer.append(close);
  content.append(header, body, footer);
  dialog.append(content);
  open.addEventListener('click', () => dialog.showModal());
  [top, close].forEach((b) => b.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  wrap.append(open, dialog);
  return wrap;
}

/** A value cell: icon (checkmark / minus, with an accessible label) or short text. */
function buildValueCell(cell) {
  const td = document.createElement('td');
  const div = document.createElement('div');
  const icon = cell.querySelector('span[class*="icon-th-"]');
  if (icon) {
    const name = ([...icon.classList].find((c) => c.startsWith('icon-th-')) || '').slice(8);
    icon.classList.add(ICON_SIZES[name] || 'th-icon-13');
    if (name !== 'minus') icon.classList.add('th-icon-black');
    if (ICON_LABELS[name]) {
      icon.setAttribute('aria-label', ICON_LABELS[name]);
      icon.setAttribute('role', 'img');
    }
  }
  // the authored paragraph is the cell box (source td > div): no extra wrapper around it
  const blocks = [...cell.children].filter((n) => n.matches('p, div'));
  if (blocks.length && blocks.length === cell.children.length) td.append(...blocks);
  else {
    div.append(...cell.childNodes);
    td.append(div);
  }
  return td;
}

export default function decorate(block) {
  const rows = [...block.children];
  const first = rows.findIndex((r) => r.children.length > 1);
  const pre = first < 0 ? rows : rows.slice(0, first);
  const tableRows = first < 0 ? [] : rows.slice(first).filter((r) => r.children.length > 1);
  const post = first < 0 ? [] : rows.slice(first).filter((r) => r.children.length <= 1);
  const last = pre[pre.length - 1];
  const captionRow = last && !last.querySelector('h1, h2, h3, h4') && pre.length > 1 ? last : null;
  const lead = block.classList.contains('lead');

  const head = [];
  pre.filter((r) => r !== captionRow).forEach((r) => head.push(...buildHead(r.firstElementChild)));

  const table = document.createElement('table');
  table.className = 'th-product-accordion-block-table th-accordion';
  if (captionRow) {
    const caption = document.createElement('caption');
    caption.className = 'sr-only';
    caption.append(...captionRow.firstElementChild.childNodes);
    table.append(caption);
  }
  if (tableRows.length) {
    const cols = tableRows[0].children.length;
    const colgroup = document.createElement('colgroup');
    colgroup.append(document.createElement('col'));
    for (let i = 1; i < cols; i += 1) {
      const col = document.createElement('col');
      col.setAttribute('width', '15%');
      colgroup.append(col);
    }
    const thead = document.createElement('thead');
    const htr = document.createElement('tr');
    [...tableRows[0].children].forEach((cell) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.append(...cell.childNodes);
      htr.append(th);
    });
    thead.append(htr);
    const tbody = document.createElement('tbody');
    tableRows.slice(1).forEach((r) => {
      const [labelCell, ...values] = [...r.children];
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.scope = 'row';
      const heading = labelCell.querySelector('h2, h3, h4, h5, h6');
      const bodyNodes = [...labelCell.children].filter((n) => n !== heading);
      const modal = buildRowModal(heading, bodyNodes);
      th.append(buildCollapse(heading, bodyNodes, 'product-table-item'), modal);
      tr.append(th, ...values.map(buildValueCell));
      tbody.append(tr);
    });
    table.append(colgroup, thead, tbody);
  }

  const ctas = [];
  const extra = [];
  post.forEach((r) => {
    if (isCtaRow(r)) ctas.push(...r.querySelectorAll(':scope > div > p'));
    else if (r.firstElementChild) extra.push(...r.firstElementChild.children);
  });

  block.classList.add('th-block');
  if (lead) {
    block.classList.add('th-product-accordion-block');
    const parts = [...head, table, ...extra];
    if (ctas.length) parts.push(buildActions(ctas));
    block.replaceChildren(...parts);
    return;
  }
  const columns = document.createElement('div');
  columns.className = 'th-block-two-columns';
  const tableBox = document.createElement('div');
  tableBox.className = 'th-product-accordion-block th-container th-container-small th-block';
  tableBox.append(table, ...extra);
  columns.append(wrapNode(tableBox, 'th-block-column th-block-column-table'));
  if (ctas.length) {
    const teaser = document.createElement('div');
    teaser.className = 'th-teaser-block th-container th-container-small th-block';
    teaser.append(buildActions(ctas));
    columns.append(wrapNode(teaser, 'th-block-column'));
  }
  block.replaceChildren(...head, columns);
}
