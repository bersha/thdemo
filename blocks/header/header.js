import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Header — Trygg-Hansa replica (canon § Header chrome).
 * The /nav document is authored in four sections:
 *   1. brand     link to / holding the logo icons (:logo-trygg-hansa: mobile,
 *                :logo-trygg-hansa-neg: desktop) and its accessible text
 *   2. switcher  list of segment links; the **bold** one is the active segment
 *   3. primary   list; an item with a nested list becomes a mega-menu (icon + label, then one
 *                item per category: icon + link + nested list of links); other items are links
 *   4. tools     right-aligned links; a **bold** link renders as the accent nav button
 * Authored nodes are moved into the source markup (th-header-* classes); no labels live here.
 */

const isDesktop = window.matchMedia('(min-width: 1024px)');
// accessible names for controls the document cannot author (source strings)
const NAV_LABEL = 'Primär toppmeny';
const SUBMENU_LABEL = 'Öppna undermeny för';

const normPath = (p) => decodeURIComponent(p).toLowerCase().replace(/\.html$/, '').replace(/(.)\/$/, '$1');
const currentPath = normPath(window.location.pathname);

/** Root-relative path of a same-origin link, else null. */
function localPath(a) {
  if (!a || !a.href) return null;
  const url = new URL(a.href, window.location.href);
  return url.origin === window.location.origin ? normPath(url.pathname) : null;
}

/** True when the current page is the link's page or below it (never for /). */
function isCurrent(a) {
  const p = localPath(a);
  return !!p && p !== '/' && (currentPath === p || currentPath.startsWith(`${p}/`));
}

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** Wraps each non-blank text node child of `parent` in a span (the authored node is moved). */
function wrapText(parent, className) {
  [...parent.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      const span = el('span', className);
      node.replaceWith(span);
      span.append(node);
    }
  });
}

/** Unwraps <strong>/<em> around an element; returns true when it was wrapped. */
function unwrapEmphasis(node) {
  const wrap = node.parentElement && node.parentElement.closest('strong, em');
  if (!wrap) return false;
  wrap.replaceWith(...wrap.childNodes);
  return true;
}

function iconOf(container) {
  return container.querySelector(':scope > .th-icon, :scope > span[class*="icon-th-"]');
}

function arrowIcon() {
  return el('span', 'th-icon th-icon-10 icon-th-arrow2 th-collapse-icon');
}

function buildLogo(section) {
  const container = el('div', 'th-header-logo-container');
  const link = section && section.querySelector('a');
  if (!link) return container;
  link.className = 'th-header-logo-link';
  const imgs = [...link.querySelectorAll('img')];
  imgs.forEach((img, i) => {
    const span = img.closest('span.icon');
    if (span && link.contains(span)) span.replaceWith(img);
    img.className = 'th-icon th-header-logo-icon';
    if (imgs.length > 1) img.classList.add(i === 0 ? 'th-header-logo-icon-mobile' : 'th-header-logo-icon-desktop');
    img.loading = 'eager';
    img.alt = '';
  });
  wrapText(link, 'sr-only');
  container.append(link);
  return container;
}

function buildSwitcher(section) {
  const list = section && section.querySelector('ul');
  if (!list) return null;
  const item = el('div', 'th-header-nav-item th-header-nav-item-switcher');
  const switcher = el('div', 'th-header-switcher');
  list.className = 'th-header-switcher-list';
  [...list.children].forEach((li) => {
    li.className = 'th-header-switcher-item';
    const a = li.querySelector('a');
    const para = a && a.closest('p');
    if (para && li.contains(para)) para.replaceWith(...para.childNodes);
    if (a && unwrapEmphasis(a)) li.classList.add('th-header-switcher-item-active');
  });
  switcher.append(list);
  item.append(switcher);
  return item;
}

function toggleCollapse(collapse, button, open) {
  collapse.classList.toggle('is-collapse-open', open);
  collapse.classList.toggle('is-collapse-close', !open);
  button.setAttribute('aria-expanded', String(open));
}

/** One mega-menu category: icon + link header, collapse toggle (until desktop), link list. */
function buildCategory(li) {
  li.className = 'th-header-subnavigation';
  const sublist = li.querySelector(':scope > ul');
  const label = li.querySelector(':scope > p') || li;
  const headerContainer = el('div', 'th-header-subnavigation-header-container');
  const head = el('div', 'th-header-subnavigation-header');
  head.append(...[...label.childNodes].filter((n) => n !== sublist));
  if (label !== li) label.remove();
  const icon = iconOf(head);
  if (icon) icon.classList.add('th-icon-32', 'th-icon-black', 'th-header-subnavigation-header-icon');
  headerContainer.append(head);
  li.prepend(headerContainer);
  const link = head.querySelector('a');
  let current = isCurrent(link);
  if (sublist) {
    sublist.className = 'th-collapse-body th-header-subnavigation-list';
    [...sublist.children].forEach((item) => {
      item.className = 'th-header-subnavigation-item';
      if (isCurrent(item.querySelector('a'))) {
        current = true;
        if (localPath(item.querySelector('a')) === currentPath) item.classList.add('th-header-subnavigation-item-active');
      }
    });
    li.classList.add('th-collapse', 'th-collapse-until-desktop', 'is-collapse-close');
    const toggle = el('button', 'th-collapse-header th-header-subnavigation-icon-container', {
      type: 'button',
      'aria-expanded': 'false',
      'aria-label': `${SUBMENU_LABEL} ${link ? link.textContent.trim() : ''}`.trim(),
    });
    toggle.append(arrowIcon());
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCollapse(li, toggle, !li.classList.contains('is-collapse-open'));
    });
    headerContainer.append(toggle);
  }
  if (current) {
    head.classList.add('th-header-subnavigation-header-active');
    if (icon) icon.classList.replace('th-icon-black', 'th-icon-primary');
  }
  return current;
}

function buildDropdown(li, index) {
  const sublist = li.querySelector(':scope > ul');
  const label = li.querySelector(':scope > p') || li;
  const id = `th-header-nav-${index}`;
  const button = el('button', 'th-header-nav-button', { type: 'button', 'aria-expanded': 'false', 'aria-controls': id });
  button.append(...[...label.childNodes].filter((n) => n !== sublist));
  if (label !== li) label.remove();
  const icon = iconOf(button);
  if (icon) icon.classList.add('th-icon-22');
  wrapText(button, 'th-header-nav-text');
  const body = el('div', 'th-header-nav-item-body', { id });
  sublist.className = 'th-header-subnavigation-container';
  const current = [...sublist.children].map(buildCategory).some(Boolean);
  if (current) button.classList.add('th-header-nav-button-active');
  body.append(sublist);
  li.prepend(button);
  li.append(body);
}

function buildLink(li, right) {
  const a = li.querySelector('a');
  if (!a) return;
  const para = a.closest('p');
  if (para && li.contains(para)) para.replaceWith(...para.childNodes);
  const accent = unwrapEmphasis(a);
  a.className = accent ? 'th-header-nav-button' : 'th-header-nav-link';
  const icon = iconOf(a);
  if (icon) {
    icon.classList.add('th-icon-22');
    if (accent) icon.classList.add('th-icon-inverse');
  }
  wrapText(a, 'th-header-nav-text');
  if (isCurrent(a)) a.classList.add(accent ? 'th-header-nav-button-active' : 'th-header-nav-link-active');
  if (right) li.classList.add('th-header-nav-item-right');
}

function buildNavList(primary, tools) {
  const list = (primary && primary.querySelector('ul')) || el('ul');
  list.className = 'th-header-nav-list';
  const toolItems = tools ? [...tools.querySelectorAll(':scope > ul > li')] : [];
  [...list.children].forEach((li, i) => {
    li.className = 'th-header-nav-item';
    if (li.querySelector(':scope > ul')) buildDropdown(li, i);
    else buildLink(li, false);
  });
  toolItems.forEach((li) => {
    li.className = 'th-header-nav-item';
    buildLink(li, true);
    list.append(li);
  });
  return list;
}

function setupMenus(header) {
  const closeAll = (returnFocus) => {
    header.querySelectorAll('.is-th-header-nav-item-open').forEach((item) => {
      item.classList.remove('is-th-header-nav-item-open');
      const b = item.querySelector(':scope > .th-header-nav-button');
      if (b) {
        b.setAttribute('aria-expanded', 'false');
        if (returnFocus && item.contains(document.activeElement)) b.focus();
      }
    });
    document.body.classList.remove('th-no-scroll-on-mobile');
  };
  header.querySelectorAll('.th-header-nav-button[aria-controls]').forEach((button) => {
    const item = button.closest('.th-header-nav-item');
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !item.classList.contains('is-th-header-nav-item-open');
      closeAll(false);
      item.classList.toggle('is-th-header-nav-item-open', open);
      button.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('th-no-scroll-on-mobile', open);
      header.style.setProperty('--th-visible-header-height', `${header.getBoundingClientRect().bottom}px`);
      // opened from the keyboard (detail 0): focus moves into the panel, as on the source
      const first = open && e.detail === 0 && item.querySelector('.th-header-nav-item-body a');
      if (first) first.focus();
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.th-header-nav-item-body')) closeAll(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.querySelector('.is-th-header-nav-item-open')) closeAll(true);
  });
  isDesktop.addEventListener('change', () => closeAll(false));
}

/**
 * loads and decorates the header from the /nav document
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  block.textContent = '';
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .map((s) => s.querySelector('.default-content-wrapper') || s);
  const [brand, switcherSection, primary, tools] = sections;

  const nav = el('nav', 'th-header-nav-container', { 'aria-label': NAV_LABEL });
  const switcher = buildSwitcher(switcherSection);
  if (switcher) nav.append(switcher);
  nav.append(buildNavList(primary, tools));

  block.append(buildLogo(brand), nav);
  const header = block.closest('header') || block;
  header.classList.add('th-header');
  setupMenus(header);
}
