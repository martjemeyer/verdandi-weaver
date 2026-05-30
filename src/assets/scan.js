const SCANS = {
  nervous: {
    title: "Nervous System Self-Scan",
    questions: [
      { q: "Right now, where are you in your body?", hint: "There's no wrong answer. Just notice.", opts: ["I feel grounded and present", "Mostly here, a little wound up", "Above my body, in my head", "Bracing — protected", "I can't quite tell"] },
      { q: "What does your breath want?", hint: "Let it choose, don't choose for it.", opts: ["A long exhale", "A slower in-breath", "More space", "To rest", "Something else"] },
      { q: "If your body could speak in one word, what would it say?", opts: ["Tired", "Held", "Alert", "Soft", "Hungry", "Steady"] },
      { q: "What are you needing more of in the last few days?", opts: ["Quiet", "Warmth", "Movement", "Connection", "Solitude", "Less input"] },
      { q: "What are you needing less of?", opts: ["Stimulation", "Other people's needs", "Decisions", "Performance", "Effort", "Noise"] }
    ],
    close: "Thank you for staying with yourself for a few quiet minutes. There's nothing to fix in what you noticed — only to honour it."
  },
  wholeness: {
    title: "Grounded Wholeness Scan",
    questions: [
      { q: "Which part of you have you been ignoring?", opts: ["My body", "My anger", "My grief", "My softness", "My joy", "My doubt"] },
      { q: "Which part have you been overusing?", opts: ["My mind", "My capable self", "My helping self", "My quiet self", "My performing self", "My pleasing self"] },
      { q: "What would 'including everything' actually feel like?", opts: ["Relief", "Disorientation", "Permission", "Heaviness", "Lightness", "I don't know yet"] }
    ],
    close: "Wholeness is not a finish line. It's a way of being in conversation with yourself."
  },
  awakening: {
    title: "Social · Soul · Human",
    questions: [
      { q: "What kind of seeing has been opening in you lately?", opts: ["Seeing systems and what's 'off'", "Sensing meaning and connection", "Noticing my own patterns", "All three, tangled"] },
      { q: "Which one feels neglected?", opts: ["The systems view", "The soul view", "The human view"] }
    ],
    close: "These are three different layers. None replaces the others. Wholeness lives where they meet."
  },
  capacity: {
    title: "Emotional Capacity Reflection",
    questions: [
      { q: "How much can you hold today — honestly?", opts: ["A lot", "A medium amount", "Less than usual", "Almost nothing"] },
      { q: "What is one thing you can put down for the next 24 hours?", opts: ["A worry", "A role", "A conversation", "An expectation", "A scroll", "Other"] }
    ],
    close: "Capacity is not character. It moves with the seasons of your life."
  },
  burnout: {
    title: "Burnout & Fragmentation Scan",
    questions: [
      { q: "What part of you is most tired?", opts: ["The one who keeps things running", "The one who feels everything", "The one who shows up", "The one who holds others", "The one who hopes"] },
      { q: "What does that part need first?", opts: ["Rest", "To be seen", "To say no", "To cry", "To be useless for a while"] }
    ],
    close: "Tiredness is data. Listen to which part is talking; respond to that one specifically."
  },
  safety: {
    title: "Relationship Safety Reflection",
    questions: [
      { q: "Where do you exhale most easily?", opts: ["Alone", "In nature", "With one specific person", "In silence with someone", "In creative work"] },
      { q: "Where do you brace?", opts: ["At work", "In family", "In groups", "Online", "When asked how I am"] }
    ],
    close: "Safety is a felt thing. The body knows before the mind names it."
  }
};

let scanState = { key: null, i: 0, answers: [] };
function el(id) { return document.getElementById(id); }
function setBar(p) { el('scan-bar').style.width = p + '%'; }

function startScan(key) {
  scanState = { key, i: 0, answers: [] };
  renderQ();
  document.getElementById('start').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function scanReset() { scanState = { key: null, i: 0, answers: [] }; renderIntro(); }
function renderIntro() {
  setBar(0);
  el('scan-count').textContent = 'Intro';
  el('scan-step').innerHTML = `
    <p class="t-eyebrow" style="margin-bottom: var(--sp-3);">A note before we begin</p>
    <p class="scan__q t-balance">There are no right answers.</p>
    <p class="scan__hint">Take your time. Pick a scan above when you're ready.</p>
  `;
}
function renderQ() {
  const s = SCANS[scanState.key]; if (!s) return renderIntro();
  const q = s.questions[scanState.i];
  if (!q) return renderClose();
  const total = s.questions.length;
  setBar(((scanState.i) / total) * 100);
  el('scan-count').textContent = `${s.title} · ${scanState.i + 1} of ${total}`;
  const step = el('scan-step');
  step.classList.remove('scan__step'); void step.offsetWidth; step.classList.add('scan__step');
  step.innerHTML = `
    <p class="scan__q t-balance">${q.q}</p>
    ${q.hint ? `<p class="scan__hint">${q.hint}</p>` : ''}
    <div class="scan__opts">
      ${q.opts.map(o => `<button class="scan__opt" onclick="scanAnswer('${o.replace(/'/g, "\\'")}')">${o}</button>`).join('')}
    </div>
  `;
}
function scanAnswer(opt) {
  scanState.answers.push(opt);
  scanState.i++;
  setTimeout(renderQ, 250);
}
function scanNext() { renderIntro(); }
function renderClose() {
  const s = SCANS[scanState.key];
  setBar(100);
  el('scan-count').textContent = `${s.title} · complete`;
  el('scan-step').innerHTML = `
    <p class="t-eyebrow" style="margin-bottom: var(--sp-3);">A closing note</p>
    <p class="scan__q t-balance">${s.close}</p>
    <p class="scan__hint">You noticed: ${scanState.answers.map(a => `<em>${a}</em>`).join(' · ')}</p>
    <div class="scan__opts">
      <button class="scan__opt" onclick="scanReset()">Try another scan</button>
    </div>
  `;
}
