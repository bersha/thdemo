# Dynamic features — trygghansa.se

Curated from `stardust/dynamics/dynamic-features.generated-plan.md` (29 draft rows, 4 archetype pages + reach from 10 crawled pages). Static recreation continues regardless of every row below.

## Listings contract
none — the card grids (product cards on the category overviews, "Våra försäkringar", "Relevant läsning") are editorially curated navigation, authored as rows in the page document; no query index is read.

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | quick-quote | Quick-quote form in the hero (personnummer + regnr / address; vehicle, home, pregnancy apps from cdn.trygghansa.se) | F | 8/10 | rebuild-native | widget | needs-business-decision | pending | forms | regulated-pii: UI rebuilt, submission blocked until the owner names the secured quote endpoint; interim "Se ditt bästa pris" hands the visitor to the source quote flow | rows 6–8 |
| 2 | product-cards | Card grids (icon cards, image cards) | L | 6/10 | static-snapshot | block | self | pending | settled-dom-snapshot | — editorially curated | rows 9–13 |
| 3 | header-menu | Header "Försäkringar" mega-menu, Privat/Företag switch, mobile drawer | M | 10/10 | rebuild-native | runtime | self | pending | chrome-interaction | — header contract is the spec | rows 14, 17, 18, 29; stardust/chrome/header-contract.json |
| 4 | faq-accordion | FAQ accordions / collapsible sections | M | 6/10 | rebuild-native | block | self | pending | modal-loader | — | row 15–16 |
| 5 | data-layers | dataLayer / adobeDataLayer / utag_data settings objects | A | 10/10 | static-snapshot | content | self | pending | read-settings | — carried with the martech contract (disabled) | rows 2–4 |
| 6 | vue-islands | Vue-rendered quote apps (settled DOM captured) | CR | 2/4 | static-snapshot | content | self | pending | settled-dom-snapshot | — | row 5 |
| 7 | martech | Tealium, Adobe Launch, GTM, OneTrust, session replay, Amazon ads, VoC badge, Azure monitor | T | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | owner turns each part on in `stardust/martech-contract.json` (all disabled) | rows 19–26, 1; stardust/martech-handoff.md |
| 8 | runtime-iframe | iframe without src (tag-injected) | V | 10/10 | static-snapshot | — | needs-human-capture | pending | embed-passthrough | undecided — revisit at rollout (injected by the tag stack; returns when tags are enabled) | row 27 |
| 9 | account-cart | Logga in / Mina sidor (commerce/auth signals) | X | 2/4 | static-snapshot | — | needs-backend | pending | — | undecided — revisit at rollout; "Logga in" stays a link to the source login | row 28 |

## Decision batch
One message to the owner:
- **Quote forms (row 1):** which secured endpoint should the new site's quick-quote submit to? Until named, the rebuilt form hands visitors to the existing quote flow on trygghansa.se.
- **Tags and consent (row 7):** enable OneTrust and each tag manager route in `stardust/martech-contract.json` (see `stardust/martech-handoff.md`); everything ships disabled.
- **Tag-injected iframe (row 8)** and **login / Mina sidor (row 9):** confirm they stay on the existing host.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none decided out (hands-off never writes decided-out) | — |
