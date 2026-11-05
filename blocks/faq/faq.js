/**
 * faq — questions and answers as an accordion list (source .th-block__list.th-accordion).
 *
 * Authoring:
 *   head row (one cell, optional): h2 (+ intro paragraphs).
 *   question rows: cell 1 = the question (h3) | cell 2 = the answer (paragraphs, lists, links).
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

export default function decorate(block) {
  const rows = [...block.children];
  const head = [];
  const list = document.createElement('ul');
  list.className = 'th-block-list th-accordion';
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      head.push(...buildHead(cells[0]));
      return;
    }
    const [qCell, ...aCells] = cells;
    const heading = qCell.querySelector('h1, h2, h3, h4, h5, h6, p');
    const answer = aCells.flatMap((c) => [...c.children]);
    const li = document.createElement('li');
    li.className = 'th-block-list-item';
    li.append(buildCollapse(heading, answer, 'faq-item'));
    list.append(li);
  });
  block.classList.add('th-block');
  block.replaceChildren(...head, list);
}
