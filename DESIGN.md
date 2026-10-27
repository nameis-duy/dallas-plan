---
name: Dallas
description: A cinematic Vietnamese editorial travel journal with practical trip tools.
colors:
  paper: "#faf9f5"
  ink: "#243b32"
  green: "#294d3f"
  sage: "#eaf0e4"
  muted: "#626b62"
  ochre: "#b67632"
  line: "#dcded5"
  white: "white"
  selected: "#edf0e7"
  light-hover: "#e8eddf"
  tool-hover: "#e8edde"
  focus: "#bb873e"
typography:
  display:
    fontFamily: '"Noto Serif Display", Georgia, serif'
    fontSize: "88px"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "0em"
  headline:
    fontFamily: '"Noto Serif Display", Georgia, serif'
    fontSize: "52px"
    fontWeight: 500
    lineHeight: 1.16
    letterSpacing: "0em"
  body:
    fontFamily: '"Be Vietnam Pro", sans-serif'
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.9
    letterSpacing: "0em"
  label:
    fontFamily: '"Be Vietnam Pro", sans-serif'
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "0em"
  practical:
    fontFamily: '"Be Vietnam Pro", sans-serif'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  map-title:
    fontFamily: '"Be Vietnam Pro", sans-serif'
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "0em"
  supporting:
    fontFamily: '"Be Vietnam Pro", sans-serif'
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
rounded:
  control: "2px"
  map-fit: "3px"
  circle: "50%"
spacing:
  section-block: "96px"
  section-inline: "64px"
  compact-inline: "40px"
  mobile-inline: "25px"
  small-inline: "20px"
  heading-gap: "48px"
  grid-gap: "24px"
components:
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "15px 23px"
  button-light-hover:
    backgroundColor: "{colors.light-hover}"
  button-green:
    backgroundColor: "{colors.green}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "15px 23px"
  text-link:
    backgroundColor: "transparent"
    typography: "{typography.label}"
    padding: "0"
  tool-button:
    backgroundColor: "transparent"
    rounded: "{rounded.circle}"
    width: "42px"
    height: "42px"
  packing-input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.practical}"
    padding: "10px 0"
  day-selection:
    backgroundColor: "{colors.selected}"
    textColor: "{colors.green}"
    padding: "18px 24px"
  packing-check:
    backgroundColor: "{colors.green}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    width: "15px"
    height: "15px"
---

# Design System: Dallas

## Overview

**Creative North Star: "Editorial travel journal"**

A cinematic Vietnamese travel magazine: real destination photography, warm paper, forest ink, muted landscape accents, and a roman/italic serif voice. Content-led, unframed bands balance an expressive photographic opening with quiet, practical travel tools.

Photography is illustrative destination imagery, not evidence of personal trip memories. Preserve its labeling and credits. Visual storytelling must not delay access to source-faithful travel information.

**Key Characteristics:**

- Real illustrative photography with visible provenance.
- Vietnamese-capable editorial serif and practical sans-serif.
- Unframed bands, quiet dividers, compact functional controls.
- Restrained motion with a complete reduced-motion path.

Evidence: [stylesheet](src/index.css), [font loading](src/main.jsx), [application](src/App.jsx), [itinerary](src/components/Itinerary.jsx), [map](src/components/TripMap.jsx), [gallery](src/components/Gallery.jsx), [packing](src/components/PackingChecklist.jsx), [product](PRODUCT.md), and [approved direction](.impeccable/surface-journal.md). Frontmatter owns primitive values; the sidecar owns extensions and standalone specimens. Source CSS wins if implementation changes.

## Colors

Warm neutrals carry the page; landscape accents organize actions and state without overwhelming the photographs.

### Primary

- **Forest green** (`green`): filled practical actions, selected controls, progress, and checked items.
- **Forest ink** (`ink`): reading text and light-button labels.

### Secondary

- **Sage** (`sage`): the full-width packing band, not a generic card background.
- **Ochre** (`ochre`): the brand dot, accommodation legend, and checkbox focus. General keyboard focus uses the distinct `focus` token.

### Neutral

- **Paper** (`paper`): page and light-action surface; **white** (`white`): text over filled actions and photography.
- **Muted** (`muted`): supporting text; **line** (`line`): quiet dividers and tool outlines.
- **Selected wash** (`selected`): day and place selection. Light-action and circular-tool hover washes are distinct source colors; do not merge them.

**The Source Palette Rule.** Use observed roles; generated sidecar tonal ramps are preview aids, not additional UI colors.

## Typography

Noto Serif Display (Georgia fallback) is self-hosted at weight 500 in roman and italic. Be Vietnam Pro (sans-serif fallback) is self-hosted at weights 400, 500, and 600. Both load Vietnamese and Latin subsets. The normal utility hierarchy uses 400/500; loading 600 does not establish a new bold role. Letter spacing stays zero.

Frontmatter defines desktop display, section headline, overview body, action label, practical text, map title, and supporting roles. Serif italics emphasize phrases rather than entire utility surfaces. Overview prose is constrained to about 45ch; heading-side copy to 32ch, expanding to 45ch on mobile.

Responsive display sizes follow source media queries: 96px at wide desktop, 78px at compact desktop, 64px on mobile, and 55px on small mobile. Mobile section headings use 39px/1.18. Other serif roles include day dates (28px; mobile 22px), day titles (29px; mobile 27px), and place-panel titles (22px; compact/mobile 20px).

**The Practical Text Rule.** Preserve the repaired map name/support/detail hierarchy (14px/11px/12px), packing labels (12px), and persistence/reset row (11px). Smaller existing folios, credits, and day metadata are local exceptions, not a recommended scale for new actionable or essential information.

## Layout

Content uses a centered wrapper (max-width 1280px, border-box) with desktop section rhythm from the spacing tokens. Sections are unframed bands, not floating cards. Section-specific spacing overrides are deliberate: overview 76px/74px, itinerary and gallery top 80px. The packing tint extends across the page, with constrained inner content.

At max-width 1100px, sections become 72px by the compact-inline token; at 760px, 58px by mobile-inline; at 370px, retain mobile vertical rhythm and use small-inline. These are inclusive max-width queries. A separate min-width 1600px query adjusts the hero, not the general content grid. Minimum supported body width is 320px.

Desktop: overview uses two columns; itinerary uses a 260px introduction and flexible timeline with a 72px gap (210px/30px compact); map is a framed tool split 1.25:1 at 510px high; gallery uses 1.15:1:1 tracks and staggered image positions; packing uses 0.85:1.2 tracks. At mobile, introductions stack, map becomes a 330px canvas above a 360px list, gallery becomes two columns with the first photo spanning both, and packing retains two checklist columns. Day selection scrolls horizontally in five minimum-82px tracks without scrolling the whole page.

The sticky masthead changes from 80px to 66px; anchor clearance changes from 95px to 76px. Desktop navigation yields to a compact menu. The photographic cover uses bounded viewport height, not a decorative card; its desktop/mobile positioning and scrims preserve readable overlay text. Gallery aspect ratios reserve image space; the lightbox uses contain rather than cropping.

## Elevation & Depth

The page is predominantly flat: rules, sage wash, selection wash, and photographic scrims provide hierarchy. Shadows are local exceptions for map overlays and the mobile menu, not a card-elevation scale. Exact map-fit, map-status, and mobile-navigation shadows live in the sidecar. The gallery viewer uses a near-opaque dark backdrop; this is a modal state, not a second page theme.

## Shapes

Photography and content bands are square-edged. Filled actions and checkbox marks use the control radius; circular outline tools use the circle radius. Map fit is a small-radius exception. Fine one-pixel borders separate rows, tabs, tools, and the map tool frame. Do not spread the map frame into nested card layouts.

## Components

- **Filled actions:** paper/ink on photography, green/white for practical confirmation. Base minimum height is 48px; hover lifts 2px over 0.2s. Mobile padding becomes 14px 19px with 11px labels. Reset confirmation locally uses 10px 16px, minimum 38px, and 10px labels; this is not the general button default.
- **Text actions:** transparent, icon plus text, minimum 36px, hover underline. Source context controls color and label size; persistence/reset remains at its repaired size.
- **Circular tools:** outlined, centered icons; hover wash and disabled opacity 0.38. Base tools are 42px square; mobile menu/lightbox tools are 36px, custom-item delete tools 32px. Name icon-only tools accessibly and retain source tooltips where supplied.
- **Packing field and check:** transparent underline field with an adjacent add tool; no boxed field shell. Native checkbox overlays the label; a small visible mark shows green fill and a check when selected, while the label strikes through. Mobile checklist labels have minimum 44px height. Persistence failure is explicit; reset requires inline confirmation and restores focus.
- **Day navigation and timeline:** selected day uses a wash and bottom rule, not a pill. Preserve tab semantics, roving focus, arrow/Home/End navigation, and associated panels. Activity rows disclose details with a rotating chevron and an expanded state; preserve original line breaks in practical details.
- **Map list:** names, supporting text, and details use the repaired hierarchy. Selection wash links list and map; filters use pressed state. Link-only places remain available without invented markers, and the fallback preserves navigation and itinerary actions.
- **Gallery and navigation:** image hover zoom is restrained; expand tools are visible on mobile and keyboard focus. The dialog supports keyboard, touch, Escape/backdrop dismissal, focus containment, and focus restoration. Main navigation marks the visible section with an underline; mobile menu exposes expanded state and Escape focus return.

General focus is a two-pixel outline with five-pixel offset; the checkbox has a local ochre outline with three-pixel offset. CSS state transitions, hero/reveal motion, day/detail transitions, map travel, and reduced-motion behavior are catalogued in the sidecar. Snippets are static visual specimens; application behavior remains owned by the source components.

## Do's and Don'ts

### Do:

- Do use real destination photography with illustrative labels and credits.
- Do preserve Vietnamese glyph coverage and the roman/italic serif pairing.
- Do keep practical information readable, keyboard reachable, and available without motion or a working map.
- Do use unframed content bands and reserve framing for the actual map tool and modal viewer.

### Don't:

- Don't imply illustrative photos are personal memories or invent trip facts and precise map locations.
- Don't turn incidental tiny captions into future practical-text defaults.
- Don't replace compact controls with decorative pills, nested cards, or a dashboard composition.
- Don't add invented palette roles, elevation levels, or motion that obstructs reading.
