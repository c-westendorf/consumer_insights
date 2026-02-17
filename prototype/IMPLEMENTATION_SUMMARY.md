# CVS Health Consumer Insights - Metric Framework Implementation Summary

## Implementation Date: 2026-02-16

## Overview
Implemented the **4-Layer Insight Template** framework with strategic pillars (Grow Active Customers, Improve Retention, Increase Frequency & Basket) and lagging/leading indicator classification.

## What Was Implemented

### 1. **Strategic Pillars with Lagging/Leading Indicators** (`data_attention.js`)

Added three strategic pillars with metrics classified as lagging (outcomes) or leading (predictors):

#### Pillar 1: Grow Active Customers
- **Lagging Metrics:**
  - Active Customer Count (2.1M, +8.3% trend)
  - New Customer Acquisition (45K/qtr, +15% trend)
  - CAC ($22, target $20)

- **Leading Metrics:**
  - Onboarding Velocity (62%, target 70%)
  - New → Active Conversion (78%, target 85%)

#### Pillar 2: Improve Retention
- **Lagging Metrics:**
  - Retention Rate (82%, target 85%)
  - Churn Rate (18%, target 15%)
  - At-Risk Customer Count (215K, target 180K)

- **Leading Metrics:**
  - Recency Score (18 days, target 14 days)
  - PCW Conversion Rate (12%, target 15%)
  - Maturity Tier Progression (23%, target 28%)

#### Pillar 3: Increase Visit Frequency & Basket
- **Lagging Metrics:**
  - Trips per Customer (2.24, target 2.50)
  - Basket Size ($60.64, target $65.00)

- **Leading Metrics:**
  - Category Penetration (3.2 categories, target 3.8)
  - Multi-Mission Trip % (42%, target 50%)
  - Digital Trip % (28%, target 35%)

---

### 2. **Hypothesis 3 Insight: Rx-FS Connection** (Pilot Implementation)

Implemented full 4-layer insight structure for **"Rx-FS Connection Is the Golden Path to Retention"**:

#### Layer 1: Customer Segment + Value + State
- **Segment:** Retail-Only Active Customers
- **% of Base:** 28%
- **Customer Count:** 591,000
- **State:** PCW conversion opportunity

#### Layer 2: Key Behaviors (LAGGING)
- **Observable Outcome:** Only 12% convert to PCW within 12 months
- **Baseline:** 88% stay retail-only
- **Measurement:** PCW conversion rate tracking

#### Layer 3: Drivers (LEADING)
- **Leading Indicator:** First Rx fill within 90 days
- **Signal Strength:** 85% correlation
- **Lead Time:** 12 months ahead
- **Attribution:** First Rx fill creates pharmacy dependency, leading to cross-shopping behavior and higher retention

#### Layer 4: Applicable Value (QUANTIFIED)
- **Retention Lift:** +42%
- **CLV Lift:** +$385
- **Total Opportunity:** $204M

#### "What This Means" Section
Complete action framework with 6 components:
1. **Current State:** 88% of retail-only customers never adopt pharmacy
2. **Opportunity:** Convert retail shoppers to PCW through first Rx incentive
3. **Early Warning:** Monitor days since acquisition without Rx fill (>120 days = low conversion)
4. **Intervention:** "3 Free Rx Fills" promotion at 60-day mark
5. **Expected Impact:** 10% conversion = 59K customers = $22.7M value (15.1x ROI)
6. **Opportunity Cost:** Optimize = pharmacy lock-in; Don't = vulnerable to e-commerce competitors

---

### 3. **New Function: `generateInsightNarrative()`** (`narrative.js`)

Created comprehensive narrative generation function that outputs:
- 4-layer insight structure with visual hierarchy
- Color-coded indicator badges (lagging = gray, leading = green)
- Signal strength visualization with animated progress bar
- Complete "What This Means" section with 6 components
- Icon-based visual hierarchy for each section

**Key Features:**
- Responsive design for mobile/desktop
- Color coding by layer (Layer 1 = blue, Layer 2 = gray, Layer 3 = green, Layer 4 = red)
- Signal strength bar with percentage display
- Opportunity cost comparison (Optimize vs Don't Optimize)
- Risk highlighting

---

### 4. **New CSS: `insights.css`**

Complete stylesheet for insight narrative display including:
- **Insight Layers:** 4 distinct visual styles with color-coded borders
- **Indicator Badges:** Lagging (gray) and Leading (green) badges
- **Signal Strength Bar:** Animated progress bar showing correlation strength
- **What This Means Sections:** 6 distinct sections with icon-based labels
- **Impact Metrics Grid:** Responsive grid for quantified outcomes
- **Opportunity Cost Comparison:** Side-by-side optimize vs don't optimize paths

**Visual Hierarchy:**
- Layer 1 (Segment): Blue gradient background
- Layer 2 (Lagging): Gray gradient background
- Layer 3 (Leading): Green gradient background
- Layer 4 (Value): Red gradient background

---

### 5. **Pillar Scorecard Visualization** (`visualizations.js`)

New function `renderPillarScorecard()` that displays:
- Grid layout for 3 strategic pillars
- Lagging and Leading sections within each pillar
- Current values + trend percentages
- Color-coded trend indicators (positive = green, negative = red, neutral = gray)

**Features:**
- Responsive grid (auto-fit for different screen sizes)
- Clear separation between lagging outcomes and leading predictors
- Metric name + current value + trend in each row

---

### 6. **Story Arc Page Updates** (`story_arc.html`)

Enhanced story arc page with:
1. **New Section:** Strategic Pillars (displays lagging vs leading indicators)
2. **New Section:** Strategic Insights (displays 4-layer insight narratives)
3. **Conditional Rendering:** Sections only display if data is available
4. **New Function:** `renderInsights()` to process insight objects

**Page Structure:**
1. Context
2. Performance (scorecard)
3. **Strategic Pillars** ← NEW
4. Who Drove Performance (waterfall)
5. What Changed (trip behavior)
6. **Strategic Insights** ← NEW
7. Areas to Investigate (recommendations)

---

## File Structure

### Modified Files:
1. `/Users/chris/consumer_insights/prototype/js/data_attention.js`
   - Added `strategic_pillars` object
   - Added `insights.rx_fs_connection` object

2. `/Users/chris/consumer_insights/prototype/js/narrative.js`
   - Added `generateInsightNarrative(insight)` function

3. `/Users/chris/consumer_insights/prototype/js/visualizations.js`
   - Added `renderPillarScorecard(pillars, containerId)` function

4. `/Users/chris/consumer_insights/prototype/story_arc.html`
   - Added Strategic Pillars section
   - Added Strategic Insights section
   - Added `renderInsights()` function
   - Linked `insights.css`

### New Files:
1. `/Users/chris/consumer_insights/prototype/css/insights.css`
   - Complete stylesheet for insight narratives
   - Pillar scorecard styles
   - Responsive design for mobile/desktop

---

## How to View

1. **Open Homepage:**
   ```
   open /Users/chris/consumer_insights/prototype/index.html
   ```

2. **Click on:** "What needs my attention this week?"

3. **New Sections Visible:**
   - **Strategic Pillars:** Shows 3 pillars with lagging/leading metrics
   - **Strategic Insights:** Shows Rx-FS Connection insight with full 4-layer framework

---

## Next Steps (From Approved Plan)

### Phase 1: Complete (2-3 weeks estimated)
✅ Hypothesis-driven metric framework defined
✅ 4-layer insight template created
✅ Pilot insight implemented (Hypothesis 3: Rx-FS Connection)
✅ Strategic pillars with lagging/leading classification

### Phase 2: Add Remaining Insights (2-3 weeks)
- [ ] Hypothesis 1: Digital-Physical Integration
- [ ] Hypothesis 2: Promotion Diversity Beats Dependency
- [ ] Hypothesis 4: Mission Diversity Expansion
- [ ] Hypothesis 5: Shopping Pattern Stability

### Phase 3: Signal Processing for New Customers (1-2 weeks)
- [ ] Implement velocity metrics (days to 2nd/3rd trip)
- [ ] Build exploration metrics (category breadth, mission diversity)
- [ ] Create engagement intent indicators (clip without redeem, digital adoption)
- [ ] Define 90-day lagging outcomes

### Phase 4: Hypothesis Validation by Lifecycle Segment (2-3 weeks)
- [ ] Segment active customers by lifecycle (families, seniors, young professionals, bargain hunters)
- [ ] Test hypotheses within each segment
- [ ] Quantify which hypotheses matter most for which segments
- [ ] Build segment-specific metric stories

### Phase 5: Dual Aggregation Strategy (2 weeks)
- [ ] Build field-centric scorecard (store/region aggregation)
- [ ] Create migration impact tracking
- [ ] Validate field scorecard with store managers

---

## Key Innovations

1. **Visual Signal Strength:** Animated progress bar showing 85% correlation strength
2. **Lead Time Display:** Explicitly shows "12 months ahead" prediction window
3. **Opportunity Cost Framework:** Side-by-side comparison of optimize vs don't optimize paths
4. **6-Component Action Framework:** Comprehensive "What This Means" section with actionable insights
5. **Color-Coded Hierarchy:** Visual distinction between lagging (gray) and leading (green) indicators

---

## Testing Checklist

- [ ] Homepage loads without errors
- [ ] "What needs my attention?" question loads data
- [ ] Strategic Pillars section displays 3 pillars
- [ ] Lagging/Leading indicators properly color-coded
- [ ] Strategic Insights section displays Rx-FS Connection insight
- [ ] Signal strength bar animates to 85%
- [ ] All 6 "What This Means" sections render correctly
- [ ] Opportunity cost comparison displays optimize vs don't optimize
- [ ] Responsive design works on mobile
- [ ] All dollar values and percentages format correctly

---

## Metrics for Success

1. **Pilot Insight Value:** $204M total opportunity identified
2. **Expected ROI:** 15.1x return on investment
3. **Target Conversion:** 10% of 591K retail-only customers = 59K PCW conversions
4. **CLV Lift:** +$385 per converted customer
5. **Retention Lift:** +42% for PCW vs retail-only customers

---

## Documentation References

- **Plan File:** `/Users/chris/.claude/plans/dynamic-growing-muffin.md`
- **Prototype Root:** `/Users/chris/consumer_insights/prototype/`
- **Implementation Summary:** This file

---

**Implementation Status:** ✅ Pilot Complete
**Ready for Review:** Yes
**Next Priority:** Implement remaining 4 hypotheses (Phase 2)
