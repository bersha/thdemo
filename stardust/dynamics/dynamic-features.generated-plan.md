<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-04T11:35:50.888Z · input stardust/current/_dynamics.json (4 pages, 29 findings) · target probe https://main--64009de2--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-swedencentral-0-in-applicationins | A | unknown third-party host swedencentral-0.in.applicationinsights.azure.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 4/4 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | a-cms-app-settings-object-adobedatalayer | A | CMS / app settings object adobeDataLayer | 4/4 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 4 | a-cms-app-settings-object-utag-data | A | CMS / app settings object utag_data | 4/4 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 5 | cr-client-framework-vue | CR | client framework vue | 2/4 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 6 | f-form-qq-pregnant-form-wrapper-no-action-js-wired-1-fields | F | form "qq-pregnant__form-wrapper" → no action (JS-wired) (1 fields) | 1/4 | rebuild-native | block | needs-business-decision | pending | forms | production endpoint; interim capture ships now | regulated-pii: never auto-wire; submission blocked until a human configures the secured endpoint |
| 7 | f-form-less-control-group-in-div-th-v-form-field-container-1 | F | form-less control group in div._th-v-form-field__container_1q95p_1 (2 controls) | 1/4 | rebuild-native | widget | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 8 | f-form-less-control-group-in-div-th-v-form-field-container-1 | F | form-less control group in div._th-v-form-field__container_1q95p_1 (3 controls) | 1/4 | rebuild-native | widget | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 9 | l-listing-candidate-th-content-area-8-cards | L | listing candidate th-content-area (8 cards) | 1/4 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 10 | l-listing-candidate-th-cards-th-cards-with-icon-9-cards | L | listing candidate th-cards th-cards--with-icon (9 cards) | 1/4 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 11 | l-listing-candidate-th-content-area-10-cards | L | listing candidate th-content-area (10 cards) | 1/4 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 12 | l-listing-candidate-th-cards-th-cards-with-image-6-cards | L | listing candidate th-cards th-cards--with-image (6 cards) | 1/4 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 13 | l-listing-candidate-th-cards-th-cards-with-icon-10-cards | L | listing candidate th-cards th-cards--with-icon (10 cards) | 1/4 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 14 | m-modal-trigger-aria-haspopup-chrome-only-button-content | M | modal trigger aria-haspopup (chrome only) → button:content | 3/4 | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 15 | m-modal-trigger-aria-controls-dialog-dialog-content | M | modal trigger aria-controls→dialog → dialog:content | 1/4 | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 16 | m-modal-trigger-data-modal-trigger-target-outside-dom-at-cap | M | modal trigger data-modal-trigger → target outside DOM at capture | 1/4 (reach 58/10) | rebuild-native | runtime | self | delivered-by-capture | modal-loader | none | output already carries "tecknar bilförsäkring online!" |
| 17 | m-modal-trigger-th-modal-button-top-chrome-only-target-outsi | M | modal trigger th-modal__button-top (chrome only) → target outside DOM at capture | 1/4 (reach 54/10) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 18 | m-modal-trigger-data-modal-button-close-chrome-only-target-o | M | modal trigger data-modal-button-close (chrome only) → target outside DOM at capture | 1/4 (reach 54/10) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 19 | t-tag-manager-tealium | T | tag manager: Tealium | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 20 | t-consent-onetrust | T | consent: OneTrust | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 21 | t-tag-manager-adobe-launch | T | tag manager: Adobe Launch | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | t-unknown-third-party-host-js-monitor-azure-com | T | unknown third-party host js.monitor.azure.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 23 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 24 | t-analytics-session-replay | T | analytics: session replay | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-unknown-third-party-host-c-amazon-adsystem-com | T | unknown third-party host c.amazon-adsystem.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 26 | t-feedback-survey-voc-badge | T | feedback: survey / VoC badge | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 4/4 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 28 | x-commerce-signals-cart-true-prices-0 | X | commerce signals (cart: true, prices: 0) | 2/4 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 29 | chrome-menu | M | header menu: Försäkringar (chrome only) | 1/1 | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 9 row(s) — read-settings, settled-dom-snapshot, chrome-interaction, modal-loader.
- **One owner decision batch:** 18 row(s) — inspect the XHR, add a vendor row · production endpoint; interim capture ships now · index-driven or editorially curated? · which tags run on the new host; property ids · CMP domain script reuse on the new host · resolve the runtime src from a rendered capture.
- **Already delivered by the capture pipeline:** 1 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.
- **Martech:** OneTrust · 0/3 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 8
- **interactive** — 6
- **listings** — 5
- **detect** — 4
- **forms** — 3
- **capture** — 1
- **embeds** — 1
- **register** — 1
