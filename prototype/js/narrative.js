// Narrative generation functions for story arc

/**
 * Render the context section
 * @param {Object} context - Context data
 */
function renderContext(context) {
    document.getElementById('time-period').textContent = context.time_period;
    document.getElementById('strategic-goals').textContent = context.strategic_goals;
    document.getElementById('prior-trend').textContent = context.prior_trend;
}

/**
 * Generate performance narrative from scorecard data
 * @param {Object} scorecard - Scorecard metrics data
 * @returns {string} HTML string with narrative
 */
function generatePerformanceNarrative(scorecard) {
    const customers = scorecard.total_customers;
    const trips = scorecard.total_trips;
    const value = scorecard.total_value;

    const customerChange = customers.delta_pct >= 0 ? 'saw' : 'experienced';
    const tripsChange = trips.delta_pct >= 0 ? 'generating' : 'with';
    const valueChange = value.delta_pct >= 0 ? 'total value of' : 'total value of';

    return `
        <p>
            This week, CVS Health ${customerChange} <strong>${formatNumber(customers.current)}</strong> active customers
            (<span class="${getSentimentClass(customers.delta_pct)}">${formatPercent(customers.delta_pct)} YoY</span>),
            ${tripsChange} <strong>${formatNumber(trips.current)}</strong> trips
            (<span class="${getSentimentClass(trips.delta_pct)}">${formatPercent(trips.delta_pct)} YoY</span>)
            with ${valueChange} <strong>${formatCurrency(value.current)}</strong>
            (<span class="${getSentimentClass(value.delta_pct)}">${formatPercent(value.delta_pct)} YoY</span>).
        </p>
    `;
}

/**
 * Generate drivers narrative from segment data
 * @param {Array} segments - Array of segment objects
 * @returns {string} HTML string with narrative
 */
function generateDriversNarrative(segments) {
    // Check if data has a custom narrative opening (from question-specific data files)
    if (window.insightData && window.insightData.narrative_opening) {
        let narrative = `<p>${window.insightData.narrative_opening}</p>`;

        // Add detailed list
        narrative += '<ul class="driver-list">';
        segments.forEach(segment => {
            if (segment.value_delta !== 0) {
                narrative += `
                    <li>
                        <strong>${segment.name}</strong>
                        (${formatDelta(segment.customer_delta, 'customers')} customers,
                        ${formatDelta(segment.value_delta, 'dollars', true)} impact)
                        ${getSegmentDescription(segment.name)}
                    </li>
                `;
            }
        });
        narrative += '</ul>';

        return narrative;
    }

    // Fallback to default narrative logic
    // Sort segments by contribution percentage (absolute value)
    const sortedSegments = [...segments].sort((a, b) =>
        Math.abs(b.contribution_pct) - Math.abs(a.contribution_pct)
    );

    // Get top positive and negative contributors
    const positiveContributors = sortedSegments.filter(s => s.value_delta > 0).slice(0, 3);
    const negativeContributors = sortedSegments.filter(s => s.value_delta < 0).slice(0, 2);

    let narrative = '<p>Growth was primarily driven by:</p><ul class="driver-list">';

    // Add positive contributors
    positiveContributors.forEach(segment => {
        narrative += `
            <li>
                <strong>${segment.name}</strong>
                (${formatDelta(segment.customer_delta, 'customers')} customers,
                ${formatDelta(segment.value_delta, 'dollars', true)} impact)
                ${getSegmentDescription(segment.name)}
            </li>
        `;
    });

    narrative += '</ul>';

    // Add negative contributors if any
    if (negativeContributors.length > 0) {
        narrative += '<p>Partially offset by:</p><ul class="driver-list">';
        negativeContributors.forEach(segment => {
            narrative += `
                <li>
                    <strong>${segment.name}</strong>
                    (${formatDelta(segment.customer_delta, 'customers')} customers,
                    ${formatDelta(segment.value_delta, 'dollars', true)} impact)
                </li>
            `;
        });
        narrative += '</ul>';
    }

    return narrative;
}

/**
 * Get description for a segment
 * @param {string} segmentName - Name of the segment
 * @returns {string} Description text
 */
function getSegmentDescription(segmentName) {
    const descriptions = {
        'PCW Customers': '- customers engaging with both pharmacy and retail',
        'Reactivated Customers': '- previously churned customers returning',
        'Active High Maturity': '- high-value loyal customers',
        'Retail-only Active': '- customers shopping front store only',
        'Pharmacy-only': '- customers filling prescriptions only'
    };
    return descriptions[segmentName] || '';
}

/**
 * Generate trip behavior narrative for a specific segment
 * @param {Object} segment - Segment data
 * @param {Object} fullData - Full data object for context
 * @returns {string} HTML string with narrative
 */
function generateTripBehaviorNarrative(segment, fullData) {
    if (!segment) return '<p>No segment data available.</p>';

    const frequencyChange = segment.trips_per_customer_delta_pct;
    const basketChange = segment.basket_delta_pct;

    const frequencyText = frequencyChange > 0 ? 'increased' : frequencyChange < 0 ? 'decreased' : 'maintained';
    const basketText = basketChange > 0 ? 'increased' : basketChange < 0 ? 'decreased' : 'maintained';

    let narrative = `
        <div class="behavior-highlight">
            <h4>${segment.name}</h4>
            <div class="behavior-metrics">
                <div class="behavior-metric">
                    <span class="metric-label">Trips per Customer:</span>
                    <span class="metric-value">
                        ${segment.trips_per_customer_prior.toFixed(1)} → ${segment.trips_per_customer_current.toFixed(1)}
                        (<span class="${getSentimentClass(frequencyChange)}">${formatPercent(frequencyChange)}</span>)
                    </span>
                </div>
                <div class="behavior-metric">
                    <span class="metric-label">Basket Size:</span>
                    <span class="metric-value">
                        ${formatCurrency(segment.basket_prior)} → ${formatCurrency(segment.basket_current)}
                        (<span class="${getSentimentClass(basketChange)}">${formatPercent(basketChange)}</span>)
                    </span>
                </div>
            </div>
        </div>
    `;

    narrative += `
        <p>
            <strong>${segment.name}</strong> ${frequencyText} visit frequency
            (<span class="${getSentimentClass(frequencyChange)}">${formatPercent(frequencyChange)}</span>)
            and ${basketText} basket size
            (<span class="${getSentimentClass(basketChange)}">${formatPercent(basketChange)}</span>),
            ${getInterpretation(frequencyChange, basketChange)}.
        </p>
    `;

    return narrative;
}

/**
 * Get interpretation of frequency and basket changes
 * @param {number} frequencyChange - Frequency percent change
 * @param {number} basketChange - Basket percent change
 * @returns {string} Interpretation text
 */
function getInterpretation(frequencyChange, basketChange) {
    if (frequencyChange > 0 && basketChange > 0) {
        return 'indicating deeper engagement across both visit frequency and purchase value';
    } else if (frequencyChange > 0 && basketChange < 0) {
        return 'suggesting more frequent but smaller purchases';
    } else if (frequencyChange < 0 && basketChange > 0) {
        return 'showing fewer but more valuable visits';
    } else if (frequencyChange < 0 && basketChange < 0) {
        return 'indicating declining engagement across both dimensions';
    } else {
        return 'showing stable behavior patterns';
    }
}

/**
 * Render recommendations
 * @param {Array} recommendations - Array of recommendation strings
 */
function renderRecommendations(recommendations) {
    const container = document.getElementById('recommendations-content');
    if (!recommendations || recommendations.length === 0) {
        container.innerHTML = '<p>No recommendations available at this time.</p>';
        return;
    }

    let html = '';
    recommendations.forEach(rec => {
        html += `<div class="recommendation-item">${rec}</div>`;
    });

    container.innerHTML = html;
}

/**
 * Create an insight summary box
 * @param {string} title - Title of the insight
 * @param {string} content - Content of the insight
 * @param {string} type - Type: 'info', 'success', 'warning', 'danger'
 * @returns {string} HTML string
 */
function createInsightBox(title, content, type = 'info') {
    const icons = {
        info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M13 16h-1v-6h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        success: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        warning: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
        danger: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    };

    return `
        <div class="insight-box insight-${type}">
            <div class="insight-icon">${icons[type]}</div>
            <div class="insight-content">
                <h4 class="insight-title">${title}</h4>
                <p class="insight-text">${content}</p>
            </div>
        </div>
    `;
}

/**
 * Generate a 4-layer insight narrative with "What This Means" section
 * @param {Object} insight - Insight object containing layer1-4 and what_this_means
 * @returns {string} HTML string with complete insight narrative
 */
function generateInsightNarrative(insight) {
    if (!insight) return '';

    const { layer1, layer2, layer3, layer4, what_this_means } = insight;

    let html = `
        <div class="insight-narrative">
            <h3 class="insight-main-title">${insight.insight_title}</h3>

            <!-- 4-Layer Structure -->
            <div class="insight-layers">
                <div class="insight-layer layer-1">
                    <div class="layer-label">Customer Segment + Value + State</div>
                    <div class="layer-content">
                        <strong>${layer1.segment}</strong>
                        <span class="layer-detail">${layer1.pct_of_base}% of active base</span>
                        <span class="layer-detail">${formatNumber(layer1.customer_count)} customers</span>
                        <span class="layer-state">${layer1.state}</span>
                    </div>
                </div>

                <div class="insight-layer layer-2 lagging">
                    <div class="layer-label">
                        <span class="indicator-badge lagging">LAGGING</span>
                        Key Behaviors (Observable Outcomes)
                    </div>
                    <div class="layer-content">
                        <div class="behavior-metric">
                            <strong>Observable Outcome:</strong> ${layer2.observable_outcome}
                        </div>
                        <div class="behavior-metric">
                            <strong>Baseline:</strong> ${layer2.baseline}
                        </div>
                        <div class="behavior-metric">
                            <strong>Measurement:</strong> ${layer2.measurement}
                        </div>
                    </div>
                </div>

                <div class="insight-layer layer-3 leading">
                    <div class="layer-label">
                        <span class="indicator-badge leading">LEADING</span>
                        Drivers (Predictive Signals)
                    </div>
                    <div class="layer-content">
                        <div class="driver-metric">
                            <strong>Leading Indicator:</strong> ${layer3.indicator}
                        </div>
                        <div class="signal-strength-container">
                            <div class="signal-label">Signal Strength:</div>
                            <div class="signal-bar-container">
                                <div class="signal-bar" style="width: ${layer3.signal_strength}%">
                                    ${layer3.signal_strength}%
                                </div>
                            </div>
                        </div>
                        <div class="driver-metric">
                            <strong>Lead Time:</strong> ${layer3.lead_time_months} months ahead
                        </div>
                        <div class="driver-attribution">
                            <strong>Why It Predicts:</strong> ${layer3.attribution}
                        </div>
                    </div>
                </div>

                <div class="insight-layer layer-4">
                    <div class="layer-label">Applicable Value (Quantified Impact)</div>
                    <div class="layer-content value-metrics">
                        <div class="value-metric">
                            <div class="value-label">Retention Lift</div>
                            <div class="value-amount positive">+${layer4.retention_lift_pct}%</div>
                        </div>
                        <div class="value-metric">
                            <div class="value-label">CLV Lift</div>
                            <div class="value-amount positive">+${formatCurrency(layer4.clv_lift_dollars)}</div>
                        </div>
                        <div class="value-metric highlight">
                            <div class="value-label">Total Opportunity</div>
                            <div class="value-amount positive">${formatCurrency(layer4.total_opportunity_millions * 1000000, true)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- What This Means Section -->
            <div class="what-this-means">
                <h4 class="section-title">What This Means</h4>

                <div class="means-section">
                    <div class="means-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Current State
                    </div>
                    <div class="means-content">${what_this_means.current_state}</div>
                </div>

                <div class="means-section opportunity">
                    <div class="means-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        Opportunity
                    </div>
                    <div class="means-content">${what_this_means.opportunity}</div>
                </div>

                <div class="means-section early-warning">
                    <div class="means-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                        Early Warning
                    </div>
                    <div class="means-content">
                        <div><strong>Metric to Monitor:</strong> ${what_this_means.early_warning.metric}</div>
                        <div><strong>Threshold:</strong> ${what_this_means.early_warning.threshold}</div>
                        <div><strong>Signal:</strong> ${what_this_means.early_warning.signal}</div>
                    </div>
                </div>

                <div class="means-section intervention">
                    <div class="means-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                        Intervention (Proactive Action)
                    </div>
                    <div class="means-content">
                        <div><strong>Tactic:</strong> ${what_this_means.intervention.tactic}</div>
                        <div><strong>Timing:</strong> ${what_this_means.intervention.timing}</div>
                        <div><strong>Targeting:</strong> ${what_this_means.intervention.targeting}</div>
                    </div>
                </div>

                <div class="means-section expected-impact">
                    <div class="means-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                        Expected Impact (Quantified Value)
                    </div>
                    <div class="means-content impact-metrics">
                        <div class="impact-metric">
                            <span class="impact-label">Target Conversion:</span>
                            <span class="impact-value">${what_this_means.expected_impact.conversion_target_pct}%</span>
                        </div>
                        <div class="impact-metric">
                            <span class="impact-label">Customer Count:</span>
                            <span class="impact-value">${formatNumber(what_this_means.expected_impact.customer_count)}</span>
                        </div>
                        <div class="impact-metric highlight">
                            <span class="impact-label">Value:</span>
                            <span class="impact-value positive">${formatCurrency(what_this_means.expected_impact.value_millions * 1000000, true)}</span>
                        </div>
                        <div class="impact-metric">
                            <span class="impact-label">ROI:</span>
                            <span class="impact-value">${what_this_means.expected_impact.roi_multiple}x</span>
                        </div>
                    </div>
                </div>

                <div class="means-section opportunity-cost">
                    <div class="means-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Opportunity Cost
                    </div>
                    <div class="means-content opportunity-comparison">
                        <div class="opp-path optimize">
                            <div class="opp-path-label">If Optimize:</div>
                            <div class="opp-path-content">${what_this_means.opportunity_cost.if_optimize}</div>
                        </div>
                        <div class="opp-path dont-optimize">
                            <div class="opp-path-label">If Don't Optimize:</div>
                            <div class="opp-path-content">${what_this_means.opportunity_cost.if_dont_optimize}</div>
                        </div>
                        <div class="opp-risk">
                            <strong>Risk:</strong> ${what_this_means.opportunity_cost.risk}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return html;
}

/**
 * Generate Business Health Summary narrative
 * @param {Object} healthData - Business health metrics from data.business_health
 * @returns {string} HTML string with business health narrative
 */
function generateBusinessHealthNarrative(healthData) {
    if (!healthData || !healthData.aggregate) {
        return '<p>Business health data not available.</p>';
    }

    const agg = healthData.aggregate;
    const clvCurrent = agg.clv_per_customer_current;
    const clvPrior = agg.clv_per_customer_prior;
    const clvDelta = agg.clv_per_customer_delta;
    const clvDeltaPct = agg.clv_per_customer_delta_pct;

    const retentionCurrent = agg.retention_rate_current;
    const retentionPrior = agg.retention_rate_prior;
    const retentionDeltaPp = agg.retention_rate_delta_pp;

    const totalClvPoolCurrent = agg.total_clv_pool_current;
    const totalClvPoolPrior = agg.total_clv_pool_prior;
    const totalClvPoolDelta = agg.total_clv_pool_delta || (totalClvPoolCurrent - totalClvPoolPrior);
    const totalClvPoolDeltaPct = agg.total_clv_pool_delta_pct || ((totalClvPoolDelta / totalClvPoolPrior) * 100);

    // Determine sentiment for narrative
    const clvTrend = clvDeltaPct > 5 ? 'improved significantly' : clvDeltaPct > 0 ? 'improved' : clvDeltaPct < -5 ? 'declined significantly' : 'declined slightly';
    const retentionTrend = retentionDeltaPp > 3 ? 'climbing' : retentionDeltaPp > 0 ? 'increasing' : 'declining';

    // Find top contributing segment
    const topSegment = healthData.by_segment ?
        Object.entries(healthData.by_segment)
            .filter(([k, v]) => v.clv_per_customer > 0)
            .sort((a, b) => b[1].contribution_to_clv_pool_pct - a[1].contribution_to_clv_pool_pct)[0]
        : null;

    return `
        <p>
            Business health ${clvTrend} this period. <strong>CLV per customer (trailing 52-week
            accumulated revenue) reached ${formatCurrency(clvCurrent)}</strong>
            — up ${formatPercent(clvDeltaPct)} from ${formatCurrency(clvPrior)} prior period.
            <strong>Retention rate ${retentionTrend} ${Math.abs(retentionDeltaPp).toFixed(0)}pp
            to ${retentionCurrent}%</strong> (from ${retentionPrior}%), meaning ${retentionCurrent}%
            of active customers (those who purchased within the last 13 weeks) continued purchasing
            in the current period.
        </p>
        <p>
            The total CLV pool grew <strong>${formatCurrency(totalClvPoolDelta, true)}
            (+${totalClvPoolDeltaPct.toFixed(1)}%)</strong> to
            ${formatCurrency(totalClvPoolCurrent, true)}.
            ${topSegment ? `<strong>${topSegment[0]}</strong> contributes the largest share
            at ${topSegment[1].contribution_to_clv_pool_pct}% of the pool, with
            ${formatCurrency(topSegment[1].clv_per_customer)}/customer (trailing 52-week)
            and ${topSegment[1].retention_rate}% retention.` : ''}
        </p>
    `;
}

/**
 * Generate Behavioral Metrics narrative from Strategic Pillars leading indicators
 * @param {Object} pillars - Strategic pillars data from data.strategic_pillars
 * @returns {string} HTML string with behavioral metrics narrative
 */
function generateBehavioralMetricsNarrative(pillars) {
    if (!pillars) {
        return '<p>Strategic pillars data not available.</p>';
    }

    let narrative = '<p>Key behavioral shifts driving CLV and retention improvement (period-over-period). Leading indicators predict future lagging outcomes:</p><ul class="behavior-drivers-list">';

    // Extract leading indicators from each pillar
    Object.keys(pillars).forEach(pillarKey => {
        const pillar = pillars[pillarKey];
        if (!pillar.metrics || !pillar.metrics.leading) return;

        const pillarName = pillar.pillar_name || pillarKey;

        pillar.metrics.leading.forEach(indicator => {
            const prior = indicator.prior;
            const current = indicator.current;
            if (prior === undefined || current === undefined) return;

            const delta = current - prior;
            const deltaPct = prior !== 0 ? ((delta / prior) * 100).toFixed(1) : '0';

            // Determine if lower is better for this metric
            const isLowerBetter = indicator.name.includes('Recency') || indicator.name.includes('Days');
            const improving = isLowerBetter ? delta < 0 : delta > 0;
            const sentimentClass = improving ? 'positive' : delta === 0 ? 'neutral' : 'negative';

            let metricDisplay;
            if (indicator.unit === 'percent') {
                metricDisplay = `${prior}% → ${current}% (${delta > 0 ? '+' : ''}${delta.toFixed(1)}pp)`;
            } else if (indicator.unit === 'days') {
                metricDisplay = `${prior}d → ${current}d (${delta > 0 ? '+' : ''}${delta}d)`;
            } else if (indicator.unit === 'trips' || indicator.unit === 'categories') {
                metricDisplay = `${prior.toFixed(1)} → ${current.toFixed(1)} (${delta > 0 ? '+' : ''}${deltaPct}%)`;
            } else {
                metricDisplay = `${prior} → ${current} (${delta > 0 ? '+' : ''}${deltaPct}%)`;
            }

            narrative += `
                <li class="${sentimentClass}">
                    <strong>${indicator.name}:</strong> ${metricDisplay}
                    <span class="pillar-tag">${pillarName}</span>
                </li>
            `;
        });
    });

    narrative += '</ul>';
    return narrative;
}

/**
 * Generate enhanced performance narrative (CLV-first, not revenue-first)
 * @param {Object} scorecard - Scorecard metrics data
 * @param {Object} healthData - Business health data (optional)
 * @returns {string} HTML string with CLV-first narrative
 */
function generateEnhancedPerformanceNarrative(scorecard, healthData) {
    if (!healthData || !healthData.aggregate) {
        // Fallback to original revenue-focused narrative if health data unavailable
        return generatePerformanceNarrative(scorecard);
    }

    const agg = healthData.aggregate;
    const customers = scorecard.total_customers;

    return `
        <p>
            This week, CVS Health customer portfolio delivered <strong>CLV of ${formatCurrency(agg.clv_per_customer_current)}</strong>
            per customer (<span class="${getSentimentClass(agg.clv_per_customer_delta_pct)}">${formatPercent(agg.clv_per_customer_delta_pct)} YoY</span>)
            with <strong>retention rate of ${agg.retention_rate_current}%</strong>
            (<span class="${getSentimentClass(agg.retention_rate_delta_pp * 10)}">${agg.retention_rate_delta_pp > 0 ? '+' : ''}${agg.retention_rate_delta_pp.toFixed(0)}pp YoY</span>)
            across <strong>${formatNumber(customers.current)}</strong> active customers
            (<span class="${getSentimentClass(customers.delta_pct)}">${formatPercent(customers.delta_pct)} YoY</span>).
        </p>
        <p>
            Total CLV pool reached <strong>${formatCurrency(agg.total_clv_pool_current, true)}</strong>,
            up <strong>${formatCurrency(agg.total_clv_pool_current - agg.total_clv_pool_prior, true)}</strong>
            (+${(agg.total_clv_pool_delta_pct || 0).toFixed(1)}%) from prior year.
        </p>
    `;
}

/**
 * Generate Tier 2 Functional Area narrative for segment drill-down
 * @param {Object} segmentData - Segment data including tier2_tags
 * @param {string} segmentName - Name of the segment
 * @returns {string} HTML string with Tier 2 functional area breakdown
 */
function generateTier2Narrative(segmentData, segmentName) {
    if (!segmentData || !segmentData.tier2_tags) {
        return '';
    }

    const tier2Tags = segmentData.tier2_tags;
    const tier2Areas = [
        {key: 'acquisition_onboarding', label: 'Customer Acquisition & Onboarding', icon: '🎯'},
        {key: 'retention_ltv', label: 'Customer Retention & Lifetime Value', icon: '🔒'},
        {key: 'cross_business_behavior', label: 'Cross-Business Customer Behavior', icon: '🔄'},
        {key: 'engagement_loyalty', label: 'Customer Engagement & Loyalty', icon: '⭐'},
        {key: 'segmentation_targeting', label: 'Customer Segmentation & Targeting', icon: '📊'}
    ];

    let html = `
        <div class="tier2-functional-view">
            <h4 class="tier2-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
                Functional Area Contribution (Tier 2 View)
            </h4>
            <p class="tier2-description">Which business functional areas does this segment drive?</p>

            <div class="tier2-cards-grid">
    `;

    // Render card for each Tier 2 functional area
    tier2Areas.forEach(area => {
        const areaData = tier2Tags[area.key];
        if (!areaData) return;

        const customers = areaData.customers;
        const value = areaData.value;
        const description = areaData.description;

        // Determine card class based on value
        let cardClass = 'tier2-card';
        if (value > 10000000) cardClass += ' high-value';
        else if (value > 1000000) cardClass += ' medium-value';
        else if (value > 0) cardClass += ' low-value';
        else cardClass += ' zero-value';

        html += `
            <div class="${cardClass}" data-area="${area.key}">
                <div class="tier2-card-header">
                    <span class="tier2-icon">${area.icon}</span>
                    <h5 class="tier2-card-title">${area.label}</h5>
                </div>
                <div class="tier2-card-metrics">
                    <div class="tier2-metric">
                        <span class="tier2-metric-label">Customers:</span>
                        <span class="tier2-metric-value">${formatNumber(customers)}</span>
                    </div>
                    <div class="tier2-metric">
                        <span class="tier2-metric-label">Value:</span>
                        <span class="tier2-metric-value">${formatCurrency(value, true)}</span>
                    </div>
                </div>
                <div class="tier2-card-description">
                    ${description}
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

/**
 * Generate Geographic & Demographic Attribution narrative
 * @param {Object} regionalData - regional_performance data (enterprise + regions)
 * @param {Array} segments - segments array
 * @returns {string} HTML narrative string
 */
function generateGeoDemoNarrative(regionalData, segments) {
    if (!regionalData || !regionalData.regions) {
        return '<p>Geographic data not available.</p>';
    }

    const regions = regionalData.regions;

    // Find highest-growth region
    const regionEntries = Object.entries(regions);
    const topRegion = regionEntries.sort((a, b) => b[1].yoy_pct - a[1].yoy_pct)[0];
    const topRegionLabel = topRegion[1].label;
    const topRegionYoy = topRegion[1].yoy_pct;

    // Find top DMA across all regions
    let topDMA = null;
    let topDMAYoy = -Infinity;
    regionEntries.forEach(([key, region]) => {
        if (region.dmas) {
            region.dmas.forEach(dma => {
                if (dma.yoy_pct > topDMAYoy) {
                    topDMAYoy = dma.yoy_pct;
                    topDMA = { ...dma, regionLabel: region.label };
                }
            });
        }
    });

    // Find PCW demographic highlight
    const pcwSegment = segments.find(s => s.name === 'PCW Customers');
    const pcwDemo = pcwSegment && pcwSegment.demographic_summary;

    return `
        <p>
            <strong>${topRegionLabel}</strong> is the fastest-growing region at
            <strong>+${topRegionYoy}% YoY</strong>, led by
            ${topDMA ? `<strong>${topDMA.dma}, ${topDMA.state}</strong> (+${topDMA.yoy_pct}% YoY)` : 'multiple markets'}.
            ${pcwDemo ? `PCW customer growth is concentrated in the <strong>${pcwDemo.top_age_group}</strong>
            age group (${pcwDemo.top_age_pct}% of segment), with
            <strong>${pcwDemo.top_region}</strong> contributing ${pcwDemo.top_region_pct}% of segment value.
            Income profile skews toward <strong>${pcwDemo.top_income}</strong> (${pcwDemo.top_income_pct}%),
            with a female-majority customer base (${pcwDemo.gender_split.female}% female).` : ''}
        </p>
        <p>Click a region bar below to see the full DMA breakdown, or click a waterfall segment bar above
        to see its regional attribution.</p>
    `;
}
