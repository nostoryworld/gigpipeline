// GigPipeline — money-pipeline tracker for AI gig workers.
// Single-file state, localStorage persistence, no backend.

const STORE_KEY = "gigpipeline.v1";
const RATES = { USD: 1, USDC: 1, AUD: 0.65, SOL: 140 }; // approximate, display only
const STAGES = ["applied", "messaged", "trial", "submitted", "paid", "dead"];
const STAGE_NAMES = {
  applied: "Applied", messaged: "Messaged", trial: "Trial",
  submitted: "Submitted", paid: "Paid / Won", dead: "Dead"
};

let state = { cards: [], seeded: false };
let editingId = null;

const $ = (id) => document.getElementById(id);
const usd = (bid, cur) => bid * (RATES[cur] ?? 1);
const fmt$ = (n) => "$" + Math.round(n).toLocaleString("en-US");

// ---------- persistence ----------
function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}
function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) { state = JSON.parse(raw); return; }
  } catch (e) { /* corrupted -> reseed */ }
  seed();
}

// ---------- seed data (his real pipeline, Oct 2026) ----------
function seed() {
  const d = (days) => {
    const t = new Date(); t.setDate(t.getDate() + days);
    return t.toISOString().slice(0, 10);
  };
  const mk = (title, platform, bid, currency, stage, deadline, notes) => ({
    id: crypto.randomUUID(), title, platform, bid, currency, stage,
    deadline: deadline || null, notes: notes || "", createdAt: Date.now()
  });
  state = {
    seeded: true,
    cards: [
      mk("2hives — paid work packages (trial)", "ugig", 30, "AUD", "trial", d(3), "Trial task submitted, awaiting verdict"),
      mk("AI Document Contradiction Detector", "ugig", 1150, "SOL", "applied", d(2), "Bid 1,150 SOL, 48h"),
      mk("Group Chat Power Analyzer", "ugig", 2900, "SOL", "applied", d(3), "Bid 2,900 SOL, 72h"),
      mk("Speed-to-Lead workflow", "ugig", 800, "USD", "applied", d(5), "$800 / 5 days"),
      mk("Review-Request flow", "ugig", 450, "USD", "applied", d(4), "$450 / 4 days"),
      mk("REST/API adapter gig", "ugig", 149, "USD", "applied", d(2), "$149, 2–3 days"),
      mk("Python automation gig", "ugig", 55, "USD", "applied", d(1), "$55 / 48h — urgent"),
      mk("flapjaxculture follow-up", "ugig", 25, "USD", "messaged", null, "Buyer replied with process guidance")
    ]
  };
  save();
}

// ---------- deadlines ----------
function daysUntil(iso) {
  if (!iso) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dl = new Date(iso + "T00:00:00");
  return Math.round((dl - today) / 86400000);
}
function deadlineLabel(iso) {
  const n = daysUntil(iso);
  if (n === null) return "";
  if (n < 0) return `${-n}d overdue`;
  if (n === 0) return "due today";
  if (n === 1) return "due tomorrow";
  return `in ${n}d`;
}

// ---------- render ----------
function render() {
  const board = $("board");
  board.innerHTML = "";
  let pipelineTotal = 0;

  for (const stage of STAGES) {
    const cards = state.cards.filter((c) => c.stage === stage);
    const total = cards.reduce((s, c) => s + usd(c.bid, c.currency), 0);
    if (stage !== "dead") pipelineTotal += total;

    const col = document.createElement("div");
    col.className = "column";
    col.dataset.stage = stage;
    col.innerHTML = `
      <div class="col-header">
        <div class="name">${STAGE_NAMES[stage]}</div>
        <div class="meta">${cards.length} gig${cards.length === 1 ? "" : "s"} · <span class="total">${fmt$(total)}</span></div>
      </div>
      <div class="col-cards"></div>`;

    const list = col.querySelector(".col-cards");
    if (!cards.length) {
      list.innerHTML = `<div class="empty-col">—</div>`;
    }
    for (const c of cards) list.appendChild(cardEl(c));

    // desktop drag-and-drop targets
    col.addEventListener("dragover", (e) => { e.preventDefault(); col.classList.add("dragover"); });
    col.addEventListener("dragleave", () => col.classList.remove("dragover"));
    col.addEventListener("drop", (e) => {
      e.preventDefault(); col.classList.remove("dragover");
      const id = e.dataTransfer.getData("text/plain");
      moveCard(id, stage);
    });

    board.appendChild(col);
  }

  $("pipelineValue").textContent = fmt$(pipelineTotal);
  $("ratesNote").textContent = `Rates approx: 1 AUD ≈ $0.65 · 1 SOL ≈ $140 · Dead excluded`;
}

function cardEl(c) {
  const el = document.createElement("div");
  el.className = "gig-card";
  el.draggable = true;
  el.dataset.id = c.id;
  const n = daysUntil(c.deadline);
  if (n !== null && n < 0) el.classList.add("overdue");
  else if (n !== null && n <= 2) el.classList.add("urgent");

  el.innerHTML = `
    <div class="title">${escapeHtml(c.title)}</div>
    <div class="row2"><span class="pill">${c.platform}</span><span class="bid">${fmt$(usd(c.bid, c.currency))}</span></div>
    ${c.deadline ? `<div class="deadline">⏰ ${deadlineLabel(c.deadline)}</div>` : ""}`;

  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", c.id);
    el.classList.add("dragging");
  });
  el.addEventListener("dragend", () => el.classList.remove("dragging"));
  el.addEventListener("click", () => openModal(c.id));
  return el;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

// ---------- mutations ----------
function moveCard(id, stage) {
  const c = state.cards.find((x) => x.id === id);
  if (c && c.stage !== stage) { c.stage = stage; save(); render(); }
}
function upsertCard(data) {
  if (editingId) {
    const c = state.cards.find((x) => x.id === editingId);
    Object.assign(c, data);
  } else {
    state.cards.push({ id: crypto.randomUUID(), createdAt: Date.now(), stage: "applied", ...data });
  }
  save(); render();
}
function deleteCard() {
  state.cards = state.cards.filter((x) => x.id !== editingId);
  save(); render(); closeModal();
}

// ---------- modal ----------
function openModal(id) {
  editingId = id || null;
  const c = id ? state.cards.find((x) => x.id === id) : null;
  $("modalTitle").textContent = c ? "Edit gig" : "Add gig";
  $("fTitle").value = c?.title || "";
  $("fPlatform").value = c?.platform || "ugig";
  $("fStage").value = c?.stage || "applied";
  $("fBid").value = c?.bid ?? "";
  $("fCurrency").value = c?.currency || "USD";
  $("fDeadline").value = c?.deadline || "";
  $("fNotes").value = c?.notes || "";
  $("deleteBtn").classList.toggle("hidden", !c);
  $("modalOverlay").classList.remove("hidden");
  $("fTitle").focus();
}
function closeModal() {
  $("modalOverlay").classList.add("hidden");
  editingId = null;
}
function saveModal() {
  const title = $("fTitle").value.trim();
  const bid = parseFloat($("fBid").value);
  if (!title) { alert("Title is required."); return; }
  if (!(bid > 0)) { alert("Bid must be a positive number."); return; }
  upsertCard({
    title,
    platform: $("fPlatform").value,
    stage: $("fStage").value,
    bid,
    currency: $("fCurrency").value,
    deadline: $("fDeadline").value || null,
    notes: $("fNotes").value.trim()
  });
  closeModal();
}

// ---------- wire up ----------
$("addBtn").addEventListener("click", () => openModal(null));
$("cancelBtn").addEventListener("click", closeModal);
$("saveBtn").addEventListener("click", saveModal);
$("deleteBtn").addEventListener("click", () => {
  if (confirm("Delete this gig?")) deleteCard();
});
$("modalOverlay").addEventListener("click", (e) => {
  if (e.target === $("modalOverlay")) closeModal();
});
$("resetBtn").addEventListener("click", () => {
  if (confirm("Reset to demo data? Your changes will be lost.")) { seed(); render(); }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

load();
render();
