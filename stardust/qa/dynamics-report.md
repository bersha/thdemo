# Dynamics parity check — https://main--64009de2--aemcoder.aem.live — 2026-11-04T14:52:34.183Z

Replayed 7 checks over 10 features · pass 7 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Quick-quote form (UI rebuilt; submission hands off to the source quote flow, no PII stored) | F | scaffolded-awaiting-owner | dom-count | PASS | 1 × main form (min 1) |  |
| Quick-quote form (UI rebuilt; submission hands off to the source quote flow, no PII stored) | F | scaffolded-awaiting-owner | dom-count | PASS | 3 × main form (min 1) |  |
| Card grids | L | done | dom-count | PASS | 10 × main .cards li, main .cards > div > div (min 3) |  |
| Header mega-menu, Privat/Företag switch, mobile drawer | M | done | dom-count | PASS | 1 × header .th-header-nav-button[aria-expanded] (min 1) |  |
| FAQ accordions | M | done | dom-count | PASS | 8 × main .faq button[aria-expanded] (min 1) |  |
| No uncaught exceptions on delivered pages | - | done | no-page-errors | PASS | none on 10 page(s) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (4 gated · 0 cross-site host(s) blocked) |  |

## Features without checks

- dataLayer / adobeDataLayer / utag_data settings (A) — scaffolded-awaiting-owner · owner: carried with the martech contract, disabled; owner enables per part
- Vue quote apps (settled DOM captured) (CR) — done
- Tag-injected iframe (V) — scaffolded-awaiting-owner · owner: returns when the owner enables the tag stack in the martech contract
- Logga in / Mina sidor (X) — done
