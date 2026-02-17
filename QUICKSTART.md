# Quick Start Guide - CVS Health Consumer Insights Prototype

## Try it in 3 Simple Steps

### Step 1: Start the Prototype

**Option A - Using Local Server (Recommended):**
```bash
cd consumer_insights/prototype
./serve.sh
```
Then open your browser to: `http://localhost:8000`

**Option B - Direct Open (Quick Test):**
```bash
cd consumer_insights/prototype
open index.html  # macOS
```

**Note:** If you see "Error loading insights data", use Option A (local server).

### Step 2: Click a Question
Click on any of the three question cards:
- "What needs my attention this week?" ⭐ (Recommended)
- "Where is the biggest opportunity?"
- "What's changing in our customer base?"

### Step 3: Explore the Story Arc
- View performance metrics with YoY trends
- Check the waterfall chart showing segment contributions
- Click on waterfall bars to drill down into segments
- Review recommendations for follow-up questions

## What You'll See

### Choice Menu Page
- CVS Health branded landing page
- Three strategic questions for VP-level insights
- Clean, professional interface

### Story Arc Page
Contains 5 sections:

1. **Context**
   - Time period: Week of Feb 10-16, 2025 vs same week 2024
   - Strategic goals and prior trend

2. **Performance Scorecard**
   - 6 metric cards with sparkline trends
   - Total Customers: 2.1M (+8.3%)
   - Total Value: $285M (+15.4%)
   - And more...

3. **Who Drove Performance**
   - Narrative explaining drivers
   - Waterfall chart (click bars to drill down!)
   - PCW Customers: +$15M impact
   - Reactivated Customers: +$8M impact

4. **What Changed**
   - Trip behavior analysis
   - Segment comparison table
   - Frequency and basket size metrics

5. **Recommendations**
   - 4 follow-up questions to explore

## Interactive Features

✅ **Click waterfall bars** to see lifecycle breakdown
✅ **Hover metric cards** to see 12-week trends
✅ **Click segment names** in table for drill-down
✅ **Responsive design** works on tablet/mobile

## Demo Scenario

The prototype shows a "Mixed Results" story:
- ✅ Strong PCW customer growth (+45K, +$15M)
- ✅ Successful reactivation campaigns (+22K, +$8M)
- ⚠️ Retail-only churn concern (-8K, -$3M)
- ➡️ Pharmacy-only segment flat (+$0.5M)

This demonstrates how the system surfaces both successes and areas needing attention.

## Troubleshooting

**Charts not showing?**
- Check internet connection (Plotly loads from CDN)
- Try refreshing the page (Cmd+R or Ctrl+R)

**Page looks broken?**
- Make sure you're opening `index.html` not `story_arc.html`
- Try a different browser (Chrome recommended)

**Want to change the data?**
- Edit `prototype/data/synthetic_data.json`
- Refresh the page to see changes

## Next Steps

After exploring the prototype:
1. Review the full plan in `/Users/chris/.claude/plans/dynamic-growing-muffin.md`
2. Check README.md for detailed documentation
3. Prepare feedback for Demo 1 stakeholder presentation

## Need Help?

- Full documentation: See `README.md`
- Plan details: See `.claude/plans/dynamic-growing-muffin.md`
- Customization: Edit JSON data or CSS files

**Ready to demo? Open `index.html` and start exploring!** 🚀
