/**
 * pregnancy-quote widget — the home tabset's pregnancy quick-quote form (UI only;
 * see quote-form.js).
 * @param {Element} widget the widget root
 */
import decorateQuoteForm from './quote-form.js';

export default function decorate(widget) {
  decorateQuoteForm(widget, []);
}
