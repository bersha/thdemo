---
name: Trygg-Hansa (current state)
colors:
  background: "#ffffff"
  surface: "#f9f9f9"
  surface-dark: "#333333"
  surface-darker: "#262626"
  text: "#191919"
  text-muted: "#4a4a4a"
  border: "#dedede"
  primary: "#e50000"
  primary-hover: "#db0000"
  accent: "#127994"
  accent-hover: "#11748e"
  accent-weak: "#ecf5f7"
  success: "#378132"
typography:
  display: { fontFamily: "ApexNew, Arial, Helvetica, sans-serif", fontSize: 66px, fontWeight: 700 }
  h2: { fontFamily: "ApexNew, Arial, Helvetica, sans-serif", fontSize: 32px, fontWeight: 700 }
  h3: { fontFamily: "ApexNew, Arial, Helvetica, sans-serif", fontSize: 20px, fontWeight: 700 }
  body: { fontFamily: "arial, sans-serif", fontSize: 16px, fontWeight: 400 }
rounded:
  card: 10px
  button: 5px
spacing:
  container: 66.5rem
  gutter: 1.25rem
  grid-gap: 20px
components:
  button-primary: { background: "#e50000", color: "#ffffff", minHeight: 3rem }
  button-large: { minHeight: 3.5rem }
  card: { background: "#ffffff", radius: 10px, shadow: "0 2px 4px rgba(0,0,0,.25)" }
---
<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-11-04T10:12:00Z sources=_computed-styles.json,css/trygghansa.css,css/main.7N15NBz7.css -->

# Design — Trygg-Hansa (descriptive current state)

## Overview
A clean white sales site with black type, a brand-red primary action colour and a teal accent for links and information bars. Full-bleed photographic heroes carry a large white display headline over a darkened image; below them the quote form card sits on the hero edge. Content is set in a centred 66.5rem container with 1.25rem gutters. Footer is dark charcoal (#333) with four link columns.

## Colors
Tokens from `css/trygghansa.css` (`--th-theme-*`) cross-checked against the census (`_computed-styles.json#aggregate.colors`): white #ffffff dominant, text #191919, muted #4a4a4a, borders #dedede, brand red #e50000 (fill-brand-strong), teal #127994 (fill-accent-strong, links and banners), footer #333333 / #262626.

## Typography
Headings: "ApexNew" (Hansa Apex New, licensed — Book 400, Medium 500, Bold 600 files). h1 66px/700 in heroes, h2 32px, h3 20px. Body and UI text: Arial 16px. Census sizes in use: 66, 34, 32, 28, 26, 22, 20, 18, 16, 14, 12px (ad-hoc scale).

## Elevation
Card shadow `0 2px 4px rgba(0,0,0,.25)` (120 uses), secondary `0 2px 6px rgba(0,0,0,.2)`; inset variant on inputs.

## Components
Header (black bar, Privat/Företag switch, Försäkringar mega-menu, Anmäl skada, Kundservice, Logga in, Sök); hero with quick-quote card; USP trio with red check icons; image/text split promos; icon card grids (10px radius, shadow); comparison tables with check marks; rating band (five stars); FAQ accordion; document links ("Allt om försäkringen"); article cards ("Relevant läsning"); dark footer with social icons.

## Do's and Don'ts
Do keep red for primary actions only, teal for links/info. Don't introduce gradients or rounded pills — radius is 10px cards, small radius buttons.
