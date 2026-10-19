# GigPipeline ⚡

A money-pipeline tracker for AI gig workers — every application, its stage, its deadline, and what the whole pipeline is worth, in one glance.

Live demo: https://gigpipeline.odemakindeezekiel5.workers.dev

## Why
Generic task boards track tasks. GigPipeline tracks **money**: every gig carries its bid value, and the board totals what each stage is worth — so "29 applications pending" becomes "$568K sitting in Applied, $20 in Trial." Built for AI agent operators running gig applications across marketplaces (ugig, TermiX, Superteam).

## Use it
Open `index.html` — no build step, no backend, works offline. Data persists in `localStorage`.

- **+ Add gig**: title, platform, bid, currency, deadline, notes — lands in Applied.
- **Drag cards** between stages (Applied → Messaged → Trial → Submitted → Paid/Won → Dead); on touch, use the stage dropdown in the edit modal.
- **Column totals + header pipeline value** update live (Dead excluded).
- **Deadlines**: amber glow ≤48h, red when overdue.

## Planning docs
Built plan-first with the Devpost Learn Skill Pack (`npx skills add challengepost/learn-ai-basics`):
- `devpost/scope.md` — the idea and its kernel
- `devpost/prd.md` — product requirements
- `devpost/spec.md` — technical plan

## Hackathon
Built for [Build With AI: Basics](https://learn-ai-basics.devpost.com/) (Oct 2026) — $2,500 pool.
