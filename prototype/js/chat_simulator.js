// Chat Simulator - Auto-play conversational interface demo

// Conversation script
const conversationScript = [
    {
        type: 'user',
        text: 'What drove performance this week?',
        delay: 1000
    },
    {
        type: 'system',
        text: `This week, CVS Health saw +15.4% value growth driven by two key segments:

• <strong>PCW Customers:</strong> +$15M (pharmacy + retail integrated shoppers)
• <strong>Reactivated Customers:</strong> +$8M (win-back campaigns working)

However, <strong>retail-only churn</strong> is accelerating at -$3M, requiring attention.`,
        chart: 'waterfall',
        delay: 2000,
        typingSpeed: 30
    },
    {
        type: 'user',
        text: 'Dig into the PCW customer growth - who specifically is driving this?',
        delay: 1500
    },
    {
        type: 'system',
        text: `PCW growth (+$15M) is concentrated in <strong>Active customers</strong> in the <strong>Tier 3 'High Value'</strong> maturity stage:

• 120K customers (+8.5% YoY)
• Average 15-30 trips/year at $185 value
• Increased both frequency (+14.3%) and basket (+7.1%)

These are established customers deepening engagement across pharmacy and retail.`,
        delay: 2000,
        typingSpeed: 30
    },
    {
        type: 'user',
        text: 'Where are these high-value customers located and what demographics?',
        delay: 1500
    },
    {
        type: 'system',
        text: `High-value active PCW customers skew toward:

<strong>Demographics:</strong>
• Age 45-64 (primary) - 71% of segment
• Family households with kids - 58%
• Suburban locations - 65%

<strong>Geographic Performance:</strong>
• <strong>Southeast:</strong> +15.8% YoY (FL, GA, NC leading)
• <strong>Northeast:</strong> +12.5% YoY (NY, MA, PA strong)
• Midwest & West: +8-10% (opportunity to close gap)`,
        delay: 2000,
        typingSpeed: 30
    },
    {
        type: 'user',
        text: 'Based on this analysis, what should I prioritize?',
        delay: 1500
    },
    {
        type: 'system',
        text: 'Here are your top 3 priorities ranked by impact and urgency:',
        priorities: true,
        delay: 2000,
        typingSpeed: 30
    }
];

// Priority cards data
const priorities = [
    {
        level: 1,
        icon: '🔴',
        title: 'PRIORITY 1: STOP RETAIL-ONLY CHURN',
        details: [
            '<strong>Current Impact:</strong> -$3M and accelerating',
            '<strong>Root Cause:</strong> Single-channel customers less sticky (no pharmacy tie)',
            '<strong>Opportunity Cost:</strong> Every week of delay = -$750K',
            '<strong>Recommended Action:</strong> Launch targeted PCW conversion campaign in Midwest (highest churn concentration)',
            '<strong>Expected Outcome:</strong> Recover 30% of at-risk customers = +$900K/week'
        ]
    },
    {
        level: 2,
        icon: '🟢',
        title: 'PRIORITY 2: SCALE REACTIVATION CAMPAIGNS',
        details: [
            '<strong>Current Impact:</strong> +$8M (114% growth rate - highest ROI)',
            '<strong>Untapped Potential:</strong> Currently reaching 40% of lapsed customers',
            '<strong>Opportunity Cost:</strong> $7M left on table by not scaling to 80% reach',
            '<strong>Recommended Action:</strong> 2x investment in win-back email/coupon tactics',
            '<strong>Expected Outcome:</strong> Scale from $8M to $15M impact in 8 weeks'
        ]
    },
    {
        level: 3,
        icon: '🟡',
        title: 'PRIORITY 3: CONVERT NEW RETAIL CUSTOMERS TO PCW',
        details: [
            '<strong>Current Opportunity:</strong> 89K new retail-only customers this quarter',
            '<strong>Conversion Value:</strong> PCW customers 2.5x more valuable than retail-only',
            '<strong>Opportunity Cost:</strong> 10% conversion rate = $2.5M incremental revenue',
            '<strong>Recommended Action:</strong> "First Fill Free" RX promotion for retail shoppers',
            '<strong>Expected Outcome:</strong> 15% conversion rate = $3.8M incremental + retention lift'
        ]
    }
];

let messageIndex = 0;
let isTyping = false;

/**
 * Initialize chat on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        playConversation();
    }, 500);
});

/**
 * Play the conversation sequence
 */
async function playConversation() {
    for (let i = 0; i < conversationScript.length; i++) {
        const message = conversationScript[i];
        await sleep(message.delay);
        await addMessage(message);
    }
}

/**
 * Add a message to the chat
 */
async function addMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.type}-message`;

    // Create avatar
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = message.type === 'user' ? 'VP' : 'AI';

    // Create bubble
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    bubble.appendChild(textDiv);

    messagesContainer.appendChild(messageDiv);

    // Type out the message if it's from system
    if (message.type === 'system' && message.typingSpeed) {
        // Show typing indicator first
        const typingDiv = createTypingIndicator();
        bubble.insertBefore(typingDiv, textDiv);
        scrollToBottom();

        await sleep(1500);
        bubble.removeChild(typingDiv);

        // Type out message
        await typeText(textDiv, message.text, message.typingSpeed);
    } else {
        // Show message instantly (user messages)
        textDiv.innerHTML = message.text;
    }

    // Add chart if specified
    if (message.chart === 'waterfall') {
        await sleep(500);
        const chartDiv = createWaterfallChart();
        bubble.appendChild(chartDiv);
    }

    // Add priority cards if specified
    if (message.priorities) {
        await sleep(500);
        const prioritiesDiv = createPriorityCards();
        bubble.appendChild(prioritiesDiv);

        // Add final impact summary
        await sleep(1000);
        const impactDiv = document.createElement('div');
        impactDiv.className = 'priority-impact';
        impactDiv.innerHTML = '<strong>Total Addressable Impact:</strong> $11.7M in next 8 weeks if all three executed';
        bubble.appendChild(impactDiv);

        await sleep(500);
        const followUpDiv = document.createElement('div');
        followUpDiv.className = 'message-text';
        followUpDiv.style.marginTop = '16px';
        followUpDiv.innerHTML = 'Would you like to drill deeper into any of these priorities?';
        bubble.appendChild(followUpDiv);
    }

    scrollToBottom();
}

/**
 * Type text character by character
 */
async function typeText(element, text, speed) {
    let currentText = '';
    let inTag = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Handle HTML tags
        if (char === '<') inTag = true;
        if (char === '>') {
            inTag = false;
            currentText += char;
            element.innerHTML = currentText;
            continue;
        }

        currentText += char;
        element.innerHTML = currentText;

        // Only delay if not inside an HTML tag
        if (!inTag && speed) {
            await sleep(speed);
            scrollToBottom();
        }
    }
}

/**
 * Create typing indicator
 */
function createTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    return div;
}

/**
 * Create waterfall chart
 */
function createWaterfallChart() {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'message-chart';

    const chartDiv = document.createElement('div');
    chartDiv.className = 'chart-placeholder';
    chartDiv.id = `chart-${Date.now()}`;
    chartContainer.appendChild(chartDiv);

    // Render waterfall chart
    setTimeout(() => {
        renderMiniWaterfall(chartDiv.id);
    }, 100);

    return chartContainer;
}

/**
 * Render mini waterfall chart
 */
function renderMiniWaterfall(containerId) {
    const data = window.insightData.waterfall_data;

    const x = ['Prior Year', ...data.changes.map(c => c.label), 'Current Year'];
    const y = [data.baseline.value, ...data.changes.map(c => c.value), data.total.value];
    const colors = ['#6c757d', ...data.changes.map(c => c.type === 'increase' ? '#00A650' : '#CC0000'), '#0033A0'];

    const trace = {
        type: 'waterfall',
        x: x,
        y: y,
        connector: { line: { color: '#adb5bd' } },
        increasing: { marker: { color: '#00A650' } },
        decreasing: { marker: { color: '#CC0000' } },
        totals: { marker: { color: '#0033A0' } }
    };

    const layout = {
        title: {
            text: 'Segment Contributions to Performance',
            font: { size: 14 }
        },
        xaxis: { tickangle: -45 },
        yaxis: { tickformat: '$,.0f' },
        margin: { t: 40, b: 80, l: 60, r: 20 },
        height: 280
    };

    Plotly.newPlot(containerId, [trace], layout, { responsive: true, displayModeBar: false });
}

/**
 * Create priority cards
 */
function createPriorityCards() {
    const container = document.createElement('div');
    container.className = 'priority-cards';

    priorities.forEach(priority => {
        const card = document.createElement('div');
        card.className = `priority-card priority-${priority.level}`;

        const header = document.createElement('div');
        header.className = 'priority-header';
        header.innerHTML = `
            <span class="priority-icon">${priority.icon}</span>
            <h4 class="priority-title">${priority.title}</h4>
        `;

        const details = document.createElement('div');
        details.className = 'priority-details';
        details.innerHTML = '<ul>' + priority.details.map(d => `<li>${d}</li>`).join('') + '</ul>';

        card.appendChild(header);
        card.appendChild(details);
        container.appendChild(card);
    });

    return container;
}

/**
 * Scroll to bottom of messages
 */
function scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Sleep utility
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
