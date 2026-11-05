/**
 * vehicle-quote widget — the car quick-quote form (UI only).
 * Submission is blocked until the owner names a secured quote endpoint
 * (dynamic-features-plan row 1):
 * "Se ditt bästa pris" hands the visitor to the source quote flow WITHOUT the entered values,
 * so no personal data (personnummer, registration number) leaves the page.
 * @param {Element} widget the widget root
 */
export default function decorate(widget) {
  widget.classList.add('th-app-wrapper');
  const form = widget.querySelector('form');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const loader = widget.querySelector('.th-qq-loader');
    if (loader) loader.hidden = false;
    const target = new URL(form.getAttribute('action'));
    const type = form.querySelector('select[name="insuranceType"]');
    if (type && type.value) target.searchParams.set('insuranceType', type.value);
    window.location.assign(target.href);
  });
  const modal = widget.querySelector('.th-qq-modal');
  const close = widget.querySelector('.th-qq-close');
  if (modal && close) close.addEventListener('click', () => modal.close());
}
