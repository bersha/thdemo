/**
 * breadcrumbs — trail under the hero (source nav.th-breadcrumbs); flush + stripe section.
 *
 * Authoring: one cell holding a list (ol or ul): one item per crumb, a link for every crumb
 * except the current page (plain text). Small screens show the first and the last two crumbs.
 */
export default function decorate(block) {
  const list = block.querySelector('ol, ul');
  if (!list) return;
  const nav = document.createElement('nav');
  nav.className = 'th-breadcrumbs th-container th-container-wide';
  nav.setAttribute('aria-label', 'Brödsmulor');
  nav.append(list);
  const current = list.querySelector('li:last-child');
  if (current && !current.querySelector('a')) current.setAttribute('aria-current', 'page');
  block.replaceChildren(nav);
}
