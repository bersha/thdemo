# Martech hand-off

Everything below is scaffolded **off**. To ship it, set `enabled: true` on `consent.cmp` and on each route in `stardust/martech-contract.json`, then re-run `deploy/scripts/martech-scaffold.mjs` and `dynamics/scripts/dynamics-check.mjs` to confirm the enabled tags load. Enabled tags load on `www.trygghansa.se` only; preview with `?martech=on` (add `&consent=accept` to grant every category).

## Consent

- **CMP:** OneTrust · `data-domain-script` = `c91270b2-f5b9-4772-9722-8f6fd78cf5d8`
- **Model `per-tag`:** the source loads the tag manager ungated and gates each tag inside it by consent group. Keep it: leave every route `category` null.
- **Google Consent Mode:** consent-mode calls in `tags/www.googletagmanager.com-gtm-GTM-TDH7D6.js`. Check it with the owner before gating a route on a category.
- **Categories** (default rule set): `C0001` Absolut nödvändiga cookies (always active) · `C0003` Funktionella cookies (inactive) · `C0002` Prestanda-cookies (inactive) · `C0005` Sociala medier-cookies (inactive) · `C0004` Riktade cookies (inactive)

## Routes

| id | vendor | src | CMP groups listing its host | enabled |
|---|---|---|---|---|
| adobe-launch | Adobe Launch | `https://assets.adobedtm.com/8bd8ff966c09/b72845161ef0/launch-3cee49d7db63.min.js` | C0004 | false |
| google-tag-manager | Google Tag Manager | `https://www.googletagmanager.com/gtm.js?id=GTM-TDH7D6` | — | false |
| tealium | Tealium | `https://tags.tiqcdn.com/utag/tryg/trygghansa-se-web/prod/utag.js` | — | false |

Also seen, not routed (loaded by the tag manager or inline on the source — confirm each still fires): analytics: session replay · feedback: survey / VoC badge.

## Rewrite before go-live

These read the old URLs or DOM and will not match the migrated pages:
- rule `RL33920be890474830a8b61501dc1de6e7` Core - data-personalization clicked link (CDP) — selectors `a`
- rule `RL3856d5b4f0774d7cbd742d19912f8f93` Core - data-personalization Enters Viewport (CDP) — selectors `[data-personalization]`
- rule `RLb87365354b2442f99b176fad0e91408b` Core - Focus on th-pregnancy-phone — selectors `#th-pregnancy-phone`
- rule `RLd74a2764354e4ad5a708a19a4af1abd1` Core - data-personalization clicked (CDP) — selectors `[data-personalization]`
- rule `RLd8c2d37b5d7443aa9884a885771a94f3` Core - Focus on th-pregnancy-email — selectors `#th-pregnancy-email`

## Data layer

The source pages expose `adobeDataLayer`, `dataLayer`, `utag_data`; keep the same global names.
Adobe Launch rules fire on data-layer pushes; the migrated pages must push the same events: `logToAdobe` (2) · `civilSubscribed` (2) · `civilCalculated` (1) · `paChild-Quote` (1) · `paChild-HealthDeclarationSummary` (1) · `editBankDetails` (1) · `changedhealthDeclarationQuestionsInteracted` (1) · `careCLSummary` (1) · `paChild-Payment` (1) · `vehicleRecalculated` (1) · `paChild-HealthDeclaration1` (1) · `AutogiroCancelConfirmation` (1) · `paChild-HealthDeclaration3` (1) · `autogiroAbortModal` (1) · `changedChildAge` (1) · `careCLRecalculated` (1) · `prodView` (1) · `pdfAccordion` (1) · `pageload` (1) · `paCalculated` (1) · `petCustomerValidated` (1) · `signingModal` (1) · `AutogiroConfirmation` (1) · `vehicleCalculated` (1) · `paRecalculated` (1) · `bankSelected` (1) · `paCheckout` (1) · `paChild-HealthDeclaration2` (1) · `civilRecalculated` (1) · `petProductValidated` (1) · `civilCustomerAndPropertyValidated` (1) · `petRecalculated` (1) · `petSubscribed` (1) · `CallBookingForm` (1) · `changedPrice` (1) · `error` (1) · `smallBusinessSubscribed` (1) · `addonModalPopup` (1) · `elementInteraction` (1) · `paChild-Confirmation` (1) · `errorAndValidation` (1) · `postPartumCare` (1) · `accordion` (1) · `vehicleSubscribed` (1) · `cancelInsuranceConfirmation` (1) · `smallBusinesRealculated` (1) · `petCalculated` (1) · `smallBusinessCalculated` (1) · `paSubscribed` (1) · `careCLCalculated` (1) · `counter` (1) · `careCLSubscribed` (1) · `trackQqFocus` (1).
Data elements read these data-layer paths: `adobeDataLayer.page.request`.
Rules in Google Tag Manager, Tealium were not parsed. Read each library listed in `martech/tags.json` and record its rules and data elements in the contract's `tagNotes`, keyed by tag manager, each citing where it was read (`from`); until then their triggers and events come from the tagging plan.
Ask the owner for the tagging plan (solution design reference): each event, its payload and the interaction that pushes it. With it, add each push in the block that owns the interaction.

- rule `RL02ad8e4f528f465e96af91382e351d03` ACDL | Clear and Set Variables | civilCalculated — listens for `civilCalculated`
- rule `RL0427d2ab462a4b879938451467d7c62c` ACDL | Clear and Set Variables | PAChild Step 1 Age not chosen yet — listens for `paChild-Quote`
- rule `RL0903edb4dbc046f7839628373b87fd18` ACDL | Clear and Set Variables | PAChild HD summary — listens for `paChild-HealthDeclarationSummary`
- rule `RL0ab030e3d8f6416d95379c7548b2899f` ACDL | Clear and Set Variables | petsubscribedAutogiro2 — listens for `editBankDetails`
- rule `RL0eb799f114f8457980121796b52d44f7` ACDL | Clear and Set Variables | PAChild  HD steps Fields — listens for `changedhealthDeclarationQuestionsInteracted`
- rule `RL15aa4a5751f444bab22266a836526c99` ACDL | Clear and Set Variables | careCLSummary — listens for `careCLSummary`
- rule `RL19ac1fd775674487b87f87872f151922` ACDL | Clear and Set Variables | PAChild Payment LSBS — listens for `paChild-Payment`
- rule `RL1b93377ab452432a9fe05147cbe8d956` ACDL | Clear and Set Variables | vehicleRecalculated — listens for `vehicleRecalculated`
- rule `RL209afab72c0e419589ab5a06e4c11d42` ACDL | Clear and Set Variables | PAChild Health Step 1 — listens for `paChild-HealthDeclaration1`
- rule `RL214c3821db294b3d8ec9aa5f4f7b449c` ACDL | Clear and Set Variables | vehicleSubscribed Cancel Confirmation — listens for `AutogiroCancelConfirmation`
- rule `RL23353bbb99054850ba21c2f43dc72b35` ACDL | Clear and Set Variables | PAChild Health Step 3 — listens for `paChild-HealthDeclaration3`
- rule `RL2b310778ee8c4da9869103dbdaf5650f` ACDL | Clear and Set Variables | petSubscribedAutogiroAbortModal — listens for `autogiroAbortModal`
- rule `RL34dd55f9b2e44832b41b37563b9a2e35` ACDL | Clear and Set Variables | PAChild Quote Changed Child age on step 1 — listens for `changedChildAge`
- rule `RL382649643c434f2db780ccbba97317c4` ACDL | Clear and Set Variables | careCLReCalculated — listens for `careCLRecalculated`
- rule `RL43c9da48f7194384934b700809d2b3ae` ACDL | Clear and Set Variables | prodView — listens for `prodView`
- rule `RL47b5911bc9464f17b0689ff22132233d` ACDL | Clear and Set Variables | vehicleRecalculated accordion — listens for `pdfAccordion`
- rule `RL4cf0c345c27549538ce2287f3dac34f2` ACDL | Clear and Set Variables | vehicleSubscribed pageload — listens for `pageload`
- rule `RL52a8cd53ae884b2fb39d03a11626fde8` ACDL | Clear and Set Variables | paCalculated — listens for `paCalculated`
- rule `RL544d4484c6094994bbf6ac7fc019758f` Core - data-personalization exists (CDP) — listens for `logToAdobe`
- rule `RL58cc02f415d546dc8b650c4a3e546865` ACDL | Clear and Set Variables | petCustomerValidated — listens for `petCustomerValidated`
- rule `RL59031752876e486bacea7bacd5d10d15` ACDL | Clear and Set Variables | petSubscribedSigningModalClicked — listens for `signingModal`
- rule `RL5e2763365ac04a8e814072362a7ad770` ACDL | Clear and Set Variables | vehicleSubscribed AutogiroConfirmation — listens for `AutogiroConfirmation`
- rule `RL68d1af456dc04f2a910664c8bec05bcf` ACDL | Clear and Set Variables | vehicleCalculated — listens for `vehicleCalculated`
- rule `RL78e45a8927c848a4a212cf39241b88d9` ACDL | Clear and Set Variables | paRecalculated — listens for `paRecalculated`
- rule `RL85a6c46e4b554047963331cff2ebf586` ACDL | Clear and Set Variables | petSubscribedBankSelected — listens for `bankSelected`
- rule `RL872b5c53ac2049a8a2a2bd143e7de752` ACDL | Clear and Set Variables | paCheckout — listens for `paCheckout`
- rule `RL888097571d724e28b104258d564b5176` ACDL | Clear and Set Variables | PAChild HD step 2 — listens for `paChild-HealthDeclaration2`
- rule `RL8f14f2c605884edcbfe3ec11a25b9f63` ACDL | Clear and Set Variables | civilRecalculated — listens for `civilRecalculated`
- rule `RL8f603be1e2034dc8b27463a2316dfd1d` ACDL | Clear and Set Variables | petProductValidated — listens for `petProductValidated`
- rule `RL8f8a214f099c49f797cc45b39024102f` ACDL | Clear and Set Variables | civilCustomerAndPropertyValidated — listens for `civilCustomerAndPropertyValidated`
- rule `RL8fbb3b23bd8c4066b39751512178714b` ACDL | Clear and Set Variables | petRecalculated — listens for `petRecalculated`
- rule `RL936490bd6bbe4d67aa456670c49f459c` ACDL | Clear and Set Variables | petSubscribed — listens for `petSubscribed`
- rule `RL9eb48ddf8a53472b9bc7b3a46a41e8f9` ACDL | Clear and Set Variables | CallBookingForm — listens for `CallBookingForm`
- rule `RLa3e8cf71d5844e26ac5aa9a4c6590b4b` ACDL | Clear and Set Variables | PAChild Quote Changed Child age on step 1 Price track — listens for `changedPrice`
- rule `RLa5dc2d14e6da41f09426587705a1c3bf` ACDL | Clear and Set Variables | error — listens for `error`
- rule `RLab611045b2354c32a4125b07ccb9a625` ACDL | Clear and Set Variables | logToAdobe — listens for `logToAdobe`
- rule `RLb4526485e5ae4b82b7d0e4339a210220` ACDL | Clear and Set Variables | smallBusinessSubscribed — listens for `smallBusinessSubscribed`
- rule `RLb4ccbee00f7d471aaab6b7ba26115329` ACDL | Clear and Set Variables | civilSubscribed — listens for `civilSubscribed`
- rule `RLc5b48be15cad4e489b02a339f12e18e2` ACDL | Clear and Set Variables | vehicleRecalculated addonstuff — listens for `addonModalPopup`
- rule `RLc64b05c6678a4aab9cb47b53444ebb2c` ACDL | Clear and Set Variables | elementInteraction — listens for `elementInteraction`
- rule `RLd0e606a04123483f9de4eec7fcce9b10` ACDL | Clear and Set Variables | PAChild Confirmation page — listens for `paChild-Confirmation`
- rule `RLda27147bb0874372b157ad0fe686241b` ACDL | Clear and Set Variables | PAChild Errors — listens for `errorAndValidation`
- rule `RLdd2d8d0051e84942ab7133c66564b4c7` ACDL | Clear and Set Variables | PAChild BB utskrivet question — listens for `postPartumCare`
- rule `RLe15a337d97a141d8b1c2a70eb35254aa` ACDL | Clear and Set Variables | accordion — listens for `accordion`
- rule `RLe4e95445b1a64337a366bdddd1f63267` ACDL | Clear and Set Variables | vehicleSubscribed — listens for `vehicleSubscribed`
- rule `RLe6e35356a73549fda74368419606f274` ACDL | Clear and Set Variables | cancelInsuranceConfirmation — listens for `cancelInsuranceConfirmation`
- rule `RLe8a8bbb8c75c4944a4e309bb14fca82a` ACDL | Clear and Set Variables | civilSubscribed Testing — listens for `civilSubscribed`
- rule `RLe903378992334012858c642cfb280c9c` ACDL | Clear and Set Variables | smallBusinessReCalculated — listens for `smallBusinesRealculated`
- rule `RLebb24d6da3954113aec495ebd6027fb1` ACDL | Clear and Set Variables | petCalculated — listens for `petCalculated`
- rule `RLecc41ea66ba24a43bacca5494b1efb96` ACDL | Clear and Set Variables | smallBusinessCalculated — listens for `smallBusinessCalculated`
- rule `RLf06f8eff5b17482bb851bcd73a41d3af` ACDL | Clear and Set Variables | paSubscribed — listens for `paSubscribed`
- rule `RLf7a16c3f6365405eb8da7579084c1455` ACDL | Clear and Set Variables | careCLCalculated — listens for `careCLCalculated`
- rule `RLf7d43597b3034f928564f051e4caaf36` ACDL | Clear and Set Variables | Samlingsrabatt counter — listens for `counter`
- rule `RLf7ffbe1f0e4f4cfcaa87de68ca84bcc0` ACDL | Clear and Set Variables | careCLSubscribed — listens for `careCLSubscribed`
- rule `RLf86d91ce904d497db3b2307d06200441` ACDL | Clear and Set Variables | qqOnFocus — listens for `trackQqFocus`

## Personalization (Target)

Target runs on at.js (Launch extension `adobe-target-v2`). Launch loads late on the migrated site, so above-the-fold activities apply late or flicker. `aem-martech` renders Target only through the Web SDK: moving the activities to the Web SDK is an owner project.
`target` stays off until then.
