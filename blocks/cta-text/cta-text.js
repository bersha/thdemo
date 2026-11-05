/**
 * cta-text — heading + short intro beside one button (source .th-cta-text-block).
 *
 * Authoring (template-slotted, one cell classified by content): an h2, intro paragraph(s),
 * and a bold link paragraph (primary button). Used as a closing content section and as the
 * hero app panel (`hero with-cta` builds this block from its third row).
 */

const isCtaP = (n) => {
  const a = n.matches('p') ? n.querySelector('a') : null;
  return !!a && n.textContent.trim() === a.textContent.trim()
    && !!n.querySelector('a.button, strong a, em a');
};

function wrap(nodes, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(...nodes);
  return w;
}

export default function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const ctas = nodes.filter(isCtaP);
  const intro = nodes.filter((n) => n !== heading && !ctas.includes(n));

  block.classList.add('th-cta-text-block');
  const content = [];
  if (heading) {
    heading.classList.add('th-cta-text-block-heading');
    content.push(heading);
  }
  if (intro.length) content.push(wrap(intro, 'th-cta-text-block-introduction'));
  const parts = [wrap(content, 'th-cta-text-block-content')];
  if (ctas.length) {
    ctas.forEach((p) => {
      const a = p.querySelector('a');
      a.classList.add('th-button-full-width-on-mobile-fit-text-desktop');
    });
    parts.push(wrap(ctas, 'th-cta-text-block-actions'));
  }
  block.replaceChildren(...parts);
}
