<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-11-04T10:10:00Z source=https://www.trygghansa.se/ pages=10 mode=prep -->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Private individuals and families in Sweden buying or managing insurance: car and other vehicle owners, households (home, villa), parents (child insurance), pet owners, and existing customers who need to report a claim. A secondary audience is businesses (the "Företag" switch in the header).

## Product Purpose

Trygg-Hansa's public site sells and explains insurance ("Trygghet för livet"). Product pages lead with an instant quote form ("Se ditt bästa pris" — personal identity number plus registration number or address), followed by benefits, coverage comparison tables, FAQs and related reading. The claims page ("Skadeanmälan") routes customers to report a loss online or by phone.

## Positioning

_provenance: inferred — basis: hero headlines, USP rows and rating bands on the captured pages._
An established Swedish insurer ("Snart 200 år av trygghet") positioning on breadth of cover, bundle discounts ("Upp till 20 % samlingsrabatt") and independent ratings ("Topprankad av Konsumenternas").

## Capabilities and Constraints

- Quote widgets (vehicle, home, pregnancy quick-quote) are client-rendered apps loaded from cdn.trygghansa.se.
- Header carries a Privat/Företag switch, a mega-menu "Försäkringar", "Anmäl skada", Kundservice, Logga in and Sök.
- Analytics, tag manager and consent management are present (see `_crawl-log.json#dynamicSurface`).

## Brand Commitments

- Register: `brand` (marketing/sales site with transactional entry points).
- Personality: dependable, plain-spoken, Scandinavian-clean; white surfaces, black type, brand red (#E50000) for primary actions and the logo, teal (#127994) for links and info bars.
- Typography: brand display face "ApexNew" (licensed, Hansa Apex New) for headings; Arial for body.
- Anti-references observed: no gradients, no decorative illustration beyond the icon set, minimal motion.

## Evidence on Hand

- `stardust/current/pages/*.json|.html` — 10 captured pages (live Playwright render, see `_provenance`).
- `stardust/current/assets/screenshots/*.png` — full-page captures at 1440.
- `stardust/current/_computed-styles.json` — computed-style census at 1440 and 360.
- `stardust/current/css/` — the site's own stylesheets (theme tokens in `trygghansa.css`).
- `stardust/current/assets/logo.svg`, `logo-black.svg`, `favicon.png`.

## Product Principles

_provenance: inferred — basis: page structure repeated across product pages._
1. Price first: every product page opens with the quote form above the fold.
2. Prove it: ratings, USPs and comparison tables before long-form copy.
3. Answer questions in place: FAQ accordions and "Allt om försäkringen" document links.

## Accessibility & Inclusion

Visible focus outline token (`--th-theme-stroke-focus`), aria-labelled navigation and collapsible submenus; body copy at 16px Arial on white.
