---
version: alpha
name: Echevaria Dental — Clinic Management System
description: Chairside-first clinical tool for a dental clinic digitizing its paper workflow. Two asymmetric roles (full-access dentist, read-only staff), a PDA odontogram as the hero surface, and computed billing that must show its math.
colors:
  surface-bg: "#F8F7F5"
  surface-card: "#FFFFFF"
  surface-border: "#E2E8F0"
  text-primary: "#1F2933"
  text-muted: "#64748B"
  text-on-dark: "#FFFFFF"
  primary: "#0E7490"
  primary-tint: "#E0F2F7"
  danger: "#B91C1C"
  danger-tint: "#FEE2E2"
  warning: "#B45309"
  warning-tint: "#FEF3C7"
  success: "#15803D"
  success-tint: "#DCFCE7"
  condition-h-fill: "#DCFCE7"
  condition-h-letter: "#166534"
  condition-d-fill: "#FEE2E2"
  condition-d-letter: "#991B1B"
  condition-f-fill: "#DBEAFE"
  condition-f-letter: "#1E40AF"
  condition-x-fill: "#F1F5F9"
  condition-x-letter: "#475569"
  condition-x-border: "#94A3B8"
  condition-c-fill: "#F3E8FF"
  condition-c-letter: "#6B21A8"
  condition-i-fill: "#CCFBF1"
  condition-i-letter: "#115E59"
  condition-p-outline: "#B45309"
  condition-fdi: "#475569"
typography:
  display:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.29
  title:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-strong:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.43
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
  money:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
    fontFeature: "tnum"
  money-total:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
    fontFeature: "tnum"
  tooth-letter:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.09
  fdi:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    fontFeature: "tnum"
rounded:
  sm: 6px
  md: 10px
  sheet: 16px
  tooth: 8px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  "2xl": 32px
  "3xl": 48px
  touch-floor: 44px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-on-dark}"
    rounded: "{rounded.md}"
    height: 44px
    padding: 16px 12px
    typography: "{typography.label-md}"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.primary}"
    borderColor: "{colors.surface-border}"
    rounded: "{rounded.md}"
    height: 44px
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.text-on-dark}"
    rounded: "{rounded.md}"
    height: 44px
  input-field:
    backgroundColor: "{colors.surface-card}"
    borderColor: "{colors.surface-border}"
    rounded: "{rounded.md}"
    height: 44px
    typography: "{typography.body-md}"
  input-field-locked:
    borderColor: "transparent"
    typography: "{typography.body-md}"
  chip:
    rounded: "{rounded.sm}"
    height: 32px
    typography: "{typography.label-md}"
  chip-selected:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
  tooth-cell:
    rounded: "{rounded.tooth}"
    width: 48px
    height: 48px
  tooth-cell-planned-badge:
    backgroundColor: "{colors.condition-p-outline}"
    textColor: "{colors.text-on-dark}"
    rounded: 4px
    width: 16px
    height: 16px
  bottom-sheet:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.sheet}"
    padding: 24px
  allergy-banner:
    backgroundColor: "{colors.danger-tint}"
    textColor: "{colors.danger}"
    typography: "{typography.label-md}"
  state-badge-draft:
    backgroundColor: "{colors.warning-tint}"
    textColor: "{colors.warning}"
    rounded: "{rounded.sm}"
    height: 24px
  state-badge-finalized:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    height: 24px
  state-badge-paid:
    backgroundColor: "{colors.success-tint}"
    textColor: "{colors.success}"
    rounded: "{rounded.sm}"
    height: 24px
  state-badge-void:
    backgroundColor: "#F1F5F9"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.sm}"
    height: 24px
---

## Overview

Echevaria Dental digitizes a paper-run dental clinic — patient records, the PDA
dental chart, procedures, and billing — as a responsive web app used chairside
on a tablet and at the front desk on a desktop. The product is deliberately
**clinical, not consumer**: a tired dentist reads it all day, in gloves, one
patient after another, and it has to be faster than the paper folder it
replaces. The tone is calm, precise, and trustworthy — a professional medical
tool, not a hospital EMR and not a lifestyle app. Every visual decision serves
legibility under time pressure over decoration.

The product has exactly two roles, and the UI is honest about the asymmetry
between them. The **dentist** touches every screen: full read/write, chairside
and at the desk. **Staff** are front-desk only, strictly read-only, and see
just a patient's name, contact, and visit dates — never clinical or financial
data. This isn't the same screens with things grayed out; staff get a smaller,
distinct surface, and the visual language (the calm "not available for your
role" state, never styled as an error) has to make that boundary feel like a
designed boundary, not a bug.

The centerpiece is the **PDA dental chart**: an anatomical odontogram of up to
52 teeth where each tooth must show its current condition *and* any planned
treatment at once, fully legible in grayscale, on a tablet, with gloved
fingers. Every token in this file — especially the two-channel condition
color system — exists in service of that one screen.

## Colors

The palette is deliberately small: two neutrals, one primary, three semantic
status colors, and a dedicated six-color condition palette for the chart.
Color is always a **secondary, redundant cue** — every meaning in the product
also has a letter, label, badge, or border, because the chart must remain
fully readable with all color removed.

- **Primary (`#0E7490`):** A calm clinical teal-blue. Used exclusively for
  primary actions, active navigation, links, and focus rings — never for
  decoration, so it stays meaningful as "the thing to press."
- **Surface (`#F8F7F5` bg / `#FFFFFF` card):** A warm near-white background
  with pure-white cards and sheets, avoiding the sterile chill of a pure-white
  hospital UI.
- **Text (`#1F2933` primary / `#64748B` muted):** Near-black rather than true
  black for primary text; a cooler slate for secondary text, FDI numbers, and
  captions.
- **Danger (`#B91C1C`):** Allergy alerts and destructive actions only. Always
  paired with an icon and text label, never color alone.
- **Warning (`#B45309`):** Draft/unfinalized states — and, deliberately, the
  same amber family as the chart's "planned treatment" cue, so the whole app
  uses one consistent "this isn't done yet" color.
- **Success (`#15803D`):** Healthy, paid, confirmed states.

### Condition palette (the chart's core vocabulary)

Each tooth condition is a fill tint (the cell background) paired with a
darker letter color, pre-checked for AA contrast at the tooth-letter size.
**Planned treatment (`P`) intentionally has no fill token** — it lives on a
separate visual channel (outline + corner badge) so a tooth can show a fixed
condition and a planned procedure simultaneously without the two colors
fighting for the same space.

| Code | Meaning | Fill | Letter | Non-color cue |
|---|---|---|---|---|
| H | Healthy | `#DCFCE7` | `#166534` | letter H |
| D | Decay | `#FEE2E2` | `#991B1B` | letter D |
| F | Filled | `#DBEAFE` | `#1E40AF` | letter F |
| X | Missing | `#F1F5F9` | `#475569` | letter X + dashed border `#94A3B8` |
| C | Crown | `#F3E8FF` | `#6B21A8` | letter C |
| I | Implant | `#CCFBF1` | `#115E59` | letter I |
| P | Planned | *(outline only, no fill)* | `#B45309` | corner badge "P", 2px outline |

## Typography

One typeface throughout — **Inter** — chosen for its humanist clarity and
genuinely good tabular figures. There is no display font: this is a tool, not
a brochure, and a second typeface would only add noise to a screen that's
already carrying a lot of state.

- **Display / Title:** Screen titles, sheet headers, and the bill's grand
  total use Semibold Inter at 28px and 20px respectively — enough weight to
  anchor the page without shouting.
- **Body / Body Strong:** 16px Inter is the default reading size everywhere;
  Body Strong (Semibold) marks patient names and other content that needs to
  stand out from surrounding text without becoming a heading.
- **Label / Caption:** 14px Medium for buttons, form labels, and chips; 12px
  Regular for helper text and timestamps.
- **Money / Money Total:** Semibold and Bold respectively, **always set with
  tabular figures**, so line amounts and totals align in a column the way a
  ledger should.
- **Tooth Letter:** 22px Bold — the single loudest piece of text on the
  chart, because the condition letter is the primary read, not a label
  underneath the tooth.
- **FDI:** 12px Medium, tabular, muted — orientation information, not the
  focus of the cell.

## Layout

The product is designed **tablet-first for the dentist's chairside path**
(1194×834, iPad Pro 11" landscape) and desktop for billing review and the
staff front-desk flow (1440×900). Everything sits on an **8px spacing scale**
(4px only for micro-adjustments inside a component) so density stays
consistent between a dense chart and a spacious form.

Navigation is patient-centric, not record-centric: a **Visit** is never
browsed to directly, it's always entered through an open patient, and once a
patient is open, a **pinned context bar** (name + allergy chip + visit
selector) rides across the chart, procedures, and billing screens so the
dentist never loses track of *who* mid-visit. Chairside interaction favors
**bottom sheets over navigation** — the tooth editor, for example, opens over
the chart rather than replacing it, keeping context visible.

The **44px touch floor is non-negotiable** everywhere a gloved finger might
tap: buttons, inputs, chips, segmented controls, and every tooth cell. Visual
size can shrink below that (the tooth cell renders at 48px, close to the
floor) but the hit area never does.

## Elevation & Depth

Depth is used sparingly and only to distinguish two layers: content resting
on the page, and content that has temporarily lifted above it. **Two shadow
levels only** — `card` (0/1/3 at 8% opacity) for cards and static surfaces,
and `sheet` (0/-4/16 at 16% opacity) for the bottom sheet, which lifts upward
from the bottom edge. More depth levels than that would read as visual noise
on a screen that's already dense with clinical state; hierarchy elsewhere
comes from color, weight, and the 8px spacing rhythm, not shadow stacking.

## Shapes

Corners are gently rounded, never sharp and never pill-shaped except where a
control is explicitly a track (the segmented control). The scale is small on
purpose: `sm` (6px) for chips and badges, `md` (10px) for buttons, inputs,
and cards, `sheet` (16px) for the bottom sheet's top corners only, and a
dedicated `tooth` radius (8px) for the chart's tooth cells — slightly
tighter than a standard card, so a 48px cell doesn't read as an oversized
pill at that size.

## Components

- **Buttons:** Height 44px, `md` radius, Label typography. Primary
  (filled `primary`, white text) for the one most important action per
  screen; Secondary (white fill, bordered) for the alternative action;
  Ghost (text-only) for tertiary actions; Danger (`danger` fill) reserved
  for destructive or blocking actions. No hover state — this is a
  touch-first product; states are Default, Pressed (fill darkened ~8%),
  and Disabled (40% opacity).
- **Inputs:** Height 44px, `md` radius, white fill, bordered, Body
  typography with a Label above. A distinct **Locked** state — plain text
  with a small lock glyph, no box — renders a finalized bill's prices; this
  is not the same as Disabled, because it's communicating "this can no
  longer be edited, by design," not "you can't use this yet."
- **Chips:** 32px visual height inside a ≥44px hit area, `sm` radius,
  single-select. The condition chip group (H/D/F/X/C/I) reuses each
  condition's own fill/letter pair when selected, so the tooth editor
  teaches the same color language as the chart itself.
- **Segmented control:** A neutral track (`#F1F5F9`) with a white,
  shadow-lifted active segment — used for the dentition toggle
  (Permanent/Both/Primary) and the discount type selector.
- **Patient context bar:** Pinned, full-width, card surface with a bottom
  hairline. Back navigation, patient name (Body Strong), an allergy chip
  when relevant, and the visit selector. Present on every dentist screen
  once a patient is open; absent entirely from the staff view's minimal
  patient card.
- **Allergy chip / banner:** `danger-tint` background, `danger` text,
  warning icon — always icon + text + color together, appearing as a
  compact chip in the context bar and as a full-width banner that
  re-asserts before any procedure.
- **Tooth cell:** 48×48px, `tooth` radius. Condition fill + centered
  Tooth Letter is the base state; FDI number sits small in the top-left
  corner; a planned procedure adds a 2px amber outline plus a 16px corner
  badge as **separate layers**, never altering the base fill — this is the
  mechanism that lets a crowned (`C`) tooth also show as planned (`P`)
  without visual collision.
- **Bottom sheet:** Slides up from the bottom edge, `sheet` radius on the
  top corners only, `sheet` shadow, a grab handle, Title-weight header.
  Used for the tooth editor and other quick, in-context edits that
  shouldn't navigate the dentist away from what they were looking at.
- **Money row:** Label left, tabular Money value right. Variants for an
  editable draft line, a locked finalized line, subtotal, discount (shown
  in `success` green, prefixed with a minus), VAT, and a bold Total row
  with a top border — the totals are always computed and shown line by
  line, never a single opaque number.
- **Discount selector:** Segmented control (None/Senior/PWD/Promo/Custom)
  that conditionally reveals ID and TIN fields only when a statutory
  discount is chosen, plus a quiet caption note about non-stacking rules.
- **State badge:** 24px height, `sm` radius, Label text — Draft (warning),
  Finalized (primary), Paid (success), Void (neutral gray) — always text
  and color together, never color alone.
- **Role-empty state:** A centered, muted icon and a single calm line —
  "Not available for your role." Deliberately styled with no red and no
  warning iconography: this is a boundary the product intends, not an
  error the user caused.

## Do's and Don'ts

- Do give every meaning on the chart a letter, badge, or border in
  addition to color — the chart must survive a full grayscale pass.
- Do keep the condition fill and the planned-treatment marker on separate
  visual channels (fill vs. outline/badge) so both can be true for one
  tooth at once.
- Do show computed totals line by line (subtotal → VAT → discount →
  grand total) rather than a single number the user has to trust blindly.
- Do keep every tappable hit area ≥44×44px, even when the visible control
  is smaller.
- Do render a locked/finalized state as plain text with a lock cue, not
  as a grayed-out input — the state machine should be visible, not implied.
- Do give staff a genuinely smaller navigation tree instead of the
  dentist's screens with items disabled.
- Don't use the primary teal for anything other than the single most
  important action on a screen.
- Don't introduce a second display typeface or a third color family for
  status — the whole system is deliberately built from two neutrals, one
  primary, and three status colors.
- Don't show a disabled tab or a grayed-out clinical section to a staff
  user — absence, not a locked door, is the correct empty state.
- Don't add hover-only states; this is a touch-first, tablet-first product.
- Don't let a discount or VAT number appear without also showing the
  calculation that produced it.
