# Astrophysics Club Website — Handoff to Claude Code

You are taking over an in-progress redesign of the **Fremont High School Astrophysics
Club** website. This document is the full context and the complete, itemized list of
everything the club president (Abir Mehta) has requested across a long working session.
Your job: **make sure every item below is fully implemented and correct, fix the two
things that are currently wrong (the globe and the astronaut), and remove the mono
font.** Then verify nothing was missed.

Abir is frustrated because requests piled up and a few were done wrong. Be meticulous,
verify visually, and do not regress anything that already works.

---

## 1. Project / repo

- **Location (Abir's Mac):** `~/Desktop/Code/fhs-astrophysics`
- **Stack:** static site, no build step. `index.html` + `styles.css` + `app.js` +
  `assets/`. It's a **hash-routed SPA** with routes: `#/` (home), `#/about`,
  `#/meetings`, `#/notes`, `#/atlas`, `#/team`, `#/faq`, `#/join`.
- **Theme:** deep-space. A fixed JWST deep-field photo background (`assets/bg/jwst-bg*.jpg`)
  behind every route, a hero with a big wordmark + a floating astronaut PNG
  (`assets/astronaut*.png`) + a rising Earth marble (`assets/hero-earth.webp`).
- **Preview:** `cd ~/Desktop/Code/fhs-astrophysics && python3 -m http.server 8123`,
  open `http://localhost:8123`. (Opening `index.html` directly also works.)

### Git — DO NOT TOUCH `main`
- Work happens on branch **`gauntlet/photographic-refine`**. `main` is the pristine
  original and must never be modified.
- Tags: **`original-version`** = pristine original; **`vibrant-version`** = the latest
  good state. There is a safety tag `pre-gauntlet-refine-20260905-031450`.
- The last commit on the branch is `4590ec9`. Commit your work to this branch (or a new
  branch off it); never to `main`.
- NOTE: the working tree may block `.git/*.lock` deletion (a filesystem quirk on this
  machine); if a git op complains about an existing lock, move `.git/index.lock` /
  `.git/HEAD.lock` aside and retry.

---

## 2. Design direction (the "less AI / Firebird" brief)

Abir repeatedly said the site "looks AI" and "bummy." His reference for a good look is
his own **Firebird Hub** site (firebirdhub.vercel.app): bold, high-contrast, a clear
2-color identity, **solid** cards with visible borders and rounded rectangles, confident
type, energy. The site has been moved that direction already:

- **Keep the deep-space photo hero** (JWST background, astronaut, Earth). Do not go light.
- **Solid navy cards** (`--glass-flat: #141C38`) with visible borders and rounded corners,
  NOT translucent glass.
- **Bold single accent: electric blue** (`--accent: #6AA4FF`). Replaced an earlier beige/
  sodium-gold palette everywhere. There must be **no beige/gold** left anywhere.
- **Flat & crisp, NO glows.** Abir specifically hates glow "blooms" and fully-rounded
  "pill" buttons. Buttons/inputs/chips are ~10px rounded rectangles (NOT pills), primary
  buttons use a hard bottom shadow, and accent glow box-shadows were removed. Keep it flat.
- **Fonts:** display = **Bricolage Grotesque**, body = **IBM Plex Sans**. See item 3.1 —
  the mono font must be removed.

---

## 3. THE REQUESTS — implement/verify EVERY one

Status legend: ✅ believed done on `4590ec9` · ⚠️ partially done / verify · ❌ TODO / wrong.

### 3.1 ❌ Remove the mono font ("AI-generated looking font") — HIGH PRIORITY
Abir screenshotted the word **"LECTURE"** rendered in **IBM Plex Mono** (the small
all-caps monospaced labels: nav eyebrows like "§ NEXT MEETING", "GET ON THE MEETING LIST",
the meeting-card "LECTURE / DATA LAB" kind tags, filter pills "ALL · 16", officer roles,
and **the email addresses** in the Reach-us box and team cards). He said: *"I hate this AI
generated looking font. Remove it completely from the website including like the emails …
I don't want to see it EVER AGAIN."*
- **Do:** eliminate IBM Plex Mono entirely. Repoint `--font-mono` in `styles.css` to the
  body sans (IBM Plex Sans) — e.g. `--font-mono: "IBM Plex Sans", system-ui, sans-serif;`
  — and **remove `IBM+Plex+Mono` from the Google Fonts `<link>` in `index.html`** and its
  head comment. Every former mono label (eyebrows, kickers, meta, badges, emails, countdown
  units, ticker) must render in the sans. Verify no monospace remains anywhere.

### 3.2 ❌ The Earth globe — must be the EXACT original painterly style AND show North America
This is the most important fix and the one currently WRONG.
- **Background:** Abir asked for the astronaut to sit "on top of the North America area of
  the globe." The current committed Earth (`assets/hero-earth.webp`) is an **Atlantic-facing
  painterly blue marble** — it shows Africa / Europe / South America, so **there is no North
  America visible**, which made the astronaut placement nonsensical.
- Claude (me) tried to fix it by generating a NEW globe with cartopy centered on North
  America, but it came out **blocky/cartoonish and flat** — Abir rejected it: *"the globe
  needs to be the EXACT style that it was."* That blocky version exists only in a scratch
  copy and was **not committed** — the repo still has the good original painterly webp. Do
  **not** ship a blocky/hard-edged globe.
- **Required end state:** an Earth marble in the **exact same soft, painterly blue-marble
  style as the original `hero-earth.webp`** (soft continents, blue ocean, atmosphere rim,
  a soft specular highlight, gentle day/night), **but rotated/redrawn so North America is
  front-and-centre and clearly visible in the hero.** Match the original's colors, softness,
  and lighting precisely — study the committed `assets/hero-earth.webp` first.
- The hero currently only shows the **top polar cap** of a huge Earth (`.home__earth-wrap`
  is ~120vmin, `bottom:-78vmin`). If you keep a giant Earth, North America (a mid-latitude
  continent) sits below the fold. So either (a) render the globe so North America is near
  the top of the sphere, or (b) raise/shrink `.home__earth-wrap` so more of the marble
  (including North America) is visible above the fold — whichever keeps the original look.
- Note: `styles.css` has `.home__earth::before` / `::after` overlays that add extra
  day/night + atmosphere shading on top of the webp. If your new webp already bakes those
  in, reduce/disable the overlays so the globe isn't double-shaded.

### 3.3 ❌ The astronaut is "messed up" — give it a clean, intentional placement
Abir said the astronaut looks "messed up." It's a floating astronaut PNG
(`.home__astro-wrap` / `.home__astro`) that hovers through the giant serif wordmark
"Astrophysics Club." Requirements he gave over time:
- Earlier he wanted it "exactly like before" = floating through the middle of the letters
  (its original position was `left:50%; top:50%`).
- Then he wanted it **on top of the North America area of the globe** (which only makes
  sense once 3.2 is fixed).
- **Do:** once the globe shows North America, position the astronaut so it reads as clearly
  hovering **over North America**, cleanly (not awkwardly cut by the wordmark, not colliding
  badly). On desktop it should look intentional; on mobile the globe is only a sliver at the
  bottom, so a sensible fallback (e.g. through the wordmark) is fine. On fine-pointer devices
  `app.js` drives an idle "ragdoll" transform on the astronaut from the `top/left` anchor —
  changing the CSS `top/left` moves it; verify it still looks right with the JS motion.

### 3.4 ⚠️ Slide-deck links must OPEN the slides, not download; no lightspeed transition
Abir clicked a meeting and it tried to **download a PDF**; he wants it to **open the Google
Slides deck in the browser** ("take them to the slides page open like this, without the
lightspeed animation"). Two places use the deck link:
- The **About page "arc" boxes** (see 3.9) link to each meeting's deck.
- The **meeting preview modal** (opened by clicking a deck card on `#/meetings`) has an
  "Open/Download slide deck" button.
- **Do:** in `app.js`, the `SLIDES(id)` helper must build a **view/present URL**, not the
  PDF-export URL. Change `…/export/pdf` to `…/present` (or `/edit`). Make the modal button
  say **"Open slide deck ↗"** (not "Download … ↓"). These are external `target="_blank"`
  links so they open in a new tab with no SPA/warp transition — verify no "lightspeed"
  route animation fires when opening a deck.

### 3.5 ✅ Meetings page — remove the index grid; keep only the deck cards
The `#/meetings` page had a row of small numbered index chips (01–13) above the big deck
cards. Abir said *"remove that entire thing basically and only have the slidedecks on that
page."* The `#meetingsIndex` container was removed from `index.html`. **Verify** the small
index chips are gone and only the deck cards remain.

### 3.6 ✅/⚠️ About "arc" boxes — rename + make each link to its slide deck
On `#/about` there's a horizontal row of numbered boxes ("01 Scale of the Universe",
"02 Celestial Motion", … "13 The Edges of Time") under a heading.
- The heading was changed from "The year, in one arc" to **"The '25–'26 Year"**. ✅
- Each box must be **clickable and link to that meeting's slide deck** (opens the deck, per
  3.4). Implemented by rendering `.arc-node` as an `<a>` in `app.js`. **Verify** clicking a
  box opens the correct deck.

### 3.7 ❌ Year switch: '25–'26 vs '26–'27 (crisp, NOT a long rounded rectangle)
Abir: *"since we are going into the '26–'27 school year, have a separate button (without
stupid long rounded rectangles) where you can click between the two."* On the About "arc"
section add a **compact segmented toggle** with two options: **'25–'26** and **'26–'27**.
- '25–'26 shows the existing 13 meetings; '26–'27 shows a short placeholder ("The '26–'27
  season kicks off this fall. Meetings will show up here as we go.") and updates the heading.
- Style it **crisp/compact** — a small segmented control with square-ish corners, NOT a pill.
- (A version of this was drafted: `#arcTitle`, `.arc__years`/`.arc__year` buttons,
  `#arcScroller`, `#arcEmpty`, and an `initArcYears()` in `app.js`. Verify/finish it.)

### 3.8 ✅ Real club logo, circular only
The nav/footer used a generic ringed-planet SVG. Abir wanted the **real club logo** — the
neon "ASTROPHYSICS CLUB" badge with a Saturn + atom. The favicon PNG had a dark **square**
tile baked in; he then said use **only the circular part**. A circular-masked
`assets/logo-circle.png` was created (transparent corners) and used in nav + footer. Verify.

### 3.9 ✅ Notes hover topic-cloud must not be cut off
On `#/notes`, hovering a handout card reveals a "TOPICS INSIDE" cloud of chips. It was
**clipped** (nested inside the short thumbnail with `overflow:hidden`, so long topic lists
got cut at the top). Fixed by moving `.ncard__cloud` out of `.ncard__thumb` to be a direct
child of `.ncard`, and making it fill the whole card (`inset:.6rem`, scroll if long). Verify
every topic shows for every card.

### 3.10 ✅ Room / teacher / founders copy
- Meeting location: **"Room 91 · Mr. Bloom's room"** everywhere (was "Room 153 · Mr. Bob's
  room" / "Mr. Caprilles's Room"). Abir also said **remove "engineering building"** from the
  where line — the Join next-meeting card's `<dd>` should read `Room 91 · Mr. Bloom's room`
  with NO ", engineering building". Also the `<meta name="description">` and the FAQ answer
  use Room 91. Verify all three spots.
- About lede: **"Founded in September 2025 by Abir Mehta and Dhruv Lagu."** (was "by two
  students").

### 3.11 ✅ FAQ "Ask us" sidebar copy
On `#/faq` there's a sticky left card headed "§ ASK US / Anything not covered here?" with a
description ending in a sentence. Change that last sentence to exactly:
**"If yours isn't covered, just email us and we'll write back!"** (Screenshot showed the old
"If yours isn't answered, one line to us and we'll write back.") Verify it reads the new way.

### 3.12 ✅ "Reach us" box — list each officer's contact, Abir first
The Join page "Reach us" card previously showed only the club email + a generic note. Abir
wanted **each officer's contact listed, with his name first**. It now shows the club email
plus three officer rows (name, role, email), in order **Abir Mehta (Co-Founder & President),
Dhruv Lagu (Co-Founder & Vice President), Saanvi Doshi (Social Media & Outreach Lead)**.
Emails: `amehta251@student.fuhsd.org`, `dlagu234@student.fuhsd.org`,
`sdoshi468@student.fuhsd.org`. Verify order and that emails render in the SANS font (3.1).

### 3.13 ✅ Remove all em dashes ("—")
Abir: remove em dashes, *especially* in the "Reach us" box copy. Done in the visible copy
(e.g. the perk "No prerequisites, drop in any time"; the Reach-us note now uses periods).
**Verify** there are **no "—" em dashes in any user-visible text** anywhere on the site
(code comments don't matter; en dashes in things like "H–R diagram" / "Real-Data" are fine).

### 3.14 ✅ Remove the "T‑MINUS" badge
The Join next-meeting card had a small pill reading "● T‑MINUS" (a dot + rocket-launch
jargon) that Abir said "looks AI." It was removed from the card header. The live countdown
clock (days/hrs/min/sec) stays. Verify the T‑MINUS pill is gone.

### 3.15 ✅ Remove the "NO SPAM · UNSUBSCRIBE ANY TIME · …" line
Under the email signup on `#/join` there was a small meta line
"NO SPAM · UNSUBSCRIBE ANY TIME · OPEN TO ANY FREMONT STUDENT, ANY GRADE". Abir said
"remove this thing all together." The `.signup__meta` span was deleted. Verify it's gone.

### 3.16 ⚠️ Card proportions — no empty space in the Next-meeting box
On `#/join` the two support cards sit side by side: **left = "§ NEXT MEETING"** (topic, date,
countdown, When/Where) and **right = "§ Reach us"** (now taller with 3 officers). They were
forced to equal height (`align-items:stretch`), so the left card grew a **big empty gap at
the bottom**. Abir: keep good proportions like the FAQ "Ask us" card and kill the empty
space. Fix = `.join__support { align-items:start; }` so each card is its natural height.
Verify the left card no longer has dead space.

### 3.17 ✅ Tagline kept
The hero tagline must remain **"From the scale of the universe to the edges of time."**
(An earlier draft changed it; Abir reverted it. Keep this exact line.)

---

## 4. Things that are already correct — DO NOT regress
Vibrant solid-card theme; electric-blue accent (no beige); flat crisp buttons with no glow
blooms; circular logo; rounded-rectangle (not pill) buttons/inputs/chips; the JWST photo
background on every route; the astronaut + Earth existing; all copy in items 3.10–3.15.

## 5. Verification checklist (do this before telling Abir it's done)
Load every route (`#/`, `#/about`, `#/meetings`, `#/notes`, `#/atlas`, `#/team`, `#/faq`,
`#/join`) on desktop AND phone width and confirm:
1. **No IBM Plex Mono anywhere** (labels, badges, emails, countdown) — all sans. (3.1)
2. **Globe** is the original soft painterly style **and North America is clearly visible**;
   the **astronaut sits cleanly over North America**. (3.2, 3.3)
3. Clicking an About "arc" box **and** the meeting-modal deck button **opens** the Google
   Slides deck in a new tab (no download, no warp animation). (3.4, 3.6)
4. Meetings page has **no index chips**, only deck cards. (3.5)
5. About year toggle ('25–'26 / '26–'27) works and is a **compact, non-pill** control. (3.7)
6. Notes hover cloud shows **all** topics, never clipped. (3.9)
7. Copy: Room 91 · Mr. Bloom's room (no "engineering building"); founders line; FAQ line;
   Reach-us officer list (Abir first); tagline. (3.10–3.13, 3.17)
8. T‑MINUS pill gone; NO-SPAM line gone; no em dashes in visible copy. (3.13–3.15)
9. Next-meeting card has **no empty gap**. (3.16)
10. No beige/gold; no glow blooms; buttons are rounded rectangles, not pills. (§2)

Commit to `gauntlet/photographic-refine`; never touch `main`. When done, tell Abir exactly
which of the items above you verified.
