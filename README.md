# PERJUANGAN — Peta Perjuangan
### v2.0 · Road to Merdeka (entrance flow + mission map shell)

A cinematic, single-page entrance flow and campaign mission map for an
Indonesian-independence-themed game shell. This build implements **only**:

1. Entrance 1 (flag splash) → Entrance 2 (credits) → Main Map
2. The **Peta Perjuangan** mission map (5-node campaign chain)

Stage gameplay is intentionally **not** implemented — "Mulai Misi" opens a
polished placeholder and calls a stub hook, as scoped.

---

## 1. How to run

No build step, no dependencies to install — it's plain HTML/CSS/JS.

**Easiest:** double-click `index.html` to open it directly in a browser.

**Recommended (avoids any local-file quirks, e.g. Safari's stricter file://
security):** serve the folder with any static server, for example:

```bash
cd perjuangan
python3 -m http.server 8080
# then open http://localhost:8080 in your browser
```

or, with Node installed:

```bash
npx serve .
```

Tested against modern evergreen browsers (Chrome, Edge, Firefox, Safari).
Requires internet access only to load the Google Fonts (Cinzel, Special
Elite, Inter) — the page still works without it, using system font
fallbacks.

---

## 2. File structure

```
perjuangan/
├── index.html        entrance markup + mission map DOM
├── style.css          all styling, design tokens, responsive rules
├── js/
│   ├── data.js         mission data (the single source of truth)
│   ├── flag.js          cloth-simulated flag (Canvas 2D mesh grid)
│   ├── modal.js         themed confirm/info modal helper
│   ├── map.js            route rendering, node states, panel, progress, hooks
│   └── main.js            screen-flow orchestration, entrance timing, dev toggle
└── README.md
```

---

## 3. Where the future-stage hooks are

Both hooks live in `js/map.js` and are attached to `window`, so real stage
code can call them from anywhere once it's built:

```js
// Called when the player taps "MULAI MISI" on an unlocked node.
// Currently: shows an elegant "coming soon" placeholder modal + logs a stub.
// Replace the body of this function with real stage-launch logic later.
window.startMission(stageId)

// Call this when a stage's real gameplay is completed, to unlock the next
// node, persist progress, and refresh the map UI.
window.markMissionComplete(stageId)
```

`stageId` is one of: `"sumpah-pemuda"`, `"rengasdengklok"`, `"proklamasi"`,
`"surabaya"`, `"agresi-gerilya"` (see `js/data.js`).

---

## 4. Progress persistence & unlock chain

- Progress is stored in `localStorage` under the key `perjuangan_v2_progress`
  as a JSON array of completed mission ids.
- Mission 1 is always available. Mission *n* unlocks only once mission
  *n − 1* is marked complete.
- **Reset Progres** (top-right of the map header) clears all progress after
  a themed confirmation dialog.
- **Hidden dev control**, for testing the unlock chain without real stage
  gameplay: press **Ctrl+Shift+D** to toggle dev mode. While active, a
  small "Tandai selesai (dev)" button appears in the detail panel for any
  unlocked, incomplete mission — clicking it calls
  `markMissionComplete(stageId)` directly.

---

## 5. Notable implementation details

- **Flag cloth animation** (`js/flag.js`): a 16×10 Canvas 2D mesh grid
  (reduced to 10×6 on mobile), pole pinned / free edge waving, a primary
  slow wave plus a faster secondary ripple, both damped by distance from
  the pole, a subtle 1.6° whole-flag sway, per-quad fold shading derived
  from local slope, and a soft blurred shadow. Runs at the display's
  refresh rate via `requestAnimationFrame` and stops cleanly once the user
  advances past Entrance 1.
- **Mission route**: a Catmull-Rom-to-Bezier spline is generated at
  runtime from the mission coordinates in `data.js`, so the route and the
  node positions always stay perfectly aligned, including on resize.
- **Detail panel**: slides in from the right on desktop, and becomes a
  bottom sheet on mobile (breakpoint at 720px).
- Respects `prefers-reduced-motion` by disabling ambient pulse/sway
  animation and shortening transitions.
