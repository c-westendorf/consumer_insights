# Phase 0: Consumer Insights Automated Decision Support System

## Context

CVS Health needs automated insights for strategic VP-level decision support to answer "who/what drove performance" in their pharmacy and retail business. The current state is manual analysis; VPs need a system that proactively surfaces what requires attention and enables progressive drill-down into customer segments, trip behavior, and category performance.

**Business Problem:**
- VPs spend time digging through data to understand weekly/monthly performance drivers
- Manual analysis is slow and may miss emerging opportunities or risks
- Need to bridge from high-level KPIs to actionable segment-level insights
- Must support different customer lenses (Retail-only, Pharmacy, PCW) and lifecycle stages

**Phase 0 Goal:**
Create the foundational output experience - a conversation interface with pre-generated story arcs that answer strategic questions about performance. This establishes the metric narrative, visualization approach, and analytical framework. Phase 1 will add NLP-to-SQL agentic orchestration.

## Strategic Framing

### Primary KPI
**Customers × Value** - Total business impact measured as:
- Customer count change (YoY) × Value per customer
- Decomposed into: Who (customer segments) × What (trip behavior & category mix)

### Progressive Disclosure Model
```
Level 1 (Opening): Choice menu → Strategic questions
                   "What needs my attention?"
                   "Where is the biggest opportunity?"
                   "What's changing?"

Level 2 (Story Arc): Context → Performance → Drivers → Implications → Recommendations
                     - Time period + goals + prior trend
                     - Scorecard + YoY performance
                     - Waterfall showing segment contributions
                     - Business meaning + risks/opportunities
                     - Areas to investigate further

Level 3 (Drill-down): VP chooses exploration path
                      - By customer segment (Retail/Pharmacy/PCW → Lifecycle → Maturity)
                      - By metric dimension (Trips → Basket → Categories)
                      - By geography (National → Region → Store clusters)
```

## Core Metrics & Analysis Framework

### Metric Suite (From Data Warehouse)

**Customer Metrics:**
- Total Active Customers (rolling 52-week engagement)
- New Customers
- Onboarding Customers (first 90 days)
- Churned Customers (no activity 52 weeks)
- Reactivated Customers (returned after churn)

**Customer Segmentation Dimensions:**
- **Type:** Retail-only, Pharmacy, PCW (pharmacy + retail)
- **Lifecycle:** New, Onboarding, Active, Churned, Reactivated
- **Maturity:** Progressive tiers based on engagement/value
- **Geography:** Region, Sub-region, Urban/Rural
- **Behavior Scores:** 5-square (Consistency, Recency, Shopping breadth, Coupon engagement, Channel)

**Trip & Transaction Metrics:**
- Total Trips
- Front Door Trips (retail)
- RX Trips (pharmacy)
- RX Attached Trips (pharmacy + retail in 2hr window)
- Trip channel breakdown: In-store, ACO (self-checkout), Drive-through
- Trips per customer (frequency)
- Basket size ($ per trip)

**Category & Mission Metrics:**
- Business unit categories (cold remedies, candy, cosmetics, beverages, etc.)
- Trip missions (9 types: Total store, Beauty & wellness routine, Health & wellness reactive, etc.)
- Category penetration by customer segment

### YoY Analysis Approach

**Time Comparison:** Year-over-year (addresses seasonality)
- Current week/month vs. same period prior year
- Compute in SQL by querying two time periods and calculating deltas

**Customer Classification Strategy:**
- **Point-in-time:** Classify customers based on their state at each point in time (primary)
- **Flow analysis:** Show customer movement between segments for lifecycle insights (e.g., New → Active → Churned)
- Combination approach: Use point-in-time for performance metrics, flow for retention insights

### "What Needs Attention" Logic

**Magnitude-based prioritization:**
1. Calculate absolute YoY change for each segment × metric combination
2. Calculate relative contribution (% of total change)
3. Rank by absolute impact: `|Δ Customers × Value per Customer|`
4. Surface top 3-5 drivers (positive and negative)

**Multi-factor context:**
- Size of opportunity (absolute numbers)
- Rate of change (% growth/decline)
- Strategic alignment (PCW growth, retention, value expansion goals)

## Delivered Output Specification

### Opening Experience: Choice Menu

**Interface:** Conversation-style with strategic question prompts

**Menu Options (Opportunity-focused):**
- "What needs my attention this week/month?"
- "Where is the biggest opportunity?"
- "What's changing in our customer base?"

**On Selection:** Generate full story arc on-demand using pre-defined SQL + analysis logic

### Story Arc Components

#### 1. Context Section
```
Time Period: Week of Feb 10-16, 2025 vs. Feb 11-17, 2024
Strategic Goals: Grow active customers, improve retention, expand customer value
Prior Trend: Last month showed 3.2% customer growth driven by PCW reactivations
```

#### 2. Performance Section

**Performance Scorecard (Visual 1):**
- Metric cards showing:
  - Total Active Customers: [Current] vs [Prior Year] ([+/- %])
  - Total Trips: [Current] vs [Prior Year] ([+/- %])
  - Total Value: [Current] vs [Prior Year] ([+/- %])
  - Value per Customer: [Current] vs [Prior Year] ([+/- %])
  - Trips per Customer: [Current] vs [Prior Year] ([+/- %])
  - Basket Size: [Current] vs [Prior Year] ([+/- %])

**Narrative:**
"This week, CVS Health saw 2.1M active customers (+8.3% YoY), generating 4.7M trips (+12.1% YoY) with total value of $285M (+15.4% YoY)."

#### 3. Drivers Section (Who + What)

**Waterfall Chart (Visual 2):**
- Starting value: Prior year total customers × value
- Positive contributions: Segments that grew (green bars)
  - PCW customers: +$15M
  - Reactivated customers: +$8M
  - Active tier 3 maturity: +$5M
- Negative contributions: Segments that declined (red bars)
  - Retail-only churned: -$3M
- Ending value: Current year total customers × value

**Narrative (Who):**
"Growth was primarily driven by:
- **PCW customers** (+45K customers, +$15M impact) - customers engaging with both pharmacy and retail
- **Reactivated customers** (+22K customers, +$8M impact) - previously churned customers returning
- Partially offset by **Retail-only churn** (-8K customers, -$3M impact)"

**Trip Behavior Analysis (What - Level 1):**
```
Segment: PCW Customers
- Trips per customer: 2.8 → 3.2 (+14.3%)
- Basket size: $42 → $45 (+7.1%)
- Value contribution: +14.3% frequency × +7.1% basket = +22.3% total
```

**Narrative (What - Level 1):**
"PCW customers increased both visit frequency (+14.3%) and basket size (+7.1%), indicating deeper engagement across pharmacy and retail."

**Category Mix (What - Level 2 - Available on drill-down):**
- Health & wellness reactive trips: +18%
- Beauty & wellness routine trips: +9%
- Seasonal items: -5%

#### 4. Implications Section

**Business Meaning:**
"The strong PCW customer growth signals that customers see value in CVS's integrated pharmacy + retail experience. The reactivation surge suggests marketing initiatives are successfully bringing back lapsed customers."

**Risks & Opportunities:**
- **Risk:** Retail-only churn accelerating (-8K customers) - single-channel customers are less sticky
- **Opportunity:** Reactivations up 35% YoY - high ROI on win-back campaigns
- **Strategic Progress:** PCW growth (+15%) outpacing goal (10% target) - core strategy is working

#### 5. Recommendations Section (Areas to Investigate)

**Follow-up Questions for VP:**
- "Which regions are driving PCW customer growth? Any geographic patterns?"
- "What categories are driving the basket increase in PCW customers?"
- "Why are retail-only customers churning? Can we convert them to PCW?"
- "Which reactivation tactics are working best? Email, coupons, direct mail?"

### Visualization Specifications

**Visual 1: Performance Scorecard**
- **Tool:** Plotly (interactive metric cards)
- **Layout:** 2×3 grid of metric cards
- **Content per card:**
  - Metric name (large, top)
  - Current value (bold, center)
  - YoY change: +/- Δ value (+/- Δ %)
  - Mini sparkline showing 4-week trend
  - Color coding: Green (positive), Red (negative), Gray (neutral)

**Visual 2: Waterfall Chart**
- **Tool:** Plotly waterfall
- **X-axis:** Segment contributions
- **Y-axis:** Value impact ($M)
- **Elements:**
  - Starting value (prior year baseline)
  - Positive bars (green) for growth segments
  - Negative bars (red) for declining segments
  - Connector lines showing cumulative effect
  - Ending value (current year total)
- **Interactivity:** Click bar to drill into that segment

**Visual 3: Treemap (Drill-down view)**
- **Tool:** Plotly treemap
- **Hierarchy:** Customer Type → Lifecycle → Maturity
- **Color:** YoY growth rate (diverging: red = decline, green = growth)
- **Size:** Absolute customer count
- **Hover:** Shows customer count, trips, value, YoY %

**Visual 4: Sparkline Table (Drill-down view)**
- **Tool:** Plotly table with embedded sparklines
- **Columns:**
  - Segment name
  - Current value
  - YoY Δ
  - YoY %
  - 12-week trend (sparkline)
  - Contribution to total change

## Data Architecture (Working Backwards)

### What Needs to Be True

**To deliver the story arc output, we need:**

1. **Segment-level aggregations** for current and prior year periods:
   - Customer counts by segment (Type × Lifecycle × Maturity × Geography)
   - Trip metrics by segment (Total trips, RX trips, Front door trips, RX attached)
   - Value metrics by segment (Total sales, Basket size)
   - All combinations to support flexible drill-down

2. **YoY delta calculations:**
   - Current period metrics - Prior year same period metrics
   - Absolute change and % change
   - Contribution to total change

3. **Time period filtering:**
   - Weekly snapshots (Sunday-Saturday)
   - Monthly rollups
   - Flexible date range for "current period" selection

4. **Drill-down support:**
   - Category-level metrics joinable to segment metrics
   - Geography hierarchy for regional analysis
   - Behavioral scores for advanced segmentation

### Star Schema Design (Recommended Structure)

**Fact Tables:**
- `fact_customer_weekly`: Customer-week grain with all metrics
- `fact_segment_weekly`: Pre-aggregated segment-week grain for performance
- `fact_trip_detail`: Trip-level detail for category/mission analysis

**Dimension Tables:**
- `dim_customer`: Customer attributes (Type, Loyalty status)
- `dim_date`: Date hierarchy (Week, Month, Quarter, Year)
- `dim_segment`: Segment definitions (Lifecycle, Maturity, Behavior scores)
- `dim_geography`: Store → Sub-region → Region → National
- `dim_category`: Product categories and trip missions

**Critical Views/Queries:**
- `vw_segment_performance_yoy`: Joins current + prior year segment facts with delta calculations
- `vw_waterfall_data`: Pre-computed contribution analysis for top segments
- `vw_scorecard_metrics`: Top-line KPIs with YoY comparisons

## Phase 0 Deliverables

### 1. Metric Narrative Document
**File:** `docs/metric_narrative.md`

**Contents:**
- Metric definitions (aligned with business language)
- Calculation formulas for composite metrics (Customers × Value)
- YoY comparison methodology
- Segment attribution logic
- "What needs attention" prioritization algorithm

### 2. SQL Query Library
**Directory:** `sql/`

**Files:**
- `sql/setup/create_star_schema.sql` - DDL for fact and dimension tables
- `sql/aggregations/segment_performance_yoy.sql` - YoY segment metrics
- `sql/aggregations/waterfall_contributions.sql` - Segment contribution to total change
- `sql/aggregations/scorecard_metrics.sql` - Top-line KPIs
- `sql/aggregations/trip_behavior_by_segment.sql` - Trip frequency, basket analysis
- `sql/aggregations/category_mix_by_segment.sql` - Category penetration and growth

### 3. Analysis & Visualization Prototype
**Directory:** `analysis/`

**Files:**
- `analysis/story_arc_generator.py` - Core logic to generate story arc from SQL results
  - Functions:
    - `generate_context()` - Creates context section
    - `generate_performance_scorecard()` - Builds metric cards
    - `generate_waterfall_chart()` - Creates segment contribution visual
    - `generate_drivers_narrative()` - Writes who/what drove performance
    - `generate_implications()` - Interprets business meaning
    - `generate_recommendations()` - Suggests follow-up questions

- `analysis/visualizations.py` - Plotly visualization library
  - Functions:
    - `create_scorecard(metrics_df)` - Performance metric cards
    - `create_waterfall(contributions_df)` - Waterfall chart
    - `create_treemap(segment_df)` - Segment treemap
    - `create_sparkline_table(trend_df)` - Table with trends

- `analysis/prototype_notebook.ipynb` - End-to-end example
  - Connects to Snowflake
  - Runs SQL queries
  - Generates story arc for sample week
  - Displays all visuals
  - Exports HTML report

### 4. Interface Mockup
**File:** `interface/choice_menu_prototype.html`

**Contents:**
- Choice menu with 3 strategic questions
- On selection, displays pre-generated story arc
- Performance scorecard + Waterfall chart
- Click interactions to show drill-down structure (mocked)
- Demonstrates progressive disclosure flow

### 5. Data Requirements Document
**File:** `docs/data_requirements.md`

**Contents:**
- Required data warehouse tables/views (working backwards from output)
- Snowflake connection requirements
- Data refresh cadence (weekly Sunday night, monthly 1st of month)
- Data quality checks (customer classification completeness, metric calculations)
- Performance requirements (query SLAs for on-demand story generation)

## Implementation Approach (Phase 0)

### Week 1: Metric Alignment & SQL Foundation
1. Document metric definitions in `docs/metric_narrative.md`
2. Write SQL for scorecard KPIs and YoY calculations
3. Validate SQL output against sample data
4. Confirm metrics match business understanding

### Week 2: Segment Attribution Logic
1. Write SQL for segment-level aggregations
2. Implement waterfall contribution calculations
3. Build "what needs attention" ranking logic
4. Test with multiple time periods

### Week 3: Visualization & Story Arc
1. Build Plotly visualization functions
2. Create story arc generator with narrative logic
3. Develop prototype notebook end-to-end
4. Generate sample story arcs for validation

### Week 4: Interface & Documentation
1. Build choice menu HTML mockup
2. Wire up story arc display
3. Complete data requirements document
4. Review with stakeholders and iterate

## Success Criteria

**Phase 0 is complete when:**
1. ✅ VP stakeholders can see a working story arc for a sample week
2. ✅ Metrics align with business definitions and goals
3. ✅ Waterfall chart accurately shows segment contributions
4. ✅ Narrative is executive-appropriate (non-technical, actionable)
5. ✅ Recommendations surface meaningful follow-up questions
6. ✅ Data requirements are documented for Phase 1 implementation
7. ✅ SQL queries run successfully against Snowflake data warehouse

## Phase 1 Preview (Out of Scope for Phase 0)

Phase 1 will add:
- NLP question parsing and intent classification
- Agentic orchestration to decompose questions into SQL
- Dynamic SQL generation based on VP questions
- Conversational follow-up and drill-down
- Support for multiple personas (Executive, VP, Tactical)

Phase 0 establishes the "answer format" - Phase 1 will make it dynamic.

## Illustrative Example for Demo 1 (6 Weeks)

### Objective
Create a **fully functional interactive HTML prototype** demonstrating the core story arc with synthetic data. This allows stakeholders to experience the output before Phase 1 agentic orchestration is built.

### Demo Scenario: Mixed Results Story
**Week of Feb 10-16, 2025 vs Feb 11-17, 2024**

**Synthetic Data Story:**
- **Overall Performance:** +8.3% customer growth, +15.4% value growth (positive headline)
- **Growth Drivers:**
  - PCW customers: +45K customers, +$15M (strong performance)
  - Reactivated customers: +22K customers, +$8M (win-back success)
- **Decline Areas:**
  - Retail-only churn: -8K customers, -$3M (needs attention)
  - Pharmacy-only flat: +2K customers, +$0.5M (stagnant)
- **Mixed implications:** Success in core strategy (PCW), but single-channel retention issues

### Prototype Components

#### 1. Landing Page: Choice Menu
**File:** `prototype/index.html`

**Elements:**
- CVS Health branding header
- Tagline: "Consumer Insights - Strategic Decision Support"
- Date selector: Week of Feb 10-16, 2025
- Three question cards (clickable):
  1. "What needs my attention this week?" (primary CTA)
  2. "Where is the biggest opportunity?"
  3. "What's changing in our customer base?"
- Footer: "Phase 0 Demo - Story Arc Preview"

**Interaction:**
- Click any question → Navigate to Story Arc page
- Each question shows same story arc (Phase 0 limited scope)
- Smooth transition animation

#### 2. Story Arc Page
**File:** `prototype/story_arc.html`

**Layout:**
```
┌─────────────────────────────────────────────┐
│ [< Back to Menu]           Week Feb 10-16   │
├─────────────────────────────────────────────┤
│ CONTEXT                                     │
│ Time Period | Goals | Prior Trend           │
├─────────────────────────────────────────────┤
│ PERFORMANCE SCORECARD                       │
│ [6 Metric Cards: Customers, Trips, Value,  │
│  Value/Customer, Trips/Customer, Basket]    │
├─────────────────────────────────────────────┤
│ WHO DROVE PERFORMANCE                       │
│ [Narrative paragraph]                       │
│ [Waterfall Chart - Interactive]             │
├─────────────────────────────────────────────┤
│ WHAT CHANGED (Trip Behavior)                │
│ [Narrative paragraph]                       │
│ [Segment comparison table with sparklines]  │
├─────────────────────────────────────────────┤
│ [Recommendations section - lightweight]     │
└─────────────────────────────────────────────┘
```

**Interactive Features:**
- **Waterfall chart clicks:** Click a segment bar → Show drill-down modal with:
  - Treemap of segment breakdown (e.g., PCW → Lifecycle stages)
  - Table with sub-segment metrics
  - "Close" button to return to main view
- **Metric cards hover:** Show 12-week trend tooltip
- **Sparklines:** Hover to see exact week values
- **Responsive:** Works on desktop and tablet

#### 3. Synthetic Data Generation
**File:** `prototype/data/synthetic_data.json`

**Data Realism:**
- Customer counts: 1.9M - 2.1M range (realistic for regional view)
- Growth rates: 5-20% range with variance by segment
- Basket sizes: $30-$60 typical retail pharmacy range
- Trips per customer: 2-4 per month average
- Ensure totals reconcile (segment deltas sum to total delta)

#### 4. Visualization Library
**File:** `prototype/js/visualizations.js`

**Functions:**
- `renderScorecard(data)` - Creates 6 metric cards with trend sparklines
- `renderWaterfall(data)` - Plotly waterfall chart with segment contributions
- `renderDrillDownModal(segment, data)` - Treemap + table in modal overlay
- `renderSparklineTable(data)` - Table with embedded mini trend charts

**Technology Stack:**
- **Plotly.js** for interactive charts (waterfall, treemap)
- **Canvas API** for sparklines (lightweight)
- **Vanilla JavaScript** for interactions (no framework overhead)
- **CSS Grid/Flexbox** for responsive layout
- **CSS Variables** for CVS brand colors

#### 5. Narrative Generation
**File:** `prototype/js/narrative.js`

**Functions:**
- `generateContextNarrative(data)` - Creates context section text
- `generatePerformanceNarrative(data)` - Summarizes scorecard metrics
- `generateDriversNarrative(data)` - "Who drove performance" paragraph
- `generateTripBehaviorNarrative(segment, data)` - "What changed" for segment
- `generateRecommendations(data)` - Follow-up questions based on top segments

### Prototype File Structure
```
consumer_insights/
├── prototype/
│   ├── index.html                 # Choice menu landing page
│   ├── story_arc.html             # Story arc display page
│   ├── css/
│   │   ├── main.css              # Global styles
│   │   ├── choice_menu.css       # Landing page styles
│   │   └── story_arc.css         # Story arc page styles
│   ├── js/
│   │   ├── visualizations.js     # Chart rendering functions
│   │   ├── narrative.js          # Text generation functions
│   │   ├── interactions.js       # Click handlers, modals
│   │   └── utils.js              # Formatting, data helpers
│   ├── data/
│   │   └── synthetic_data.json   # Sample week data
│   └── assets/
│       └── (placeholder for CVS branding assets)
```

### CVS Brand Styling
**Colors:**
- Primary: #CC0000 (CVS Red)
- Secondary: #0033A0 (CVS Blue)
- Success: #00A650 (Green for positive metrics)
- Warning: #FF6B00 (Orange for attention items)
- Danger: #CC0000 (Red for negative metrics)
- Neutral: #767676 (Gray for neutral)
- Background: #F5F5F5 (Light gray)

**Typography:**
- Headings: "Helvetica Neue", Arial, sans-serif
- Body: "Open Sans", Arial, sans-serif
- Monospace (metrics): "Courier New", monospace

### Demo 1 Delivery Timeline

**Week 1 (Current):**
- ✅ Align on metrics and narrative (completed in this planning session)
- ✅ Create synthetic data JSON file
- ✅ Build HTML structure for both pages

**Week 2:**
- ✅ Implement scorecard visualization
- ✅ Build waterfall chart with Plotly
- ✅ Create narrative generation functions

**Week 3:**
- ✅ Add drill-down modal with treemap
- ✅ Implement sparkline table
- ✅ Build interactive click handlers

**Week 4:**
- ✅ Apply CVS brand styling
- ✅ Add responsive design
- ✅ Test on multiple browsers/devices

**All prototype components completed ahead of schedule!**

### Demo 1 Walkthrough Script

**Opening (1 min):**
"This is the experience VPs will have when accessing weekly consumer insights. They'll land on a choice menu with strategic questions."

**Choice Menu Demo (30 sec):**
[Click "What needs my attention this week?"]
"Selecting a question generates an on-demand story arc analyzing the latest week."

**Story Arc Demo (3 min):**
1. **Context:** "We start with time period, strategic goals, and prior trend for continuity."
2. **Scorecard:** "Six key metrics show current vs prior year with YoY change. Hover to see 12-week trends."
3. **Who:** "Narrative explains who drove performance. Waterfall shows segment contributions."
   - [Click PCW bar] "Clicking a segment drills into lifecycle breakdown."
   - [Close modal]
4. **What:** "Trip behavior analysis shows why PCW grew - increased frequency and basket size."

**Closing (30 sec):**
"Phase 0 establishes this output format. Phase 1 adds NLP to let VPs ask any question and get dynamic story arcs."

### Success Metrics for Demo 1

**Stakeholder feedback should confirm:**
1. ✅ Metrics align with business language and strategic goals
2. ✅ Narrative is executive-appropriate (clear, concise, actionable)
3. ✅ Visuals communicate the story effectively
4. ✅ Drill-down interactions feel intuitive
5. ✅ "Areas to investigate" recommendations are valuable
6. ✅ Overall experience creates excitement for Phase 1

### Technical Requirements

**Deliverables:**
1. ✅ Self-contained HTML prototype (runs locally, no server needed)
2. ✅ README with setup instructions (just open index.html in browser)
3. ⏳ Demo walkthrough video (2-3 min screen recording with voiceover)
4. ⏳ Synthetic data documentation (explain how numbers were generated)

**Browser Support:**
- Chrome (primary) ✅
- Safari (secondary) ✅
- Edge (secondary) ✅
- Mobile/tablet responsive ✅

**Performance:**
- Page load < 2 seconds ✅
- Chart interactions < 100ms ✅
- Smooth animations (60fps) ✅

## Open Questions for Stakeholder Review

1. **Frequency:** Should the choice menu refresh daily with latest data, or only on weekly/monthly cadence?
2. **Baseline comparison:** Besides YoY, do VPs want to see vs. plan/forecast comparisons?
3. **Alerting:** Should the system proactively notify VPs when "what needs attention" shows critical changes?
4. **Segment depth:** How many drill-down levels are valuable? (Currently planning 2: segment → sub-segment)
5. **Category granularity:** Business unit categories vs. trip missions - which is more actionable for VPs?

---

**Next Steps:**
1. ✅ Review this plan
2. ✅ Build illustrative HTML prototype
3. Demo 1 stakeholder presentation (ready!)
4. Iterate based on feedback
5. Begin Phase 1 planning (agentic NLP orchestration)

**Status:** Phase 0 prototype complete and ready for Demo 1! 🎉
