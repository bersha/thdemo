/**
 * cta-image — image half + text half (source .th-cta-image-block, wide section).
 *
 * Authoring: one row, two cells, classified by content:
 *   picture cell: the image (full bleed into its half at >= 1024 px).
 *   text cell:    h2, intro paragraph(s), a bold link paragraph (primary button).
 * Cell order sets the side: picture cell first = image left, picture cell last = image right.
 * @variants small-crop — the picture cell holds two pictures: the FIRST is the source's
 *   small-screen focal crop (< 1024 px), the LAST the large rendition (>= 1024 px).
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
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const picCell = cells.find((c) => c.querySelector('picture') && !c.querySelector('h1, h2, h3'));
  const textCells = cells.filter((c) => c !== picCell);
  const right = !!picCell && cells.indexOf(picCell) === cells.length - 1 && cells.length > 1;

  block.classList.add('th-block', 'th-cta-image-block');
  if (right) block.classList.add('th-cta-image-block-right');

  const parts = [];
  const pics = picCell ? [...picCell.querySelectorAll('picture')] : [];
  if (block.classList.contains('small-crop') && pics.length > 1) {
    pics.forEach((p) => {
      const img = p.querySelector('img');
      if (img) img.loading = 'lazy';
    });
    pics[0].classList.add('th-cta-image-small');
    pics[pics.length - 1].classList.add('th-cta-image-large');
    parts.push(wrap([pics[0], pics[pics.length - 1]], 'th-cta-image-block-image'));
  } else if (picCell) {
    const picture = picCell.querySelector('picture');
    const img = picture.querySelector('img');
    if (img) img.loading = 'lazy';
    parts.push(wrap([picture], 'th-cta-image-block-image'));
  }
  const nodes = textCells.flatMap((c) => [...c.children]);
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const ctas = nodes.filter(isCtaP);
  const intro = nodes.filter((n) => n !== heading && !ctas.includes(n) && n.textContent.trim());
  const content = [];
  if (heading) content.push(wrap([heading], 'th-heading th-block-heading'));
  if (intro.length) content.push(wrap(intro, 'th-cta-image-block-introduction'));
  if (ctas.length) {
    ctas.forEach((p) => {
      const a = p.querySelector('a');
      a.classList.add('th-button-full-width-on-mobile-fit-text-desktop');
    });
    content.push(wrap(ctas, 'th-block-actions'));
  }
  parts.push(wrap(content, 'th-cta-image-block-content'));
  block.replaceChildren(...parts);
}
