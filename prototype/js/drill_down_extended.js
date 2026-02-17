// Extended drill-down functionality for multi-level progressive disclosure

/**
 * Open maturity tier drill-down (Level 3)
 * @param {string} segmentName - Parent segment name
 * @param {string} lifecycleStage - Lifecycle stage clicked
 */
function openMaturityDrillDown(segmentName, lifecycleStage) {
    // Get maturity tier data for this segment and lifecycle
    const maturityData = window.insightData.maturity_tiers?.[segmentName]?.[lifecycleStage];

    if (!maturityData) {
        alert(`No maturity tier data available for ${segmentName} → ${lifecycleStage}`);
        return;
    }

    // Add to breadcrumb
    addBreadcrumbLevel(lifecycleStage, {
        segmentName: segmentName,
        lifecycleStage: lifecycleStage
    });
    addBreadcrumbLevel('Maturity Tiers', {
        segmentName: segmentName,
        lifecycleStage: lifecycleStage,
        tiers: maturityData
    });

    // Update modal title
    document.getElementById('modal-title').textContent =
        `${segmentName} → ${lifecycleStage} → Maturity Tiers`;

    // Render Level 3 content
    renderDrillDownLevel(3, {
        segmentName: segmentName,
        lifecycleStage: lifecycleStage,
        tiers: maturityData
    });
}

/**
 * Open behavioral cohort drill-down (Level 4)
 * @param {string} segmentName - Parent segment name
 * @param {string} lifecycleStage - Lifecycle stage
 * @param {string} tierKey - Maturity tier key (e.g., "tier_3_high_value")
 * @param {string} tierLabel - Maturity tier label
 */
function openBehavioralDrillDown(segmentName, lifecycleStage, tierKey, tierLabel) {
    // Get behavioral cohort data for this tier
    const cohortData = window.insightData.behavioral_cohorts?.[tierKey];

    if (!cohortData) {
        alert(`No behavioral cohort data available for ${tierLabel}`);
        return;
    }

    // Add to breadcrumb
    addBreadcrumbLevel(tierLabel, {
        segmentName: segmentName,
        lifecycleStage: lifecycleStage,
        tierKey: tierKey
    });
    addBreadcrumbLevel('Behavioral Cohorts', {
        segmentName: segmentName,
        lifecycleStage: lifecycleStage,
        tierKey: tierKey,
        tierLabel: tierLabel,
        cohorts: cohortData
    });

    // Update modal title
    document.getElementById('modal-title').textContent =
        `${segmentName} → ${tierLabel} → Behavioral Cohorts`;

    // Render Level 4 content
    renderDrillDownLevel(4, {
        segmentName: segmentName,
        lifecycleStage: lifecycleStage,
        tierKey: tierKey,
        tierLabel: tierLabel,
        cohorts: cohortData
    });
}

/**
 * Render drill-down for a specific level
 * @param {number} level - Level number (1-6)
 * @param {Object} data - Data for this level
 */
function renderDrillDownLevel(level, data) {
    const modalBody = document.querySelector('.modal-body');
    if (!modalBody) return;

    // Clear existing content except breadcrumb
    const breadcrumb = document.getElementById('breadcrumb-nav');
    modalBody.innerHTML = '';
    if (breadcrumb) {
        modalBody.appendChild(breadcrumb);
    }

    // Add level indicator
    const levelIndicator = document.createElement('div');
    levelIndicator.className = 'drill-down-level-indicator';
    levelIndicator.textContent = `Level ${level}: ${getLevelLabel(level)}`;
    modalBody.appendChild(levelIndicator);

    // Render appropriate visualization based on level
    switch (level) {
        case 2:
            // Lifecycle Stage (existing treemap)
            renderLifecycleTreemap(data);
            break;
        case 3:
            // Maturity Tier
            renderMaturityDrillDown(data);
            break;
        case 4:
            // Behavioral Cohort
            renderBehavioralDrillDown(data);
            break;
        case 5:
            // Demographics
            renderDemographicsDrillDown(data.cohortName, data.maturityTier);
            break;
        case 6:
            // Regional
            renderRegionalDrillDown(data.ageRange, data.cohortName);
            break;
    }
}

/**
 * Enhanced Level 2: Lifecycle treemap with drill-down to maturity
 */
function renderLifecycleTreemap(data) {
    const container = document.createElement('div');
    container.id = 'treemap-chart';
    container.style.width = '100%';
    container.style.height = '400px';
    document.querySelector('.modal-body').appendChild(container);

    // Render treemap (using existing renderTreemap function)
    // Add click handlers to drill into maturity tiers
    renderTreemap(data.segmentName, data.lifecycleData);

    // Add table
    renderDrillDownTable(data.lifecycleData);
}

/**
 * Level 3: Maturity Tier Drill-Down
 * @param {Object} data - Maturity tier data
 */
function renderMaturityDrillDown(data) {
    const intro = document.createElement('div');
    intro.className = 'drill-down-intro';
    intro.innerHTML = `
        <h4>Maturity Tier Analysis</h4>
        <p>Breaking down ${data.lifecycleStage} customers by engagement maturity (Tier 1 = New → Tier 5 = Champion)</p>
    `;
    document.querySelector('.modal-body').appendChild(intro);

    // Create waterfall chart container
    const chartContainer = document.createElement('div');
    chartContainer.id = 'maturity-waterfall';
    chartContainer.className = 'maturity-waterfall-container';
    document.querySelector('.modal-body').appendChild(chartContainer);

    // Prepare waterfall data
    const tiers = data.tiers || [];
    const labels = tiers.map(t => t.label);
    const values = tiers.map(t => t.value_total);
    const yoyPcts = tiers.map(t => t.yoy_pct);

    // Color code by growth rate
    const colors = yoyPcts.map(pct => {
        if (pct > 10) return '#00A650'; // Green
        if (pct > 5) return '#7DD27D'; // Light green
        if (pct > 0) return '#FFD966'; // Yellow
        return '#FF9966'; // Orange
    });

    const trace = {
        type: 'bar',
        x: labels,
        y: values,
        marker: { color: colors },
        text: yoyPcts.map(pct => `+${pct.toFixed(1)}% YoY`),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>Value: $%{y:,.0f}<br>Growth: %{text}<extra></extra>'
    };

    const layout = {
        title: {
            text: 'Maturity Tier Performance',
            font: { size: 16, color: '#212529' }
        },
        xaxis: {
            title: 'Maturity Tier',
            tickangle: -45
        },
        yaxis: {
            title: 'Total Value ($)',
            tickformat: '$,.0f'
        },
        margin: { t: 60, b: 100, l: 80, r: 40 },
        plot_bgcolor: '#FAFAFA',
        paper_bgcolor: 'white',
        hovermode: 'closest'
    };

    Plotly.newPlot('maturity-waterfall', [trace], layout, { responsive: true }).then(function() {
        // Add click event handler to enable drill-down to Level 4 (Behavioral Cohorts)
        document.getElementById('maturity-waterfall').on('plotly_click', function(plotlyData) {
            const point = plotlyData.points[0];
            const clickedTier = data.tiers[point.pointIndex];

            // Open behavioral cohort drill-down (Level 4)
            openBehavioralDrillDown(data.segmentName, data.lifecycleStage, clickedTier.tier, clickedTier.label);
        });
    });

    // Add table
    const tableContainer = document.createElement('div');
    tableContainer.className = 'drill-down-table';
    let tableHTML = `
        <table class="demographics-table">
            <thead>
                <tr>
                    <th>Tier</th>
                    <th>Definition</th>
                    <th>Customers</th>
                    <th>Avg Value</th>
                    <th>YoY Growth</th>
                    <th>Total Value</th>
                </tr>
            </thead>
            <tbody>
    `;

    tiers.forEach(tier => {
        const growthClass = tier.yoy_pct > 0 ? 'positive' : 'negative';
        tableHTML += `
            <tr onclick="openBehavioralDrillDown('${data.segmentName}', '${data.lifecycleStage}', '${tier.tier}', '${tier.label}')" style="cursor: pointer;">
                <td><strong>${tier.label}</strong></td>
                <td>${tier.definition}</td>
                <td>${formatNumber(tier.customers)}</td>
                <td>${formatCurrency(tier.avg_value)}</td>
                <td class="${growthClass}">${formatPercent(tier.yoy_pct)}</td>
                <td>${formatCurrency(tier.value_total)}</td>
            </tr>
        `;
    });

    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
    document.querySelector('.modal-body').appendChild(tableContainer);
}

/**
 * Level 4: Behavioral Cohort Drill-Down
 * @param {Object} data - Behavioral cohort data
 */
function renderBehavioralDrillDown(data) {
    const intro = document.createElement('div');
    intro.className = 'drill-down-intro';
    intro.innerHTML = `
        <h4>5-Square Behavioral Analysis</h4>
        <p>Breaking down ${data.maturityTier} customers by engagement patterns (Recency × Frequency × Breadth × Coupon × Channel)</p>
    `;
    document.querySelector('.modal-body').appendChild(intro);

    // Create grid of cohort cards
    const grid = document.createElement('div');
    grid.className = 'behavioral-grid';

    const cohorts = data.cohorts || [];

    cohorts.forEach((cohort, index) => {
        const card = document.createElement('div');
        card.className = 'behavioral-cohort-card';
        card.onclick = () => openDemographicsDrillDown(cohort.name, data.maturityTier);

        const growthClass = cohort.yoy_pct > 0 ? 'positive' : cohort.yoy_pct < 0 ? 'negative' : '';

        card.innerHTML = `
            <div class="cohort-name">${cohort.name}</div>
            <div class="cohort-description">${cohort.description}</div>
            <div class="score-heatmap">
                <div class="score-cell" data-score="${cohort.recency_score}">
                    <div class="score-label">R</div>
                    <div class="score-value">${cohort.recency_score}</div>
                </div>
                <div class="score-cell" data-score="${cohort.frequency_score}">
                    <div class="score-label">F</div>
                    <div class="score-value">${cohort.frequency_score}</div>
                </div>
                <div class="score-cell" data-score="${cohort.breadth_score}">
                    <div class="score-label">B</div>
                    <div class="score-value">${cohort.breadth_score}</div>
                </div>
                <div class="score-cell" data-score="${cohort.coupon_score}">
                    <div class="score-label">C</div>
                    <div class="score-value">${cohort.coupon_score}</div>
                </div>
                <div class="score-cell" data-score="${cohort.channel_score}">
                    <div class="score-label">Ch</div>
                    <div class="score-value">${cohort.channel_score}</div>
                </div>
            </div>
            <div class="cohort-metrics">
                <span class="cohort-customers">${formatNumber(cohort.customers)} customers</span>
                <span class="cohort-growth ${growthClass}">${formatPercent(cohort.yoy_pct)} YoY</span>
            </div>
        `;

        grid.appendChild(card);
    });

    document.querySelector('.modal-body').appendChild(grid);
}

/**
 * Render Demographics drill-down (Level 5) with 4-tab layout
 * @param {string} cohortName - Name of the behavioral cohort
 * @param {string} maturityTier - Parent maturity tier label
 */
function renderDemographicsDrillDown(cohortName, maturityTier) {
    const tableContainer = document.getElementById('drill-down-table');
    if (!tableContainer) return;

    const demographicsData = window.insightData && window.insightData.demographics;
    if (!demographicsData || !demographicsData[cohortName]) {
        tableContainer.innerHTML = `
            <div class="drill-down-section">
                <h4>Demographics: ${cohortName}</h4>
                <p class="no-data-message">Demographic data not available for this cohort.</p>
            </div>`;
        return;
    }

    const data = demographicsData[cohortName];

    // Build tab HTML
    tableContainer.innerHTML = `
        <div class="drill-down-section">
            <h4>Demographics: ${cohortName}</h4>
            <p class="drill-breadcrumb">From: ${maturityTier || 'Maturity Tier'}</p>

            <div class="demo-tabs">
                <button class="demo-tab active" data-tab="demo-tab-age">Age Groups</button>
                <button class="demo-tab" data-tab="demo-tab-household">Household</button>
                <button class="demo-tab" data-tab="demo-tab-income">Income</button>
                <button class="demo-tab" data-tab="demo-tab-gender">Gender</button>
            </div>

            <div id="demo-tab-age" class="demo-tab-content active">
                <div id="demo-age-chart" style="width:100%;height:280px;"></div>
                <table class="drill-table">
                    <thead><tr><th>Age Group</th><th>Customers</th><th>Avg Basket</th><th>YoY%</th><th>% of Cohort</th></tr></thead>
                    <tbody id="demo-age-table"></tbody>
                </table>
            </div>

            <div id="demo-tab-household" class="demo-tab-content">
                <div id="demo-household-chart" style="width:100%;height:280px;"></div>
            </div>

            <div id="demo-tab-income" class="demo-tab-content">
                <div id="demo-income-chart" style="width:100%;height:260px;"></div>
            </div>

            <div id="demo-tab-gender" class="demo-tab-content">
                <div id="demo-gender-chart" style="width:100%;height:260px;"></div>
            </div>
        </div>
    `;

    // Wire tab buttons
    tableContainer.querySelectorAll('.demo-tab').forEach(btn => {
        btn.addEventListener('click', function() {
            tableContainer.querySelectorAll('.demo-tab').forEach(b => b.classList.remove('active'));
            tableContainer.querySelectorAll('.demo-tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const targetId = this.getAttribute('data-tab');
            const target = document.getElementById(targetId);
            if (target) target.classList.add('active');

            // Lazy-render charts when tab is shown
            if (targetId === 'demo-tab-household') renderHouseholdChart(data.household_types);
            if (targetId === 'demo-tab-income') renderIncomeChart(data.income_bands);
            if (targetId === 'demo-tab-gender') renderGenderChart(data.gender);
        });
    });

    // Render age tab immediately (active by default)
    renderAgeChart(data.age_groups);
    renderAgeTable(data.age_groups, cohortName);
}

function renderAgeChart(ageGroups) {
    if (!ageGroups) return;
    const el = document.getElementById('demo-age-chart');
    if (!el) return;
    Plotly.newPlot(el, [{
        type: 'bar',
        x: ageGroups.map(a => `Age ${a.range}`),
        y: ageGroups.map(a => a.customers),
        text: ageGroups.map(a => `${a.pct_of_cohort}%`),
        textposition: 'auto',
        marker: { color: ageGroups.map(a => a.yoy_pct > 0 ? '#0033A0' : '#CC0000') }
    }], {
        title: 'Customer Distribution by Age',
        height: 260,
        margin: { l: 60, r: 20, t: 40, b: 50 },
        xaxis: { title: 'Age Group' },
        yaxis: { title: 'Customers' },
        showlegend: false,
        font: { family: 'CVS Health Sans, Arial, sans-serif', size: 11 }
    }, { responsive: true, displayModeBar: false });
}

function renderAgeTable(ageGroups, cohortName) {
    const tbody = document.getElementById('demo-age-table');
    if (!tbody || !ageGroups) return;
    tbody.innerHTML = ageGroups.map(a => `
        <tr onclick="openRegionalDrillDown('${a.range}', '${cohortName}')" style="cursor:pointer;" title="Click for regional breakdown">
            <td>Age ${a.range}</td>
            <td>${formatNumber(a.customers)}</td>
            <td>${formatCurrency(a.avg_basket)}</td>
            <td class="value-${a.yoy_pct >= 0 ? 'positive' : 'negative'}">${a.yoy_pct > 0 ? '+' : ''}${a.yoy_pct}%</td>
            <td>${a.pct_of_cohort}%</td>
        </tr>
    `).join('');
}

function renderHouseholdChart(householdTypes) {
    const el = document.getElementById('demo-household-chart');
    if (!el || !householdTypes || el.innerHTML.trim() !== '') return;
    Plotly.newPlot(el, [{
        type: 'pie',
        labels: householdTypes.map(h => h.type),
        values: householdTypes.map(h => h.customers),
        hole: 0.4,
        textinfo: 'label+percent',
        marker: { colors: ['#0033A0', '#CC0000', '#00A650', '#FFA500'] }
    }], {
        title: 'Household Type Distribution',
        height: 260,
        margin: { l: 20, r: 20, t: 40, b: 20 },
        showlegend: true,
        font: { family: 'CVS Health Sans, Arial, sans-serif', size: 11 }
    }, { responsive: true, displayModeBar: false });
}

function renderIncomeChart(incomeBands) {
    const el = document.getElementById('demo-income-chart');
    if (!el || !incomeBands || el.innerHTML.trim() !== '') return;
    Plotly.newPlot(el, [{
        type: 'bar',
        orientation: 'h',
        y: incomeBands.map(i => i.band),
        x: incomeBands.map(i => i.customers),
        text: incomeBands.map(i => `${i.pct_of_cohort}% | ${i.yoy_pct > 0 ? '+' : ''}${i.yoy_pct}% YoY`),
        textposition: 'auto',
        marker: { color: incomeBands.map(i => i.yoy_pct > 0 ? '#00A650' : '#CC0000') }
    }], {
        title: 'Customer Distribution by Income Band',
        height: 240,
        margin: { l: 120, r: 20, t: 40, b: 50 },
        xaxis: { title: 'Customers' },
        showlegend: false,
        font: { family: 'CVS Health Sans, Arial, sans-serif', size: 11 }
    }, { responsive: true, displayModeBar: false });
}

function renderGenderChart(genderData) {
    const el = document.getElementById('demo-gender-chart');
    if (!el || !genderData || el.innerHTML.trim() !== '') return;
    Plotly.newPlot(el, [{
        type: 'pie',
        labels: genderData.map(g => g.label),
        values: genderData.map(g => g.customers),
        hole: 0.5,
        textinfo: 'label+percent',
        marker: { colors: ['#CC0000', '#0033A0', '#767676'] }
    }], {
        title: 'Gender Distribution',
        height: 240,
        margin: { l: 20, r: 20, t: 40, b: 20 },
        showlegend: true,
        font: { family: 'CVS Health Sans, Arial, sans-serif', size: 11 }
    }, { responsive: true, displayModeBar: false });
}

/**
 * Render Regional drill-down (Level 6) with DMA zoom capability
 * @param {string} ageRange - Age range from demographics click
 * @param {string} cohortName - Parent cohort name
 */
function renderRegionalDrillDown(ageRange, cohortName) {
    const tableContainer = document.getElementById('drill-down-table');
    if (!tableContainer) return;

    const regionalData = window.insightData && window.insightData.regional_performance;
    if (!regionalData || !regionalData.regions) {
        tableContainer.innerHTML = '<p class="no-data-message">Regional data not available.</p>';
        return;
    }

    renderRegionCards(ageRange, cohortName, regionalData.regions);
}

/**
 * Render the 4-region cards (Level 6a)
 */
function renderRegionCards(ageRange, cohortName, regions) {
    const tableContainer = document.getElementById('drill-down-table');
    if (!tableContainer) return;

    const regionKeys = ['northeast', 'southeast', 'midwest', 'west'];

    const cards = regionKeys.map(key => {
        const r = regions[key];
        if (!r) return '';
        const yoyClass = r.yoy_pct > 0 ? 'positive' : 'negative';
        const dmaCount = r.dmas ? r.dmas.length : 0;
        return `
            <div class="region-card" onclick="renderDMADrillDown('${key}', '${ageRange}', '${cohortName}')" title="Click to see ${dmaCount} DMAs">
                <div class="region-card-name">${r.label}</div>
                <div class="region-card-metric">${formatNumber(r.customers)} customers</div>
                <div class="region-card-metric">${formatCurrency(r.clv_per_customer)}/customer CLV</div>
                <div class="region-card-metric">${r.retention_rate}% retention</div>
                <div class="region-card-yoy value-${yoyClass}">${r.yoy_pct > 0 ? '+' : ''}${r.yoy_pct}% YoY</div>
                <div class="region-card-dma-hint">→ ${dmaCount} DMAs</div>
            </div>
        `;
    }).join('');

    tableContainer.innerHTML = `
        <div class="drill-down-section">
            <h4>Regional Performance ${ageRange ? `— Age ${ageRange}` : ''}</h4>
            <p class="drill-breadcrumb">Click a region to see DMA detail</p>
            <div class="regional-cards-grid">${cards}</div>
        </div>
    `;
}

/**
 * Render DMA table for a clicked region (Level 6b)
 * @param {string} regionKey - e.g. 'northeast'
 * @param {string} ageRange - Age range context
 * @param {string} cohortName - Cohort name context
 */
function renderDMADrillDown(regionKey, ageRange, cohortName) {
    const tableContainer = document.getElementById('drill-down-table');
    if (!tableContainer) return;

    const regionalData = window.insightData && window.insightData.regional_performance;
    if (!regionalData || !regionalData.regions || !regionalData.regions[regionKey]) return;

    const region = regionalData.regions[regionKey];
    const dmas = region.dmas || [];

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

    tableContainer.innerHTML = `
        <div class="drill-down-section">
            <span class="dma-back-link" onclick="renderRegionCards('${ageRange}', '${cohortName}', window.insightData.regional_performance.regions)">← Back to Regions</span>
            <h4>${region.label} — DMA Breakdown</h4>
            <p class="drill-breadcrumb">${region.customers.toLocaleString()} total customers | ${formatCurrency(region.clv_per_customer)}/customer | ${region.yoy_pct > 0 ? '+' : ''}${region.yoy_pct}% YoY</p>
            <table class="dma-table">
                <thead>
                    <tr><th>#</th><th>DMA</th><th>State</th><th>Customers</th><th>CLV/Customer</th><th>YoY%</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

/**
 * Helper function to open demographics drill-down (Level 5)
 */
function openDemographicsDrillDown(cohortName, maturityTier) {
    const demographics = window.insightData && window.insightData.demographics;
    if (!demographics || !demographics[cohortName]) {
        alert(`No demographic data available for ${cohortName}`);
        return;
    }

    addBreadcrumbLevel(cohortName, {
        cohortName,
        maturityTier
    });
    renderDrillDownLevel(5, {
        cohortName,
        maturityTier
    });
}

/**
 * Helper function to open regional drill-down (Level 6)
 */
function openRegionalDrillDown(ageRange, cohortName) {
    const regionalData = window.insightData && window.insightData.regional_performance;
    if (!regionalData || !regionalData.regions) {
        alert(`No regional data available for age range ${ageRange}`);
        return;
    }

    addBreadcrumbLevel(`${ageRange} - Regional`, {
        ageRange,
        cohortName
    });
    renderDrillDownLevel(6, {
        ageRange,
        cohortName
    });
}

/**
 * Render Behavioral Reconciliation Waterfall in drill-down modal
 * @param {string} segmentName - Name of segment
 * @param {Object} reconciliationData - Behavioral reconciliation data for this segment
 * @param {string} containerId - ID of container element
 */
function renderBehavioralReconciliationWaterfall(segmentName, reconciliationData, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !reconciliationData) {
        console.warn('Container or reconciliation data not found');
        return;
    }

    // Prepare waterfall data
    const labels = ['Prior Year Value'];
    const measures = ['absolute'];
    const values = [reconciliationData.prior_value];
    const texts = [formatCurrency(reconciliationData.prior_value, true)];
    const colors = ['#0033A0'];
    const customdata = [null]; // For storing effect details

    // Process each effect
    reconciliationData.effects.forEach(effect => {
        const effectLabel = effect.effect_label || formatEffectType(effect.effect_type);
        let effectValue = effect.value;

        // For CLV Expansion, we might want to show sub-effects
        if (effect.effect_type === 'clv_expansion' && effect.sub_effects) {
            // Add parent CLV Expansion bar
            labels.push(effectLabel);
            measures.push('relative');
            values.push(effectValue);
            texts.push(formatCurrency(Math.abs(effectValue), true));
            colors.push(effectValue > 0 ? '#00A650' : '#CC0000');
            customdata.push({
                effectType: effect.effect_type,
                drivers: effect.drivers || [],
                cohorts: effect.cohorts || [],
                hasSubEffects: true
            });

            // Optionally show sub-effects inline (or make them expandable)
            // For now, we'll add them as separate bars
            effect.sub_effects.forEach(subEffect => {
                const subLabel = formatEffectType(subEffect.sub_type);
                labels.push(`  ↳ ${subLabel}`);
                measures.push('relative');
                values.push(subEffect.value);
                texts.push(formatCurrency(Math.abs(subEffect.value), true));
                colors.push(subEffect.value > 0 ? '#00A650' : '#CC0000');
                customdata.push({
                    effectType: subEffect.sub_type,
                    drivers: subEffect.drivers || [],
                    cohorts: subEffect.cohorts || [],
                    isSubEffect: true
                });
            });
        } else {
            // Simple effect without sub-effects
            labels.push(effectLabel);
            measures.push('relative');
            values.push(effectValue);
            texts.push(formatCurrency(Math.abs(effectValue), true));
            colors.push(effectValue > 0 ? '#00A650' : '#CC0000');
            customdata.push({
                effectType: effect.effect_type,
                drivers: effect.drivers || [],
                cohorts: effect.cohorts || []
            });
        }
    });

    // Add total
    labels.push('Current Year Value');
    measures.push('total');
    values.push(reconciliationData.current_value);
    texts.push(formatCurrency(reconciliationData.current_value, true));
    colors.push('#0033A0');
    customdata.push(null);

    const trace = {
        type: 'waterfall',
        orientation: 'v',
        measure: measures,
        x: labels,
        y: values,
        text: texts,
        textposition: 'outside',
        customdata: customdata,
        marker: {
            color: colors
        },
        connector: {
            line: {
                color: '#767676',
                width: 1
            }
        },
        hovertemplate: '<b>%{x}</b><br>Value: %{text}<extra></extra>'
    };

    const layout = {
        title: {
            text: `Value Attribution: ${segmentName}`,
            font: { size: 14, family: 'CVS Health Sans, Arial, sans-serif' }
        },
        showlegend: false,
        margin: { l: 80, r: 40, t: 60, b: 140 },
        xaxis: {
            tickangle: -45,
            automargin: true
        },
        yaxis: {
            title: 'Value ($)',
            tickformat: ',.0f'
        },
        font: {
            family: 'CVS Health Sans, Arial, sans-serif',
            size: 11
        },
        height: 450
    };

    const config = {
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot(container, [trace], layout, config);

    // Add click handler for expanding cohort details
    container.on('plotly_click', function(data) {
        const pointIndex = data.points[0].pointIndex;
        const effectData = customdata[pointIndex];

        if (effectData && effectData.cohorts && effectData.cohorts.length > 0) {
            expandCohortDetails(effectData, segmentName);
        }
    });
}

/**
 * Format effect type for display
 * @param {string} effectType - Effect type key
 * @returns {string} Formatted label
 */
function formatEffectType(effectType) {
    const labels = {
        'retention_lift': 'Retention Lift Effect',
        'clv_expansion': 'CLV Expansion Effect',
        'volume': 'Volume Effect',
        'mix_effect': 'Mix Effect',
        'frequency_effect': 'Frequency Effect',
        'basket_effect': 'Basket Effect'
    };
    return labels[effectType] || effectType;
}

/**
 * Expand cohort details when effect bar is clicked
 * @param {Object} effectData - Effect metadata
 * @param {string} segmentName - Segment name
 */
function expandCohortDetails(effectData, segmentName) {
    // Create expansion panel below waterfall
    const containerId = `behavioral-reconciliation-waterfall-${segmentName.replace(/\s+/g, '-')}`;
    const container = document.getElementById(containerId);
    if (!container) return;

    // Check if expansion panel already exists
    let expansionPanel = container.parentElement.querySelector('.cohort-expansion-panel');
    if (!expansionPanel) {
        expansionPanel = document.createElement('div');
        expansionPanel.className = 'cohort-expansion-panel';
        container.parentElement.appendChild(expansionPanel);
    }

    // Build expansion content
    let html = `
        <div class="expansion-header">
            <h5>${formatEffectType(effectData.effectType)} - Cohort Breakdown</h5>
            <button class="expansion-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Show drivers
    if (effectData.drivers && effectData.drivers.length > 0) {
        html += '<div class="expansion-section"><h6>Drivers:</h6><ul class="driver-list">';
        effectData.drivers.forEach(driver => {
            html += `<li><strong>${driver.behavior}:</strong> ${driver.impact}`;
            if (driver.from_pillar) {
                html += ` <span class="pillar-badge">${driver.pillar_metric}</span>`;
            }
            html += '</li>';
        });
        html += '</ul></div>';
    }

    // Show cohorts
    if (effectData.cohorts && effectData.cohorts.length > 0) {
        html += '<div class="expansion-section"><h6>Contributing Cohorts:</h6>';
        html += '<table class="cohort-breakdown-table"><thead><tr>';
        html += '<th>Cohort</th><th>Customers</th>';

        // Determine columns based on cohort data structure
        const firstCohort = effectData.cohorts[0];
        if (firstCohort.retention_rate) html += '<th>Retention Rate</th>';
        if (firstCohort.clv_lift) html += '<th>CLV Lift</th>';
        if (firstCohort.trip_increase) html += '<th>Trip Increase</th>';

        html += '</tr></thead><tbody>';

        effectData.cohorts.forEach(cohort => {
            html += `<tr><td>${cohort.name || cohort.tier_transition}</td>`;
            html += `<td>${formatNumber(cohort.customers)}</td>`;
            if (cohort.retention_rate) html += `<td>${cohort.retention_rate}%</td>`;
            if (cohort.clv_lift) html += `<td>${formatCurrency(cohort.clv_lift)}</td>`;
            if (cohort.trip_increase) html += `<td>+${cohort.trip_increase.toFixed(1)}</td>`;
            html += '</tr>';
        });

        html += '</tbody></table></div>';
    }

    expansionPanel.innerHTML = html;
    expansionPanel.style.display = 'block';

    // Scroll to expansion panel
    expansionPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Helper function to render drill-down table HTML
 * @param {Object} drillDownData - Drill-down data (lifecycle stages)
 * @returns {string} HTML string
 */
function renderDrillDownTableHTML(drillDownData) {
    if (!drillDownData || !drillDownData.lifecycle) {
        return '<p>No lifecycle data available.</p>';
    }

    let html = `
        <table class="drill-down-table">
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
        const deltaPct = stage.yoy_pct || ((stage.customers - (stage.customers / (1 + stage.yoy_pct / 100))) / (stage.customers / (1 + stage.yoy_pct / 100))) * 100;
        const sentimentClass = deltaPct > 0 ? 'positive' : deltaPct < 0 ? 'negative' : 'neutral';

        html += `
            <tr>
                <td><strong>${stage.stage}</strong></td>
                <td>${formatNumber(stage.customers)}</td>
                <td class="${sentimentClass}">${deltaPct > 0 ? '+' : ''}${deltaPct.toFixed(1)}%</td>
                <td>${formatCurrency(stage.value, true)}</td>
                <td>${stage.trips_per_customer ? stage.trips_per_customer.toFixed(2) : 'N/A'}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    return html;
}
