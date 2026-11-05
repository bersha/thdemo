/**
 * Shared quick-quote form behaviour (UI only) for the landing quick-quote widgets.
 * No quote endpoint is wired (dynamic-features-plan row 1, owner decision pending):
 * submitting hands the visitor to the source quote flow (the form action) WITHOUT the
 * entered values, so no personal data (personnummer, registration number, address)
 * leaves the page. Non-personal choices listed in `keep` (e.g. a property type select)
 * are passed on as query parameters.
 * @param {Element} widget the widget root
 * @param {string[]} [keep] names of non-personal fields forwarded to the source flow
 */
export default function decorateQuoteForm(widget, keep = []) {
  const form = widget.querySelector('form');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const loader = widget.querySelector('.th-qq-loader');
    if (loader) loader.hidden = false;
    const target = new URL(form.getAttribute('action'), window.location.href);
    keep.forEach((name) => {
      const field = form.elements.namedItem(name);
      if (field && field.value) target.searchParams.set(name, field.value);
    });
    window.location.assign(target.href);
  });

  const modal = widget.querySelector('.th-qq-modal');
  const modalClose = modal && modal.querySelector('.th-qq-close');
  if (modalClose) modalClose.addEventListener('click', () => modal.close());

  widget.querySelectorAll('.th-qq-popover').forEach((pop) => {
    const help = pop.querySelector('.th-qq-help');
    const body = pop.querySelector('.th-qq-popover-body');
    const close = body && body.querySelector('.th-qq-close');
    if (!help || !body) return;
    const set = (open) => {
      body.hidden = !open;
      help.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    help.addEventListener('click', (e) => {
      e.preventDefault();
      set(body.hidden);
    });
    if (close) {
      close.addEventListener('click', (e) => {
        e.preventDefault();
        set(false);
        help.focus();
      });
    }
    pop.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !body.hidden) {
        set(false);
        help.focus();
      }
    });
  });
}
