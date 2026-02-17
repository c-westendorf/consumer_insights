// Plotly visualization functions

/**
 * Render the scorecard grid with metric cards
 * @param {Object} scorecard - Scorecard data object
 */
function renderScorecard(scorecard) {
    const container = document.getElementById('scorecard-grid');
    container.innerHTML = '';

    const metrics = [
        'total_customers',
        'total_trips',
        'total_value',
        'value_per_customer',
        'trips_per_customer',
        'basket_size'
    ];

    metrics.forEach(metricKey => {
        const metric = scorecard[metricKey];
        const sentimentClass = getSentimentClass(metric.delta_pct);

        const card = document.createElement('div');
        card.className = `metric-card ${sentimentClass}`;

        // Create sparkline
        const sparklineImg = createSparkline(
            metric.trend_12w,
            120,
            40,
            sentimentClass === 'positive' ? '#00A650' : sentimentClass === 'negative' ? '#CC0000' : '#767676'
        );

        card.innerHTML = `
            <div class="metric-name">${metric.metric_name}</div>
            <div class="metric-value">${formatMetricValue(metric.current, metric.unit)}</div>
            <div class="metric-change ${sentimentClass}">
                ${getArrowIcon(metric.delta)}
                ${formatDelta(metric.delta, metric.unit)} (${formatPercent(metric.delta_pct)})
            </div>
            ${sparklineImg ? `<img src="${sparklineImg}" class="metric-trend" alt="12-week trend">` : ''}
        `;

        // Add hover tooltip
        card.title = `12-week trend: ${metric.trend_12w.map(v => v.toFixed(1)).join('%, ')}%`;

        container.appendChild(card);
    });
}

/**
 * Format metric value based on unit type
 * @param {number} value - The value to format
 * @param {string} unit - The unit type
 * @returns {string} Formatted value
 */
function formatMetricValue(value, unit) {
    switch (unit) {
        case 'dollars':
            return formatCurrency(value, true);
        case 'customers':
        case 'trips':
            return formatNumber(value);
        default:
            return value.toFixed(2);
    }
}

/**
 * Render waterfall chart showing segment contributions
 * @param {Object} waterfallData - Waterfall data object
 */
function renderWaterfall(waterfallData) {
    const { baseline, changes, total } = waterfallData;

    // Prepare data for Plotly waterfall
    const labels = [baseline.label];
    const measures = ['absolute'];
    const values = [baseline.value];
    const texts = [formatCurrency(baseline.value, true)];
    const colors = ['#0033A0'];

    changes.forEach(change => {
        labels.push(change.label);
        measures.push('relative');
        values.push(change.value);
        texts.push(formatCurrency(Math.abs(change.value), true));
        colors.push(change.type === 'increase' ? '#00A650' : '#CC0000');
    });

    labels.push(total.label);
    measures.push('total');
    values.push(total.value);
    texts.push(formatCurrency(total.value, true));
    colors.push('#0033A0');

    const trace = {
        type: 'waterfall',
        orientation: 'v',
        measure: measures,
        x: labels,
        y: values,
        text: texts,
        textposition: 'outside',
        connector: {
            line: {
                color: '#767676',
                width: 2
            }
        },
        increasing: {
            marker: {
                color: '#00A650'
            }
        },
        decreasing: {
            marker: {
                color: '#CC0000'
            }
        },
        totals: {
            marker: {
                color: '#0033A0'
            }
        }
    };

    const layout = {
        title: {
            text: 'Segment Contribution to Total Value Change (YoY)',
            font: {
                size: 16,
                family: 'Helvetica Neue, Arial, sans-serif'
            }
        },
        xaxis: {
            title: '',
            tickangle: -45
        },
        yaxis: {
            title: 'Value ($)',
            tickformat: '$,.0s'
        },
        showlegend: false,
        margin: {
            l: 80,
            r: 40,
            t: 60,
            b: 120
        },
        paper_bgcolor: '#FFFFFF',
        plot_bgcolor: '#F5F5F5',
        font: {
            family: 'Open Sans, Arial, sans-serif'
        }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d']
    };

    Plotly.newPlot('waterfall-chart', [trace], layout, config);

    // Add click event to waterfall bars
    document.getElementById('waterfall-chart').on('plotly_click', function(data) {
        const pointIndex = data.points[0].pointIndex;
        const label = labels[pointIndex];

        // Don't open modal for baseline or total
        if (label !== baseline.label && label !== total.label) {
            openDrillDown(label);
        }
    });
}

/**
 * Render behavior comparison table with sparklines
 * @param {Array} segments - Array of segment objects
 */
function renderSparklineTable(segments) {
    const container = document.getElementById('behavior-table-container');

    let html = `
        <table class="behavior-table">
            <thead>
                <tr>
                    <th>Segment</th>
                    <th>Customers</th>
                    <th>Customer Δ%</th>
                    <th>Trips/Customer</th>
                    <th>Δ%</th>
                    <th>Basket Size</th>
                    <th>Δ%</th>
                    <th>Value Impact</th>
                </tr>
            </thead>
            <tbody>
    `;

    segments.forEach(segment => {
        const customerClass = getSentimentClass(segment.customer_delta_pct);
        const tripsClass = getSentimentClass(segment.trips_per_customer_delta_pct);
        const basketClass = getSentimentClass(segment.basket_delta_pct);
        const valueClass = getSentimentClass(segment.value_delta);

        html += `
            <tr>
                <td class="segment-name">${segment.name}</td>
                <td>${formatNumber(segment.customer_current)}</td>
                <td class="value-${customerClass}">${formatPercent(segment.customer_delta_pct)}</td>
                <td>${segment.trips_per_customer_current.toFixed(1)}</td>
                <td class="value-${tripsClass}">${formatPercent(segment.trips_per_customer_delta_pct)}</td>
                <td>${formatCurrency(segment.basket_current)}</td>
                <td class="value-${basketClass}">${formatPercent(segment.basket_delta_pct)}</td>
                <td class="value-${valueClass}">${formatCurrency(segment.value_delta, true)}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

/**
 * Render treemap for drill-down modal
 * @param {string} segmentName - Name of the segment
 * @param {Object} drillDownData - Drill-down data for the segment
 */
function renderTreemap(segmentName, drillDownData) {
    if (!drillDownData || !drillDownData.lifecycle) {
        document.getElementById('treemap-chart').innerHTML =
            '<p class="error-message">No drill-down data available for this segment.</p>';
        return;
    }

    const lifecycleData = drillDownData.lifecycle;

    const labels = lifecycleData.map(d => d.stage);
    const parents = new Array(lifecycleData.length).fill(segmentName);
    const values = lifecycleData.map(d => d.customers);
    const colors = lifecycleData.map(d => {
        if (d.yoy_pct > 10) return '#00A650';
        if (d.yoy_pct > 0) return '#90EE90';
        if (d.yoy_pct > -10) return '#FFB6C1';
        return '#CC0000';
    });
    const texts = lifecycleData.map(d =>
        `${d.stage}<br>${formatNumber(d.customers)} customers<br>${formatPercent(d.yoy_pct)} YoY`
    );

    // Add root node
    labels.unshift(segmentName);
    parents.unshift('');
    values.unshift(0);
    colors.unshift('#0033A0');
    texts.unshift(segmentName);

    const trace = {
        type: 'treemap',
        labels: labels,
        parents: parents,
        values: values,
        text: texts,
        textposition: 'middle center',
        marker: {
            colors: colors,
            line: {
                width: 2,
                color: '#FFFFFF'
            }
        },
        hovertemplate: '%{text}<extra></extra>'
    };

    const layout = {
        title: {
            text: `${segmentName} - Lifecycle Breakdown`,
            font: {
                size: 14,
                family: 'Helvetica Neue, Arial, sans-serif'
            }
        },
        margin: {
            l: 10,
            r: 10,
            t: 40,
            b: 10
        },
        font: {
            family: 'Open Sans, Arial, sans-serif',
            size: 12
        }
    };

    const config = {
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot('treemap-chart', [trace], layout, config).then(function() {
        // Add click event handler to enable drill-down to Level 3 (Maturity Tiers)
        document.getElementById('treemap-chart').on('plotly_click', function(data) {
            const point = data.points[0];
            const clickedLabel = point.label;

            // Don't drill down if clicking the root node
            if (clickedLabel === segmentName) {
                return;
            }

            // Get the lifecycle stage that was clicked
            const lifecycleStage = clickedLabel;

            // Open maturity tier drill-down (Level 3)
            openMaturityDrillDown(segmentName, lifecycleStage);
        });
    });
}

/**
 * Render drill-down table
 * @param {Object} drillDownData - Drill-down data
 */
function renderDrillDownTable(drillDownData) {
    const container = document.getElementById('drill-down-table');

    if (!drillDownData || !drillDownData.lifecycle) {
        container.innerHTML = '<p>No detailed data available.</p>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Lifecycle Stage</th>
                    <th>Customers</th>
                    <th>YoY Change</th>
                    <th>Value</th>
                    <th>Trips/Customer</th>
                </tr>
            </thead>
            <tbody>
    `;

    drillDownData.lifecycle.forEach(stage => {
        const sentimentClass = getSentimentClass(stage.yoy_pct);
        html += `
            <tr>
                <td><strong>${stage.stage}</strong></td>
                <td>${formatNumber(stage.customers)}</td>
                <td class="${sentimentClass}">${formatPercent(stage.yoy_pct)}</td>
                <td>${formatCurrency(stage.value, true)}</td>
                <td>${stage.trips_per_customer.toFixed(1)}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

/**
 * Render pillar scorecard with lagging/leading indicators
 * @param {Object} pillars - Strategic pillars data
 * @param {string} containerId - Container element ID
 */
function renderPillarScorecard(pillars, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !pillars) return;

    let html = '<div class="pillar-scorecard-grid">';

    for (const pillarKey in pillars) {
        const pillar = pillars[pillarKey];

        html += `
            <div class="pillar-card">
                <h3 class="pillar-title">${pillar.pillar_name}</h3>

                <div class="metrics-section">
                    <div class="metrics-label lagging">
                        <span class="indicator-badge lagging">LAGGING</span>
                        Outcomes
                    </div>
                    <div class="metrics-list">
        `;

        pillar.metrics.lagging.forEach(metric => {
            const trendClass = metric.trend > 0 ? 'positive' : metric.trend < 0 ? 'negative' : 'neutral';
            html += `
                <div class="metric-row">
                    <span class="metric-name">${metric.name}</span>
                    <span class="metric-values">
                        <span class="current">${formatMetricValue(metric.current, metric.unit)}</span>
                        <span class="trend ${trendClass}">${metric.trend > 0 ? '+' : ''}${metric.trend}%</span>
                    </span>
                </div>
            `;
        });

        html += `
                    </div>
                </div>

                <div class="metrics-section">
                    <div class="metrics-label leading">
                        <span class="indicator-badge leading">LEADING</span>
                        Predictors
                    </div>
                    <div class="metrics-list">
        `;

        pillar.metrics.leading.forEach(metric => {
            const trendClass = metric.trend > 0 ? 'positive' : metric.trend < 0 ? 'negative' : 'neutral';
            html += `
                <div class="metric-row">
                    <span class="metric-name">${metric.name}</span>
                    <span class="metric-values">
                        <span class="current">${formatMetricValue(metric.current, metric.unit)}</span>
                        <span class="trend ${trendClass}">${metric.trend > 0 ? '+' : ''}${metric.trend}%</span>
                    </span>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
            </div>
        `;
    }

    html += '</div>';
    container.innerHTML = html;
}

/**
 * Render Strategic Pillars Dashboard with KPI gauges (Enhanced version)
 * @param {Object} pillars - Strategic pillars data from data.strategic_pillars
 */
function renderStrategicPillarsDashboard(pillars) {
    const container = document.getElementById('pillars-dashboard');
    if (!container || !pillars) return;

    const pillarOrder = ['grow_active_customers', 'improve_retention', 'increase_frequency_basket'];
    const pillarTitles = {
        'grow_active_customers': 'Grow Active Customers',
        'improve_retention': 'Improve Retention',
        'increase_frequency_basket': 'Increase Frequency & Basket'
    };

    let html = '<div class="pillars-dashboard-grid">';

    pillarOrder.forEach(pillarKey => {
        const pillar = pillars[pillarKey];
        if (!pillar || !pillar.metrics) return;

        html += `
            <div class="pillar-card">
                <h3 class="pillar-card-title">${pillar.pillar_name || pillarTitles[pillarKey]}</h3>

                <!-- Lagging Indicators Section -->
                <div class="pillar-section lagging-section">
                    <div class="pillar-section-header">
                        <span class="indicator-badge lagging">LAGGING</span>
                        <span class="section-label">Business Outcomes</span>
                    </div>
                    <div class="lagging-metrics-grid">
        `;

        pillar.metrics.lagging.forEach(metric => {
            // For metrics where lower is better, invert the sentiment
            const isLowerBetter = metric.name.includes('Churn') || metric.name.includes('CAC') || metric.name.includes('At-Risk');
            const trendValue = metric.trend || 0;
            const effectiveTrend = isLowerBetter ? -trendValue : trendValue;
            const statusClass = effectiveTrend > 0 ? 'positive' : effectiveTrend < 0 ? 'negative' : 'neutral';

            // Calculate absolute change
            const absoluteChange = metric.current - metric.prior;
            const changeDisplay = absoluteChange !== 0 ?
                `${absoluteChange > 0 ? '+' : ''}${formatKPIValue(Math.abs(absoluteChange), metric.unit)}` : '';

            html += `
                <div class="kpi-gauge ${statusClass}">
                    <div class="kpi-label">${metric.name}</div>
                    <div class="kpi-value">
                        ${formatKPIValue(metric.current, metric.unit)}
                    </div>
                    <div class="kpi-change">
                        ${changeDisplay ? `<span class="${statusClass}">${effectiveTrend > 0 ? '↑' : effectiveTrend < 0 ? '↓' : '→'} ${changeDisplay} (${trendValue > 0 ? '+' : ''}${trendValue.toFixed(1)}%)</span>` : '<span>No change</span>'}
                    </div>
                    <div class="kpi-prior">
                        Prior: ${formatKPIValue(metric.prior, metric.unit)}
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>

                <!-- Leading Indicators Section -->
                <div class="pillar-section leading-section">
                    <div class="pillar-section-header">
                        <span class="indicator-badge leading">LEADING</span>
                        <span class="section-label">Predictive Signals</span>
                    </div>
                    <div class="leading-metrics-list">
        `;

        pillar.metrics.leading.forEach(indicator => {
            // For leading indicators where lower is better
            const isLowerBetter = indicator.name.includes('Recency') || indicator.name.includes('Days');
            const trend = indicator.trend || 0;
            const effectiveTrend = isLowerBetter ? -trend : trend;
            const trendIcon = effectiveTrend > 0 ? '↑' : effectiveTrend < 0 ? '↓' : '→';
            const trendClass = effectiveTrend > 0 ? 'positive' : effectiveTrend < 0 ? 'negative' : 'neutral';

            const absoluteChange = indicator.current - indicator.prior;
            const changeDisplay = absoluteChange !== 0 ?
                `${absoluteChange > 0 ? '+' : ''}${formatKPIValue(Math.abs(absoluteChange), indicator.unit)}` : '';

            html += `
                <div class="leading-indicator-row">
                    <div class="leading-indicator-name">${indicator.name}</div>
                    <div class="leading-indicator-values">
                        <span class="leading-current">${formatKPIValue(indicator.current, indicator.unit)}</span>
                        ${trend !== 0 ? `<span class="leading-trend ${trendClass}">${trendIcon} ${changeDisplay} (${trend > 0 ? '+' : ''}${trend}%)</span>` : ''}
                    </div>
                    <div class="leading-prior">vs. ${formatKPIValue(indicator.prior, indicator.unit)} prior period</div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

/**
 * Format KPI value based on unit
 * @param {number} value - Value to format
 * @param {string} unit - Unit type (%, score, days, rate, etc.)
 * @returns {string} Formatted value
 */
function formatKPIValue(value, unit) {
    if (!value && value !== 0) return 'N/A';

    if (unit === 'percent' || unit === '%') {
        return `${value}%`;
    } else if (unit === 'score') {
        return value.toFixed(1);
    } else if (unit === 'days') {
        return `${value}d`;
    } else if (unit === 'rate') {
        return `${value}%`;
    } else if (unit === 'customers') {
        return value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toString();
    } else if (unit === 'customers/quarter') {
        return value >= 1000 ? `${(value / 1000).toFixed(0)}K/qtr` : `${value}/qtr`;
    } else if (unit === 'dollars') {
        return `$${value}`;
    } else if (unit === 'trips') {
        return value.toFixed(2);
    } else if (unit === 'categories') {
        return value.toFixed(1);
    } else {
        return typeof value === 'number' ? value.toFixed(1) : value.toString();
    }
}

/**
 * Render Business Health Summary cards
 * @param {Object} healthMetrics - Business health data from data.business_health.aggregate
 */
function renderBusinessHealthSummary(healthMetrics) {
    const container = document.getElementById('health-summary-cards');
    if (!container || !healthMetrics) return;

    const cards = [
        {
            title: 'CLV per Customer',
            current: healthMetrics.clv_per_customer_current,
            prior: healthMetrics.clv_per_customer_prior,
            delta: healthMetrics.clv_per_customer_delta,
            deltaPct: healthMetrics.clv_per_customer_delta_pct,
            unit: 'currency',
            icon: '💰',
            description: 'Trailing 52-week accumulated value'
        },
        {
            title: 'Retention Rate',
            current: healthMetrics.retention_rate_current,
            prior: healthMetrics.retention_rate_prior,
            delta: healthMetrics.retention_rate_delta_pp,
            deltaPct: (healthMetrics.retention_rate_delta_pp / healthMetrics.retention_rate_prior) * 100,
            unit: 'percent',
            icon: '🔒',
            description: '% active in 13-week window'
        },
        {
            title: 'Total CLV Pool',
            current: healthMetrics.total_clv_pool_current,
            prior: healthMetrics.total_clv_pool_prior,
            delta: healthMetrics.total_clv_pool_delta,
            deltaPct: healthMetrics.total_clv_pool_delta_pct,
            unit: 'currency',
            icon: '🏦',
            description: 'Aggregate customer value'
        }
    ];

    let html = '';

    cards.forEach(card => {
        const sentimentClass = card.delta > 0 ? 'positive' : card.delta < 0 ? 'negative' : 'neutral';

        let currentDisplay, deltaDisplay;
        if (card.unit === 'currency') {
            const useCompact = card.current >= 1000000;
            currentDisplay = formatCurrency(card.current, useCompact);
            deltaDisplay = `${card.delta > 0 ? '+' : ''}${formatCurrency(Math.abs(card.delta), useCompact)}`;
        } else if (card.unit === 'percent') {
            currentDisplay = `${card.current}%`;
            deltaDisplay = `${card.delta > 0 ? '+' : ''}${card.delta.toFixed(0)}pp`;
        } else if (card.unit === 'score') {
            currentDisplay = card.current.toFixed(1);
            deltaDisplay = `${card.delta > 0 ? '+' : ''}${card.delta.toFixed(1)}`;
        }

        // Create mini sparkline (mock trend - would use actual data in production)
        const sparklineSvg = createHealthSparkline(card.prior, card.current, sentimentClass);

        html += `
            <div class="health-summary-card ${sentimentClass}">
                <div class="health-card-icon">${card.icon}</div>
                <div class="health-card-content">
                    <div class="health-card-title">${card.title}</div>
                    <div class="health-card-value">${currentDisplay}</div>
                    <div class="health-card-delta ${sentimentClass}">
                        ${card.delta > 0 ? '↑' : card.delta < 0 ? '↓' : '→'} ${deltaDisplay} (${formatPercent(card.deltaPct)})
                    </div>
                    <div class="health-card-description">${card.description}</div>
                </div>
                <div class="health-card-sparkline">
                    ${sparklineSvg}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Create a simple SVG sparkline for health metrics
 * @param {number} prior - Prior value
 * @param {number} current - Current value
 * @param {string} sentimentClass - Sentiment class (positive/negative/neutral)
 * @returns {string} SVG string
 */
function createHealthSparkline(prior, current, sentimentClass) {
    const color = sentimentClass === 'positive' ? '#00A650' : sentimentClass === 'negative' ? '#CC0000' : '#767676';

    // Create a simple 2-point trend line
    const width = 80;
    const height = 30;
    const padding = 2;

    const minVal = Math.min(prior, current);
    const maxVal = Math.max(prior, current);
    const range = maxVal - minVal || 1;

    const x1 = padding;
    const y1 = height - padding - ((prior - minVal) / range) * (height - 2 * padding);
    const x2 = width - padding;
    const y2 = height - padding - ((current - minVal) / range) * (height - 2 * padding);

    return `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                  stroke="${color}" stroke-width="2" stroke-linecap="round"/>
            <circle cx="${x2}" cy="${y2}" r="3" fill="${color}"/>
        </svg>
    `;
}

/**
 * Render Value Reconciliation Waterfall (CLV Pool Growth)
 * @param {Object} reconciliation - Reconciliation data from data.behavioral_reconciliation
 * @param {string} segmentName - Name of segment (or "aggregate" for total)
 */
function renderValueReconciliationWaterfall(reconciliation, segmentName = 'aggregate') {
    const container = document.getElementById('reconciliation-waterfall');
    if (!container || !reconciliation) return;

    // For aggregate view, we need to sum across all segments
    // For now, using PCW Customers as example (would aggregate in production)
    const segmentKey = segmentName === 'aggregate' ? 'PCW Customers' : segmentName;
    const data = reconciliation[segmentKey];

    if (!data) {
        container.innerHTML = '<p>Reconciliation data not available for this view.</p>';
        return;
    }

    // Prepare waterfall data
    const labels = ['Prior CLV Pool'];
    const measures = ['absolute'];
    const values = [data.prior_value];
    const texts = [formatCurrency(data.prior_value, true)];
    const colors = ['#0033A0'];

    // Add each effect
    data.effects.forEach(effect => {
        let effectValue = effect.value;
        let effectLabel = effect.effect_label || effect.effect_type;

        labels.push(effectLabel);
        measures.push('relative');
        values.push(effectValue);
        texts.push(formatCurrency(Math.abs(effectValue), true));
        colors.push(effectValue > 0 ? '#00A650' : '#CC0000');
    });

    // Add total
    labels.push('Current CLV Pool');
    measures.push('total');
    values.push(data.current_value);
    texts.push(formatCurrency(data.current_value, true));
    colors.push('#0033A0');

    const trace = {
        type: 'waterfall',
        orientation: 'v',
        measure: measures,
        x: labels,
        y: values,
        text: texts,
        textposition: 'outside',
        marker: {
            color: colors
        },
        connector: {
            line: {
                color: '#767676',
                width: 1
            }
        }
    };

    const layout = {
        title: {
            text: `CLV Pool Reconciliation: ${segmentKey}`,
            font: { size: 16, family: 'CVS Health Sans, Arial, sans-serif' }
        },
        showlegend: false,
        margin: { l: 80, r: 40, t: 60, b: 120 },
        xaxis: {
            tickangle: -45,
            automargin: true
        },
        yaxis: {
            title: 'CLV Pool Value ($)',
            tickformat: ',.0f'
        },
        font: {
            family: 'CVS Health Sans, Arial, sans-serif',
            size: 12
        }
    };

    const config = {
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot(container, [trace], layout, config);

    // Add drill-down details below the waterfall
    renderReconciliationDrillDown(data, segmentKey);
}

/**
 * Render reconciliation drill-down details showing drivers and cohorts
 * @param {Object} data - Reconciliation data for a segment
 * @param {string} segmentKey - Segment name
 */
function renderReconciliationDrillDown(data, segmentKey) {
    const drillDownContainer = document.getElementById('reconciliation-drilldown');
    if (!drillDownContainer) return;

    let html = `
        <div class="reconciliation-drilldown">
            <h3>Value Driver Details: ${segmentKey}</h3>
            <div class="effects-breakdown">
    `;

    // Sort effects by rank
    const sortedEffects = [...data.effects].sort((a, b) => (a.rank || 0) - (b.rank || 0));

    sortedEffects.forEach(effect => {
        const valueClass = effect.value > 0 ? 'positive' : 'negative';
        const pctSign = effect.pct_of_total > 0 ? '+' : '';

        html += `
            <div class="effect-card ${valueClass}">
                <div class="effect-header">
                    <h4>${effect.effect_label}</h4>
                    <div class="effect-value">
                        ${formatCurrency(effect.value, true)}
                        <span class="effect-pct">(${pctSign}${effect.pct_of_total.toFixed(1)}% of total)</span>
                    </div>
                </div>

                ${effect.drivers && effect.drivers.length > 0 ? `
                    <div class="effect-drivers">
                        <div class="section-label">Behavioral Drivers:</div>
                        <ul class="drivers-list">
                            ${effect.drivers.map(driver => `
                                <li>
                                    <strong>${driver.behavior}</strong> → ${driver.impact}
                                    <div class="pillar-link">From pillar: ${formatPillarName(driver.from_pillar)} → ${driver.pillar_metric}</div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${effect.sub_effects && effect.sub_effects.length > 0 ? `
                    <div class="sub-effects">
                        <div class="section-label">Breakdown:</div>
                        ${effect.sub_effects.map(sub => `
                            <div class="sub-effect-row">
                                <div class="sub-effect-name">${sub.sub_label}</div>
                                <div class="sub-effect-value ${sub.value > 0 ? 'positive' : 'negative'}">
                                    ${formatCurrency(sub.value, true)} (${sub.pct_of_total.toFixed(1)}%)
                                </div>
                                ${sub.drivers && sub.drivers.length > 0 ? `
                                    <ul class="sub-drivers-list">
                                        ${sub.drivers.map(driver => `
                                            <li>${driver.behavior} → ${driver.impact}</li>
                                        `).join('')}
                                    </ul>
                                ` : ''}
                                ${sub.cohorts && sub.cohorts.length > 0 ? `
                                    <div class="cohorts-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Cohort</th>
                                                    <th>Customers</th>
                                                    <th>Metrics</th>
                                                    <th>Impact</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${sub.cohorts.map(cohort => `
                                                    <tr>
                                                        <td><strong>${cohort.tier_transition || cohort.name}</strong></td>
                                                        <td>${formatNumber(cohort.customers)}</td>
                                                        <td>
                                                            ${cohort.clv_from ? `CLV: $${cohort.clv_from} → $${cohort.clv_to}` : ''}
                                                            ${cohort.trip_frequency_prior ? `Trips: ${cohort.trip_frequency_prior.toFixed(1)} → ${cohort.trip_frequency_current.toFixed(1)}` : ''}
                                                            ${cohort.basket_from ? `Basket: $${cohort.basket_from.toFixed(2)} → $${cohort.basket_to.toFixed(2)}` : ''}
                                                        </td>
                                                        <td>
                                                            ${cohort.clv_lift ? `+$${cohort.clv_lift}/customer` : ''}
                                                            ${cohort.total_clv_impact ? ` (${formatCurrency(cohort.total_clv_impact, true)} total)` : ''}
                                                        </td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${effect.cohorts && effect.cohorts.length > 0 ? `
                    <div class="cohorts-table">
                        <div class="section-label">Cohort Analysis:</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Cohort</th>
                                    <th>Customers</th>
                                    <th>Performance</th>
                                    <th>Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${effect.cohorts.map(cohort => `
                                    <tr>
                                        <td><strong>${cohort.name}</strong></td>
                                        <td>${formatNumber(cohort.customers)}</td>
                                        <td>
                                            ${cohort.retention_rate ? `${cohort.retention_rate}% retention` : ''}
                                            ${cohort.conversion_rate ? `${cohort.conversion_rate}% conversion` : ''}
                                            ${cohort.onboarding_days_current ? `${cohort.onboarding_days_current}d onboarding` : ''}
                                            ${cohort.avg_clv ? `$${cohort.avg_clv} avg CLV` : ''}
                                        </td>
                                        <td>
                                            ${cohort.retention_lift_pp ? `+${cohort.retention_lift_pp}pp retention lift` : ''}
                                            ${cohort.onboarding_days_prior ? `(was ${cohort.onboarding_days_prior}d)` : ''}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : ''}
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    drillDownContainer.innerHTML = html;
}

/**
 * Format pillar name for display
 */
function formatPillarName(pillarKey) {
    const names = {
        'grow_active_customers': 'Grow Active Customers',
        'improve_retention': 'Improve Retention',
        'increase_frequency_basket': 'Increase Frequency & Basket'
    };
    return names[pillarKey] || pillarKey;
}

/**
 * Render regional attribution grouped bar chart
 * Shows YoY growth % by region for top segments
 * @param {Object} regionalData - regional_performance data
 */
function renderRegionalAttributionChart(regionalData) {
    const container = document.getElementById('regional-attribution-chart');
    if (!container || !regionalData || !regionalData.regions) return;

    const regions = regionalData.regions;
    const regionKeys = ['northeast', 'southeast', 'midwest', 'west'];
    const regionLabels = regionKeys.map(k => regions[k] ? regions[k].label : k);

    // Enterprise baseline YoY for reference
    const enterpriseYoy = regionalData.enterprise ? regionalData.enterprise.yoy_pct : 0;

    // Traces: one per metric shown
    const clvTrace = {
        name: 'CLV/Customer ($)',
        type: 'bar',
        x: regionLabels,
        y: regionKeys.map(k => regions[k] ? regions[k].clv_per_customer : 0),
        marker: { color: '#0033A0' },
        yaxis: 'y2',
        text: regionKeys.map(k => regions[k] ? `$${regions[k].clv_per_customer}` : ''),
        textposition: 'auto'
    };

    const yoyTrace = {
        name: 'YoY Customer Growth (%)',
        type: 'bar',
        x: regionLabels,
        y: regionKeys.map(k => regions[k] ? regions[k].yoy_pct : 0),
        marker: { color: regionKeys.map(k => {
            const yoy = regions[k] ? regions[k].yoy_pct : 0;
            return yoy > enterpriseYoy ? '#00A650' : '#CC0000';
        })},
        text: regionKeys.map(k => regions[k] ? `+${regions[k].yoy_pct}%` : ''),
        textposition: 'auto'
    };

    const retentionTrace = {
        name: 'Retention Rate (%)',
        type: 'scatter',
        mode: 'markers+text',
        x: regionLabels,
        y: regionKeys.map(k => regions[k] ? regions[k].retention_rate : 0),
        marker: { color: '#CC0000', size: 10 },
        text: regionKeys.map(k => regions[k] ? `${regions[k].retention_rate}%` : ''),
        textposition: 'top center',
        yaxis: 'y3'
    };

    const layout = {
        title: { text: 'Regional Performance: YoY Growth, CLV & Retention', font: { size: 16 } },
        showlegend: true,
        legend: { orientation: 'h', y: -0.2 },
        margin: { l: 60, r: 60, t: 60, b: 80 },
        barmode: 'group',
        xaxis: { title: 'Region' },
        yaxis: { title: 'YoY Growth %', side: 'left' },
        yaxis2: { title: 'CLV/Customer ($)', side: 'right', overlaying: 'y', showgrid: false },
        yaxis3: { title: 'Retention %', side: 'right', overlaying: 'y', showgrid: false, visible: false },
        font: { family: 'CVS Health Sans, Arial, sans-serif', size: 12 },
        shapes: [{
            type: 'line',
            x0: -0.5, x1: regionLabels.length - 0.5,
            y0: enterpriseYoy, y1: enterpriseYoy,
            line: { color: '#767676', width: 1, dash: 'dash' }
        }]
    };

    const config = { responsive: true, displayModeBar: false };

    Plotly.newPlot(container, [yoyTrace, clvTrace, retentionTrace], layout, config).then(function() {
        // Wire DMA panel on region bar click (after Plotly fully initializes)
        try {
            container.on('plotly_click', function(evt) {
                const pt = evt.points[0];
                if (!pt) return;
                const clickedLabel = pt.x;
                const regionKey = regionKeys.find(k => regions[k] && regions[k].label === clickedLabel);
                if (regionKey && regions[regionKey].dmas) {
                    renderRegionalDMAPanel(regions[regionKey].label, regions[regionKey].dmas);
                }
            });
        } catch(e) {
            console.warn('Could not attach plotly_click to regional chart:', e);
        }
    }).catch(function(e) {
        console.error('renderRegionalAttributionChart Plotly failed:', e);
    });
}

/**
 * Render DMA table panel below the regional chart
 * @param {string} regionLabel - Name of the clicked region
 * @param {Array} dmas - Array of DMA objects
 */
function renderRegionalDMAPanel(regionLabel, dmas) {
    const container = document.getElementById('demographic-spotlight-grid');
    if (!container || !dmas) return;

    // Insert DMA panel before spotlight grid
    let panel = document.getElementById('regional-dma-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'regional-dma-panel';
        panel.className = 'regional-dma-panel';
        container.parentNode.insertBefore(panel, container);
    }

    const rows = dmas.map(dma => `
        <tr class="${dma.rank === 1 ? 'top-dma' : ''}">
            <td>${dma.rank}</td>
            <td><strong>${dma.dma}</strong></td>
            <td>${dma.state}</td>
            <td>${formatNumber(dma.customers)}</td>
            <td>${formatCurrency(dma.clv_per_customer)}</td>
            <td class="value-${dma.yoy_pct > 0 ? 'positive' : 'negative'}">${dma.yoy_pct > 0 ? '+' : ''}${dma.yoy_pct}%</td>
        </tr>
    `).join('');

    panel.innerHTML = `
        <div class="dma-panel-header">
            <span class="dma-back-link" onclick="document.getElementById('regional-dma-panel').style.display='none'">← Close DMA detail</span>
            <h4>${regionLabel} — DMA Breakdown</h4>
        </div>
        <table class="dma-table">
            <thead>
                <tr>
                    <th>#</th><th>DMA</th><th>State</th><th>Customers</th><th>CLV/Customer</th><th>YoY%</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
    panel.style.display = 'block';
}

/**
 * Render demographic spotlight cards for top segments
 * @param {Array} segments - segments array with demographic_summary
 */
function renderDemographicSpotlight(segments) {
    const container = document.getElementById('demographic-spotlight-grid');
    if (!container || !segments) return;

    const keySegments = ['PCW Customers', 'FS-only Active', 'Rx-only', 'Non-member'];
    // Try matching by name (some files may use slightly different names)
    const spotlightSegments = keySegments.map(name => {
        return segments.find(s => s.name === name || s.name.includes(name.split(' ')[0]));
    }).filter(Boolean);

    let html = '';
    spotlightSegments.forEach(seg => {
        const demo = seg.demographic_summary;
        if (!demo) return;

        const genderBar = `
            <div class="gender-mini-bar">
                <div class="gender-fill female" style="width:${demo.gender_split.female}%" title="Female ${demo.gender_split.female}%"></div>
                <div class="gender-fill male" style="width:${demo.gender_split.male}%" title="Male ${demo.gender_split.male}%"></div>
                <div class="gender-fill other" style="width:${demo.gender_split.other}%" title="Other ${demo.gender_split.other}%"></div>
            </div>
            <div class="gender-legend">
                <span class="female-dot">●</span> F ${demo.gender_split.female}%
                <span class="male-dot">●</span> M ${demo.gender_split.male}%
            </div>
        `;

        html += `
            <div class="demo-spotlight-card">
                <div class="spotlight-segment">${seg.name}</div>
                <div class="demo-spotlight-row">
                    <span class="demo-spotlight-label">Top Age</span>
                    <span class="demo-spotlight-value">${demo.top_age_group} (${demo.top_age_pct}%)</span>
                </div>
                <div class="demo-spotlight-row">
                    <span class="demo-spotlight-label">Top Region</span>
                    <span class="demo-spotlight-value">${demo.top_region} (${demo.top_region_pct}%)</span>
                </div>
                <div class="demo-spotlight-row">
                    <span class="demo-spotlight-label">Income</span>
                    <span class="demo-spotlight-value">${demo.top_income} (${demo.top_income_pct}%)</span>
                </div>
                <div class="demo-spotlight-row gender-row">
                    <span class="demo-spotlight-label">Gender</span>
                    <div class="demo-spotlight-value">${genderBar}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Render regional attribution panel inline below the segment waterfall
 * @param {string} segmentName - Name of clicked segment
 * @param {Array} regionalBreakdown - Array of {region, value, pct} objects
 */
function renderWaterfallRegionalPanel(segmentName, regionalBreakdown) {
    const panel = document.getElementById('waterfall-regional-panel');
    if (!panel) return;

    const regions = regionalBreakdown.map(r => r.region);
    const values = regionalBreakdown.map(r => r.value);
    const pcts = regionalBreakdown.map(r => r.pct);
    const colors = values.map(v => v > 0 ? '#00A650' : '#CC0000');

    const trace = {
        type: 'bar',
        orientation: 'h',
        x: values.map(v => Math.abs(v)),
        y: regions,
        text: regionalBreakdown.map(r => `${formatCurrency(Math.abs(r.value), true)} (${r.pct}%)`),
        textposition: 'auto',
        marker: { color: colors }
    };

    const layout = {
        title: { text: `Regional Attribution: ${segmentName}`, font: { size: 14 } },
        height: 220,
        margin: { l: 100, r: 40, t: 50, b: 40 },
        xaxis: { title: 'Value Contribution ($)' },
        showlegend: false,
        font: { family: 'CVS Health Sans, Arial, sans-serif', size: 12 }
    };

    const config = { responsive: true, displayModeBar: false };

    panel.style.display = 'block';
    Plotly.newPlot(panel, [trace], layout, config);
}
