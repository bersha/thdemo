/**
 * campaign-banner — full-bleed accent band: burst-badge icon + one campaign line,
 * optionally with a link that opens a modal (source .th-campaign-banner + .th-modal).
 *
 * Authoring:
 *   row 1: cell 1 = icon (:th-savepig:) | cell 2 = the campaign line paragraph and, when the
 *          block has a modal, a second paragraph = the modal trigger text (rendered as an
 *          underlined inline button continuing the line).
 *   row 2 (optional): the modal — heading (h2) + body paragraphs.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

let modalCount = 0;

/** Builds a .th-modal dialog around an authored heading + body nodes (moved, not copied). */
function buildModal(heading, bodyNodes) {
  modalCount += 1;
  const dialog = document.createElement('dialog');
  dialog.className = 'th-modal';
  dialog.setAttribute('aria-modal', 'true');
  const content = document.createElement('div');
  content.className = 'th-modal-content';
  const header = document.createElement('div');
  header.className = 'th-modal-header';
  if (heading) {
    if (!heading.id) heading.id = `campaign-banner-modal-${modalCount}`;
    dialog.setAttribute('aria-labelledby', heading.id);
    header.append(wrapNode(heading, 'th-heading th-modal-heading'));
  }
  const top = document.createElement('button');
  top.type = 'button';
  top.className = 'th-modal-button-top';
  top.setAttribute('aria-label', 'Stäng dialogruta');
  top.innerHTML = '<span class="th-icon th-icon-black th-icon-20 icon-th-cross"></span>';
  header.append(top);
  const body = document.createElement('div');
  body.className = 'th-modal-body';
  body.append(...bodyNodes);
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
  [top, close].forEach((b) => b.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  return dialog;
}

export default function decorate(block) {
  const rows = [...block.children];
  const iconSpan = block.querySelector('span[class*="icon-th-"]');
  const iconText = [...block.querySelectorAll('p')].find((p) => /^\s*:[a-z0-9-]+:\s*$/.test(p.textContent));
  const iconHost = iconSpan ? iconSpan.closest('p') || iconSpan : iconText || null;
  const modalCell = rows.slice(1).map((r) => r.querySelector('h2, h3')?.parentElement).find(Boolean);
  const lines = [...block.querySelectorAll('p')].filter((p) => p !== iconHost
    && !(modalCell && modalCell.contains(p)) && p.textContent.trim());

  block.classList.add('th-campaign-banner');
  const iconWrap = document.createElement('div');
  iconWrap.className = 'th-campaign-banner-icon-wrapper';
  iconWrap.setAttribute('aria-hidden', 'true');
  if (iconHost) {
    if (iconSpan) iconSpan.classList.add('th-icon-black', 'th-campaign-banner-icon');
    iconWrap.append(iconHost);
  }
  const text = document.createElement('div');
  text.className = 'th-campaign-banner-text';
  const triggerP = modalCell && lines.length > 1 ? lines.pop() : null;
  lines.forEach((p, i) => {
    if (i) text.append(' ');
    text.append(p);
  });

  if (modalCell) {
    const heading = modalCell.querySelector('h2, h3');
    const bodyNodes = [...modalCell.children].filter((n) => n !== heading);
    const dialog = buildModal(heading, bodyNodes);
    if (triggerP) {
      const trigger = document.createElement('div');
      trigger.className = 'th-button-link';
      trigger.setAttribute('role', 'button');
      trigger.tabIndex = 0;
      trigger.append(triggerP);
      const open = (e) => {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        dialog.showModal();
      };
      trigger.addEventListener('click', open);
      trigger.addEventListener('keydown', open);
      text.append(' ', trigger);
    }
    text.append(dialog);
  }
  block.replaceChildren(iconWrap, text);
}
