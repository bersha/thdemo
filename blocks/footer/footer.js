import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Footer — Trygg-Hansa replica (canon § Footer chrome).
 * The /footer document is authored in two sections:
 *   1. columns  repeated heading (h2) + list of links; each pair becomes a column
 *               (4 across from 1024 px, collapsible below)
 *   2. bottom   list of social links (icon + text, text kept for screen readers),
 *               a logo link (:logo-trygg-hansa-neg:), the copyright paragraph and a paragraph
 *               of legal links
 * Authored nodes are moved into the source markup (th-footer-* classes); no labels live here.
 */

const isDesktop = window.matchMedia('(min-width: 1024px)');
// accessible name the document cannot author (source string)
const NAV_LABEL = 'Undermeny';

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

function buildColumns(section) {
  const nav = el('nav', 'th-footer-nav', { 'aria-label': NAV_LABEL });
  const main = el('ul', 'th-footer-main');
  const toggles = [];
  if (section) {
    section.querySelectorAll(':scope > h2, :scope > h3').forEach((heading) => {
      const list = heading.nextElementSibling && heading.nextElementSibling.tagName === 'UL'
        ? heading.nextElementSibling : null;
      const column = el('li', 'th-collapse th-collapse-until-desktop th-footer-column is-collapse-close');
      const h = el('h2', 'th-footer-header');
      const button = el('button', 'th-collapse-header', { type: 'button', 'aria-expanded': 'false' });
      button.append(...heading.childNodes);
      button.append(el('span', 'th-icon th-icon-10 icon-th-arrow2 th-collapse-icon th-footer-icon'));
      h.append(button);
      heading.remove();
      const body = el('div', 'th-collapse-body');
      if (list) {
        list.className = 'th-footer-list';
        [...list.children].forEach((li) => {
          li.className = 'th-footer-item';
          li.querySelectorAll('a').forEach((a) => { a.className = 'th-footer-link'; });
        });
        body.append(list);
      }
      button.addEventListener('click', () => {
        const open = !column.classList.contains('is-collapse-open');
        column.classList.toggle('is-collapse-open', open);
        column.classList.toggle('is-collapse-close', !open);
        button.setAttribute('aria-expanded', String(open));
      });
      toggles.push(button);
      column.append(h, body);
      main.append(column);
    });
  }
  // the column heading is a plain heading from 1024 px: take its toggle out of use
  const sync = () => toggles.forEach((b) => { b.disabled = isDesktop.matches; });
  sync();
  isDesktop.addEventListener('change', sync);
  nav.append(main);
  return nav;
}

function buildBottom(section) {
  const bottom = el('div', 'th-footer-bottom th-container th-container-wide');
  if (!section) return bottom;
  const social = section.querySelector(':scope > ul');
  if (social) {
    social.className = 'th-footer-links-container';
    social.querySelectorAll('a').forEach((a) => {
      const icon = a.querySelector('[class*="icon-th-"]');
      if (icon) icon.classList.add('th-icon-32');
      wrapText(a, 'sr-only');
    });
    bottom.append(social);
  }
  const paragraphs = [...section.querySelectorAll(':scope > p')];
  const logoP = paragraphs.find((p) => p.querySelector('img'));
  if (logoP) {
    const logo = el('div', 'th-footer-logo-container');
    const a = logoP.querySelector('a');
    logoP.querySelectorAll('img').forEach((img) => {
      const span = img.closest('span.icon');
      if (span) span.replaceWith(img);
      img.className = 'th-footer-logo-icon';
      img.alt = '';
    });
    if (a) {
      a.className = '';
      wrapText(a, 'sr-only');
      logo.append(a);
    } else logo.append(...logoP.childNodes);
    logoP.remove();
    bottom.append(logo);
  }
  const textContainer = el('div', 'th-footer-text-container');
  paragraphs.filter((p) => p !== logoP).forEach((p) => {
    p.className = 'th-footer-text';
    const links = p.querySelectorAll('a');
    if (links.length) {
      p.classList.add('th-footer-bottom-links');
      links.forEach((a) => { a.className = 'th-footer-link th-footer-link-underline'; });
    }
    textContainer.append(p);
  });
  bottom.append(textContainer);
  return bottom;
}

/**
 * loads and decorates the footer from the /footer document
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  block.textContent = '';
  if (!fragment) return;

  const [columns, bottom] = [...fragment.querySelectorAll(':scope > .section')]
    .map((s) => s.querySelector('.default-content-wrapper') || s);
  block.append(buildColumns(columns), buildBottom(bottom));
  const footer = block.closest('footer') || block;
  footer.classList.add('th-footer');
}
