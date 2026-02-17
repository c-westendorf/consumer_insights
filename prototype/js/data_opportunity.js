// Data for "Where is the biggest opportunity?" question
// Focus: Growth potential + ROI
// Ordering: By growth rate % (fastest growing first, negatives excluded)

window.insightData = {
  "question_type": "opportunity",
  "week": "2025-02-10",
  "week_label": "Week of Feb 10-16, 2025",
  "prior_week": "2024-02-11",
  "prior_week_label": "Week of Feb 11-17, 2024",
  "context": {
    "time_period": "Week of Feb 10-16, 2025 vs. Feb 11-17, 2024",
    "strategic_goals": "Grow active customers, improve retention, expand customer value",
    "prior_trend": "Last month showed 3.2% customer growth driven by PCW reactivations"
  },
  "scorecard": {
    "total_customers": {
      "metric_name": "Total Active Customers",
      "current": 2100000,
      "prior": 1940000,
      "delta": 160000,
      "delta_pct": 8.3,
      "trend_12w": [1.2, 1.5, 2.1, 2.8, 3.5, 4.2, 5.1, 6.0, 6.8, 7.5, 8.0, 8.3],
      "unit": "customers"
    },
    "total_trips": {
      "metric_name": "Total Trips",
      "current": 4700000,
      "prior": 4193000,
      "delta": 507000,
      "delta_pct": 12.1,
      "trend_12w": [2.1, 3.0, 4.2, 5.5, 6.8, 7.9, 8.5, 9.2, 10.1, 11.0, 11.5, 12.1],
      "unit": "trips"
    },
    "total_value": {
      "metric_name": "Total Value",
      "current": 285000000,
      "prior": 247000000,
      "delta": 38000000,
      "delta_pct": 15.4,
      "trend_12w": [3.5, 4.8, 6.2, 7.8, 9.1, 10.5, 11.8, 12.9, 13.5, 14.2, 14.8, 15.4],
      "unit": "dollars"
    },
    "value_per_customer": {
      "metric_name": "Value per Customer",
      "current": 135.71,
      "prior": 127.32,
      "delta": 8.39,
      "delta_pct": 6.6,
      "trend_12w": [2.2, 3.2, 4.0, 4.8, 5.4, 6.1, 6.5, 6.7, 6.5, 6.5, 6.6, 6.6],
      "unit": "dollars"
    },
    "trips_per_customer": {
      "metric_name": "Trips per Customer",
      "current": 2.24,
      "prior": 2.16,
      "delta": 0.08,
      "delta_pct": 3.5,
      "trend_12w": [0.8, 1.4, 2.0, 2.5, 3.0, 3.4, 3.2, 3.0, 3.1, 3.3, 3.4, 3.5],
      "unit": "trips"
    },
    "basket_size": {
      "metric_name": "Basket Size",
      "current": 60.64,
      "prior": 58.91,
      "delta": 1.73,
      "delta_pct": 2.9,
      "trend_12w": [1.4, 1.7, 2.0, 2.2, 2.4, 2.6, 3.1, 3.6, 3.3, 3.1, 2.9, 2.9],
      "unit": "dollars"
    }
  },
  "segments": [
    {
      "name": "Reactivated Customers",
      "customer_current": 142000,
      "customer_prior": 120000,
      "customer_delta": 22000,
      "customer_delta_pct": 18.3,
      "value_current": 15000000,
      "value_prior": 7000000,
      "value_delta": 8000000,
      "value_delta_pct": 114.3,
      "contribution_pct": 25.8,
      "trips_per_customer_current": 1.8,
      "trips_per_customer_prior": 1.2,
      "trips_per_customer_delta_pct": 50.0,
      "basket_current": 58.50,
      "basket_prior": 48.60,
      "basket_delta_pct": 20.4,
      "rank": 1,
      "sentiment": "positive"
    },
    {
      "name": "PCW Customers",
      "customer_current": 425000,
      "customer_prior": 380000,
      "customer_delta": 45000,
      "customer_delta_pct": 11.8,
      "value_current": 62000000,
      "value_prior": 47000000,
      "value_delta": 15000000,
      "value_delta_pct": 31.9,
      "contribution_pct": 48.4,
      "trips_per_customer_current": 3.2,
      "trips_per_customer_prior": 2.8,
      "trips_per_customer_delta_pct": 14.3,
      "basket_current": 45.50,
      "basket_prior": 42.50,
      "basket_delta_pct": 7.1,
      "rank": 2,
      "sentiment": "positive"
    },
    {
      "name": "FS-only Active",
      "customer_current": 591000,
      "customer_prior": 502000,
      "customer_delta": 89000,
      "customer_delta_pct": 17.7,
      "value_current": 83500000,
      "value_prior": 71000000,
      "value_delta": 12500000,
      "value_delta_pct": 17.6,
      "contribution_pct": 40.3,
      "trips_per_customer_current": 1.9,
      "trips_per_customer_prior": 1.8,
      "trips_per_customer_delta_pct": 5.6,
      "basket_current": 74.50,
      "basket_prior": 78.50,
      "basket_delta_pct": -5.1,
      "rank": 3,
      "sentiment": "mixed"
    },
    {
      "name": "Non-member",
      "customer_current": 102000,
      "customer_prior": 100000,
      "customer_delta": 2000,
      "customer_delta_pct": 2.0,
      "value_current": 6000000,
      "value_prior": 5500000,
      "value_delta": 500000,
      "value_delta_pct": 9.1,
      "contribution_pct": 1.6,
      "trips_per_customer_current": 1.2,
      "trips_per_customer_prior": 1.1,
      "trips_per_customer_delta_pct": 9.1,
      "basket_current": 49.00,
      "basket_prior": 50.00,
      "basket_delta_pct": -2.0,
      "rank": 4,
      "sentiment": "neutral"
    },
    {
      "name": "Rx-only",
      "customer_current": 485000,
      "customer_prior": 483000,
      "customer_delta": 2000,
      "customer_delta_pct": 0.4,
      "value_current": 72500000,
      "value_prior": 72000000,
      "value_delta": 500000,
      "value_delta_pct": 0.7,
      "contribution_pct": 1.6,
      "trips_per_customer_current": 2.1,
      "trips_per_customer_prior": 2.1,
      "trips_per_customer_delta_pct": 0.0,
      "basket_current": 71.20,
      "basket_prior": 71.00,
      "basket_delta_pct": 0.3,
      "rank": 5,
      "sentiment": "neutral"
    }
  ],
  "drill_down": {
    "Reactivated Customers": {
      "lifecycle": [
        {
          "stage": "Recently Reactivated (<30 days)",
          "customers": 85000,
          "yoy_delta": 15000,
          "yoy_pct": 21.4,
          "value": 9500000,
          "trips_per_customer": 1.5
        },
        {
          "stage": "Reactivated (30-90 days)",
          "customers": 57000,
          "yoy_delta": 7000,
          "yoy_pct": 14.0,
          "value": 5500000,
          "trips_per_customer": 2.2
        }
      ]
    },
    "PCW Customers": {
      "lifecycle": [
        {
          "stage": "Active",
          "customers": 380000,
          "yoy_delta": 38000,
          "yoy_pct": 11.1,
          "value": 55000000,
          "trips_per_customer": 3.5
        },
        {
          "stage": "New",
          "customers": 32000,
          "yoy_delta": 5000,
          "yoy_pct": 18.5,
          "value": 4800000,
          "trips_per_customer": 2.1
        },
        {
          "stage": "Onboarding",
          "customers": 13000,
          "yoy_delta": 2000,
          "yoy_pct": 18.2,
          "value": 2200000,
          "trips_per_customer": 2.4
        }
      ]
    },
    "FS-only Active": {
      "lifecycle": [
        {
          "stage": "Active",
          "customers": 591000,
          "yoy_delta": 89000,
          "yoy_pct": 17.7,
          "value": 83500000,
          "trips_per_customer": 1.9
        }
      ]
    },
    "Non-member": {
      "lifecycle": [
        {
          "stage": "Active",
          "customers": 102000,
          "yoy_delta": 2000,
          "yoy_pct": 2.0,
          "value": 6000000,
          "trips_per_customer": 1.2
        }
      ]
    }
  },
  "waterfall_data": {
    "baseline": {
      "label": "Prior Year Total",
      "value": 247000000
    },
    "changes": [
      {
        "label": "Reactivated",
        "value": 8000000,
        "type": "increase"
      },
      {
        "label": "PCW Customers",
        "value": 15000000,
        "type": "increase"
      },
      {
        "label": "FS-only Active",
        "value": 12500000,
        "type": "increase"
      },
      {
        "label": "Non-member",
        "value": 500000,
        "type": "increase"
      },
      {
        "label": "Rx-only",
        "value": 500000,
        "type": "increase"
      }
    ],
    "total": {
      "label": "Current Year Total",
      "value": 285000000
    }
  },
  "narrative_focus": "opportunity",
  "narrative_opening": "The biggest opportunity this week is in <strong>reactivated customers</strong>, growing 114% YoY (+22K customers, +$8M). These previously churned customers are returning at unprecedented rates, suggesting win-back campaigns are highly effective. Second opportunity: <strong>PCW customers</strong> growing 32% (+45K customers, +$15M) - the integrated pharmacy+retail value proposition is resonating strongly.",
  "recommendations": [
    "Double down: What specific reactivation tactics are driving 114% growth? Scale the successful campaigns immediately.",
    "Expand reach: Can we apply the reactivation playbook to other lapsed customer segments for similar ROI?",
    "Capitalize on conversion: How can we convert reactivated customers to PCW status for sustained long-term value?",
    "Test and learn: Which channels (email, direct mail, personalized coupons) show highest reactivation ROI? Optimize mix."
  ],
  "maturity_tiers": {
    "PCW Customers": {
      "Active": [
        {
          "tier": "tier_1_new",
          "label": "Tier 1 - New Customer",
          "customers": 45000,
          "definition": "< 3 months, < 5 trips",
          "avg_value": 95,
          "yoy_pct": 15.2,
          "value_total": 4275000
        },
        {
          "tier": "tier_2_growing",
          "label": "Tier 2 - Growing",
          "customers": 85000,
          "definition": "3-12 months, 5-15 trips",
          "avg_value": 125,
          "yoy_pct": 12.8,
          "value_total": 10625000
        },
        {
          "tier": "tier_3_high_value",
          "label": "Tier 3 - High Value",
          "customers": 120000,
          "definition": "12+ months, 15-30 trips",
          "avg_value": 185,
          "yoy_pct": 8.5,
          "value_total": 22200000
        },
        {
          "tier": "tier_4_vip",
          "label": "Tier 4 - VIP",
          "customers": 95000,
          "definition": "24+ months, 30-50 trips",
          "avg_value": 265,
          "yoy_pct": 5.2,
          "value_total": 25175000
        },
        {
          "tier": "tier_5_champion",
          "label": "Tier 5 - Champion",
          "customers": 35000,
          "definition": "36+ months, 50+ trips",
          "avg_value": 425,
          "yoy_pct": 3.1,
          "value_total": 14875000
        }
      ]
    }
  },
  "behavioral_cohorts": {
    "tier_3_high_value": [
      {
        "name": "High Recency + High Frequency",
        "recency_score": 5,
        "frequency_score": 5,
        "breadth_score": 4,
        "coupon_score": 3,
        "channel_score": 4,
        "customers": 45000,
        "description": "Recent shoppers, frequent visits, multi-category",
        "yoy_pct": 18.5,
        "avg_value": 195
      },
      {
        "name": "High Recency + Medium Frequency",
        "recency_score": 5,
        "frequency_score": 3,
        "breadth_score": 3,
        "coupon_score": 4,
        "channel_score": 3,
        "customers": 35000,
        "description": "Recent shoppers, moderate visits, coupon-responsive",
        "yoy_pct": 12.2,
        "avg_value": 175
      },
      {
        "name": "Medium All-Around",
        "recency_score": 3,
        "frequency_score": 3,
        "breadth_score": 3,
        "coupon_score": 3,
        "channel_score": 3,
        "customers": 25000,
        "description": "Balanced engagement across all dimensions",
        "yoy_pct": 8.5,
        "avg_value": 185
      },
      {
        "name": "Low Recency + High Frequency",
        "recency_score": 2,
        "frequency_score": 5,
        "breadth_score": 4,
        "coupon_score": 2,
        "channel_score": 4,
        "customers": 15000,
        "description": "Loyal but less recent, high trip frequency",
        "yoy_pct": 5.1,
        "avg_value": 180
      }
    ]
  },
  "demographics": {
    "High Recency + High Frequency": {
      "age_groups": [
        {
          "range": "18-24",
          "customers": 3500,
          "avg_basket": 38.50,
          "yoy_pct": 8.2,
          "pct_of_cohort": 7.8
        },
        {
          "range": "25-34",
          "customers": 8500,
          "avg_basket": 52.75,
          "yoy_pct": 15.8,
          "pct_of_cohort": 18.9
        },
        {
          "range": "35-44",
          "customers": 12000,
          "avg_basket": 68.20,
          "yoy_pct": 12.5,
          "pct_of_cohort": 26.7
        },
        {
          "range": "45-64",
          "customers": 16000,
          "avg_basket": 78.50,
          "yoy_pct": 9.8,
          "pct_of_cohort": 35.6
        },
        {
          "range": "65+",
          "customers": 5000,
          "avg_basket": 72.30,
          "yoy_pct": 6.5,
          "pct_of_cohort": 11.1
        }
      ],
      "household_types": [
        {
          "type": "Single",
          "customers": 9000,
          "yoy_pct": 11.2,
          "pct_of_cohort": 20.0
        },
        {
          "type": "Couple",
          "customers": 11000,
          "yoy_pct": 10.5,
          "pct_of_cohort": 24.4
        },
        {
          "type": "Family with Kids",
          "customers": 20000,
          "yoy_pct": 14.8,
          "pct_of_cohort": 44.4
        },
        {
          "type": "Multi-Generational",
          "customers": 5000,
          "yoy_pct": 8.5,
          "pct_of_cohort": 11.1
        }
      ]
    }
  },
  "regional_performance": {
    "Age 45-64": {
      "northeast": {
        "label": "Northeast",
        "customers": 4800,
        "yoy_pct": 12.5,
        "avg_value": 145,
        "total_value": 696000,
        "top_states": ["NY", "MA", "PA"]
      },
      "southeast": {
        "label": "Southeast",
        "customers": 5300,
        "yoy_pct": 15.8,
        "avg_value": 132,
        "total_value": 699600,
        "top_states": ["FL", "GA", "NC"]
      },
      "midwest": {
        "label": "Midwest",
        "customers": 3200,
        "yoy_pct": 8.2,
        "avg_value": 128,
        "total_value": 409600,
        "top_states": ["IL", "OH", "MI"]
      },
      "west": {
        "label": "West",
        "customers": 2700,
        "yoy_pct": 10.5,
        "avg_value": 152,
        "total_value": 410400,
        "top_states": ["CA", "WA", "AZ"]
      }
    }
  }
};
