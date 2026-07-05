# Fremont High School Astrophysics Club — Website

A static site (HTML + CSS + vanilla JS, no build step) — a **hash-routed SPA** with six
routes (`/`, `/about`, `/meetings`, `/notes`, `/team`, `/join`) that swap via a
light-speed warp transition. Art direction: **realistic deep space** — a black-navy
nebula background with a real-looking white starfield, a huge **serif wordmark**
(`Astrophysics Club`) spanning the viewport, a floating illustrated astronaut that pops
through the middle of the letters, a large realistic blue Earth rising from the bottom
edge (atmosphere glow, cloud swirls, sunlit limb, orbital rings), an upward light beam,
and an animated film-grain overlay across the whole page. Ice-blue (`#BCD7FF`) accent —
no cyan/violet AI-style gradients anywhere. Reduced-motion aware.

## Fonts

| Role | Typeface | Source |
|------|----------|--------|
| Headlines / hero / display numbers | **Instrument Serif** (400) | Google Fonts (auto-loads) |
| Body / paragraphs | **Söhne** (400/600) | local `assets/fonts/*.woff2` (see below) |
| All-caps metadata labels | **Söhne Mono** Bold (700) | local `assets/fonts/*.woff2` |

Söhne is a **licensed** typeface (Klim Type Foundry). Drop the three WOFF2 files into
`assets/fonts/` — the exact names are documented in `assets/fonts/README.txt`. Until
they're present the site falls back cleanly to Helvetica Neue (body) and a system mono
(labels); Instrument Serif always loads from Google Fonts. No code change needed to add
the real font — just the files.

> Instrument Serif ships a single weight, so all headings use `font-weight: 400` and
> lean on size for hierarchy (never a synthesized/faux bold).

## Run locally
```bash
cd fhs-astrophysics
python3 -m http.server 8123
# open http://localhost:8123
```
Any static server works. There is no build step. `.claude/launch.json` is set up so
`preview_start astro-site` works in the Claude preview panel.

## Deploy
Upload the whole `fhs-astrophysics/` folder to any static host — GitHub Pages,
Netlify, Vercel, or Cloudflare Pages. All paths are relative.

## Files
| File | What it holds |
|------|----------------|
| `index.html` | Page structure + all copy |
| `styles.css` | All styling, tokens at the top under `:root`, responsive breakpoints at the bottom |
| `app.js` | Meeting + notes + officers data, router, modal, copy toast, back-to-top, starfield with parallax |
| `assets/thumbs/` | Auto-generated preview images: `deck-1..13.jpg`, `note-6..21.jpg` |
| `assets/notes/` | Local PDF copies of the 16 LaTeX handouts (`src-6..21.pdf`) |
| `assets/fonts/` | Drop-in Söhne WOFF2 files (see `assets/fonts/README.txt`) |

## New in this revision (v3 — typography + realism pass)

- **Type system swap** — Instrument Serif headlines, Söhne body, Söhne Mono Bold labels
  (see the Fonts table above). Every heading weight is 400 to match Instrument Serif.
- **Serif hero wordmark** — the hero now reads `Astrophysics Club` in filled Instrument
  Serif spanning the viewport, sitting *behind* the astronaut (no more outlined strokes).
- **Bigger, more realistic Earth** — larger blue marble with continents, cloud swirls, a
  sunlit limb highlight, a night-side terminator, atmosphere glow, orbital rings, and an
  upward light beam into the starfield. Background is a blue nebula fading to true black.
- **Heavier film grain** — animated turbulence at ~50% soft-light so the texture is
  actually visible on dark surfaces.
- **Stats sidebar** repositioned to the lower-right so it never clips the title; numbers
  are Instrument Serif, labels are Söhne Mono Bold, and officers now reads `3` (no zero-pad).
- **Glassmorphism** — meeting cards, note cards, stat/readout/arc panels, and the join
  cards are frosted glass (`rgba(255,255,255,.04)`, `blur(16px)`, hairline border, inner glow).
- **Brand-colored nav socials** — Instagram (gradient) + Discord (blurple) icons top-right.
- **Next-meeting placeholder** — the Join section shows a "Next meeting" card with
  Date / Time / Topic = **TBA**, ready to fill in (the live countdown was removed).
- **Snacks are permanent** — "Snacks provided at every meeting. Come hungry."
- **Team = officers only** — the members grid is gone; three officer cards remain
  (roles now use `&`: Co-Founder & President / Vice President, Social Media & Outreach Lead).
- **Year arc restyle** — serif section header, Söhne Mono label, glass timeline cards.

## Retained from the previous pass

- **Astronaut** — hand-drawn SVG with a slow zero-gravity float (±15px, ±3°) and ambient
  glow. The astronaut and Earth are pure SVG + CSS — no image dependencies.
- **Ice-blue palette** — the single accent is `#BCD7FF`; every AI-style purple gradient
  is gone (nav pill, filter pills, primary hero button all clean).
- **Meeting modal** — clicking any meeting card opens a preview modal showing the deck
  cover thumbnail, handout page-one preview, topic chips, summary, and two actions
  (Open lecture notes / Download slide deck). Focus is managed and `Esc` closes.
- **Topic cloud on notes** — hovering a note card reveals a floating chip cloud with
  the parent meeting's topics. On touch devices the cloud is always visible.
- **Filter UX** — active filter pill has a soft ice-blue glow ring (no gradient fill).
  `All · 16` resets the filter.
- **Team cards** — subtle blue gradient underlay in the portrait area, "Officer · 0N"
  badge pill, name + role, and a hover-in bio reveal.
- **Two-column Join** — left: benefits + when/where + next-meeting card + contact emails
  with one-click copy buttons + social buttons. Right: a real email signup that submits
  to the Google Form in a new tab.
- **Copy-to-clipboard toast** — click the copy button next to an email; a small ice-blue
  bordered toast confirms (with an `execCommand` fallback if the Clipboard API is blocked).
- **Back-to-top** — round FAB fades in after 480px of scroll, positioned above the
  safe area on mobile.
- **Starfield parallax** — canvas stars translate with scroll (per-star depth factor)
  for a subtle sense of depth without over-animating.
- **CSS containment** — `contain: layout paint` on cards for cheaper repaints.
- **Mobile pass** — buttons stack full-width on the hero, Earth scales to viewport vmin,
  hover states convert to always-visible reveals via `@media (hover: none)`.

## What's real vs. placeholder

**Real (pulled from your own decks & handouts):** every meeting title, topic list, and
summary; all 13 slide-deck download links; all 16 note previews + PDFs; officer names,
roles, and bios; meeting logistics; contact emails; Instagram & Discord links.

**Placeholders to fill in (clearly tagged in the UI):**
- Officer **photos** — see below.
- **Next meeting** — Date / Time / Topic are `TBA` in the Join section (hardcoded in
  `index.html`, `#nextMeeting`). Fill them in when the next meeting is scheduled.
- **Söhne font files** — see `assets/fonts/README.txt`.

## Common edits

### Add officer photos
Drop images in `assets/team/` (e.g. `abir.jpg`), then in `app.js` set the `photo` field:
```js
const OFFICERS = [
  { name: "Abir Mehta", role: "Co-Founder & President", photo: "assets/team/abir.jpg", email: "amehta251@student.fuhsd.org", bio: "…" },
  …
];
```
Leaving `photo: null` shows the two-letter initials placeholder on the gradient underlay.

### Fill in the next meeting
In `index.html`, find `#nextMeeting` and replace the three `TBA` values in
`.nextmeet__val` with the real Date / Time / Topic.

### Swap the email-list form target
The right column of the Join section (`#emailSignup`) is a real `<form>` that posts to
`https://forms.gle/cSwdE6HvF92m9wq28` in a new tab. Change the `action` attribute to
your own form URL.

### Change accent color
`--accent` in `styles.css` `:root`. It's used everywhere — filter glow, active links,
chapter rule, brand mark, cursor, toast, focus ring.

### Edit meetings / notes
`MEETINGS` array + `NOTES` object at the top of `app.js`. Slide links use Google's
`/export/pdf` endpoint so a click downloads the PDF directly.

## Accessibility notes
- All animations respect `prefers-reduced-motion` (grain jitter, astronaut float,
  starfield warp, reveal transitions, staggered fade-ins).
- Icon-only buttons (Instagram, Discord, copy, close) all have `aria-label`.
- Modal manages focus (opens on close button, restores on dismiss) and traps `Esc`.
- Toast uses `role="status"` + `aria-live="polite"`.
- Touch devices always show topic clouds and officer bios (no hover dependency).
