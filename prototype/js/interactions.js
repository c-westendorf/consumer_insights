// Interactive drill-down and modal functionality

/**
 * Open drill-down modal for a specific segment
 * @param {string} segmentName - Name of the segment to drill into
 */
function openDrillDown(segmentName) {
    const modal = document.getElementById('drill-down-modal');
    const modalTitle = document.getElementById('modal-title');

    // Get drill-down data for this segment
    const drillDownData = window.insightData.drill_down[segmentName];

    if (!drillDownData) {
        console.warn(`No drill-down data available for ${segmentName}`);
        return;
    }

    // Get segment data for metrics
    const segmentData = window.insightData.segments.find(s => s.name === segmentName);

    // Get behavioral reconciliation data for this segment
    const behavioralReconciliation = window.insightData.behavioral_reconciliation
        ? window.insightData.behavioral_reconciliation[segmentName]
        : null;

    // Get business health data for this segment
    const businessHealth = window.insightData.business_health && window.insightData.business_health.by_segment
        ? window.insightData.business_health.by_segment[segmentName]
        : null;

    // Initialize breadcrumb
    initBreadcrumb();
    addBreadcrumbLevel(segmentName, {
        segmentName: segmentName,
        drillDownData: drillDownData
    });

    // Update modal title
    modalTitle.textContent = `${segmentName} - Drill Down`;

    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Clear modal body and rebuild structure
    const modalBody = document.getElementById('modal-body');
    if (!modalBody) {
        console.error('Modal body element not found');
        return;
    }

    // Build new modal content structure
    let modalContent = '';

    // Section 1: Business Health Summary
    if (businessHealth && segmentData) {
        modalContent += `
            <div class="drill-down-section health-summary-section">
                <h4 class="drill-down-section-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Business Health Summary
                </h4>
                <div class="segment-health-metrics">
                    <div class="segment-health-metric">
                        <span class="metric-label">Total Customers:</span>
                        <span class="metric-value">${formatNumber(segmentData.customer_current || 0)}</span>
                        <span class="metric-delta ${segmentData.customer_delta_pct > 0 ? 'positive' : 'negative'}">
                            ${segmentData.customer_delta_pct > 0 ? '+' : ''}${formatPercent(segmentData.customer_delta_pct)}
                        </span>
                    </div>
                    <div class="segment-health-metric">
                        <span class="metric-label">CLV per Customer:</span>
                        <span class="metric-value">${formatCurrency(businessHealth.clv_per_customer)}</span>
                    </div>
                    <div class="segment-health-metric">
                        <span class="metric-label">Retention Rate:</span>
                        <span class="metric-value">${businessHealth.retention_rate}%</span>
                    </div>
                    <div class="segment-health-metric">
                        <span class="metric-label">Portfolio Contribution:</span>
                        <span class="metric-value">${segmentData.contribution_pct ? segmentData.contribution_pct.toFixed(1) : '0.0'}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Section 2: Behavioral Metrics (from Strategic Pillars leading indicators)
    if (window.insightData.strategic_pillars) {
        modalContent += `
            <div class="drill-down-section behavioral-metrics-section">
                <h4 class="drill-down-section-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    Engagement Behaviors (Leading Indicators)
                </h4>
                <p class="section-description">Key behavioral metrics driving business health for this segment</p>
                <div class="behavioral-metrics-note">
                    <em>Note: Behavioral metrics aggregated from Strategic Pillars data. Segment-specific breakdown available in detailed cohort views below.</em>
                </div>
            </div>
        `;
    }

    // Section 3: Behavioral Reconciliation Waterfall (REPLACES TREEMAP)
    if (behavioralReconciliation) {
        modalContent += `
            <div class="drill-down-section reconciliation-section">
                <h4 class="drill-down-section-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                    </svg>
                    Behavioral Reconciliation: How Value Changed
                </h4>
                <div id="behavioral-reconciliation-waterfall-${segmentName.replace(/\s+/g, '-')}" class="waterfall-container"></div>
            </div>
        `;
    }

    // Section 4: Tier 2 Functional Area View (EXISTING)
    if (segmentData && segmentData.tier2_tags) {
        modalContent += `
            <div class="drill-down-section tier2-section">
                ${generateTier2Narrative(segmentData, segmentName)}
            </div>
        `;
    }

    // Section 5: Cohort Deep Dive (Lifecycle breakdown - existing table)
    modalContent += `
        <div class="drill-down-section cohort-section">
            <h4 class="drill-down-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                Customer Lifecycle Breakdown
            </h4>
            <div id="drill-down-table-container"></div>
        </div>
    `;

    // Set modal content
    modalBody.innerHTML = modalContent;

    // Now render the behavioral reconciliation waterfall if data exists
    if (behavioralReconciliation) {
        renderBehavioralReconciliationWaterfall(
            segmentName,
            behavioralReconciliation,
            `behavioral-reconciliation-waterfall-${segmentName.replace(/\s+/g, '-')}`
        );
    }

    // Render existing drill-down table
    const tableContainer = document.getElementById('drill-down-table-container');
    if (tableContainer) {
        tableContainer.innerHTML = renderDrillDownTableHTML(drillDownData);
    }
}

/**
 * Close drill-down modal
 */
function closeDrillDown() {
    const modal = document.getElementById('drill-down-modal');
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
}

/**
 * Handle click outside modal to close
 */
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('drill-down-modal');

    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeDrillDown();
            }
        });
    }

    // Add escape key handler
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeDrillDown();
        }
    });
});

/**
 * Add hover effects to metric cards
 */
function addMetricCardInteractions() {
    const cards = document.querySelectorAll('.metric-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/**
 * Add smooth scroll to sections
 */
function addSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Add table row hover effects
 */
function addTableInteractions() {
    const tables = document.querySelectorAll('.behavior-table, .drill-down-table table');

    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#F5F5F5';
                this.style.cursor = 'pointer';
            });

            row.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
        });
    });
}

/**
 * Handle segment clicks in behavior table to open drill-down
 */
function addSegmentClickHandlers() {
    const segmentCells = document.querySelectorAll('.behavior-table .segment-name');

    segmentCells.forEach(cell => {
        cell.addEventListener('click', function() {
            const segmentName = this.textContent.trim();
            openDrillDown(segmentName);
        });

        cell.style.cursor = 'pointer';
        cell.style.textDecoration = 'underline';
        cell.style.color = '#0033A0';

        cell.addEventListener('mouseenter', function() {
            this.style.color = '#CC0000';
        });

        cell.addEventListener('mouseleave', function() {
            this.style.color = '#0033A0';
        });
    });
}

/**
 * Initialize all interactions after page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Wait for content to be loaded before adding interactions
    setTimeout(() => {
        addMetricCardInteractions();
        addSmoothScroll();
        addTableInteractions();
        addSegmentClickHandlers();
    }, 500);
});

/**
 * Add animation on scroll for story sections
 */
function addScrollAnimations() {
    const sections = document.querySelectorAll('.story-section');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', addScrollAnimations);

/**
 * Export data as CSV (future enhancement)
 * @param {string} type - Type of data to export ('scorecard', 'segments', 'all')
 */
function exportData(type) {
    // Placeholder for future export functionality
    console.log(`Export ${type} data requested`);
    alert('Export functionality will be available in Phase 1');
}

/**
 * Print current view (future enhancement)
 */
function printView() {
    // Placeholder for future print functionality
    window.print();
}

/**
 * Share insights (future enhancement)
 */
function shareInsights() {
    // Placeholder for future share functionality
    console.log('Share insights requested');
    alert('Share functionality will be available in Phase 1');
}
