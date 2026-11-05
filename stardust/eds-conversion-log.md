# EDS conversion log — trygghansa.se replica

## Publish decision (2026-11-04)
- Decided for this run: **publish**. Every delivered page, the redirects sheet and the chrome documents (nav, footer)
  go live on main--64009de2--aemcoder.aem.live (`deploy-batch.mjs` without `--no-publish`, or `POST admin.hlx.page/live/…`).

## C0 foundation (2026-11-04)
- styles/styles.css + fonts.css (canon ported; Lato 700 R-01 substitute), header/footer blocks loaded from /nav and /footer
  (both `Robots: noindex`, published), icons/ (59 th-* masks + logos), head.html, stardust/runtime-contract.json.
- Class names: source th-* with `__`/`--` collapsed to `-` (kebab-case lint). `main > .section` = `.th-section`;
  section styles `flush`, `wide`, `small`, `stripe`. Breakpoints kept at the source's 768/1024.
- Header contract: the extract-time source record had the OneTrust preference-centre dialog over every open-state crop.
  Script adaptation: `stardust/scripts/diff/live-session.mjs` CONSENT_CANDIDATES gains OneTrust's
  `#accept-recommended-btn-handler` (chrome-explore has no `--consent` flag); the contract was re-recorded
  (`stardust/chrome/header-contract.json`, old copy in `.work/chrome/`). chrome-compare vs the preview shell:
  0 errors, 8 warnings (mobile submenu height animation, skip link, budget truncation) → `stardust/chrome/header-parity.json`.
- Header/footer crop-compare vs the gated prototype: 0.00% (1440 footer 0.09%).
- Not carried in the foundation: the tag-injected SHL flyout; the "Till innehållet" skip link.

## archetype-program — `/forsakringar/bilforsakring` (2026-11-04)
- Encoder: `stardust/rollout/encoders/program-encode.mjs <migrated|prototype html> --out content/<path>.html
  --media-map <json>` (module → block mapping in its header; reuse for program/listing/landing siblings). Media map
  `stardust/rollout/encoders/media-map-forsakringar-bilforsakring.json`; images under DA `media/forsakringar-bilforsakring/`
  (hero = 480 crop + 1536 crop; stars SVG rasterised to PNG).
- Blocks (decode tier): hero (template-slotted; 2 pictures = small <768 / large; `/widgets/…` link → app slot),
  widget `widgets/quick-quote/vehicle-quote` (UI only; submit → source quote flow without field values),
  campaign-banner (template-slotted; row 2 = modal; 2nd paragraph = modal trigger), breadcrumbs (list, flush+stripe),
  quick-facts / cards / product-table / faq / document-list / columns (reconstructive), teaser (template-slotted).
  Variants: `cards small`, `product-table lead`. Head rule shared by all: a cell starting with h2 = heading, rest = intro.
- Deviations: accordion header is the source's `<button>` holding the authored h3 (EW7 traded for gate control parity —
  unit-geometry counts the button); product-table modal title/body are stripped clones (EW4, `@ew-exempt`).
- delivery-lint P1 `one-cta-per-p` is a false positive on a prose paragraph (2 inline links + a bold term in the
  columns block); runtime decorateButtons does not buttonise it.
- Gate (preview origin): 1440 1.07 % Δh 0, 360 0.43 % Δh 0, PASS (3 fix rounds: accordion end margin + nested
  container gutters; source button header + value-cell box; card link box). `stardust/replica/units.json`
  `program-coverage-rows.build` now targets the EDS rows (`.th-product-accordion-block-table tbody tr`); the other
  families still carry prototype `__` selectors and need the collapsed EDS name before their published gate.
  gate-all needs a state file with the page `deployed` + `liveUrl` (used `stardust/.work/archetype-program/gate-state.json`)
  and `--eds-host` WITH the `https://` scheme.

## archetype-landing — `/` (DA `index`) (2026-11-04)
- Encoder: the shared `stardust/rollout/encoders/program-encode.mjs` (now also landing: hero area,
  tabset, cta-image, content block; a `<p><br>` keeps its empty first line as `<p>&nbsp;<br>`),
  input = the gated prototype (the migrated copy only relativises links). Media map
  `stardust/rollout/encoders/media-map-index.json`, images under DA `media/index/` (hero 480 + 1536 crops).
- Sections: 1 flush (hero + tabset), quick-facts, 3× cta-image (`wide`), teaser content (`small`), cards,
  2× teaser (`small`). Stripe order equals the source (flush sections are not counted).
- New blocks: **tabset** (template-slotted tabs + reconstructive panels; row per tab = tab cell [bold campaign
  tag, :th-icon:, short label, full label] | banner cell | panel cell [h2, intro, bold/italic buttons,
  `/widgets/quick-quote/<name>.html` link]; click + arrow/Home/End; tab labels `@ew-exempt` — they are the inline
  text of the `<a role="tab">`), **cta-image** (one row: picture cell + text cell; picture cell last = image right).
- New widgets (UI only; submit → source quote flow with no personal values; home forwards only the property
  type): `widgets/quick-quote/car-quote`, `pregnancy-quote`, `home-quote` (+ help popover); shared atoms in
  `quote-form.css` / `quote-form.js`.
- Variants: `hero large top-aligned` (overlay modifiers), `teaser content` (source .th-content-block:
  left-aligned head, image after the intro, the source's trailing empty paragraph as bottom padding).
  Shared-block change: cards `.th-card-text p` fills its grid row (unit geometry) — program row re-gated
  at 1440: 1.07 % Δh 0 PASS (unchanged).
- block-roundtrip: tabset is checked against a prototype copy with the widget-owned subtree removed
  (`stardust/.work/archetype-landing/proto-widget-skipped.html`), mirroring the tool's own widget skip on the EDS side.
- units.json: `product-cards` / `quick-facts` build selectors switched to the EDS names.
- Gate (preview origin): 1440 0.14 % Δh 0, 360 0.15 % Δh 0, PASS (fix rounds: widget unwrapped from its
  paragraph; content-block box + leading-br line + card text row height; content-block gutters).

## archetype-listing — `/forsakringar/person` (2026-11-04)
- Encoder: the shared `stardust/rollout/encoders/program-encode.mjs`, input = the gated prototype; no new module code.
  Fix: a link's trailing space moves after the `</a>` (the DA → preview pipeline trims it, gluing "studenter</a>till");
  a leading space stays inside the link (it survives, and moving it shifts the link box off the source's: units off 1).
  Media map `stardust/rollout/encoders/media-map-forsakringar-person.json`, images under DA `media/forsakringar-person/`
  (hero 480 + 1536 renditions).
- Sections (decode tier): hero (template-slotted, flush), campaign-banner (template-slotted, flush, no modal row),
  breadcrumbs (list, flush+stripe), teaser with icon (`small`, template-slotted), cards (icon cards, reconstructive),
  columns (head row + 2 prose columns, reconstructive). No new blocks, no variants, no shared block change.
- block-roundtrip `--ew` (maps hero=.th-hero, teaser=.th-content-area>.th-section>.th-teaser-block,
  cards=.th-card-list-block, columns=.th-two-column-text-block): 63/63 editable, 0 structural; 🟡 only for the
  `:th-*:` icon tokens (harness does not decorate icons) and hero 2 img (small/large renditions).
- units.json: `listing-product-cards` / `listing-two-column-text` build selectors switched to the EDS names.
- Gate (preview origin): 1440 0.21 % Δh 0, 360 0.17 % Δh 0, units off 0, PASS (one content fix round: link trailing space).

## cluster-program — program siblings (2026-11-04)
- Pages: /forsakringar/hemforsakring, /forsakringar/bilforsakring/helforsakring,
  /forsakringar/hemforsakring/villaforsakring, /forsakringar/person/barnforsakring (published).
- Encoder: shared `program-encode.mjs`, input = the scratch sibling renders
  `stardust/.work/migrate-program/<slug>.html` (absolute source links → in-scope root-relative, others absolute).
  Media maps `stardust/rollout/encoders/media-map-<slug>.json`, images under DA `media/<slug>/`; hero = the
  source's 480 focal crop (`<stem>_480`, fetched from the live rxy URL) + the large render; SVG logos/stars
  rasterised to PNG (helforsakring reuses the archetype's stars_4-8.png).
- Hero app on hem/villa/barn is NOT a quick-quote form — the source app is a `.th-cta-text-block` panel
  (no home-quote widget used). Authored as `hero with-cta` followed by a `cta-text` block in the same flush
  section; hero.js (variant-gated) moves that block's wrapper into the hero app.
- New block **cta-text** (template-slotted; one cell: h2, intro paragraph(s), bold link = primary button;
  closing section and hero-app panel; row layout + 53.75rem box from 1024 px).
- New variants (additive, scoped): `hero with-cta`, `product-table lead stacked` (helforsakring: head-owning
  tables nested in a full-width two-column column → one block per table, 46.25rem centred, gap 1.875/2.5rem),
  `columns with-icon` (head icon paragraph above the h2, source .th-block__icon). Encoder now also emits a lead
  product table's own CTA anchor as its CTA row. Villa image cards use the existing detected image layout
  (no class needed); barn cta-image right = picture cell last. Archetype encode output unchanged (verified).
- davids-model D1 on cta-text (single-cell prose block) is a deliberate bespoke component (source module).
- Gate (preview origin): hem 1440 0.26 % / 360 0.48 %, helforsakring 1.05 % / 0.13 %, barn 0.08 % / 0.31 %,
  all Δh 0 PASS (1 fix round: columns head icon). Villa FAILS vs live: with consent accepted the live page
  runs an Adobe Target experiment (`section.security-benefits`, "Din trygghet i fem punkter") replacing the
  captured quick-facts + rating cards → 1440 12.29 % Δh -362 / 360 20.98 % Δh -255, MISSING heading 1.
  Against the capture-time crawl shot (control, `--blocked villaforsakring`, asymmetric) 1440 is 4.56 %
  Δh 47. Content stays verbatim to the capture; needs a decision (gate without consent / variable region).

## archetype-static — `/skadeanmalan` (2026-11-04)
- Encoder: the shared `stardust/rollout/encoders/program-encode.mjs`, input = the gated prototype. Additive:
  a `.th-content-block` body `ol`/`ul` → `teaser content with-list`; a cta-image whose srcset's smallest
  rendition (focal crop) is in the media map → `cta-image small-crop` (that crop authored first).
  Media map `stardust/rollout/encoders/media-map-skadeanmalan.json`, images under DA `media/skadeanmalan/`
  (hero 480 + 1536, card images 1536, cta-image 750 crop + 1536).
- Sections (decode tier): hero (template-slotted, flush), breadcrumbs (list, flush+stripe), teaser (large CTA,
  `small`), teaser content with-list (`small`), faq (reconstructive, `small`), cards small (icon cards), cards
  (image cards), cta-image small-crop (`wide`). No new blocks.
- New variants: **teaser with-list** (with `content`: an ol/ul in the cell goes after the introduction as a
  direct child of the block, numbered with the source's brand-coloured `n.` counter), **cta-image small-crop**
  (picture cell = 2 pictures: first shown < 1024 px, last >= 1024 px). Both additive: no existing page carries
  either class, teaser.js/cta-image.js behaviour for other content unchanged → no re-gate of siblings needed.
- units.json: `skadeanmalan-faq` / `skadeanmalan-cards` build selectors switched to the EDS names.
- Gate (preview origin): 1440 0.33 % Δh 0, 360 0.27 % Δh 0, units off 0, PASS (one fix round: the 360
  cta-image used a center-cropped 1536 instead of the source's 750 focal crop, 3.65 % → 0.27 %).

## cluster-program — villaforsakring capture-state override (2026-11-04)
- After consent, the live origin runs an Adobe Target experiment on /forsakringar/hemforsakring/villaforsakring:
  `section.security-benefits` ("Din trygghet i fem punkter") replaces the captured quick-facts/rating section.
  Without consent the page matches the capture. Replica keeps the captured control content verbatim.
- Gate rows keep the measured numbers: 1440 4.56 % Δh 47 vs the capture-time origin (crawl-fullpage, asymmetric),
  360 20.98 % Δh -255 vs the live experiment; content MISSING 1 = the experiment's h2. Recorded as
  `overrides.json` verdict `capture-state` + `presence.json` variable region in `gates/all-1440|360/`.
- Owner note: if the experiment's variant is to become the page, it is a content change for the authors, not a replica delta.

## cluster-listing — listing siblings (2026-11-04)
- Pages: /forsakringar/fordon, /djurforsakring (published). Encoder: shared `program-encode.mjs`, input = the
  sibling renders `stardust/.work/migrate-listing/<slug>.html` (no scratch link pass needed: localHref already
  keeps in-scope paths root-relative). Media maps `stardust/rollout/encoders/media-map-<slug>.json`, images under
  DA `media/<slug>/` (hero = source 480 focal crop + 1536 render; FirstVet cta-image 1536x650 + 750x650 crop).
- Additive encoder change: a cta-image picture without srcset → `cta-image small-crop` when the media map
  carries `<stem>_750` (archetype encode output verified unchanged).
- Sections: fordon = hero + `/widgets/quick-quote/vehicle-quote` (flush), breadcrumbs, cards (11 icon cards);
  djur = hero, campaign-banner with modal row (heading inside the dialog), breadcrumbs, quick-facts, cards
  (dog2/cat2/paw), columns with-icon, cta-image small-crop (`wide`). No new blocks, variants or icons (all
  `:th-*:` icons already in icons/ + styles.css); no shared block change.
- block-roundtrip `--ew` vs the migrated tree (fordon with the hero app subtree emptied): 0 structural.
- Gate (preview origin): fordon 1440 0.32 % Δh 0 / 360 0.25 % Δh 0; djur 1440 5.78 % Δh 28 / 360 0.54 % Δh 0;
  all PASS, no fix round. Djur 1440 residual: the quick-facts intro ends in `&nbsp;` which the DA → preview
  pipeline trims (plain.html), so "jämföras." fits line 2 instead of wrapping to line 3 (-28 px, all below shift).

## gate-all — roster published-origin gate on aem.live (2026-11-04)
- `gate-all.mjs --skip-existing --eds-host https://main--64009de2--aemcoder.aem.live` (derived state
  `stardust/.work/gate-all/gate-state.json`): 1440 and 360 each 9 PASS + villaforsakring capture-state override → 10 delivered.
- Trap: `stardust/current/measure/<slug>-units.json` is not width-keyed — a 360 origin cache failed forsakringar-person at
  1440 (units off 43). Clear the caches before each width's run.

## Redirects (D-site, 2026-11-04)
- No redirect rows: all 10 delivered paths equal their source paths (extensionless, no sanitised segments), and the
  source root serves a page (200), delivered as the root `index` document. No spec knowledge of legacy redirects in
  scope; no `/redirects.json` sheet published (an empty sheet would carry nothing).
