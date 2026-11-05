# Stardust journal — trygghansa.se replica

## Extract — 10 planned pages captured live, spec seeded (2026-11-04)
- crawl.mjs `--pages` (10 URLs from site-plan.json) `--dynamics`, real Chrome headless, no bot wall: 10/10 live, 0 failed. Provenance 10/10 live.
- Vision check (thumbnails): all 10 ok — real rendered pages, consent dismissed (auto).
- Page types: landing 1 (index) · program 5 (bil, hem, helförsäkring, villa, barn) · listing 3 (fordon, person, djur) · static 1 (skadeanmälan).
- Style census 1440+360 → `_computed-styles.json`; theme tokens from `css/trygghansa.css`.
- Display face ApexNew (Hansa Apex New) is licensed and served without CORS → substitute required (width probe: Lato 700 ≈ 1.029× ApexNew Bold).
- cap-probe: container caps differ per archetype (1440 / fluid / 1064) — recorded in DESIGN.json extensions.breakpoints.
- Header contract recorded (`stardust/chrome/header-contract.json`): 1 menu control (Försäkringar), 390 run truncated at request budget.
- Capture gaps: none (no locale roots).

## Preserve direction — spec promoted verbatim, register R-01, dynamics triaged (2026-11-04)
- current/PRODUCT.md, DESIGN.md, DESIGN.json promoted verbatim to the project root; `stardust/direction.md` written (preserve mode).
- Register: 1 entry — R-01 licensed display face (ApexNew, no CORS) → size-adjusted Lato, brand family first in the stack. Otherwise pure replica.
- Dynamics: detect on 4 archetypes (29 findings) → curated 9 rows in `stardust/dynamic-features.md`; quick-quote is regulated-pii (UI rebuilt, submission handed to source flow, owner decision); header menu + FAQ accordion rebuilt natively.
- Martech: spec-martech (OneTrust, Launch 65 rules, GTM, Tealium) → `stardust/martech-contract.json` + `martech-handoff.md`, every part disabled; scaffold runs before deploy.

## Recreate — 4 archetypes recreated and gated at 1440 + 360 (2026-11-04)
- landing `index` 1440 0.14% / 360 0.15%; listing `forsakringar-person` 0.21% / 0.16%; static `skadeanmalan` 0.15% / 0.15%;
  program `forsakringar-bilforsakring` 0.26% / 0.45% — all Δh 0, content-diff 0 🔴 / 0 nothing-lost 🟡, clip 0, cap-probe PASS at 2560,
  motion compare 0 missing / 0 extra. Evidence `stardust/replica/progress.json`, `gates/<slug>-<w>/`.
- Program needed 2 fix iterations at 1440 (sr-only captions laid out; product-accordion intro 22/30) and 1 at 360 (buttons'
  line-height is `normal` in the source cascade). The two canon fixes were re-confirmed on the three earlier archetypes.
- Prototype table (`gate-all --stage prototype`): 4/4 PASS at 1440 and at 360 (`gates/prototypes-<w>/`).
- Trap: `current/measure/<slug>-units.json` is not width-keyed — clear it before every run at another width (a 1440 table run
  read 360 origin geometry and failed units for one page).

## Migrate plan — 4 archetypes rendered, 6 siblings queued behind their live archetypes (2026-11-04)
- Archetypes rendered through `migrate.mjs render` (branch A) into `stardust/migrated/` and advanced to `migrated`; modules[] declared.
- Sibling variance probes: program siblings hemforsakring/villaforsakring/barnforsakring use the home quick-quote app (variant);
  everything else is content-count variance. Plan in `stardust/migrate/plan.md`, units in `stardust/migrate/progress.json`.
- Sibling render units `listing` and `program` run inside C-deliver after each template's `archetype` unit is done.

## A-inventory — 10 pages inventoried, 4 archetypes to deliver first (2026-11-04)
- `inventory.mjs`: 10 pages, 4 pending (archetypes), 6 content-pending (siblings); DA org aemcoder / site 64009de2 / ref main;
  live host main--64009de2--aemcoder.aem.live.

## B-block — 12 distinct blocks, representative-first plan (2026-11-04)
- `blocks.mjs`: 12 module blocks from 29 instances (cards×4, hero×4, teaser×4, breadcrumbs×3 …); `plan.mjs`: each block converts on one page.

## B2-dynamic — dynamic surface re-detected on the archetypes, martech scaffolded switched off (2026-11-04)
- `dynamics-detect.mjs --from-state`: 28 findings on the 4 archetypes (13 third-party hosts, quick-quote forms, triggers) — matches
  the curated `stardust/dynamic-features.md` (9 rows, all dispositioned); regenerated plan 29 rows.
- Martech: contract rebuilt from `stardust/martech` (`dynamics-plan.mjs --martech`), every part disabled (0 enabled);
  `martech-scaffold.mjs` wrote `scripts/martech.js` and hooked `scripts/scripts.js` — no CMP, 0 routes on; the owner switches parts on.

## C-deliver — 10/10 pages delivered and gated on the published origin (2026-11-04)
- Units: foundation, archetype×4 (landing, program, listing, static), cluster×2 (listing, program), gate-all, final — all done.
- gate-all at 1440 + 360: 9 PASS + villaforsakring capture-state override (live A/B variant) → 10/10 delivered; coverage --gate 10/10.
- C-final: foundation-freeze check clean (14 files), no foundation requests queued, so no archetype re-gate; 10 pages + nav/footer 200 on aem.live.
- state.json: the 6 siblings advanced to migrated; migrate report unit closed.
- Next: D-site (sitemap/robots, redirects sheet — /redirects.json not yet published), then E…I.

## D-site — sitemap served 10 = assembled 10, root 200, no redirects needed (2026-11-04)
- assemble.mjs --verify-origin aem.live: 10 served = 10 assembled, 0 extra, 0 missing; /nav and /footer carry robots noindex.
- `/` → 200 on aem.page; the source root serves a page, so it is the root `index` document, no `/` sheet row.
- Redirects: none needed (paths identical); decision in eds-conversion-log.md.

## D2-dynamic — 7/7 parity checks pass on aem.live, martech gated off (2026-11-04)
- stardust/dynamics/parity.json: 9 features; checks: quick-quote form (bilforsakring, home), cards, header menu, FAQ, no page errors on 10 pages, martech gate (4 parts gated, 0 tag hosts requested).
- First run's hemforsakring quick-quote check was mis-targeted (the source page has no form); repointed to the home tabset.
- Owner decisions open by name: quick-quote submission target, martech parts, tag-injected iframe. No search / query-index surface. D3 multilingual not applicable (single locale).

## E-full-site — 10/10 verified on aem.live; two verify.mjs false negatives documented (2026-11-04)
- verify.mjs --all: 4 verified, 6 failed — none a page defect:
  - HTTP 404 ×3 (bilforsakring, person, skadeanmalan): lib.mjs publicUrl() adds a trailing slash when the migrated source is a folder `index.html`; the delivered extensionless URL answers 200.
  - "broken internal links" ×3 (home, fordon, helforsakring): `/widgets/quick-quote/*.html` — the documented widget reference (#133); verify's link check does not exempt it; each answers 200 on aem.live.
- Equivalent check (stardust/.work/verify/equiv.mjs: 200 on the delivered URL, exactly one h1, no about:error, every internal href known or a widget answering 200, gate.pass true): 10/10 PASS → update-coverage --status verified for the six.
- No restoreAtDelivery entries (no autoplay media / auto-advancing carousels captured).

## E2-link-audit — 0 broken links; 155 out-of-scope targets repointed to the source (2026-11-04)
- localize-links --check over content/: 0 localizable links left. Live audit (10 pages + /nav + /footer): 16 internal targets 200 on aem.live, 155 source-site targets < 400, 11 external hosts untouched.
- Decision recorded in direction.md: fixed 10-page scope → every other target is scope extension, repointed to the source.

## F-optimize — gate PASS, 0 P1; 10 P2 = structured data missing on every page (2026-11-04)
- optimize --base inspected only 7 pages (same trailing-slash publicUrl skip as verify); re-run over a mirror of the 10 served pages (stardust/.work/optimize-mirror, --root) → run-2: 10/10 inspected, P1 0 · P2 10 · P3 0.
- All 10 P2 are ai-search/jsonld: the source carries JSON-LD on every page (Organization + WebSite on home; BreadcrumbList, Product, FAQPage on product pages) and the delivered pages carry none — a real regression, fixed in G-aem.

## G-aem — source JSON-LD carried verbatim onto 10/10 pages; optimize 0 open (2026-11-04)
- autofix-aem --dry-run: eds-jsonld is manual (head/metadata pipeline). Fix: each content page's metadata block gains a `JSON-LD` row holding the source page's JSON-LD items verbatim (array when > 1); the EDS pipeline renders it as `<script type="application/ld+json">` (stardust/.work/jsonld/add-jsonld.py, idempotent).
- First pass tripped davids-model D15 ×6 (HTML inside FAQ answers showed as `&lt;p…` text); `<`, `>`, `&` now written as JSON `\u` escapes — identical JSON, lint back to 0 🔴.
- deploy-batch --force over the 10 paths (ledger stardust/deploy/ledger-g-aem.json): 10/10 live. Served JSON-LD == source item-for-item on 10/10 (stardust/.work/jsonld/parity.py).
- optimize run-3 (mirror of served pages): P1 0 · P2 0 · P3 0, 10 fixed; verify-equivalent 10/10 PASS. Head-only change — pixel gate rows stand.

## H-report — 10/10 pages, 12/12 blocks, quality 100, nothing left in scope (2026-11-04)
- Coverage block rows were still `pending` → recorded 12/12 verified (all ship under blocks/ or widgets/).
- stardust/rollout/report.md written; three learnings appended.

## I-dashboard — dashboard built: 10 identified · prototyped · deployed · optimised (2026-11-04)
- stardust/rollout/dashboard/{index.html,data.json} from the coverage, optimize and state ledgers.

## Handoff — run complete: 10/10 pages live and gated on aem.live (2026-11-04)
- Runner done-check: {"complete":true,"gaps":[]}.
- Header parity re-run against the live host (chrome-explore on aem.live → chrome-compare replica): 0 errors, 8 warnings (same as the shell-check run: budget-truncated 390 record, height motion on submenu, top-level `/` link), header_parity gap closed.
- Local done-check still lists pages_not_live:3 (/forsakringar/bilforsakring/, /forsakringar/person/, /skadeanmalan/) — the same rollout/lib.mjs publicUrl trailing-slash false negative as verify/optimize; the extensionless URLs answer 200 on aem.live. Logged in learnings.md.
- Owner decisions left open by name: quick-quote submission target, martech contract parts (all disabled), tag-injected iframe.
