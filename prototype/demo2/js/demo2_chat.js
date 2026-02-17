// InsightOS Demo2 — Chat Simulator (Spec §3.1–3.4)
// Rekeys chat_simulator.js patterns to spec-exact prompts.

const CHAT_SCRIPT = DEMO2_DATA.chatScript;

let chatIdx = 0;
let chatRunning = false;

// ── Entry point ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(playChat, 600);
});

async function playChat() {
  if (chatRunning) return;
  chatRunning = true;
  for (let i = 0; i < CHAT_SCRIPT.length; i++) {
    chatIdx = i;
    const prompt = CHAT_SCRIPT[i];
    await sleep(i === 0 ? 800 : 1800);
    await addUserMessage(prompt.userText);
    await sleep(1400);
    await addAssistantMessage(prompt);
  }
}

// ── Message renderers ─────────────────────────────────────────────────────
async function addUserMessage(text) {
  const container = document.getElementById('chat-messages');
  const row = document.createElement('div');
  row.className = 'chat-row user-row';
  row.innerHTML = `
    <div class="chat-avatar user-avatar">YOU</div>
    <div class="chat-bubble user-bubble">${text}</div>
  `;
  container.appendChild(row);
  scrollChat();
}

async function addAssistantMessage(prompt) {
  const container = document.getElementById('chat-messages');
  const row = document.createElement('div');
  row.className = 'chat-row assistant-row';

  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar assistant-avatar';
  avatar.textContent = 'AI';

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble assistant-bubble';

  row.appendChild(avatar);
  row.appendChild(bubble);
  container.appendChild(row);

  // Typing indicator
  bubble.innerHTML = `<div class="typing-indicator"><span class="t-dot"></span><span class="t-dot"></span><span class="t-dot"></span></div>`;
  scrollChat();
  await sleep(1500);
  bubble.innerHTML = '';

  // Build insight contract block
  const block = buildInsightBlock(prompt);
  bubble.appendChild(block);

  // Animate the text sections in
  const sections = block.querySelectorAll('.ic-section');
  for (const sec of sections) {
    sec.style.opacity = '0';
    sec.style.transform = 'translateY(6px)';
  }

  for (const sec of sections) {
    await sleep(120);
    sec.style.transition = 'all 0.25s ease';
    sec.style.opacity = '1';
    sec.style.transform = 'translateY(0)';
    scrollChat();
  }
}

function buildInsightBlock(prompt) {
  const wrap = document.createElement('div');
  wrap.className = 'insight-contract';

  // Answer
  wrap.appendChild(makeSection('Answer', prompt.answer));

  // Evidence
  wrap.appendChild(makeSection('Evidence', prompt.evidence));

  // Confidence
  const confHtml = `
    <span class="confidence-badge medium" style="font-size:0.78rem;padding:4px 10px;">
      <span class="cb-dot"></span>${prompt.confidence}
    </span>
    <span class="confidence-detail" style="display:inline;margin-left:8px;">${prompt.confidenceDetail}</span>
  `;
  wrap.appendChild(makeSection('Confidence', confHtml, true));

  // Next clicks
  const linksHtml = prompt.nextClicks.map(nc => {
    // Links open weekly.html at the appropriate anchor
    return `<a href="weekly.html#${nc.anchor}" class="next-click-link" target="_blank">&rarr; ${nc.label}</a>`;
  }).join('');
  wrap.appendChild(makeSection('Next clicks', `<div class="next-clicks-row">${linksHtml}</div>`, true));

  return wrap;
}

function makeSection(label, contentHtml, raw = false) {
  const div = document.createElement('div');
  div.className = 'ic-section';
  div.innerHTML = `
    <span class="ic-label">${label}</span>
    <div class="ic-content">${raw ? contentHtml : contentHtml}</div>
  `;
  return div;
}

// ── Utilities ─────────────────────────────────────────────────────────────
function scrollChat() {
  const container = document.getElementById('chat-messages');
  container.scrollTop = container.scrollHeight;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
