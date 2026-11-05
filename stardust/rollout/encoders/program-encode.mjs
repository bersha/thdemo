#!/usr/bin/env node
/**
 * program-encode.mjs — ENCODE side for the trygghansa.se replica (program template and the
 * modules it shares with listing/landing/static pages): migrated/prototype HTML → DA document.
 *
 * Usage:
 *   node stardust/rollout/encoders/program-encode.mjs <page.html> --out content/<path>.html
 *        [--media-map <json: asset basename → content.da.live URL>] [--list-images]
 *
 * Modules → EDS blocks (authoring models documented in each block's JSDoc):
 *   section.th-hero            → hero (+ widget link for the quick-quote app)      [flush]
 *   section.th-campaign-banner → campaign-banner                                   [flush]
 *   nav.th-breadcrumbs         → breadcrumbs                                       [flush, stripe]
 *   .th-quick-facts-block      → quick-facts
 *   .th-card-list-block        → cards (variant small when .th-cards--small)
 *   .th-product-accordion-block→ product-table (variant lead when it owns its h2)
 *   .th-two-column-text-block  → columns
 *   .th-teaser-block           → teaser
 *   ul.th-accordion (FAQ)      → faq
 *   .th-document-block         → document-list
 *   landing (index):
 *   .th-content-area-hero      → hero (variants large/top-aligned from the overlay modifiers)
 *                                + tabset (one row per tab: tab | campaign banner | panel; the
 *                                quick-quote forms become /widgets/quick-quote/<name>.html links) [flush]
 *   .th-cta-image-block        → cta-image (picture cell first = image left, last = image right) [wide]
 *   .th-content-block          → teaser content (left-aligned heading + intro + picture)        [small]
 *   program siblings (hem/villa/barn):
 *   .th-hero__app > .th-cta-text-block → hero with-cta + a cta-text block after it in the section
 *   section > .th-cta-text-block      → cta-text (one cell: h2, intro paragraphs, button)
 *   .th-block__two-columns of head-owning product tables → product-table lead stacked (one per table)
 *   a product table's own CTA anchor → CTA row of its product-table block
 *   .th-two-column-text-block with a .th-block__icon → columns with-icon (icon paragraph first)
 *   hero picture without srcset: the media map's `<stem>_480` focal crop (small) when present
 *   static (skadeanmalan):
 *   .th-content-block with a body ol/ul → teaser content with-list (list after the intro)
 *   listing siblings: cta-image picture without srcset → small-crop from the media map's `<stem>_750`
 * In-scope trygghansa.se paths become root-relative; every other link stays absolute.
 */
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) {
  console.log('usage: program-encode.mjs <page.html> --out <content.html> [--media-map <json>] [--list-images]');
  process.exit(0);
}
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const src = args[0];
const out = opt('--out');
const mediaMap = opt('--media-map') ? JSON.parse(fs.readFileSync(opt('--media-map'), 'utf8')) : {};
const listImages = args.includes('--list-images');

const IN_SCOPE = new Set(['/', '/forsakringar/bilforsakring', '/forsakringar/hemforsakring',
  '/forsakringar/person', '/forsakringar/fordon', '/djurforsakring',
  '/forsakringar/bilforsakring/helforsakring', '/forsakringar/hemforsakring/villaforsakring',
  '/forsakringar/person/barnforsakring', '/skadeanmalan']);

const html = fs.readFileSync(src, 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });
const images = [];

function localHref(href) {
  if (!href) return href;
  const m = href.match(/^https:\/\/www\.trygghansa\.se(\/[^?#]*)?([?#].*)?$/);
  if (!m) return href;
  let p = m[1] || '/';
  if (p.length > 1) p = p.replace(/\/$/, '');
  return IN_SCOPE.has(p) && !m[2] ? p : href;
}

function mediaUrl(file) {
  const base = path.basename(file);
  images.push(base);
  return mediaMap[base] || `https://content.da.live/aemcoder/64009de2/media/UNMAPPED/${base}`;
}

const esc = (s) => s.replace(/&(?!(#\d+|#x[0-9a-f]+|[a-z]+);)/gi, '&amp;').replace(/"/g, '&quot;');

/** Inline/prose HTML of a node's children: drops classes/ids, maps icons and links. */
function prose(el) {
  const c = $(el).clone();
  c.find('span[class*="icon-TH-"]').each((_, s) => {
    const name = ($(s).attr('class').match(/icon-TH-([A-Za-z0-9]+)/) || [])[1];
    $(s).replaceWith(`:th-${name.toLowerCase()}:`);
  });
  c.find('a').each((_, a) => {
    const href = localHref($(a).attr('href'));
    const keep = { href };
    if (/^https?:/.test(href) && !href.includes('trygghansa.se') && $(a).attr('rel')) keep.rel = $(a).attr('rel');
    Object.keys(a.attribs).forEach((k) => delete a.attribs[k]);
    Object.assign(a.attribs, keep);
    // a link's trailing space moves after it (the pipeline trims it; a leading one survives)
    const kids = a.children || [];
    const last = kids[kids.length - 1];
    if (last && last.type === 'text' && /\s$/.test(last.data)) {
      last.data = last.data.replace(/\s+$/, '');
      $(a).after(' ');
    }
  });
  c.find('picture').each((_, p) => {
    const img = $(p).find('img');
    $(p).replaceWith(`<picture><img src="${mediaUrl(img.attr('src'))}" alt="${esc(img.attr('alt') || '')}"></picture>`);
  });
  c.find('*').each((_, n) => {
    ['class', 'id', 'style', 'target', 'aria-hidden', 'role', 'aria-label'].forEach((k) => {
      if (n.attribs) delete n.attribs[k];
    });
  });
  // a paragraph that opens with a line break keeps its empty first line (DA drops a leading <br>)
  return c.html().trim().replace(/<p><br\s*\/?>/g, '<p>&nbsp;<br>');
}
const outer = (el) => { const w = $('<div></div>').append($(el).clone()); return prose(w[0]); };
const cell = (inner) => `<div>${inner}</div>`;
const row = (...cells) => `<div>${cells.map(cell).join('')}</div>`;
const block = (name, rows) => `<div class="${name}">${rows.join('')}</div>`;
const meta = (style) => `<div class="section-metadata"><div><div>style</div><div>${style}</div></div></div>`;
const section = (...parts) => `<div>${parts.filter(Boolean).join('')}</div>`;
/** A source CTA anchor → authored button paragraph (bold = brand, bold+italic = accent). */
function cta(a) {
  const href = localHref($(a).attr('href'));
  const label = $(a).text().trim();
  const cls = $(a).attr('class') || '';
  if (cls.includes('primary-accent')) return `<p><strong><em><a href="${href}">${label}</a></em></strong></p>`;
  if (cls.includes('secondary-accent')) return `<p><em><a href="${href}">${label}</a></em></p>`;
  return `<p><strong><a href="${href}">${label}</a></strong></p>`;
}
/** Block head: section h2 + introduction children, as one cell. */
function head(blk) {
  const parts = [];
  const h2 = $(blk).children('h2').first();
  if (h2.length) parts.push(`<h2>${prose(h2[0])}</h2>`);
  const intro = $(blk).children('.th-block__introduction').first();
  if (intro.length) parts.push(prose(intro[0]));
  return parts.join('');
}

/** Source .th-cta-text-block → one cell: h2, introduction children, button paragraph(s). */
function ctaTextCell(blk) {
  const ct = $(blk).children('.th-cta-text-block__content').first();
  const parts = [`<h2>${prose(ct.children('h2')[0])}</h2>`];
  const intro = ct.children('.th-cta-text-block__introduction').first();
  if (intro.length) parts.push(prose(intro[0]));
  $(blk).children('a[class*="th-button"]').each((_, a) => parts.push(cta(a)));
  return parts.join('');
}

function encodeHero(sec) {
  const rows = [];
  const pics = $(sec).find('picture').first();
  if (pics.length) {
    const img = pics.find('img');
    const set = (pics.find('source').attr('srcset') || '').split(',').map((s) => s.trim().split(/\s+/));
    const pick = (w) => (set.find(([, d]) => d === `${w}w`) || [img.attr('src')])[0];
    const alt = esc(img.attr('alt') || '');
    let small = set.length > 1 ? pick(480) : null;
    const large = set.length > 1 ? pick(1536) : img.attr('src');
    if (set.length <= 1) {
      const { name, ext } = path.parse(path.basename(img.attr('src')));
      if (mediaMap[`${name}_480${ext}`]) small = `${name}_480${ext}`;
    }
    const cellHtml = [small, large].filter(Boolean)
      .map((f) => `<picture><img src="${mediaUrl(f)}" alt="${alt}"></picture>`).join('');
    rows.push(row(cellHtml));
  }
  const content = [`<h1>${prose($(sec).find('h1').first()[0])}</h1>`];
  if ($(sec).find('form.vehicle-quick-quote').length) {
    content.push('<p><a href="/widgets/quick-quote/vehicle-quote.html">/widgets/quick-quote/vehicle-quote.html</a></p>');
  }
  rows.push(row(content.join('')));
  const appCta = $(sec).find('.th-hero__app > .th-cta-text-block').first();
  const ov = $(sec).find('.th-hero__content-overlay').first();
  const variants = ['large', 'top-aligned'].filter((v) => ov.hasClass(`th-hero__content-overlay--${v}`));
  if (!appCta.length) return block(['hero', ...variants].join(' '), rows);
  variants.push('with-cta');
  return block(['hero', ...variants].join(' '), rows) + block('cta-text', [row(ctaTextCell(appCta))]);
}

const QQ_WIDGETS = [
  [/\/bilforsakring/, 'car-quote'],
  [/\/gravidforsakring/, 'pregnancy-quote'],
  [/\/villaforsakring/, 'home-quote'],
];
/** Hero tabset: row per tab = tab cell | campaign banner cell | panel cell. */
function encodeTabset(ts) {
  const rows = [];
  $(ts).find('.th-tabset-tab').each((i, li) => {
    const a = $(li).find('.th-tabset-tab__button').first();
    const panel = $(ts).find(`#${a.attr('aria-controls')}`).first();
    const icon = ($(li).find('[class*="icon-TH-"]').attr('class').match(/icon-TH-([A-Za-z0-9]+)/) || [])[1];
    const tab = [];
    const camp = $(li).find('.th-tabset-tab__campaign').first();
    if (camp.length) tab.push(`<p><strong>${camp.text().trim()}</strong></p>`);
    tab.push(`<p>:th-${icon.toLowerCase()}:</p>`);
    $(li).find('.th-tabset-tab__heading').each((_, h) => tab.push(`<p>${$(h).text().trim()}</p>`));
    const banner = panel.find('.th-tabset-panel__campaign-banner').first();
    const body = [];
    panel.children().each((_, el) => {
      const $el = $(el);
      if ($el.is('h2')) body.push(`<h2>${prose(el)}</h2>`);
      else if ($el.is('p.th-tabset-panel__introduction')) body.push(`<p>${prose(el)}</p>`);
      else if ($el.is('.th-start-page-tab-button-list')) $el.children('a').each((__, b) => body.push(cta(b)));
      else if ($el.is('form')) {
        const w = QQ_WIDGETS.find(([re]) => re.test($el.attr('action') || ''));
        if (w) body.push(`<p><a href="/widgets/quick-quote/${w[1]}.html">/widgets/quick-quote/${w[1]}.html</a></p>`);
        else console.error(`unmapped quick-quote form ${$el.attr('action')}`);
      }
    });
    rows.push(row(tab.join(''), banner.length ? prose(banner[0]) : '', body.join('')));
  });
  return block('tabset', rows);
}

function encodeHeroArea(area) {
  const parts = [];
  $(area).children().each((_, el) => {
    if ($(el).is('section.th-hero')) parts.push(encodeHero(el));
    else if ($(el).is('.th-tabset')) parts.push(encodeTabset(el));
    else console.error(`unencoded hero-area child: ${$(el).attr('class')}`);
  });
  return section(...parts, meta('flush'));
}

function encodeBanner(sec) {
  const icon = ($(sec).find('[class*="icon-TH-"]').attr('class').match(/icon-TH-([A-Za-z0-9]+)/) || [])[1];
  const text = $(sec).find('.th-campaign-banner__text').first();
  const p = text.children('p').first();
  const trigger = text.children('button.th-button-link').first();
  const dlg = text.find('dialog').first();
  let line = `<p>${prose(p[0])}</p>`;
  if (trigger.length) line += `<p>${trigger.text().trim()}</p>`;
  const rows = [row(`<p>:th-${icon.toLowerCase()}:</p>`, line)];
  if (dlg.length) {
    rows.push(row(`<h2>${prose(dlg.find('.th-modal__heading')[0])}</h2>${prose(dlg.find('.th-modal__body')[0])}`));
  }
  return section(block('campaign-banner', rows), meta('flush'));
}

function encodeBreadcrumbs(nav) {
  const lis = $(nav).find('li').map((_, li) => {
    const a = $(li).find('a');
    if (a.length) return `<li><a href="${localHref(a.attr('href'))}">${a.text().trim()}</a></li>`;
    return `<li>${$(li).text().trim()}</li>`;
  }).get().join('');
  return section(block('breadcrumbs', [row(`<ol>${lis}</ol>`)]), meta('flush, stripe'));
}

function encodeQuickFacts(blk) {
  const h = head(blk);
  const rows = h ? [row(h)] : [];
  $(blk).find('.th-quick-facts-block__item').each((_, li) => {
    const icon = ($(li).find('[class*="icon-TH-"]').attr('class').match(/icon-TH-([A-Za-z0-9]+)/) || [])[1];
    const hd = $(li).find('h2, h3').first();
    const tag = hd[0].tagName.toLowerCase();
    const body = $(li).find('.th-quick-facts-block__item-content').first();
    rows.push(row(`<p>:th-${icon.toLowerCase()}:</p>`, `<${tag}>${prose(hd[0])}</${tag}>${prose(body[0])}`));
  });
  $(blk).children('a[class*="th-button"]').each((_, a) => rows.push(row(cta(a))));
  return rows;
}

function encodeCards(blk) {
  const list = $(blk).children('ul.th-cards').first();
  const rows = [];
  const h = head(blk);
  if (h) rows.push(row(h));
  list.children('li').each((_, li) => {
    const card = $(li).find('.th-card').first();
    const iconEl = card.find('[class*="icon-TH-"]').first();
    const pic = card.find('picture').first();
    const parts = [`<h3>${prose(card.find('.th-card__heading')[0])}</h3>`];
    const txt = card.find('.th-card__text').first();
    if (txt.length) parts.push(`<p>${prose(txt[0])}</p>`);
    const a = card.find('a.th-card__link').first();
    if (a.length) parts.push(`<p><a href="${localHref(a.attr('href'))}">${a.text().trim()}</a></p>`);
    let media = '';
    if (iconEl.length) {
      const icon = (iconEl.attr('class').match(/icon-TH-([A-Za-z0-9]+)/) || [])[1];
      media = `<p>:th-${icon.toLowerCase()}:</p>`;
    } else if (pic.length) {
      const img = pic.find('img');
      const set = (pic.find('source').attr('srcset') || '').split(',').map((s) => s.trim().split(/\s+/));
      const best = (set.length && set[set.length - 1][0]) || img.attr('src');
      media = `<picture><img src="${mediaUrl(best)}" alt="${esc(img.attr('alt') || '')}"></picture>`;
    }
    rows.push(media ? row(media, parts.join('')) : row(parts.join('')));
  });
  $(blk).children('a[class*="th-button"]').each((_, a) => rows.push(row(cta(a))));
  const variant = list.hasClass('th-cards--small') ? 'cards small' : 'cards';
  return { name: variant, rows };
}

function tableRows(table) {
  const rows = [];
  const cap = $(table).find('caption').first();
  if (cap.length) rows.push(row(`<p>${cap.text().trim()}</p>`));
  rows.push(row(...$(table).find('thead th').map((_, th) => `<p>${$(th).text().trim()}</p>`).get()));
  $(table).find('tbody tr').each((_, tr) => {
    const th = $(tr).children('th').first();
    const title = th.find('.th-accordion__item-heading h3').first();
    const body = th.find('.th-accordion__item-content').first();
    const first = `<h3>${prose(title[0])}</h3>${prose(body[0])}`;
    const vals = $(tr).children('td').map((_, td) => {
      const icon = $(td).find('[class*="icon-TH-"]').first();
      if (icon.length) {
        const n = (icon.attr('class').match(/icon-TH-([A-Za-z0-9]+)/) || [])[1];
        return `<p>:th-${n.toLowerCase()}:</p>`;
      }
      return `<p>${$(td).text().trim()}</p>`;
    }).get();
    rows.push(row(first, ...vals));
  });
  return rows;
}

function encodeContentSection(sec) {
  const ctaText = $(sec).children('.th-cta-text-block').first();
  if (ctaText.length) return section(block('cta-text', [row(ctaTextCell(ctaText))]));
  const blk = $(sec).children('.th-block').first();
  if (!blk.length) return null;
  const cls = blk.attr('class');
  const sm = cls.includes('th-container--small');
  const smallMeta = sm ? meta('small') : '';
  if (blk.hasClass('th-quick-facts-block')) return section(block('quick-facts', encodeQuickFacts(blk)));
  if (blk.hasClass('th-card-list-block')) {
    const { name, rows } = encodeCards(blk);
    return section(block(name, rows), smallMeta);
  }
  if (blk.hasClass('th-product-accordion-block')) {
    const rows = [row(head(blk)), ...tableRows(blk.find('table').first())];
    blk.children('a[class*="th-button"]').each((_, a) => rows.push(row(cta(a))));
    return section(block('product-table lead', rows), smallMeta);
  }
  if (blk.hasClass('th-two-column-text-block')) {
    const cols = blk.find('.th-block__two-columns').first().children('div').map((_, d) => prose(d)).get();
    const icon = blk.children('[class*="icon-TH-"]').first();
    if (icon.length) {
      const n = (icon.attr('class').match(/icon-TH-([A-Za-z0-9]+)/) || [])[1];
      const h = `<p>:th-${n.toLowerCase()}:</p>${head(blk)}`;
      return section(block('columns with-icon', [row(h), row(...cols)]), smallMeta);
    }
    return section(block('columns', [row(head(blk)), row(...cols)]), smallMeta);
  }
  if (blk.hasClass('th-cta-image-block')) {
    const pic = blk.find('.th-cta-image-block__image').first();
    const ct = blk.find('.th-cta-image-block__content').first();
    const txt = [`<h2>${prose(ct.children('h2')[0])}</h2>`, prose(ct.children('.th-cta-image-block__introduction')[0])];
    ct.children('a[class*="th-button"]').each((_, a) => txt.push(cta(a)));
    const cells = [prose(pic[0]), txt.join('')];
    // static: the srcset's smallest rendition is a focal crop; when the media map carries it,
    // author it first (small, < 1024 px) → variant small-crop
    const set = (pic.find('source').attr('srcset') || '').split(',').map((s) => s.trim().split(/\s+/)[0]);
    let smallCrop = set.length > 1 ? path.basename(set[0]) : null;
    if (set.length <= 1) {
      // sibling renders carry no srcset: the media map's `<stem>_750` focal crop, when present
      const src = pic.find('img').attr('src') || '';
      const { name: stem, ext } = path.parse(path.basename(src));
      if (mediaMap[`${stem}_750${ext}`]) smallCrop = `${stem}_750${ext}`;
    }
    let name = 'cta-image';
    if (smallCrop && mediaMap[smallCrop]) {
      const alt = esc(pic.find('img').attr('alt') || '');
      cells[0] = `<picture><img src="${mediaUrl(smallCrop)}" alt="${alt}"></picture>${cells[0]}`;
      name = 'cta-image small-crop';
    }
    if (blk.hasClass('th-cta-image-block--right')) cells.reverse();
    return section(block(name, [row(...cells)]), meta('wide'));
  }
  if (blk.hasClass('th-content-block')) {
    const parts = [head(blk)];
    let hasList = false;
    blk.children('p, ol, ul').each((_, p) => {
      if ($(p).is('ol, ul')) {
        // static (skadeanmalan): a body list after the intro → variant with-list
        hasList = true;
        parts.push(outer(p));
      } else if ($(p).find('picture').length) parts.push(`<p>${prose(p)}</p>`);
    });
    const name = hasList ? 'teaser content with-list' : 'teaser content';
    return section(block(name, [row(parts.join(''))]), smallMeta);
  }
  if (blk.hasClass('th-teaser-block')) {
    const parts = [];
    const icon = blk.children('[class*="icon-TH-"]').first();
    if (icon.length) {
      const n = (icon.attr('class').match(/icon-TH-([A-Za-z0-9]+)/) || [])[1];
      parts.push(`<p>:th-${n.toLowerCase()}:</p>`);
    }
    parts.push(head(blk));
    blk.children('a[class*="th-button"]').each((_, a) => parts.push(cta(a)));
    return section(block('teaser', [row(parts.join(''))]), smallMeta);
  }
  if (blk.hasClass('th-document-block')) {
    const lis = blk.find('ul.th-block__list li a').map((_, a) => `<li><a href="${localHref($(a).attr('href'))}">${$(a).text().trim()}</a></li>`).get().join('');
    return section(block('document-list', [row(head(blk)), row(`<ul>${lis}</ul>`)]), smallMeta);
  }
  if (blk.children('ul.th-accordion').length) {
    const rows = [row(head(blk))];
    blk.find('ul.th-accordion > li').each((_, li) => {
      const q = $(li).find('.th-accordion__item-heading h3').first();
      const a = $(li).find('.th-accordion__item-content').first();
      rows.push(row(`<h3>${prose(q[0])}</h3>`, prose(a[0])));
    });
    return section(block('faq', rows), smallMeta);
  }
  // th-block whose two-column body holds only product tables that own their head
  // (helforsakring) → one `product-table lead stacked` block per table, same section
  const pts = blk.find('.th-block__two-columns .th-product-accordion-block');
  if (pts.length && !head(blk) && !blk.find('.th-teaser-block').length
    && pts.toArray().every((t) => $(t).children('h2').length)) {
    const blocks = pts.toArray().map((t) => {
      const rows = [row(head(t)), ...tableRows($(t).find('table').first())];
      $(t).children('a[class*="th-button"]').each((_, a) => rows.push(row(cta(a))));
      return block('product-table lead stacked', rows);
    });
    return section(...blocks, smallMeta);
  }
  // th-block with a two-column body holding a product table (+ teaser CTA)
  const pt = blk.find('.th-product-accordion-block').first();
  if (pt.length) {
    const rows = [row(head(blk)), ...tableRows(pt.find('table').first())];
    blk.find('.th-teaser-block a[class*="th-button"]').each((_, a) => rows.push(row(cta(a))));
    return section(block('product-table', rows), smallMeta);
  }
  // plain th-block → default content
  const parts = [head(blk)];
  blk.children('a[class*="th-button"]').each((_, a) => parts.push(cta(a)));
  return section(parts.join(''), smallMeta);
}

const main = $('main').first();
const sections = [];
main.children().each((_, el) => {
  const $el = $(el);
  if ($el.is('section.th-hero')) sections.push(section(encodeHero(el), meta('flush')));
  else if ($el.is('.th-content-area-hero')) sections.push(encodeHeroArea(el));
  else if ($el.is('section.th-campaign-banner')) sections.push(encodeBanner(el));
  else if ($el.find('nav.th-breadcrumbs').length) sections.push(encodeBreadcrumbs($el.find('nav.th-breadcrumbs')[0]));
  else if ($el.is('.th-content-area')) {
    $el.children('section').each((__, s) => {
      const enc = encodeContentSection(s);
      if (enc) sections.push(enc);
      else console.error(`unencoded section: ${$(s).attr('class')}`);
    });
  } else console.error(`unencoded top-level: ${el.tagName}.${$el.attr('class')}`);
});

const title = $('title').text().trim();
const desc = $('meta[name="description"]').attr('content') || '';
const metaBlock = `<div class="metadata"><div><div>Title</div><div>${title}</div></div><div><div>Description</div><div>${desc}</div></div></div>`;
sections[sections.length - 1] = sections[sections.length - 1].replace(/<\/div>$/, `${metaBlock}</div>`);

if (listImages) {
  console.log([...new Set(images)].join('\n'));
  process.exit(0);
}
const doc = `<body><header></header><main>\n${sections.join('\n')}\n</main><footer></footer></body>\n`;
if (out) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, doc);
  const unmapped = [...new Set(images)].filter((b) => !mediaMap[b]);
  console.log(`wrote ${out}: ${sections.length} sections${unmapped.length ? `, UNMAPPED images: ${unmapped.join(', ')}` : ''}`);
} else process.stdout.write(doc);
