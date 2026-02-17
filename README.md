# CVS Health Consumer Insights - Phase 0 Prototype

A fully functional interactive HTML prototype demonstrating automated consumer insights for CVS Health VP-level strategic decision support.

## Overview

This prototype showcases the **Phase 0** deliverable for the CVS Health Consumer Insights project. It demonstrates the complete vision for VP-level decision support through:

- **Differentiated Question Entry Points**: Three strategic questions, each showing different insights and priorities
- **6-Level Progressive Disclosure**: Drill from National → Customer Type → Lifecycle → Maturity → Behavioral → Demographics → Regional
- **Traditional Story Arc Interface**: Full narrative with Context, Performance, Drivers, Behavior Analysis, and Recommendations
- **Conversational Interface Preview**: Simulated chat showing natural VP workflow with decision support endpoint
- **Rich Interactive Visualizations**: Plotly-powered scorecards, waterfalls, treemaps, bar charts, pie charts, and metric cards

**Phase 1** will add NLP-to-SQL agentic orchestration for dynamic question answering and make the conversational interface fully interactive.

## Features

### 1. Differentiated Question Entry Points
Three strategic questions that each provide unique insights:

- **"What needs my attention this week?"** - Alert-focused view highlighting problems and opportunities by absolute impact
- **"Where is the biggest opportunity?"** - Growth-focused view prioritizing segments by growth rate %
- **"What's changing in our customer base?"** - Trend-focused view showing customer flow and compositional changes

Each question shows the same data through a different lens, demonstrating how the system can tailor insights to specific VP needs.

### 2. Traditional Story Arc Interface

Navigate through five interconnected sections:

**Context** - Time period, strategic goals, prior trends
**Performance Scorecard** - 6 key metrics with YoY comparison and 12-week sparkline trends
**Who Drove Performance** - Narrative + interactive waterfall chart showing segment contributions
**What Changed** - Trip behavior analysis with frequency and basket size metrics
**Recommendations** - Follow-up questions for deeper exploration

### 3. 6-Level Progressive Disclosure

Drill down from national performance to individual cohort characteristics:

1. **National Performance** - Waterfall chart of all segments
2. **Customer Type** - Click segment → Lifecycle treemap (New, Onboarding, Active, Reactivated)
3. **Maturity Tier** - Click lifecycle stage → 5 maturity tiers (New to Champion)
4. **Behavioral Cohort** - Click maturity tier → 5-square behavioral grid (Recency × Frequency × Breadth × Coupon × Channel)
5. **Demographics** - Click cohort → Age groups and household types with charts
6. **Regional Performance** - Click age group → Geographic performance by region with top states

**Breadcrumb Navigation** - Shows full drill path and allows jumping to any level

### 4. Conversational Interface (Phase 1 Preview)

Simulated chat demonstrating how VPs will interact with the system:

- Auto-playing conversation with typing animation
- VP asks questions → System responds with insights + visualizations
- Embedded waterfall chart showing segment contributions
- Decision support endpoint with 3 prioritized actions ranked by impact and opportunity cost
- "Coming in Phase 1" disabled input to show future interactivity

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Safari, Edge, Firefox)
- No server or installation required - runs locally!

### Setup Instructions

**Two Ways to Run the Prototype:**

#### Option 1: Using a Local Server (Recommended)

This method works reliably on all browsers and is required for the fetch-based data loading.

```bash
cd consumer_insights/prototype
./serve.sh
```

This will start a server at `http://localhost:8000` and you can view the prototype in your browser.

**Alternative server commands:**
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server -p 8000
```

Then open your browser to: `http://localhost:8000`

#### Option 2: Open Directly (Works with Embedded Data)

The prototype now includes embedded data in `js/data.js`, so you can also:

1. **Double-click `index.html` in your file browser**
2. **Or from terminal:**
   ```bash
   cd consumer_insights/prototype
   open index.html  # macOS
   # or
   start index.html  # Windows
   # or
   xdg-open index.html  # Linux
   ```

**Note:** Some browsers may block certain features when opening via `file://` protocol. If you encounter issues, use Option 1 (local server).

#### Exploring the Prototype

Once loaded:
- Click any question card on the landing page
- View the story arc with narrative and visualizations
- Click on waterfall chart segments to drill down
- Hover over metric cards to see trends

## Project Structure

```
consumer_insights/
├── README.md                       # This file
├── prototype/
│   ├── index.html                  # Choice menu landing page
│   ├── story_arc.html              # Story arc display page
│   ├── css/
│   │   ├── main.css                # Global styles and CVS branding
│   │   ├── choice_menu.css         # Landing page specific styles
│   │   └── story_arc.css           # Story arc page styles
│   ├── js/
│   │   ├── utils.js                # Formatting and utility functions
│   │   ├── narrative.js            # Narrative generation functions
│   │   ├── visualizations.js       # Plotly chart rendering
│   │   └── interactions.js         # Click handlers and modal logic
│   ├── data/
│   │   └── synthetic_data.json     # Sample week data
│   └── assets/
│       └── (placeholder for CVS logo and branding assets)
```

## Data Structure

The prototype uses synthetic data that models a realistic CVS Health weekly performance scenario:

**Scenario: Mixed Results Story (Week of Feb 10-16, 2025)**
- Overall: +8.3% customer growth, +15.4% value growth
- Growth drivers: PCW customers (+$15M), Reactivated customers (+$8M)
- Concerns: Retail-only churn (-$3M), Pharmacy-only flat

### Key Metrics
- **Total Active Customers**: 2.1M (+8.3% YoY)
- **Total Trips**: 4.7M (+12.1% YoY)
- **Total Value**: $285M (+15.4% YoY)
- **Value per Customer**: $135.71 (+6.6% YoY)
- **Trips per Customer**: 2.24 (+3.5% YoY)
- **Basket Size**: $60.64 (+2.9% YoY)

### Customer Segments
1. **PCW Customers** - Pharmacy + Retail combined
2. **Reactivated Customers** - Previously churned, now returned
3. **Active High Maturity** - Loyal, high-value customers
4. **Retail-only Churned** - Lost front store customers
5. **Pharmacy-only** - Prescription customers
6. **Retail-only Active** - Front store shoppers

## Technical Details

### Technology Stack
- **HTML5/CSS3**: Semantic markup, responsive design
- **Plotly.js 2.27.0**: Interactive charts (waterfall, treemap)
- **Vanilla JavaScript**: No framework dependencies
- **CSS Grid/Flexbox**: Responsive layouts

### CVS Brand Colors
- Primary Red: `#CC0000`
- Blue: `#0033A0`
- Success Green: `#00A650`
- Warning Orange: `#FF6B00`
- Neutral Gray: `#767676`
- Background: `#F5F5F5`

### Browser Support
- Chrome 90+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Firefox 88+ ✅
- Mobile/tablet responsive ✅

### Performance
- Page load: < 2 seconds
- Chart interactions: < 100ms
- Smooth 60fps animations

## Demo Walkthrough

### Step 1: Landing Page (30 seconds)
1. View three strategic question options
2. Notice CVS Health branding and clean design
3. Click "What needs my attention this week?"

### Step 2: Story Arc Overview (2 minutes)
1. **Context**: See time period, goals, and prior trend
2. **Performance Scorecard**: Review 6 key metrics with YoY changes
3. **Who Drove Performance**: Read narrative and view waterfall chart
4. **What Changed**: Analyze trip behavior and segment table
5. **Recommendations**: Review suggested areas to investigate

### Step 3: Interactive Drill-Down (1 minute)
1. Click on "PCW Customers" bar in waterfall chart
2. View treemap showing lifecycle breakdown
3. Review detailed metrics table
4. Close modal and return to main view

## Customization

### Changing Data
Edit `prototype/data/synthetic_data.json` to update:
- Metrics values
- Segment performance
- Recommendations
- Time periods

### Styling
Modify CSS files in `prototype/css/`:
- `main.css` - Global styles and brand colors
- `choice_menu.css` - Landing page appearance
- `story_arc.css` - Story arc layout and components

### Adding New Segments
1. Add segment data to `synthetic_data.json` in `segments` array
2. Optionally add drill-down data in `drill_down` object
3. Update waterfall data in `waterfall_data.changes`

## Future Enhancements (Phase 1)

Phase 1 will add:
- **NLP Question Parsing**: VP asks questions in natural language
- **Agentic Orchestration**: Auto-decompose questions into SQL
- **Dynamic SQL Generation**: Real-time data warehouse queries
- **Multi-Persona Support**: Executive, VP, and Tactical views
- **Conversational Follow-up**: Ask clarifying questions and drill deeper
- **Real-time Data**: Connect to Snowflake data warehouse

## Troubleshooting

### Charts not displaying
- Ensure you have internet connection (Plotly CDN required)
- Check browser console for JavaScript errors
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Data not loading
- Verify `synthetic_data.json` is in correct location: `prototype/data/`
- Check that JSON file has valid syntax (use JSONLint.com)
- Check browser console for fetch errors

### Styling issues
- Ensure all CSS files are present in `prototype/css/`
- Clear browser cache and reload
- Verify file paths in HTML `<link>` tags

## Demo 1 Presentation

**Target Audience**: VP Stakeholders
**Duration**: 5 minutes
**Date**: 6 weeks from project start

**Presentation Flow:**
1. **Opening (1 min)**: Context on Phase 0 goals and approach
2. **Choice Menu Demo (30 sec)**: Show strategic question selection
3. **Story Arc Demo (3 min)**: Walk through full story arc
4. **Drill-down Demo (30 sec)**: Show interactive segment exploration
5. **Closing (30 sec)**: Roadmap to Phase 1

## Contact & Feedback

For questions, feedback, or suggestions regarding this prototype, please contact the Consumer Insights team.

## License

Internal CVS Health project - Confidential

---

**Last Updated**: February 2025
**Version**: 1.0.0 (Phase 0 Demo)
**Status**: Ready for Demo 1 Stakeholder Review
