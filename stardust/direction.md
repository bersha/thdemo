---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-04T10:13:27Z
  againstInput: https://www.trygghansa.se/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.trygghansa.se/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-04T10:13:27Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(1 entry — R-01, licensed display-face substitution forced by the font licence; otherwise a pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Link targets outside the delivered set (E2 link audit, 2026-11-04)
- Decision: **scope extension → repoint to the source site.** The run's page scope is fixed at the 10 planned pages
  (stardust/.labs/site-plan.json); every internal target outside it is a scope extension, not a capture gap, and stays an
  absolute link to https://www.trygghansa.se/… (155 distinct source-site targets, all answering < 400 on 2026-11-04;
  list: stardust/rollout/link-audit.json). No locale roots exist; `site.captureGaps` empty.
- In-scope targets are root-relative and extensionless (localize-links --check: 0 localizable); 16 internal targets all 200 on aem.live.
