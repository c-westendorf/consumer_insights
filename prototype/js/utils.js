// Utility functions for formatting and calculations

/**
 * Format a number with commas for thousands
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
    if (num === null || num === undefined) return 'N/A';
    return num.toLocaleString('en-US');
}

/**
 * Format a number as currency
 * @param {number} num - The number to format
 * @param {boolean} compact - Whether to use compact notation (M, K)
 * @returns {string} Formatted currency string
 */
function formatCurrency(num, compact = false) {
    if (num === null || num === undefined) return 'N/A';

    if (compact) {
        if (num >= 1000000) {
            return `$${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `$${(num / 1000).toFixed(1)}K`;
        }
    }

    return `$${num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })}`;
}

/**
 * Format a number as a percentage
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
function formatPercent(num, decimals = 1) {
    if (num === null || num === undefined) return 'N/A';
    return `${num >= 0 ? '+' : ''}${num.toFixed(decimals)}%`;
}

/**
 * Format a delta value with appropriate sign and styling
 * @param {number} delta - The delta value
 * @param {string} unit - The unit type ('dollars', 'percent', 'number')
 * @param {boolean} compact - Whether to use compact notation
 * @returns {string} Formatted delta string
 */
function formatDelta(delta, unit = 'number', compact = false) {
    if (delta === null || delta === undefined) return 'N/A';

    const sign = delta >= 0 ? '+' : '';

    switch (unit) {
        case 'dollars':
            return `${sign}${formatCurrency(Math.abs(delta), compact)}`;
        case 'percent':
            return formatPercent(delta);
        case 'trips':
        case 'customers':
        case 'number':
        default:
            return `${sign}${formatNumber(Math.abs(delta))}`;
    }
}

/**
 * Get sentiment class based on delta value
 * @param {number} delta - The delta value
 * @param {boolean} inverse - Whether positive is bad (e.g., for churn)
 * @returns {string} CSS class name
 */
function getSentimentClass(delta, inverse = false) {
    if (delta === 0) return 'neutral';

    const isPositive = delta > 0;

    if (inverse) {
        return isPositive ? 'negative' : 'positive';
    }

    return isPositive ? 'positive' : 'negative';
}

/**
 * Get arrow icon for delta
 * @param {number} delta - The delta value
 * @returns {string} SVG arrow icon
 */
function getArrowIcon(delta) {
    if (delta === 0) {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12h16M4 12l4-4M4 12l4 4"/></svg>';
    } else if (delta > 0) {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4v16m0-16l-4 4m4-4l4 4"/></svg>';
    } else {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20V4m0 16l-4-4m4 4l4-4"/></svg>';
    }
}

/**
 * Truncate text to a maximum length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncate(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter of each word
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
    if (!str) return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Create a mini sparkline chart using canvas
 * @param {Array} data - Array of numbers for the trend
 * @param {number} width - Width of the sparkline
 * @param {number} height - Height of the sparkline
 * @param {string} color - Color of the line
 * @returns {string} Data URL of the sparkline image
 */
function createSparkline(data, width = 100, height = 30, color = '#0033A0') {
    if (!data || data.length === 0) return '';

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const xStep = width / (data.length - 1);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, index) => {
        const x = index * xStep;
        const y = height - ((value - min) / range) * height;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    return canvas.toDataURL();
}

/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Deep clone an object
 * @param {Object} obj - The object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Calculate percentage contribution
 * @param {number} part - The part value
 * @param {number} total - The total value
 * @returns {number} Percentage contribution
 */
function calculateContribution(part, total) {
    if (total === 0) return 0;
    return (part / total) * 100;
}
