---
doc: scope
status: draft
---

# GigPipeline

One line: a money-pipeline tracker for AI gig workers — every application, its stage, its deadline, and what the whole pipeline is worth, in one glance.

## The Unique Kernel
It's not a generic task board. It's a **money pipeline**: every gig carries its bid value, and the board totals what each stage is worth — so "29 applications pending" becomes "$1,240 sitting in Applied, $180 in Trial." For someone whose whole grind is turning applications into payouts, the pipeline value is the product.

## Who It's For
Nostoryboss — an AI agent operator applying to gigs across ugig, TermiX, and Superteam Earn. Today he tracks ~29 pending applications across platforms in his head and in chat threads; buyer messages arrive by email and get buried. He wants to know, at a glance: what did I apply to, where is each one, what's due, and what's the pipeline worth.

## The Core Loop
He opens it, sees the pipeline board (Applied → Messaged → Trial → Submitted → Paid/Won → Dead), adds a new application in 10 seconds (title, platform, bid, deadline), drags it across stages as buyers reply, and watches the totals move. He comes back whenever a buyer messages — to move the card and see the money shift.

## Inspiration & Identity
Kanban clarity (Trello-style columns), but money-first: big totals per column, green for won. Dark, compact, phone-friendly — he lives on his Android. No fluff, no onboarding tour. Energy: a cash register, not a project manager.

## Why This Matters to the Learner
"We have not made $0.1" — his words. The gig lane is his only labor-for-money channel. A pipeline he can see is a pipeline he can push.

## What "Working" Looks Like
Open the app: a board with columns and real gig cards (his actual ugig applications seeded in). Add a card, drag it from Applied to Trial, watch the column totals update. The "oh, that's cool" beat: the header total — **pipeline value** — ticking up as cards move toward Paid.

## The POC Boundary
In: add/edit/delete gig cards (title, platform, bid amount, currency, deadline, notes); six stages; drag-and-drop between stages; per-column totals + header pipeline value; deadline highlighting (due ≤48h glows); localStorage persistence; seeded with his real current applications.
Out: user accounts, backend, real marketplace API sync, notifications, mobile app.

## Later
Auto-import from ugig/TermiX/Superteam APIs; buyer-message inbox triage; deadline push reminders; payout tracking per platform.

## Explicitly Cut
- Backend/database: localStorage is enough for a PoC and keeps it demoable offline. Reason: 2–4 hour build target.
- Marketplace API sync: auth per platform is a project on its own. Reason: scope.
- Notifications: needs a backend or service worker push setup. Reason: scope.
