# Migrate plan — trygghansa.se replica (2026-11-04)

In scope: 10 pages (site-plan fixed).
- Path A (archetype, approved + gated): index (landing), forsakringar-bilforsakring (program),
  forsakringar-person (listing), skadeanmalan (static).
- Path A' (sibling, rendered only after the template's archetype is live + gated on the preview origin):
  - program → forsakringar-hemforsakring, forsakringar-bilforsakring-helforsakring,
    forsakringar-hemforsakring-villaforsakring, forsakringar-person-barnforsakring
  - listing → forsakringar-fordon, djurforsakring
- Path B: none.

Variance probes (`variance-program.json`, `variance-listing.json`, 1440):
- program: hemforsakring / villaforsakring / barnforsakring carry the generic quick-quote app (h2 26/34, 122 px) instead of
  the vehicle quick-quote → variant `quick-quote (home)`; card/table/faq differences are content counts (same families),
  villaforsakring cards carry images → `cards (images)` variant (already in the archetype's card-list families).
- listing: fordon has no campaign banner and no two-column block (content absence, not a variant); djurforsakring's
  banner carries a heading.
