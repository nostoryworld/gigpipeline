---
doc: spec
status: draft
---

# GigPipeline — Technical Spec

Source: `prd.md` (all sections). POC boundary: `scope.md > The POC Boundary`.

## Architecture
Single static web app: one `index.html`, one `styles.css`, one `app.js`. No build step, no dependencies, no backend. Runs from `file://`, any static host, or Cloudflare Workers Static Assets. This keeps the 2–4h build target and makes the demo video trivially recordable.

## Data Model
```js
// localStorage key: "gigpipeline.v1" -> { cards: Card[], seeded: true }
Card = {
  id: string,          // crypto.randomUUID()
  title: string,       // required
  platform: "ugig" | "termix" | "superteam" | "other",  // required
  bid: number,         // required, > 0
  currency: "USD" | "AUD" | "SOL" | "USDC",  // default USD
  deadline: string | null,  // ISO date "2026-10-22"
  notes: string,
  stage: "applied" | "messaged" | "trial" | "submitted" | "paid" | "dead",
  createdAt: number
}
```

## Currency Conversion (display only)
Fixed approximate rates, shown in footer: `RATES = { USD: 1, USDC: 1, AUD: 0.65, SOL: 140 }`. Column total = Σ bid × rate, formatted `$1,240`. Rates are clearly labeled approximate — no live price feeds in the PoC.

## Key Behaviors
- **Render**: `render()` rebuilds columns from state; called after every mutation. Totals computed in the same pass.
- **Drag-and-drop**: HTML5 drag events on desktop; on touch, each card gets a "Move ▸" menu in the edit modal listing the six stages (avoids fragile touch-drag polyfills).
- **Deadlines**: `daysUntil(deadline)`; ≤2 days → `.urgent` (amber glow); <0 → `.overdue` (red). Relative label via `Intl`-free helper ("today", "tomorrow", "in 3d", "2d overdue").
- **Persistence**: `save()` writes the whole state on every mutation; `load()` on boot; seed on first run (`seeded` flag).
- **Seed data**: 8 cards reflecting his real pipeline (2hives trial — Trial, $30 AUD; ugig research briefs/code review/API adapter/automation — Applied with real bids; one Messaged: flapjaxculture). Footer "Reset demo data" clears storage and reseeds.

## Look and Feel (implementable)
- Dark theme: bg `#0f1419`, cards `#1a2230`, borders `#2a3444`; accent green `#22c55e`; amber `#f59e0b`; red `#ef4444`.
- System font stack; tabular numbers for totals (`font-variant-numeric: tabular-nums`).
- Columns: horizontal scroll-snap on mobile (`overflow-x: auto`), grid on desktop.
- Card: compact, 3-line max; platform as small pill; bid bold.

## Files
- `index.html` — structure, modal, footer.
- `styles.css` — theme, board, cards, modal, urgency glows.
- `app.js` — state, render, DnD, modal, seed, persistence (~300 lines).
- `devpost/` — learner-profile.md, scope.md, prd.md, spec.md (planning docs, required in repo).
- `.gitignore` — `devpost/learner-profile.md` (personal context stays out of the public repo).

## Testing (manual, per 5-build)
1. Add gig → appears in Applied, totals update. 2. Drag applied→trial → totals move. 3. Reload → persists. 4. Set deadline tomorrow → amber glow. 5. Set deadline yesterday → red overdue. 6. Delete → confirm → gone, totals update. 7. Reset demo data → seeds return.

## Deployment (for demo)
Deploy `index.html/css/js` as Cloudflare Workers static site for a public URL in the submission; the repo itself is the deliverable. Reviewers don't run code — the video shows it working.
