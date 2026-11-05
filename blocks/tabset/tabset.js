/**
 * tabset — the home hero's campaign tabs with quick-quote panels (source .th-tabset).
 * Sits in the flush hero section, after the hero block, and overlaps the hero bottom.
 *
 * Authoring: one row per tab, cells classified by content (an author may omit the banner):
 *   cell 1 (tab):    a bold paragraph = the campaign tag over the tab ("5 % rabatt", optional),
 *                    an icon paragraph (:th-car:), then the label paragraph(s): the first is the
 *                    short mobile label ("Bil"), the last the full label ("Bilförsäkring").
 *   cell 2 (banner): the campaign banner text over the panel (optional).
 *   cell 3 (panel):  optional h2 + intro paragraph(s), button links (bold = primary,
 *                    italic = secondary) and/or a /widgets/quick-quote/<name>.html link
 *                    (the quick-quote form app).
 * The first tab is active. Tabs switch on click and with the arrow / Home / End keys.
 * @ew-exempt tab labels — the campaign tag and the short/full labels of cell 1 render as the
 *   inline text of the <a role="tab"> control (phrasing content only, one accessible name, the
 *   source's tab DOM); they are edited in the document row, not in place.
 */

const isIconP = (n) => n.matches('p') && !n.querySelector('a')
  && (!!n.querySelector('span[class*="icon-th-"]') || /^\s*:[a-z0-9-]+:\s*$/.test(n.textContent));
const isBoldP = (n) => n.matches('p') && !!n.querySelector('strong')
  && n.textContent.trim() === n.querySelector('strong').textContent.trim();
const isCtaP = (n) => {
  const a = n.matches('p') ? n.querySelector('a') : null;
  return !!a && n.textContent.trim() === a.textContent.trim()
    && !!n.querySelector('a.button, strong a, em a');
};

function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

/** Inline label span for the tab control (an <a role="tab"> holds phrasing content only). */
function labelSpan(p, className) {
  const span = el('span', className);
  span.textContent = p.textContent.trim();
  return span;
}

function buildTab(cell, i, uid) {
  const nodes = cell ? [...cell.children] : [];
  const iconP = nodes.find(isIconP);
  const campaignP = nodes.find((n) => n !== iconP && isBoldP(n));
  const labels = nodes.filter((n) => n !== iconP && n !== campaignP && n.textContent.trim());
  const li = el('li', 'th-tabset-tab', { role: 'presentation' });
  const a = el('a', 'th-tabset-tab-button', {
    href: `#${uid}tabpanel-${i + 1}`,
    id: `${uid}tab-${i + 1}`,
    role: 'tab',
    'aria-controls': `${uid}tabpanel-${i + 1}`,
  });
  if (campaignP) {
    li.classList.add('th-tabset-tab-with-highlight');
    a.append(labelSpan(campaignP, 'th-tabset-tab-campaign'));
  }
  const content = el('div', 'th-tabset-tab-content');
  const icon = iconP && iconP.querySelector('span[class*="icon-th-"]');
  if (icon) {
    icon.classList.add('th-icon-neutral');
    content.append(icon);
  }
  const short = labels[0];
  const full = labels[labels.length - 1];
  if (short && full && short !== full) {
    content.append(
      labelSpan(short, 'th-tabset-tab-heading th-display-hidden-tablet'),
      labelSpan(full, 'th-tabset-tab-heading th-display-block-tablet'),
    );
  } else if (full) {
    content.append(labelSpan(full, 'th-tabset-tab-heading'));
  }
  a.append(content);
  li.append(a);
  return li;
}

function buildPanel(bannerCell, panelCell, i, uid) {
  const panel = el('div', 'th-tabset-panel', {
    id: `${uid}tabpanel-${i + 1}`,
    role: 'tabpanel',
    tabindex: '0',
    'aria-labelledby': `${uid}tab-${i + 1}`,
  });
  if (bannerCell && bannerCell.textContent.trim()) {
    const banner = el('div', 'th-tabset-panel-campaign-banner');
    banner.append(...bannerCell.childNodes);
    panel.append(banner);
  }
  let buttons = null;
  [...(panelCell ? panelCell.children : [])].forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName)) {
      n.classList.add('th-tabset-panel-heading');
      panel.append(n);
    } else if (n.classList.contains('widget') || n.querySelector(':scope > .widget')) {
      // the quick-quote app (a widget block; unwrap it from a paragraph that only holds it)
      panel.append(n.classList.contains('widget') ? n : n.querySelector(':scope > .widget'));
    } else if (isCtaP(n)) {
      if (!buttons) {
        buttons = el('div', 'th-start-page-tab-button-list');
        panel.append(buttons);
      }
      const a = n.querySelector('a');
      a.classList.add('th-button-full-width-on-mobile-fit-text-desktop');
      buttons.append(n);
    } else if (n.textContent.trim()) {
      if (n.matches('p')) n.classList.add('th-tabset-panel-introduction');
      panel.append(n);
    }
  });
  return panel;
}

function activate(tabs, panels, index, focus) {
  tabs.forEach((li, i) => {
    const on = i === index;
    const a = li.querySelector('.th-tabset-tab-button');
    li.classList.toggle('th-tabset-tab-is-active', on);
    a.setAttribute('aria-selected', on ? 'true' : 'false');
    if (on) a.removeAttribute('tabindex');
    else a.setAttribute('tabindex', '-1');
    panels[i].hidden = !on;
    if (on && focus) a.focus();
  });
}

let tabsetCount = 0;

export default async function decorate(block) {
  tabsetCount += 1;
  // ids as the source (tab-1 / tabpanel-1); a second tabset on a page gets a prefix
  const uid = tabsetCount > 1 ? `tabset-${tabsetCount}-` : '';
  const rows = [...block.children].filter((r) => r.textContent.trim() || r.querySelector('.widget'));
  const list = el('ul', 'th-tabset-tabs', { role: 'tablist', 'aria-label': 'Flikar med prisförslag' });
  const panelsWrap = el('div', 'th-tabset-panels');
  const tabs = [];
  const panels = [];
  rows.forEach((row, i) => {
    const cells = [...row.children];
    const tabCell = cells[0];
    const panelCell = cells.length > 1 ? cells[cells.length - 1] : null;
    const bannerCell = cells.length > 2 ? cells[1] : null;
    const tab = buildTab(tabCell, i, uid);
    const panel = buildPanel(bannerCell, panelCell, i, uid);
    tabs.push(tab);
    panels.push(panel);
    list.append(tab);
    panelsWrap.append(panel);
  });

  block.classList.add('th-tabset');
  block.replaceChildren(list, panelsWrap);
  activate(tabs, panels, 0, false);

  tabs.forEach((li, i) => {
    const a = li.querySelector('.th-tabset-tab-button');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      activate(tabs, panels, i, false);
    });
    a.addEventListener('keydown', (e) => {
      const last = tabs.length - 1;
      const next = {
        ArrowRight: i === last ? 0 : i + 1,
        ArrowLeft: i === 0 ? last : i - 1,
        Home: 0,
        End: last,
      }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      activate(tabs, panels, next, true);
    });
  });

  const widgets = [...block.querySelectorAll('.widget')].filter((w) => !w.dataset.blockStatus);
  if (widgets.length) {
    const { decorateBlock, loadBlock } = await import(`${window.hlx.codeBasePath}/scripts/aem.js`);
    await Promise.all(widgets.map((w) => {
      decorateBlock(w);
      return loadBlock(w);
    }));
  }
}
