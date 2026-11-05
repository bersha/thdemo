# Inconsistency register — trygghansa.se replica

The ONLY permitted design deltas. Anything not listed here is out of scope for change.

## R-01 — Licensed display face replaced by a metric-matched substitute

- **Evidence:** headings use `ApexNew` (`css/trygghansa.css` @font-face → cdn.trygghansa.se/theme/fonts/HansaApexNew-{Book,Medium,Bold}.woff2); the font responses carry no `Access-Control-Allow-Origin`, so the face cannot load on the new origin, and the kit is licensed (never rehosted). Width probe (`stardust/.work/tools/fontmatch.mjs`): Lato 700 = 1.029× ApexNew Bold over 5 heading strings.
- **Finding:** a delivery constraint, not a taste call — the brand face is unavailable on the Edge Delivery origin.
- **Minimal change:** heading stack `"ApexNew", "Lato", Arial, Helvetica, sans-serif` with Lato self-hosted (OFL) under a size-adjusted @font-face so line widths match; a licensed ApexNew drop-in later wins automatically. No other typographic change.
- **Status:** applied
- **Where:** all page types — every heading set in ApexNew (h1–h3, card titles).
