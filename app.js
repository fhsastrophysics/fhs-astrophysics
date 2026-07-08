/* =====================================================================
   Astrophysics Club - data, router, and handcrafted micro-interactions
   Vanilla JS, no deps.
   ===================================================================== */
(function () {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = window.matchMedia("(pointer: fine)").matches;
  // Any touchscreen device (phones AND tablets, incl. an iPad with a trackpad —
  // (any-pointer: coarse) is true whenever a coarse pointer exists at all).
  // Motion on touch is deliberately calm and GPU-light: NO animated starfield
  // canvas, NO canvas light-speed warp, NO full-page blur. Those were the
  // memory/GPU hogs that crashed mobile Safari.
  const COARSE = window.matchMedia("(any-pointer: coarse)").matches;
  const SLIDES = (id) => `https://docs.google.com/presentation/d/${id}/export/pdf`;

  /* -------------------------------------------------------------------
     DATA (factual, extracted from decks & handouts)
     ------------------------------------------------------------------- */
  const NOTES = {
    6:  { title: "Introduction to Astrophysics",          meeting: 1,  type: "Lecture Notes", cat: "notes",    pages: 6 },
    7:  { title: "Celestial Motion & Orbits",             meeting: 2,  type: "Lecture Notes", cat: "notes",    pages: 6 },
    8:  { title: "Stars & Their Life Cycles",             meeting: 3,  type: "Lecture Notes", cat: "notes",    pages: 6 },
    9:  { title: "Exoplanets",                            meeting: 4,  type: "Lecture Notes", cat: "notes",    pages: 7 },
    10: { title: "Semester 1 Review: Astro Jeopardy",     meeting: 5,  type: "Lecture Notes", cat: "notes",    pages: 6 },
    11: { title: "Exoplanet Detection with Real Data",    meeting: 6,  type: "Lecture Notes", cat: "notes",    pages: 6 },
    12: { title: "Transit Detection + Model Evaluation",  meeting: 7,  type: "Lecture Notes", cat: "notes",    pages: 6 },
    13: { title: "Black Holes",                           meeting: 8,  type: "Lecture Notes", cat: "notes",    pages: 6 },
    14: { title: "Black Hole Problems",                   meeting: 9,  type: "Worksheet",     cat: "practice", pages: 2 },
    15: { title: "Black Hole: Table of Constants",        meeting: 9,  type: "Reference",     cat: "practice", pages: 1 },
    16: { title: "Black Hole Problems: Answer Key",       meeting: 9,  type: "Answer Key",    cat: "keys",     pages: 1 },
    17: { title: "Composition of the Universe",           meeting: 10, type: "Lecture Notes", cat: "notes",    pages: 7 },
    18: { title: "Workstation Activity: Dark Matter",     meeting: 11, type: "Activity",      cat: "practice", pages: 6 },
    19: { title: "Workstation Activity: Answer Key",      meeting: 11, type: "Answer Key",    cat: "keys",     pages: 2 },
    20: { title: "Special Relativity",                    meeting: 12, type: "Lecture Notes", cat: "notes",    pages: 8 },
    21: { title: "The Edges of Time",                     meeting: 13, type: "Lecture Notes", cat: "notes",    pages: 7 },
  };

  const MEETINGS = [
    { n: 1, kind: "Lecture", short: "Scale of the Universe", title: "Introduction to Astrophysics",
      slides: "1NiR7DP8yFHih9optIWVrbqJvrCi9y7N-XC_L2i9rHGM", notes: [6],
      summary: "The club's purpose and the competitions we're chasing, then the sheer scale of the universe. Light-years, AU, parsecs, and how cosmic structure is organized up to the Milky Way.",
      topics: ["Scale of the Universe", "Light-years / AU / Parsecs", "Cosmic Structure", "Competitions"] },
    { n: 2, kind: "Lecture", short: "Celestial Motion", title: "Celestial Motion & Orbits",
      slides: "1H87fP5AGzcWP7gReU9u7jrQ7mHPfu0zaz_-D1WmXb_U", notes: [7],
      summary: "How things move in space, from geocentric models to Copernicus, Kepler, Newton and Einstein. Free fall, orbits, Kepler's three laws, and the expansion of the universe.",
      topics: ["Kepler's Laws", "Newton vs. Einstein", "Free Fall & Orbits", "Hubble's Law"] },
    { n: 3, kind: "Lecture", short: "Stars & Life Cycles", title: "Stars & Their Life Cycles",
      slides: "19ezmEQR4p7_DSY9VsEwmXYG8Y5OvQtOvMKHg47HjajQ", notes: [8],
      summary: "Star formation from collapsing clouds, how mass decides a star's fate, and the end states (white dwarfs, neutron stars, black holes) read off the H–R diagram.",
      topics: ["Star Formation", "Stellar Evolution", "White Dwarfs → Black Holes", "H–R Diagram"] },
    { n: 4, kind: "Lecture", short: "Exoplanets", title: "Exoplanets",
      slides: "1Jc32G9IeLo41uNWafwEJfEsw_zeyCQrYJyfvhHi7J7g", notes: [9],
      summary: "Worlds beyond the solar system: discovery history, the four detection methods, reading composition with spectroscopy, and what makes a planet habitable.",
      topics: ["Detection Methods", "Spectroscopy", "Habitability", "Biosignatures"] },
    { n: 5, kind: "Review", short: "Semester 1 Review", title: "Semester 1 Review: Astro Jeopardy",
      slides: "18voyXD6lcH_A9X9qjlD0vmDP4sH1pCYxmQlqbTVs6W8", notes: [10],
      summary: "A Jeopardy-style review of the first four meetings, covering scale, celestial motion, and stars, with the big-picture connections that tie them together.",
      topics: ["Scale", "Celestial Motion", "Stars", "Big-Picture Connections"] },
    { n: 6, kind: "Data Lab", short: "Real-Data Detection", title: "Exoplanet Detection with Real Data",
      slides: "1ISUNQ0q-uVXzcGJSVQ90QpOZXeSQy3pYZkjdkle1E1w", notes: [11],
      summary: "Real TESS light-curve data for HD 209458 in a Google Colab notebook. Smoothing the signal, detecting transit dips, estimating an orbital period.",
      topics: ["Transit Method", "Real TESS Data", "Python / Colab", "Orbital Period"] },
    { n: 7, kind: "Data Lab", short: "Model Evaluation", title: "Transit Detection & Model Evaluation",
      slides: "1B5L9HEovJF7erVhUiz6Kakfp29nPIzU_n1QMF4lMF0w", notes: [12],
      summary: "Finishing the transit detector and grading it against the literature. Comparing the recovered period of HD 209458 b using percent error and precision.",
      topics: ["Finishing the Detector", "Model Evaluation", "Percent Error", "Precision"] },
    { n: 8, kind: "Lecture", short: "Black Holes", title: "Black Holes",
      slides: "1XGgIDgIBfZrsn4hnGzrKZI8jt_VXe_JPOEGokE9Oz2s", notes: [13],
      summary: "From supernova collapse to the event horizon. Deriving the Schwarzschild radius from escape velocity, observational evidence, time dilation, and Hawking radiation.",
      topics: ["Schwarzschild Radius", "Event Horizon", "Time Dilation", "Hawking Radiation"] },
    { n: 9, kind: "Activity", short: "Black Hole Problems", title: "Black Holes: Problem-Solving Activity",
      slides: "1-XFX1TN53etNTY9alLXDHYbWHx1clFPNJUGadSQgJMQ", notes: [14, 15, 16],
      summary: "Six multi-part problems on the Schwarzschild radius, orbital velocity, Hawking temperature, time dilation and density, with a constants sheet and full answer key.",
      topics: ["Problem Set", "Constants Sheet", "Answer Key", "Sagittarius A*"] },
    { n: 10, kind: "Lecture", short: "Universe Composition", title: "Composition of the Universe",
      slides: "1l_H9vJHJFyRAtkBiwfCE9BW-GxImi2nt", notes: [17],
      summary: "What the universe is made of: ordinary matter (~5%), dark matter (~27%), dark energy (~68%), with the evidence, the Friedmann equation, and density parameters.",
      topics: ["Dark Matter", "Dark Energy", "Friedmann Equation", "Density Parameters"] },
    { n: 11, kind: "Activity", short: "Dark Matter Stations", title: "Dark Matter & Dark Energy: Workstation Activity",
      slides: "1HjloI5Qmnxbw0nQBwscZFmIKB1jYCNVn", notes: [18, 19],
      summary: "A three-station activity: recover missing mass from a rotation curve, weigh a dark-matter halo with lensing, and decide the fate of a universe with the Friedmann equation.",
      topics: ["Rotation Curves", "Gravitational Lensing", "Fate of the Universe"] },
    { n: 12, kind: "Lecture", short: "Special Relativity", title: "Special Relativity",
      slides: "1SM3e7JkO94k3FCYx8Fjc4mh_-b9Ak9Bh", notes: [20],
      summary: "Special relativity from the ground up: the two postulates, Lorentz transformations, length contraction, time dilation, the twin paradox, and E = mc².",
      topics: ["Two Postulates", "Lorentz Transformations", "Time Dilation", "E = mc²"] },
    { n: 13, kind: "Finale", short: "The Edges of Time", title: "The Edges of Time",
      slides: "1gmeTct4YE0DMttYldYFBaxQ6JZDJlKBi", notes: [21],
      summary: "The finale. What may have come before the Big Bang (eternal inflation, cyclic and no-boundary models) and how the universe might end (Freeze, Rip, Crunch, vacuum decay).",
      topics: ["Before the Big Bang", "Fate of the Universe", "DESI 2024", "Cosmology"] },
  ];

  const OFFICERS = [
    { name: "Abir Mehta",   role: "Co-Founder & President",       photo: null, email: "amehta251@student.fuhsd.org",
      bio: "Founded the Astrophysics Club with Dhruv in October of 2025 and develops the core curriculum, including general ideas for club success. Develops the typeset notes and handouts for biweekly meetings and handles communication and outreach to gain members. Outside the club, Abir is a huge physics enthusiast who spends a large majority of his time doing physics, with a wide variety of physics and math courses taken and a plethora of projects in the works. Message him for any inquiries about physics." },
    { name: "Dhruv Lagu",   role: "Co-Founder & Vice President",  photo: null, email: "dlagu234@student.fuhsd.org",
      bio: "Develops lecture curriculum with Abir. Leads the club's data and Python side, including TESS light curves, Colab notebooks, and model evaluation, and developed the ML-based exoplanet detection curriculum used in club sessions. Outside the club, Dhruv is an aerospace enthusiast, the VP of Design & Strategy for FHS Robotics, and the developer of Orbital Watch, a website tracking the orbital debris crisis." },
    { name: "Saanvi Doshi", role: "Social Media & Outreach Lead", photo: null, email: "sdoshi468@student.fuhsd.org",
      bio: "Joined the Astrophysics Club in April of 2026. Runs the club's Instagram and other socials, as well as running fundraisers and keeping the club connected with Fremont's ASB (Associated Student Body). Outside the club, Saanvi is interested in lab research and is involved in FHS Science Olympiad, as well as various other leadership roles on campus." },
  ];

  const ROUTES = ["/", "/about", "/meetings", "/notes", "/team", "/join"];

  /* -------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const notePath = (id) => `assets/notes/src-${id}.pdf`;
  const noteThumb = (id) => `assets/thumbs/note-${id}.jpg`;
  const deckThumb = (n) => `assets/thumbs/deck-${n}.jpg`;
  const dlName = (id) => { const m = NOTES[id]; return `FHS Astrophysics - M${m.meeting} - ${m.title}.pdf`; };
  const pad = (n) => String(n).padStart(2, "0");

  const IC_OPEN = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg>';

  /* -------------------------------------------------------------------
     Split text - wrap chars in .split-c
     ------------------------------------------------------------------- */
  function splitLine(node) {
    const raw = node.textContent;
    node.textContent = "";
    const w = document.createElement("span"); w.className = "split-w";
    [...raw].forEach((ch, i) => {
      const s = document.createElement("span"); s.className = "split-c";
      s.style.transitionDelay = (i * 24) + "ms";
      // Non-breaking space so inline-block spans don't collapse
      s.textContent = ch === " " ? " " : ch;
      w.appendChild(s);
    });
    node.appendChild(w);
  }

  /* -------------------------------------------------------------------
     Odometer counter
     ------------------------------------------------------------------- */
  function odometer(node, target) {
    node.textContent = "";
    // No zero-pad - single-digit stats read as "3", not "03".
    const digits = String(target).split("");
    const cols = digits.map((d) => {
      const col = document.createElement("span");
      col.style.cssText = "display:inline-block;overflow:hidden;height:1em;vertical-align:baseline;line-height:1;";
      const reel = document.createElement("span");
      reel.style.cssText = "display:inline-block;transform:translateY(0);transition:transform 1.4s cubic-bezier(.16,1,.3,1);";
      for (let i = 0; i <= parseInt(d, 10); i++) {
        const s = document.createElement("span");
        s.textContent = i; s.style.cssText = "display:block;line-height:1;";
        reel.appendChild(s);
      }
      col.appendChild(reel);
      node.appendChild(col);
      return reel;
    });
    requestAnimationFrame(() => cols.forEach((reel, i) => {
      setTimeout(() => { reel.style.transform = `translateY(-${(reel.children.length - 1)}em)`; }, i * 120);
    }));
    setTimeout(() => cols.forEach((reel) => { reel.style.transform = `translateY(-${(reel.children.length - 1)}em)`; }), 1800);
  }

  /* -------------------------------------------------------------------
     Custom cursor
     ------------------------------------------------------------------- */
  function initCursor() {
    if (!FINE || REDUCED) return;
    const c = $("#cursor");
    const label = $(".cursor__label", c);
    if (!c) return;
    document.body.style.cursor = "none";
    let x = 0, y = 0, tx = 0, ty = 0, raf = null;
    function tick() {
      x += (tx - x) * 0.22; y += (ty - y) * 0.22;
      c.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(tick);
    }
    document.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      c.classList.add("on");
      if (!raf) tick();
    });
    document.addEventListener("pointerleave", () => c.classList.remove("on"));
    const HOT_SELECTOR = "a, button, .mcard, .ncard, .tcard, .arc-node, .mi-item";
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest(HOT_SELECTOR);
      if (t) {
        c.classList.add("hot");
        const l = t.dataset.cursor || (t.closest(".mcard") ? "PREVIEW" : t.closest(".ncard") ? "OPEN" : t.tagName === "A" || t.tagName === "BUTTON" ? "→" : "");
        label.textContent = l;
      }
    });
    document.addEventListener("pointerout", (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(HOT_SELECTOR)) c.classList.remove("hot");
    });
  }

  /* -------------------------------------------------------------------
     Magnetic buttons
     ------------------------------------------------------------------- */
  function initMagnetic() {
    if (!FINE || REDUCED) return;
    $$(".magnetic").forEach((btn) => {
      let raf = null;
      const strength = 0.3;
      btn.addEventListener("pointerenter", () => btn.classList.add("is-magnet-active"));
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          btn.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px)`;
          raf = null;
        });
      });
      btn.addEventListener("pointerleave", () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        btn.classList.remove("is-magnet-active");
        btn.style.transform = "translate(0px, 0px)";
        setTimeout(() => { btn.style.transform = ""; }, 600);
      });
    });
  }

  /* -------------------------------------------------------------------
     Card spotlight
     ------------------------------------------------------------------- */
  function initSpotlight(cards) {
    if (!FINE || REDUCED) return;
    cards.forEach((c) => {
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        c.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      });
    });
  }

  /* -------------------------------------------------------------------
     Hero interactions — astronaut ragdoll physics + background parallax.
     One rAF loop: idle zero-g float, plus a damped spring that nudges the
     astronaut away from the cursor and tilts it, settling back on leave.
     Background layers (Earth, rings, beam, glow) parallax the opposite way,
     depth-scaled. Reduced-motion / coarse-pointer: static, no loop.
     ------------------------------------------------------------------- */
  function initHeroInteractions() {
    // Touch devices get no cursor parallax and no JS ragdoll rAF — the astronaut
    // floats via a lightweight CSS animation instead (see .home__astro-wrap in the
    // mobile stylesheet). Skipping this loop removes a second continuous rAF on
    // phones, which — with the cosmos + starfield — was part of the crash.
    if (REDUCED || !FINE) return;
    const astro = $(".home__astro-wrap");   // wrapper carries the transform + glow aura
    if (!astro) return;
    const earth = $(".home__earth-wrap");
    const rings = $(".home__rings");
    const beam  = $(".home__beam");
    const glow  = $(".home__glow");
    const cosmos = $(".home__cosmos");
    const eqns  = $(".home__equations");
    const homeRoute = document.querySelector('.route[data-route="/"]');

    let mx = 0, my = 0, tmx = 0, tmy = 0;   // eased + target normalized cursor (-1..1)
    let ax = 0, ay = 0, ar = 0;             // astronaut spring: x/y px offset + rotation deg
    let vx = 0, vy = 0;                      // release impulse velocity (decays each frame)
    let grabbed = false;                    // true while the astronaut is being click-dragged
    let raf = null;
    const t0 = performance.now();

    // Click-drag: grabbing stiffens the spring so the astronaut chases the cursor
    // harder, then flings + settles on release (see the loop below).
    astro.style.cursor = "grab";
    astro.addEventListener("pointerdown", (e) => {
      grabbed = true;
      astro.style.cursor = "grabbing";
      try { astro.setPointerCapture(e.pointerId); } catch {}
    });
    window.addEventListener("pointerup", () => {
      if (!grabbed) return;
      grabbed = false;
      astro.style.cursor = "grab";
      vx = (tmx - mx) * 40;                 // kick a velocity the spring absorbs
      vy = (tmy - my) * 40;
    });

    function onMove(e) {
      const pt = (e.touches && e.touches[0]) ? e.touches[0] : e;
      if (pt.clientX == null) return;
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      tmx = Math.max(-1, Math.min(1, (pt.clientX - cx) / cx));
      tmy = Math.max(-1, Math.min(1, (pt.clientY - cy) / cy));
    }
    function settle() { tmx = 0; tmy = 0; }   // drift back to center when the cursor leaves

    // Last-written parallax cursor position; only rewrite background layers when it
    // actually moves (transforms only, translate3d for GPU compositing — no reflow).
    let lpx = 999, lpy = 999;
    function loop(now) {
      const el = (now - t0) / 1000;
      const active = !homeRoute || homeRoute.classList.contains("active");
      // ease cursor toward target (also decays to 0 after settle())
      mx += (tmx - mx) * 0.07;
      my += (tmy - my) * 0.07;

      if (active) {
        // Astronaut = idle zero-gravity float + damped cursor "push" (writes every
        // frame because the float is always moving). transform only. When grabbed the
        // spring is stiffer and the push stronger for a hands-on drag/fling feel.
        const bob = Math.sin(el * 1.05) * 14;
        const idleRot = Math.sin(el * 0.85) * 3;
        const springK = grabbed ? 0.22 : 0.11;
        const pushPx  = grabbed ? 55   : 26;
        const pushRot = grabbed ? 12   : 6;
        ax += vx; ay += vy;                 // apply release impulse, then let it decay
        vx *= 0.92; vy *= 0.92;
        ax += ((-mx * pushPx) - ax) * springK;
        ay += ((bob - my * (grabbed ? 40 : 20)) - ay) * springK;
        ar += ((idleRot + mx * pushRot) - ar) * springK;
        astro.style.transform =
          `translate3d(calc(-50% + ${ax.toFixed(1)}px), calc(-48% + ${ay.toFixed(1)}px), 0) rotate(${ar.toFixed(2)}deg)`;

        // Glow aura brightens as the cursor nears the astronaut (center of the stage).
        const dist = Math.sqrt(mx * mx + my * my);
        const glowScale = 1 + (1 - Math.min(dist, 1)) * 0.15;
        astro.style.setProperty("--aura-boost", glowScale.toFixed(3));

        // Background parallax — only when the eased cursor moved enough to matter,
        // so idle frames cost nothing. Opposite direction, depth-scaled. Held off for
        // the first ~1.6s so the CSS load-intro (Earth rise) can play uninterrupted.
        if (el > 1.6 && (Math.abs(mx - lpx) > 0.002 || Math.abs(my - lpy) > 0.002)) {
          lpx = mx; lpy = my;
          if (earth) earth.style.transform = `translate3d(calc(-50% + ${(-mx * 9).toFixed(1)}px), ${(-my * 6).toFixed(1)}px, 0)`;
          if (rings) rings.style.transform = `translate3d(${(-mx * 15).toFixed(1)}px, ${(-my * 10).toFixed(1)}px, 0)`;
          if (beam)  beam.style.transform  = `translate3d(calc(-50% + ${(-mx * 7).toFixed(1)}px), ${(-my * 5).toFixed(1)}px, 0)`;
          if (glow)  glow.style.transform  = `translate3d(${(-mx * 5).toFixed(1)}px, ${(-my * 4).toFixed(1)}px, 0)`;
          // Cosmos drifts against the cursor (deep parallax); equations drift with it.
          if (cosmos) cosmos.style.transform = `translate3d(${(-mx * 22).toFixed(1)}px, ${(-my * 15).toFixed(1)}px, 0)`;
          if (eqns)   eqns.style.transform   = `translate3d(${(mx * 12).toFixed(1)}px, ${(my * 9).toFixed(1)}px, 0)`;
        }
      }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", settle, { passive: true });
    document.addEventListener("pointerleave", settle);
    document.addEventListener("mouseleave", settle);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      else if (!raf) raf = requestAnimationFrame(loop);
    });
    raf = requestAnimationFrame(loop);
  }

  /* -------------------------------------------------------------------
     Toast
     ------------------------------------------------------------------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("on"), 2000);
  }

  /* -------------------------------------------------------------------
     Copy to clipboard (email chips + copy buttons)
     ------------------------------------------------------------------- */
  function initCopy() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".js-copy-btn");
      if (!btn) return;
      e.preventDefault();
      const text = btn.dataset.copy || "";
      if (!text) return;
      copyText(text).finally(() => toast("Copied · " + text));
    });
    // Also allow modifier-click on the email link to copy
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a.js-copy");
      if (!a) return;
      if (!(e.altKey || e.metaKey)) return;
      e.preventDefault();
      const text = a.dataset.copy || "";
      if (!text) return;
      copyText(text).finally(() => toast("Copied · " + text));
    });
  }
  function copyText(text) {
    // Try clipboard API first; fall back to execCommand on any failure
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(() => execCopy(text));
    }
    return execCopy(text);
  }
  function execCopy(text) {
    return new Promise((res) => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta); res();
    });
  }

  /* -------------------------------------------------------------------
     Signup — carry the typed email into the Google Form.
     The form has a real "Email (School)" text field (entry.624766096); we
     prefill it so a submitted address actually lands in the form instead of
     opening a blank one. Native validation gates empty/invalid input; the
     <form method=get action=viewform> is a no-JS fallback that prefills too.
     ------------------------------------------------------------------- */
  const SIGNUP_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSdN1lY5leFFF1xiokBPWNjmFCU14EdVnXaPRvGqAHnIF_3uSw/viewform";
  const SIGNUP_EMAIL_ENTRY = "entry.624766096";
  function initSignup() {
    const form = $("#emailSignup");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      const input = $(".signup__input", form);
      // Let the browser show its native error for empty/invalid emails.
      if (!form.checkValidity()) return;
      const email = (input.value || "").trim();
      e.preventDefault();
      const url = SIGNUP_FORM + "?usp=pp_url&" + SIGNUP_EMAIL_ENTRY + "=" + encodeURIComponent(email);
      window.open(url, "_blank", "noopener");
      toast("Opening sign-up · " + email);
      input.value = "";
      input.blur();
    });
  }

  /* -------------------------------------------------------------------
     Render - Year arc
     ------------------------------------------------------------------- */
  function renderArc() {
    const t = $("#arcTrack");
    if (!t) return;
    MEETINGS.forEach((m) => {
      t.appendChild(el("div", "arc-node",
        `<span class="arc-node__n">${pad(m.n)}</span><span class="arc-node__t">${m.short}</span>`));
    });
  }

  /* -------------------------------------------------------------------
     Render - Meetings (index + grid). Whole card opens the modal.
     ------------------------------------------------------------------- */
  function renderMeetings() {
    const idx = $("#meetingsIndex");
    if (idx) {
      MEETINGS.forEach((m) => {
        const a = el("a", "mi-item");
        a.href = `#meeting-${m.n}`;
        a.innerHTML = `<span class="mi-item__n">${pad(m.n)}</span><span class="mi-item__t">${m.short}</span>`;
        idx.appendChild(a);
      });
    }
    const grid = $("#meetingsGrid");
    if (!grid) return;
    MEETINGS.forEach((m, i) => {
      const card = el("article", "mcard reveal");
      card.id = `meeting-${m.n}`;
      card.style.setProperty("--i", Math.min(i, 3));
      card.dataset.mn = String(m.n);
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Preview Meeting ${m.n}: ${m.title}`);
      card.innerHTML = `
        <div class="mcard__head">
          <span class="mcard__no">${pad(m.n)}</span>
          <span class="mcard__kind">${m.kind}</span>
        </div>
        <div class="mcard__thumb"><img src="${deckThumb(m.n)}" alt="Title slide, Meeting ${m.n}: ${m.title}" loading="lazy" width="640" height="400"></div>
        <div class="mcard__body">
          <h3 class="mcard__title">${m.title}</h3>
          <p class="mcard__sum">${m.summary}</p>
          <div class="mcard__topics">${m.topics.map((x) => `<span class="chip">${x}</span>`).join("")}</div>
          <div class="mcard__cta">
            <span>Preview deck</span>
            <span class="mcard__cta-arw" aria-hidden="true">↗</span>
          </div>
        </div>`;
      grid.appendChild(card);
    });
    initSpotlight($$(".mcard", grid));
    // Click / keyboard opens modal
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".mcard"); if (!card) return;
      openMeetingModal(parseInt(card.dataset.mn, 10));
    });
    grid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".mcard"); if (!card) return;
      e.preventDefault();
      openMeetingModal(parseInt(card.dataset.mn, 10));
    });
  }

  /* -------------------------------------------------------------------
     Meeting modal
     ------------------------------------------------------------------- */
  let lastFocus = null;
  function openMeetingModal(n) {
    const m = MEETINGS.find((x) => x.n === n); if (!m) return;
    const modal = $("#meetingModal"); if (!modal) return;
    lastFocus = document.activeElement;

    $("#modalEyebrow").textContent = `Meeting № ${pad(m.n)} · ${m.kind}`;
    $("#modalTitle").textContent = m.title;
    $("#modalSum").textContent = m.summary;

    const topics = $("#modalTopics");
    topics.innerHTML = m.topics.map((x) => `<span class="chip">${x}</span>`).join("");

    // Preview: large deck-cover thumbnail + supporting note thumbs
    const thumbs = $("#modalThumbs");
    thumbs.innerHTML = "";
    const heroWrap = el("div", "mt mt--hero");
    heroWrap.innerHTML = `
      <span class="mt__n">Deck cover</span>
      <img src="${deckThumb(m.n)}" alt="Cover slide, Meeting ${m.n}: ${m.title}" loading="lazy" />
    `;
    thumbs.appendChild(heroWrap);
    // Show 1st page of any lecture-note handout as supporting preview
    const noteId = m.notes[0];
    if (noteId) {
      const nWrap = el("div", "mt");
      nWrap.innerHTML = `
        <span class="mt__n">Handout · pg 1</span>
        <img src="${noteThumb(noteId)}" alt="First page of the meeting handout" loading="lazy" />
      `;
      thumbs.appendChild(nWrap);
    }

    const primary = $("#modalPrimary");
    const secondary = $("#modalSecondary");
    const primaryNoteId = m.notes[0];
    primary.href = notePath(primaryNoteId);
    primary.setAttribute("download", dlName(primaryNoteId));
    primary.querySelector("span").textContent = m.notes.length > 1 ? `Open lecture notes · ${m.notes.length} files` : "Open lecture notes";
    secondary.href = SLIDES(m.slides);

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const closeBtn = modal.querySelector(".modal__close");
    if (closeBtn) closeBtn.focus();
  }
  function closeMeetingModal() {
    const modal = $("#meetingModal"); if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function initModal() {
    const modal = $("#meetingModal"); if (!modal) return;
    modal.addEventListener("click", (e) => {
      if (e.target.matches("[data-close]") || e.target.closest("[data-close]")) closeMeetingModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeMeetingModal();
    });
  }

  /* -------------------------------------------------------------------
     Render - Notes (with topic cloud from parent meeting)
     ------------------------------------------------------------------- */
  const FILTERS = [
    { key: "all", label: "All · 16" },
    { key: "notes", label: "Lecture Notes · 11" },
    { key: "practice", label: "Worksheets · 3" },
    { key: "keys", label: "Answer Keys · 2" },
  ];

  function topicsForNote(id) {
    const nd = NOTES[id]; if (!nd) return [];
    const m = MEETINGS.find((x) => x.n === nd.meeting);
    return m ? m.topics : [];
  }

  function renderNotes() {
    const grid = $("#notesGrid");
    const bar = $("#notesFilter");
    if (!grid) return;
    Object.keys(NOTES).map(Number).sort((a, b) => a - b).forEach((id, i) => {
      const nd = NOTES[id];
      const topics = topicsForNote(id);
      const a = el("a", "ncard reveal");
      a.href = notePath(id); a.setAttribute("download", dlName(id));
      a.dataset.cat = nd.cat; a.style.setProperty("--i", Math.min(i, 5));
      a.setAttribute("data-cursor", "DOWNLOAD");
      a.setAttribute("aria-label", `${nd.title}, ${nd.type}, Meeting ${nd.meeting}, ${nd.pages} page${nd.pages > 1 ? "s" : ""} (PDF)`);
      a.innerHTML = `
        <div class="ncard__thumb">
          <div class="ncard__mbadge"><span class="ncard__mbadge-k">Meeting</span><span class="ncard__mbadge-v">${pad(nd.meeting)}</span></div>
          <span class="ncard__type" data-type="${nd.type}">${nd.type}</span>
          <img src="${noteThumb(id)}" alt="First page of ${nd.title}" loading="lazy" width="340" height="440">
          <div class="ncard__cloud" aria-hidden="true">
            <span class="ncard__cloud-k">Topics inside</span>
            <div class="ncard__cloud-list">${topics.map((x) => `<span class="chip">${x}</span>`).join("")}</div>
          </div>
        </div>
        <div class="ncard__body">
          <h3 class="ncard__title">${nd.title}</h3>
          <p class="ncard__meta"><span>${nd.pages}p · LaTeX</span><span class="ncard__open">Open ${IC_OPEN}</span></p>
        </div>`;
      grid.appendChild(a);
    });
    if (bar) {
      FILTERS.forEach((f, i) => {
        const b = el("button", "fbtn" + (i === 0 ? " active" : ""), f.label);
        b.dataset.key = f.key;
        b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
        b.addEventListener("click", () => {
          bar.querySelectorAll(".fbtn").forEach((x) => { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); });
          b.classList.add("active"); b.setAttribute("aria-pressed", "true");
          grid.querySelectorAll(".ncard").forEach((c) => { c.style.display = (f.key === "all" || c.dataset.cat === f.key) ? "" : "none"; });
        });
        bar.appendChild(b);
      });
    }
    initSpotlight($$(".ncard", grid));
  }

  /* -------------------------------------------------------------------
     Render - Team (polished grid)
     ------------------------------------------------------------------- */
  function renderTeam() {
    const grid = $("#teamGrid");
    if (grid) {
      OFFICERS.forEach((o, i) => {
        const initials = o.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
        const li = el("article", "tcard reveal");
        li.style.setProperty("--i", i);
        const portrait = o.photo
          ? `<img src="${o.photo}" alt="Portrait of ${o.name}" loading="lazy">`
          : `<span class="tcard__initials" aria-hidden="true">${initials}</span>`;
        li.innerHTML = `
          <div class="tcard__portrait">${portrait}</div>
          <div class="tcard__body">
            <span class="tcard__badge">Officer · ${pad(i + 1)}</span>
            <h3 class="tcard__name">${o.name}</h3>
            <span class="tcard__role">${o.role}</span>
            <p class="tcard__bio">${o.bio || ""}</p>
            ${o.email ? `<a class="tcard__mail js-copy" href="mailto:${o.email}" data-copy="${o.email}">${o.email}</a>` : ""}
          </div>`;
        grid.appendChild(li);
      });
    }
  }

  /* -------------------------------------------------------------------
     Ticker (nav)
     ------------------------------------------------------------------- */
  function renderTicker() {
    const node = $("#ticker");
    if (!node) return;
    const items = MEETINGS.map((m) => `<b>${m.short}</b>`).join(" · ");
    node.innerHTML = items + " · " + items;
  }

  /* -------------------------------------------------------------------
     Reveal
     ------------------------------------------------------------------- */
  let revealIO;
  function initReveal() {
    const observe = (nodes) => {
      if (REDUCED || !("IntersectionObserver" in window)) {
        nodes.forEach((n) => n.classList.add("is-visible"));
        return;
      }
      if (!revealIO) revealIO = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); revealIO.unobserve(e.target); } });
      }, { threshold: 0.06, rootMargin: "0px 0px -4% 0px" });
      nodes.forEach((n) => revealIO.observe(n));
    };
    observe($$(".reveal"));
    observe($$(".section-in"));
    window.__astroObserveReveals = () => { observe($$(".reveal:not(.is-visible)")); observe($$(".section-in:not(.is-visible)")); };
  }

  /* -------------------------------------------------------------------
     Scroll spy for nav (highlights section as user scrolls a chapter)
     ------------------------------------------------------------------- */
  function initScrollSpy() {
    // Not much use in a hash-router SPA where whole routes swap; kept for future in-page anchors.
  }

  /* -------------------------------------------------------------------
     Back to top
     ------------------------------------------------------------------- */
  function initBackTop() {
    const btn = $("#backTop");
    if (!btn) return;
    let ticking = false;
    function update() {
      btn.classList.toggle("on", window.scrollY > 480);
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
    });
  }

  /* -------------------------------------------------------------------
     Router
     ------------------------------------------------------------------- */
  let currentRoute = null;
  let transitioning = false;
  function normalizeRoute(hash) {
    let h = (hash || "").replace(/^#/, "");
    if (!h || h === "/") return "/";
    if (h.startsWith("meeting-")) return "/meetings";
    if (h.startsWith("/")) return ROUTES.includes(h) ? h : "/";
    return "/";
  }

  function playChapter(routeEl) {
    const splits = $$(".split-chars", routeEl);
    splits.forEach((n) => {
      if (!n.dataset.split) { splitLine(n); n.dataset.split = "1"; }
      n.classList.remove("is-in");
      requestAnimationFrame(() => requestAnimationFrame(() => n.classList.add("is-in")));
      setTimeout(() => n.classList.add("is-in"), 500);
    });
    $$(".odom[data-count]", routeEl).forEach((n) => {
      const target = parseInt(n.dataset.count, 10);
      setTimeout(() => odometer(n, target), 200);
    });
    if (window.__astroObserveReveals) window.__astroObserveReveals();
  }

  function activateRoute(route, opts = {}) {
    const target = document.querySelector(`.route[data-route="${route}"]`);
    if (!target) return;
    // Drive the per-route ambient colour zone + nebula texture (see CSS
    // body[data-route="…"] rules). Set on <body> so the fixed backdrop layers,
    // which live outside the route sections, can react to the active route.
    document.body.setAttribute("data-route", route);
    $$(".nav__links a, .footer__nav a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("data-route") === route);
    });
    $$(".route").forEach((r) => r.classList.remove("active", "enter"));
    target.classList.add("active");
    target.classList.add("enter");
    window.scrollTo({ top: 0, behavior: opts.instant ? "auto" : "auto" });
    currentRoute = route;
    playChapter(target);
    const raw = (location.hash || "").replace(/^#/, "");
    if (raw.startsWith("meeting-")) {
      const idEl = document.getElementById(raw);
      if (idEl) setTimeout(() => idEl.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
    }
  }

  /* One continuous hyperspace jump (~1.35s):
       0 – 550ms   accelerate: stars elongate into streaks WHILE the current page fades out
       ~540ms      swap the route at peak warp (hidden behind the streaks + bloom)
       540 – 1290  decelerate: streaks compress back to dots WHILE the new page fades in   */
  const WARP_TOTAL = 1350;
  const WARP_SWAP = 540;
  // Tablet (iPad) light-speed jump timing.
  const WARP_TOUCH_TOTAL = 1050;
  const WARP_TOUCH_SWAP = 430;
  // Phones: a fast, overlay-free cross-fade. No streak overlay/bloom — navigation is
  // where a low-memory iPhone crashes, so the transition adds zero extra layers.
  const WARP_PHONE_TOTAL = 560;
  const WARP_PHONE_SWAP = 210;

  // Spawn a transient light-speed streak overlay (radial lines + tunnel vignette)
  // for one route jump on touch, then remove it. This is the mobile stand-in for
  // the desktop canvas warp: same look, but it exists only for ~1s per navigation
  // and leaves zero always-on GPU/memory cost behind.
  // Light-speed streak overlay for one route jump. A single UNIFORM veil (fades in,
  // holds, fades out) covers the bright sky during the swap so there's no harsh
  // lighting flash, with bright streaks radiating over it. Tablet/desktop-touch only
  // — phones skip it (see navigate) because the overlay is what tips a low-memory
  // iPhone over the edge during navigation.
  function warpJump(dur) {
    const box = el("div", "warp-intro warp-intro--jump");
    box.setAttribute("aria-hidden", "true");
    fillWarpLines(box, 26);
    document.body.appendChild(box);
    requestAnimationFrame(() => box.classList.add("show"));
    setTimeout(() => box.classList.remove("show"), Math.max(0, dur - 280));
    setTimeout(() => { if (box.parentNode) box.remove(); }, dur + 140);
  }

  function navigate(route, opts = {}) {
    if (transitioning) return;
    if (route === currentRoute) return;
    if (REDUCED) { activateRoute(route, { instant: true }); location.hash = route === "/" ? "/" : route; return; }

    // Touch devices. Tablets (iPad) get the light-speed streak overlay; phones get a
    // clean, overlay-free cross-fade (navigation is where a low-memory iPhone crashes,
    // so we add ZERO extra layers there). No bloom on either — that flash, plus the
    // old vignette, was the "weird lighting change". Routes just cross-fade underneath.
    if (COARSE) {
      transitioning = true;
      const current = $(".route.active");
      const phone = window.innerWidth <= 640;
      const swap = phone ? WARP_PHONE_SWAP : WARP_TOUCH_SWAP;
      const total = phone ? WARP_PHONE_TOTAL : WARP_TOUCH_TOTAL;
      if (!phone) warpJump(total);
      // Force the leave fade to commit before the hamburger close() mutates the fixed
      // nav overlay in the same tick (WebKit would otherwise coalesce them and skip
      // the fade). Plain timers drive the swap so navigation always completes.
      if (current) { current.classList.add("warp-out-touch"); void current.offsetHeight; }
      setTimeout(() => {
        if (current) current.classList.remove("warp-out-touch");
        activateRoute(route, opts);
        const target = $(".route.active");
        if (target) {
          target.classList.add("warp-in-touch");
          setTimeout(() => target.classList.remove("warp-in-touch"), 700);
        }
        location.hash = route === "/" ? "/" : route;
      }, swap);
      setTimeout(() => { transitioning = false; }, total);
      return;
    }

    // Desktop (fine pointer) keeps the full light-speed canvas warp.
    transitioning = true;
    const current = $(".route.active");
    const bloom = $("#warpBloom");
    // Kick off the canvas warp for the full duration and start the exit fade together.
    if (window.__warp) window.__warp(WARP_TOTAL);
    if (current) current.classList.add("warp-out");
    // Bloom flashes as the streaks reach peak length, masking the content swap.
    if (bloom) {
      setTimeout(() => bloom.classList.add("on"), WARP_SWAP - 140);
      setTimeout(() => bloom.classList.remove("on"), WARP_SWAP + 380);
    }
    // Swap at peak warp, then fade the incoming page in as the streaks decelerate.
    setTimeout(() => {
      if (current) current.classList.remove("warp-out");
      activateRoute(route, opts);
      const target = $(".route.active");
      if (target) {
        target.classList.add("warp-in");
        setTimeout(() => target.classList.remove("warp-in"), 820);
      }
      location.hash = route === "/" ? "/" : route;
    }, WARP_SWAP);
    setTimeout(() => { transitioning = false; }, WARP_TOTAL);
  }

  function initRouter() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-route]");
      if (!a) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
      const r = a.getAttribute("data-route");
      if (!ROUTES.includes(r)) return;
      e.preventDefault();
      navigate(r);
    });
    window.addEventListener("hashchange", () => {
      const r = normalizeRoute(location.hash);
      if (r !== currentRoute) activateRoute(r);
    });
    const initial = normalizeRoute(location.hash);
    activateRoute(initial, { instant: true });
  }

  /* -------------------------------------------------------------------
     Nav basics
     ------------------------------------------------------------------- */
  function initNav() {
    const nav = $("#nav"), links = $("#navLinks"), toggle = $("#navToggle");
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => { nav.classList.toggle("scrolled", window.scrollY > 16); ticking = false; });
    }, { passive: true });
    nav.classList.toggle("scrolled", window.scrollY > 16);
    const close = () => { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); };
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* -------------------------------------------------------------------
     Starfield (with scroll parallax)
     ------------------------------------------------------------------- */
  function initStars() {
    const canvas = $("#stars");
    if (!canvas) return;
    // Touch devices: drop the warp canvas entirely. A full-viewport, DPR-scaled
    // canvas is a heavy, always-on GPU/memory cost on phones (a crash factor); the
    // nebula texture + colour zones carry the backdrop, and touch gets its own CSS
    // light-speed streaks (warpJump). Desktop keeps the canvas for the warp streaks.
    if (COARSE) { canvas.remove(); return; }
    const ctx = canvas.getContext("2d");
    let w, h, dpr, stars = [], raf = null, scrollY = window.scrollY, shoot = null, shootTimer = 260;
    let warp = 0;

    window.__warp = function (duration) {
      duration = duration || 1350;
      const start = performance.now();
      const peakIn = 0.4, peakOut = 0.6;   // accelerate to 40%, hold, decelerate from 60%
      const smooth = (x) => x * x * (3 - 2 * x); // smoothstep for eased ramp/decay
      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        if (t < peakIn) warp = smooth(t / peakIn);
        else if (t < peakOut) warp = 1;
        else warp = smooth(Math.max(0, (1 - t) / (1 - peakOut)));
        if (t < 1) requestAnimationFrame(step); else warp = 0;
      }
      requestAnimationFrame(step);
    };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = Math.min(w * h / 8500, w < 700 ? 100 : 260);
      stars = [];
      for (let i = 0; i < density; i++) stars.push({
        x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.1 + 0.2,
        a: Math.random() * 0.45 + 0.25, tw: Math.random() * 0.018 + 0.003, ph: Math.random() * 6.28,
        depth: Math.random() * 0.75 + 0.15, bright: Math.random() > 0.94,
      });
    }
    function star(s, alpha) {
      // Parallax: shift by scroll * depth
      const yy = (((s.y - scrollY * s.depth * 0.28) % h) + h) % h;
      ctx.globalAlpha = alpha; ctx.beginPath(); ctx.arc(s.x, yy, s.r, 0, 6.2832);
      ctx.fillStyle = s.bright ? "#DDEAFF" : "#F1F4FA"; ctx.fill();
      if (s.bright) { ctx.globalAlpha = alpha * 0.45; ctx.beginPath(); ctx.arc(s.x, yy, s.r * 3, 0, 6.2832); ctx.fillStyle = "rgba(200,220,255,.6)"; ctx.fill(); }
    }
    function drawWarp() {
      const cx = w / 2, cy = h / 2;
      const glowAlpha = 0.08 + warp * 0.22;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
      g.addColorStop(0, `rgba(188,215,255,${glowAlpha})`);
      g.addColorStop(0.5, `rgba(188,215,255,${glowAlpha * 0.3})`);
      g.addColorStop(1, "rgba(188,215,255,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.lineCap = "round";
      for (const s of stars) {
        const yy = (((s.y - scrollY * s.depth * 0.28) % h) + h) % h;
        const dx = s.x - cx, dy = yy - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const ux = dx / dist, uy = dy / dist;
        s.x += ux * (warp * warp) * 14;
        s.y += uy * (warp * warp) * 14;
        const len = warp * (40 + dist * 0.65);
        const alpha = 0.35 + warp * 0.55;
        ctx.strokeStyle = `rgba(220,235,255,${alpha})`;
        ctx.lineWidth = 0.9 + warp * 1.4;
        ctx.beginPath();
        ctx.moveTo(s.x, yy);
        ctx.lineTo(s.x + ux * len, yy + uy * len);
        ctx.stroke();
        if (s.x < -60 || s.x > w + 60 || s.y < -60 || s.y > h + 60) {
          const a = Math.random() * 6.28318;
          const r = 20 + Math.random() * 120;
          s.x = cx + Math.cos(a) * r;
          s.y = cy + Math.sin(a) * r;
        }
      }
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      // The persistent starfield is gone (nebula texture + colour zones are the
      // backdrop now). This canvas is warp-only: idle frames draw nothing, and the
      // star array only seeds the light-speed streaks during a jump.
      if (warp > 0.02) drawWarp();
      ctx.globalAlpha = 1; raf = requestAnimationFrame(frame);
    }
    function statik() { ctx.clearRect(0, 0, w, h); }
    resize();
    let dt; window.addEventListener("resize", () => { clearTimeout(dt); dt = setTimeout(() => { resize(); if (REDUCED) statik(); }, 200); });
    window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });
    if (REDUCED) { statik(); return; }
    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      else if (!raf) raf = requestAnimationFrame(frame);
    });
  }

  /* -------------------------------------------------------------------
     Light-speed intro
     ------------------------------------------------------------------- */
  // Fill a box with a radial burst of "light-speed" streak lines. Shared by the
  // load intro and (on touch) the route-transition jump. Pure CSS/compositor and
  // fully transient — nothing like the always-on canvas warp that crashed mobile.
  function fillWarpLines(box, n) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "warp-line";
      s.style.setProperty("--a", (i * (360 / n)).toFixed(1) + "deg");
      s.style.setProperty("--d", (Math.floor(i / 3) * 45) + "ms");
      box.appendChild(s);
    }
  }

  function initWarpIntro() {
    const box = $("#warpIntro");
    if (!box) return;
    // Reduced-motion gets no intro. Touch KEEPS the light-speed intro — it's a
    // transient burst of compositor-only lines (gone by ~2.4s), not an always-on
    // cost, so it was never the crash. The homepage layer density is (see CSS).
    if (REDUCED) { box.remove(); return; }
    fillWarpLines(box, COARSE ? 20 : 26);
    setTimeout(() => box.classList.add("done"), 1700);
    setTimeout(() => { if (box.parentNode) box.remove(); }, 2400);
  }

  /* -------------------------------------------------------------------
     Home equations — render the data-tex spans as real LaTeX via KaTeX,
     and give each a random float vector + scale so they drift in varied
     directions on one seamless loop (fade in → drift → fade out forever).
     KaTeX is deferred in <head>; if it isn't ready yet we retry on load.
     ------------------------------------------------------------------- */
  function initHeroEquations() {
    const nodes = $$(".home__equations .eqn");
    if (!nodes.length) return;
    // Randomize drift/scale up front (independent of KaTeX being ready) so the
    // float animation is varied even before/without the math rendering.
    nodes.forEach((n) => {
      if (n.dataset.floated) return;
      n.dataset.floated = "1";
      const dx = (Math.random() * 90 - 45).toFixed(0);
      const dy = (Math.random() * 90 - 45).toFixed(0);
      const sc = (0.62 + Math.random() * 0.5).toFixed(2);
      const op = (0.34 + Math.random() * 0.24).toFixed(2);
      n.style.setProperty("--dx", dx + "px");
      n.style.setProperty("--dy", dy + "px");
      n.style.setProperty("--sc", sc);
      n.style.setProperty("--op", op);
    });
    const render = () => {
      if (!window.katex) return false;
      nodes.forEach((n) => {
        if (n.dataset.rendered) return;
        const tex = n.getAttribute("data-tex");
        if (!tex) return;
        try {
          window.katex.render(tex, n, { throwOnError: false, displayMode: false, output: "html" });
          n.dataset.rendered = "1";
        } catch (e) { /* leave the span empty on parse failure */ }
      });
      return true;
    };
    if (!render()) window.addEventListener("load", render, { once: true });
  }

  /* -------------------------------------------------------------------
     Ambient particles — sparse drifting specks on every route so inner
     pages share the hero's depth (not a flat black void).
     ------------------------------------------------------------------- */
  function initAmbientParticles() {
    if (REDUCED) return;
    const c = el("div", "ambient-particles");
    c.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("span");
      p.style.cssText =
        `left:${(Math.random() * 100).toFixed(1)}%;` +
        `--s:${(0.55 + Math.random() * 0.9).toFixed(2)};` +
        `--d:${(Math.random() * 26).toFixed(1)}s;` +
        `--dur:${(22 + Math.random() * 14).toFixed(1)}s;` +
        `--drift:${(Math.random() * 40 - 20).toFixed(0)}px;`;
      c.appendChild(p);
    }
    document.body.appendChild(c);
  }

  /* -------------------------------------------------------------------
     Space figures — feathered nebula/galaxy orbs placed through the site,
     scrolling WITH the page and parallaxing slightly slower than content.
     One shared scroll rAF drives all of them (transform only, compositor).
     Skipped entirely on phones (≤640) and reduced-motion — extra decoded
     image layers are exactly what crashes a low-memory iPhone.
     ------------------------------------------------------------------- */
  function initSpaceFigures() {
    if (REDUCED) return;
    // [image, top%, side, offset%, max-vw size, parallax speed]
    const PLACEMENT = {
      "/":         [["pleiades", 12, "left", 3, 30, 0.10]],
      "/about":    [["andromeda", 15, "left", 3, 27, 0.15], ["whirlpool", 62, "right", 4, 24, 0.09]],
      "/meetings": [["pillars", 13, "right", 3, 25, 0.13], ["orion", 60, "left", 4, 27, 0.08]],
      "/notes":    [["cliffs", 15, "left", 3, 26, 0.14], ["ring", 64, "right", 5, 22, 0.10]],
      "/team":     [["helix", 18, "right", 4, 25, 0.12]],
      "/join":     [["tarantula", 16, "left", 4, 26, 0.11]],
    };
    const figs = [];
    Object.keys(PLACEMENT).forEach((route) => {
      const sec = document.querySelector(`.route[data-route="${route}"]`);
      if (!sec) return;
      PLACEMENT[route].forEach(([img, top, side, off, vw, speed]) => {
        const d = el("div", "space-fig");
        // position/z-index inline so they win over the `.route > *` content rule
        // (which is position:relative z-index:1) — otherwise figures flow inline and
        // shove the page content down instead of sitting absolutely behind it.
        d.style.cssText = `position:absolute; z-index:0; top:${top}%; ${side}:${off}%; width:clamp(190px, ${vw}vw, 400px); background-image:url("assets/bg/fig-${img}.jpg");`;
        d.dataset.sp = speed;
        sec.insertBefore(d, sec.firstChild);
        figs.push(d);
      });
    });
    // Parallax only where the figures actually show (>640px). Phones keep them
    // display:none (see CSS) — no decode, no scroll work — so the tab stays light.
    if (!figs.length || !window.matchMedia("(min-width:641px)").matches) return;
    let ticking = false;
    const apply = () => {
      const y = window.scrollY;
      for (const d of figs) d.style.transform = `translate3d(0, ${(y * +d.dataset.sp).toFixed(1)}px, 0)`;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (ticking) return; ticking = true; requestAnimationFrame(apply);
    }, { passive: true });
  }

  /* -------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------- */
  function boot() {
    // First-load cinematic sequence (CSS-driven). Class is removed after the
    // sequence so it never replays on SPA route re-entry.
    if (!REDUCED) {
      document.body.classList.add("intro");
      setTimeout(() => document.body.classList.remove("intro"), 2400);
    }
    renderArc();
    renderMeetings();
    renderNotes();
    renderTeam();
    renderTicker();
    initHeroEquations();
    initAmbientParticles();
    // Cursor spotlight on the plainer inner-route cards too (meeting cards get it
    // inside renderMeetings). Notes/team keep their own richer hover treatments.
    initSpotlight($$(".arc-node"));
    initSpotlight($$(".goal"));
    initNav();
    initStars();
    initReveal();
    initCursor();
    initMagnetic();
    initModal();
    initCopy();
    initSignup();
    initBackTop();
    initScrollSpy();
    initHeroInteractions();
    initRouter();
    initWarpIntro();
    initSpaceFigures();
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
