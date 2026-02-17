// Breadcrumb navigation for multi-level drill-down

/**
 * Breadcrumb state management
 */
let breadcrumbPath = [];

/**
 * Initialize breadcrumb with base level
 */
function initBreadcrumb() {
    breadcrumbPath = [
        {
            level: 0,
            label: 'National Performance',
            data: null
        }
    ];
    renderBreadcrumb();
}

/**
 * Add a level to the breadcrumb
 * @param {string} label - Display label for this level
 * @param {Object} data - Data object for this level
 */
function addBreadcrumbLevel(label, data) {
    breadcrumbPath.push({
        level: breadcrumbPath.length,
        label: label,
        data: data
    });
    renderBreadcrumb();
}

/**
 * Navigate to a specific breadcrumb level
 * @param {number} targetLevel - Level to navigate to
 */
function navigateToBreadcrumbLevel(targetLevel) {
    if (targetLevel < 0 || targetLevel >= breadcrumbPath.length) {
        return;
    }

    // Remove levels after the target
    breadcrumbPath = breadcrumbPath.slice(0, targetLevel + 1);
    renderBreadcrumb();

    // Trigger appropriate view based on level
    const levelData = breadcrumbPath[targetLevel];

    if (targetLevel === 0) {
        // Close modal and return to main view
        closeDrillDown();
    } else {
        // Re-render the appropriate drill-down level
        renderDrillDownLevel(levelData.level, levelData.data);
    }
}

/**
 * Go back one level
 */
function goBackOneLevel() {
    if (breadcrumbPath.length > 1) {
        navigateToBreadcrumbLevel(breadcrumbPath.length - 2);
    } else {
        closeDrillDown();
    }
}

/**
 * Render the breadcrumb navigation
 */
function renderBreadcrumb() {
    const container = document.getElementById('breadcrumb-nav');
    if (!container) return;

    if (breadcrumbPath.length <= 1) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';

    let html = '<div class="breadcrumb-items">';

    breadcrumbPath.forEach((item, index) => {
        const isLast = index === breadcrumbPath.length - 1;
        const isClickable = index < breadcrumbPath.length - 1;

        html += `
            <span class="breadcrumb-item ${isLast ? 'active' : ''} ${isClickable ? 'clickable' : ''}"
                  ${isClickable ? `onclick="navigateToBreadcrumbLevel(${index})"` : ''}>
                ${item.label}
            </span>
        `;

        if (!isLast) {
            html += '<span class="breadcrumb-separator">›</span>';
        }
    });

    html += '</div>';

    // Add back button
    if (breadcrumbPath.length > 1) {
        html += `
            <button class="breadcrumb-back-btn" onclick="goBackOneLevel()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
            </button>
        `;
    }

    container.innerHTML = html;
}

/**
 * Get current drill-down level
 * @returns {number} Current level (0 = national, 1-6 = drill-down levels)
 */
function getCurrentLevel() {
    return breadcrumbPath.length - 1;
}

/**
 * Get label for drill-down level
 * @param {number} level - Level number
 * @returns {string} Level label
 */
function getLevelLabel(level) {
    const labels = [
        'National Performance',
        'Customer Type',
        'Lifecycle Stage',
        'Maturity Tier',
        'Behavioral Cohort',
        'Demographics',
        'Regional Performance'
    ];
    return labels[level] || 'Unknown Level';
}
