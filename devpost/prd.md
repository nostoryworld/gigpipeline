---
doc: prd
status: draft
---

# GigPipeline — Product Requirements

One line: a money-pipeline tracker for AI gig workers — every application, its stage, its deadline, and what the whole pipeline is worth, in one glance. For Nostoryboss, who runs ~29 gig applications across marketplaces with no single view.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`, `scope.md > The Core Loop`.

## The Core Journey
1. He opens GigPipeline on his phone. The board loads instantly with his applications already there (seeded), columns showing per-stage totals, and a header pipeline value.
2. A buyer messages about the 2hives gig — he taps the card, moves it from Applied to Trial. Column totals update; pipeline value shifts.
3. He adds a new application in 10 seconds: title, platform, bid, deadline. It lands in Applied; totals update.
4. A deadline within 48h glows amber on its card — he sees what's urgent without reading anything.
5. Success: in under a minute he knows exactly where every gig stands and what the pipeline is worth.

## Screens and Layout
Single screen, no navigation. Layout:
- **Header bar**: app name, total pipeline value (sum of all open stages), count of cards, "+ Add gig" button.
- **Board**: six horizontal columns (scrollable on phone): Applied, Messaged, Trial, Submitted, Paid/Won, Dead. Each column header shows its name, card count, and column total (sum of bids, converted roughly to USD).
- **Gig card**: title, platform tag, bid amount, deadline (amber glow if ≤48h, red if overdue), one-line note preview.
- **Add/Edit modal**: title, platform (dropdown: ugig, TermiX, Superteam, Other), bid amount + currency (USD/AUD/SOL/USDC), deadline (date), notes. Save/Cancel.
- Cards draggable between columns (touch-friendly); tap card to edit; delete inside edit modal with confirm.

## Look and Feel
Dark theme, compact, phone-first. Money-green accents for totals and Paid/Won; amber for urgent deadlines. Typography: system stack, bold numbers. No onboarding, no empty-state essays — one line ("Add your first gig") when empty. Feels like a cash register, not a project manager.

## Features and Behavior

### Board and stages
- Six fixed stages: Applied, Messaged, Trial, Submitted, Paid/Won, Dead. Cards move by drag-and-drop; on touch devices, also via a "move to" control in the edit modal.
- Per-column totals: sum of bid amounts converted to USD (SOL→USD via fixed rate shown in settings note; AUD→USD fixed rate; USDC=USD). Rates displayed once in a footer note ("Rates: SOL $X, AUD $Y — approximate").
- Header pipeline value: sum of all stages except Dead. Updates live on every change.

### Gig cards
- Fields: title (required), platform (required), bid amount (required, number), currency (USD/AUD/SOL/USDC), deadline (optional date), notes (optional text).
- Deadline display: relative ("in 3d", "tomorrow", "overdue 2d"). Amber glow ≤48h; red "overdue" past deadline. No deadline = no glow.
- Tap card → edit modal. Delete requires confirm.

### Add/edit
- "+ Add gig" opens the modal with empty fields; new cards land in Applied.
- Validation: title, platform, and bid required; bid must be a positive number.
- All changes persist to localStorage immediately; board re-renders without reload.

### Seed data
- First launch seeds ~8 real cards from his current pipeline (2hives trial in Trial; several ugig applications in Applied with real titles/bids/deadlines). A "Reset demo data" control in the footer restores seeds.

### Persistence
- Everything in localStorage under one key. No accounts, no network calls. Works offline and in a screen recording.

## Out of Scope (from scope.md)
Backend, accounts, marketplace API sync, notifications, native mobile app.

## Acceptance
- Add a gig in ≤10 seconds; it appears in Applied with correct totals.
- Drag a card to another column; column totals and header value update instantly.
- Reload the page; everything persists.
- A card due within 48h glows amber; an overdue card shows red.
- Demo-able end to end in under 60 seconds on a phone screen.
