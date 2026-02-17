// Data for "What needs my attention this week?" question
// Focus: Anomaly detection + Priority ranking
// Ordering: By absolute impact (largest absolute value first, negatives highlighted)

window.insightData = {
  "question_type": "attention",
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
      "rank": 1,
      "sentiment": "positive",
      "demographic_summary": {
        "top_age_group": "Age 45-64", "top_age_pct": 38,
        "top_region": "Southeast", "top_region_pct": 34,
        "top_income": "$50K-$100K", "top_income_pct": 48,
        "gender_split": { "female": 61, "male": 34, "other": 5 }
      },
      "tier2_tags": {
        "acquisition_onboarding": {
          "customers": 32000,
          "value": 4800000,
          "description": "New PCW customers in first 90 days, building shopping patterns across pharmacy and front store"
        },
        "retention_ltv": {
          "customers": 380000,
          "value": 55000000,
          "description": "Active PCW customers with established cross-business behavior, progressing through maturity tiers"
        },
        "cross_business_behavior": {
          "customers": 425000,
          "value": 62000000,
          "description": "All PCW customers shop both Rx and FS, demonstrating integrated health and wellness behavior"
        },
        "engagement_loyalty": {
          "customers": 395000,
          "value": 57000000,
          "description": "PCW customers using ExtraCare rewards, coupons, and digital channels (est. 93% of base)"
        },
        "segmentation_targeting": {
          "customers": 0,
          "value": 0,
          "description": "Classification and targeting analytics (not customer-facing metric)"
        }
      }
    },
    {
      "name": "Retail-only Churned",
      "customer_current": 152000,
      "customer_prior": 160000,
      "customer_delta": -8000,
      "customer_delta_pct": -5.0,
      "value_current": 0,
      "value_prior": 3000000,
      "value_delta": -3000000,
      "value_delta_pct": -100.0,
      "contribution_pct": -9.7,
      "trips_per_customer_current": 0.0,
      "trips_per_customer_prior": 0.6,
      "trips_per_customer_delta_pct": -100.0,
      "basket_current": 0.00,
      "basket_prior": 31.25,
      "basket_delta_pct": -100.0,
      "rank": 2,
      "sentiment": "negative",
      "demographic_summary": {
        "top_age_group": "Age 25-34", "top_age_pct": 32,
        "top_region": "Northeast", "top_region_pct": 38,
        "top_income": "Under $50K", "top_income_pct": 45,
        "gender_split": { "female": 55, "male": 40, "other": 5 }
      },
      "tier2_tags": {
        "acquisition_onboarding": {
          "customers": 0,
          "value": 0,
          "description": "No acquisition activity (churned segment)"
        },
        "retention_ltv": {
          "customers": 152000,
          "value": -3000000,
          "description": "Failed retention - customers churned due to single-channel vulnerability"
        },
        "cross_business_behavior": {
          "customers": 0,
          "value": 0,
          "description": "No cross-business behavior (retail-only, now inactive)"
        },
        "engagement_loyalty": {
          "customers": 0,
          "value": 0,
          "description": "No engagement (churned)"
        },
        "segmentation_targeting": {
          "customers": 152000,
          "value": 0,
          "description": "Win-back targeting opportunity - retail-only churn indicates PCW conversion gap"
        }
      }
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
      "sentiment": "mixed",
      "demographic_summary": {
        "top_age_group": "Age 35-44", "top_age_pct": 29,
        "top_region": "Southeast", "top_region_pct": 31,
        "top_income": "$50K-$100K", "top_income_pct": 44,
        "gender_split": { "female": 63, "male": 32, "other": 5 }
      },
      "tier2_tags": {
        "acquisition_onboarding": {
          "customers": 89000,
          "value": 12500000,
          "description": "New retail-only customers, but lack pharmacy integration (churn risk)"
        },
        "retention_ltv": {
          "customers": 502000,
          "value": 71000000,
          "description": "Retained retail-only customers, but single-channel = vulnerable to competition"
        },
        "cross_business_behavior": {
          "customers": 0,
          "value": 0,
          "description": "Zero cross-business behavior - PCW conversion opportunity of 591K customers"
        },
        "engagement_loyalty": {
          "customers": 354000,
          "value": 50100000,
          "description": "ExtraCare members within retail-only (est. 60% of segment)"
        },
        "segmentation_targeting": {
          "customers": 591000,
          "value": 83500000,
          "description": "Primary PCW conversion target - highest volume opportunity segment"
        }
      }
    },
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
      "rank": 4,
      "sentiment": "positive",
      "demographic_summary": {
        "top_age_group": "Age 45-64", "top_age_pct": 41,
        "top_region": "Midwest", "top_region_pct": 29,
        "top_income": "$50K-$100K", "top_income_pct": 46,
        "gender_split": { "female": 60, "male": 35, "other": 5 }
      },
      "tier2_tags": {
        "acquisition_onboarding": {
          "customers": 85000,
          "value": 9500000,
          "description": "Recently reactivated (<30 days), re-establishing shopping patterns"
        },
        "retention_ltv": {
          "customers": 142000,
          "value": 15000000,
          "description": "Reactivated customers at risk of re-churning without stabilization (8% fall back within 90 days)"
        },
        "cross_business_behavior": {
          "customers": 28000,
          "value": 3000000,
          "description": "Reactivated customers adopting PCW behavior (est. 20% of reactivated base)"
        },
        "engagement_loyalty": {
          "customers": 114000,
          "value": 12000000,
          "description": "Win-back campaigns and re-engagement tactics driving loyalty program adoption (est. 80%)"
        },
        "segmentation_targeting": {
          "customers": 142000,
          "value": 15000000,
          "description": "Win-back success driving +114% value growth, but requires stabilization interventions"
        }
      }
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
      "sentiment": "neutral",
      "demographic_summary": {
        "top_age_group": "Age 65+", "top_age_pct": 44,
        "top_region": "Southeast", "top_region_pct": 33,
        "top_income": "$50K-$100K", "top_income_pct": 47,
        "gender_split": { "female": 62, "male": 33, "other": 5 }
      },
      "tier2_tags": {
        "acquisition_onboarding": {
          "customers": 2000,
          "value": 500000,
          "description": "New pharmacy-only customers, but stagnant growth (+0.4%) indicates limited pharmacy-first acquisition"
        },
        "retention_ltv": {
          "customers": 483000,
          "value": 72000000,
          "description": "Retained pharmacy customers, but flat growth suggests disengagement risk"
        },
        "cross_business_behavior": {
          "customers": 0,
          "value": 0,
          "description": "Zero cross-business behavior - FS conversion opportunity of 485K customers"
        },
        "engagement_loyalty": {
          "customers": 315000,
          "value": 47125000,
          "description": "Pharmacy loyalty (refills, auto-refill), est. 65% ExtraCare participation"
        },
        "segmentation_targeting": {
          "customers": 485000,
          "value": 72500000,
          "description": "Front store expansion target - 'Add trip for wellness' campaign opportunity"
        }
      }
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
      "rank": 6,
      "sentiment": "neutral",
      "demographic_summary": {
        "top_age_group": "Age 18-24", "top_age_pct": 35,
        "top_region": "West", "top_region_pct": 28,
        "top_income": "Under $50K", "top_income_pct": 52,
        "gender_split": { "female": 48, "male": 45, "other": 7 }
      },
      "tier2_tags": {
        "acquisition_onboarding": {
          "customers": 2000,
          "value": 500000,
          "description": "New non-member customers without ExtraCare enrollment"
        },
        "retention_ltv": {
          "customers": 100000,
          "value": 5500000,
          "description": "Non-members have lowest retention (52% churn rate) and lowest CLV due to lack of loyalty program engagement"
        },
        "cross_business_behavior": {
          "customers": 0,
          "value": 0,
          "description": "No cross-business behavior - single-channel, transactional shoppers without loyalty"
        },
        "engagement_loyalty": {
          "customers": 0,
          "value": 0,
          "description": "Zero loyalty program engagement - primary ExtraCare enrollment target (100K opportunity)"
        },
        "segmentation_targeting": {
          "customers": 102000,
          "value": 6000000,
          "description": "ExtraCare enrollment opportunity - converting non-members increases retention by 30pp and CLV by $120"
        }
      }
    }
  ],
  "drill_down": {
    "PCW Customers": {
      "lifecycle": [
        {
          "stage": "Active",
          "customers_current": 380000,
          "customers_prior": 342000,
          "customers_delta": 38000,
          "customers_delta_pct": 11.1,
          "value_current": 55000000,
          "value_prior": 49500000,
          "value_delta": 5500000,
          "value_delta_pct": 11.1,
          "trips_per_customer_current": 3.5,
          "trips_per_customer_prior": 3.2,
          "trips_per_customer_delta_pct": 9.4,
          "basket_current": 41.35,
          "basket_prior": 45.26,
          "basket_delta_pct": -8.6,
          "contribution_pct": 88.7,
          "rank": 1
        },
        {
          "stage": "New",
          "customers_current": 32000,
          "customers_prior": 27000,
          "customers_delta": 5000,
          "customers_delta_pct": 18.5,
          "value_current": 4800000,
          "value_prior": 4050000,
          "value_delta": 750000,
          "value_delta_pct": 18.5,
          "trips_per_customer_current": 2.1,
          "trips_per_customer_prior": 2.0,
          "trips_per_customer_delta_pct": 5.0,
          "basket_current": 71.43,
          "basket_prior": 75.00,
          "basket_delta_pct": -4.8,
          "contribution_pct": 7.7,
          "rank": 2
        },
        {
          "stage": "Onboarding",
          "customers_current": 13000,
          "customers_prior": 11000,
          "customers_delta": 2000,
          "customers_delta_pct": 18.2,
          "value_current": 2200000,
          "value_prior": 1860000,
          "value_delta": 340000,
          "value_delta_pct": 18.3,
          "trips_per_customer_current": 2.4,
          "trips_per_customer_prior": 2.2,
          "trips_per_customer_delta_pct": 9.1,
          "basket_current": 70.51,
          "basket_prior": 76.86,
          "basket_delta_pct": -8.3,
          "contribution_pct": 3.5,
          "rank": 3
        }
      ]
    },
    "Reactivated Customers": {
      "lifecycle": [
        {
          "stage": "Recently Reactivated (<30 days)",
          "customers_current": 85000,
          "customers_prior": 70000,
          "customers_delta": 15000,
          "customers_delta_pct": 21.4,
          "value_current": 9500000,
          "value_prior": 7825000,
          "value_delta": 1675000,
          "value_delta_pct": 21.4,
          "trips_per_customer_current": 1.5,
          "trips_per_customer_prior": 1.4,
          "trips_per_customer_delta_pct": 7.1,
          "basket_current": 74.51,
          "basket_prior": 79.85,
          "basket_delta_pct": -6.7,
          "contribution_pct": 63.3,
          "rank": 1
        },
        {
          "stage": "Reactivated (30-90 days)",
          "customers_current": 57000,
          "customers_prior": 50000,
          "customers_delta": 7000,
          "customers_delta_pct": 14.0,
          "value_current": 5500000,
          "value_prior": 4825000,
          "value_delta": 675000,
          "value_delta_pct": 14.0,
          "trips_per_customer_current": 2.2,
          "trips_per_customer_prior": 2.1,
          "trips_per_customer_delta_pct": 4.8,
          "basket_current": 43.86,
          "basket_prior": 45.95,
          "basket_delta_pct": -4.5,
          "contribution_pct": 36.7,
          "rank": 2
        }
      ]
    },
    "Retail-only Churned": {
      "lifecycle": [
        {
          "stage": "Churned (52+ weeks)",
          "customers_current": 152000,
          "customers_prior": 160000,
          "customers_delta": -8000,
          "customers_delta_pct": -5.0,
          "value_current": 0,
          "value_prior": 3000000,
          "value_delta": -3000000,
          "value_delta_pct": -100.0,
          "trips_per_customer_current": 0.0,
          "trips_per_customer_prior": 0.6,
          "trips_per_customer_delta_pct": -100.0,
          "basket_current": 0.00,
          "basket_prior": 31.25,
          "basket_delta_pct": -100.0,
          "contribution_pct": 100.0,
          "rank": 1
        }
      ]
    },
    "Non-member": {
      "lifecycle": [
        {
          "stage": "Active",
          "customers_current": 85000,
          "customers_prior": 83500,
          "customers_delta": 1500,
          "customers_delta_pct": 1.8,
          "value_current": 5000000,
          "value_prior": 4912000,
          "value_delta": 88000,
          "value_delta_pct": 1.8,
          "trips_per_customer_current": 1.2,
          "trips_per_customer_prior": 1.18,
          "trips_per_customer_delta_pct": 1.7,
          "basket_current": 49.02,
          "basket_prior": 49.88,
          "basket_delta_pct": -1.7,
          "contribution_pct": 83.3,
          "rank": 1
        },
        {
          "stage": "New",
          "customers_current": 15000,
          "customers_prior": 14600,
          "customers_delta": 400,
          "customers_delta_pct": 2.7,
          "value_current": 900000,
          "value_prior": 876300,
          "value_delta": 23700,
          "value_delta_pct": 2.7,
          "trips_per_customer_current": 0.8,
          "trips_per_customer_prior": 0.78,
          "trips_per_customer_delta_pct": 2.6,
          "basket_current": 75.00,
          "basket_prior": 76.90,
          "basket_delta_pct": -2.5,
          "contribution_pct": 15.0,
          "rank": 2
        },
        {
          "stage": "Churned (13-52 weeks)",
          "customers_current": 2000,
          "customers_prior": 1900,
          "customers_delta": 100,
          "customers_delta_pct": 5.3,
          "value_current": 100000,
          "value_prior": 95000,
          "value_delta": 5000,
          "value_delta_pct": 5.3,
          "trips_per_customer_current": 0.3,
          "trips_per_customer_prior": 0.29,
          "trips_per_customer_delta_pct": 3.4,
          "basket_current": 166.67,
          "basket_prior": 172.65,
          "basket_delta_pct": -3.5,
          "contribution_pct": 1.7,
          "rank": 3
        }
      ]
    },
    "FS-only Active": {
      "lifecycle": [
        {
          "stage": "Active",
          "customers_current": 502000,
          "customers_prior": 425000,
          "customers_delta": 77000,
          "customers_delta_pct": 18.1,
          "value_current": 71000000,
          "value_prior": 60100000,
          "value_delta": 10900000,
          "value_delta_pct": 18.1,
          "trips_per_customer_current": 1.8,
          "trips_per_customer_prior": 1.7,
          "trips_per_customer_delta_pct": 5.9,
          "basket_current": 78.50,
          "basket_prior": 83.15,
          "basket_delta_pct": -5.6,
          "contribution_pct": 85.0,
          "rank": 1
        },
        {
          "stage": "New",
          "customers_current": 89000,
          "customers_prior": 77000,
          "customers_delta": 12000,
          "customers_delta_pct": 15.6,
          "value_current": 12500000,
          "value_prior": 10800000,
          "value_delta": 1700000,
          "value_delta_pct": 15.7,
          "trips_per_customer_current": 1.4,
          "trips_per_customer_prior": 1.35,
          "trips_per_customer_delta_pct": 3.7,
          "basket_current": 100.40,
          "basket_prior": 103.96,
          "basket_delta_pct": -3.4,
          "contribution_pct": 15.0,
          "rank": 2
        }
      ]
    },
    "Rx-only": {
      "lifecycle": [
        {
          "stage": "Active",
          "customers_current": 483000,
          "customers_prior": 481000,
          "customers_delta": 2000,
          "customers_delta_pct": 0.4,
          "value_current": 72000000,
          "value_prior": 71700000,
          "value_delta": 300000,
          "value_delta_pct": 0.4,
          "trips_per_customer_current": 2.1,
          "trips_per_customer_prior": 2.1,
          "trips_per_customer_delta_pct": 0.0,
          "basket_current": 71.00,
          "basket_prior": 70.94,
          "basket_delta_pct": 0.1,
          "contribution_pct": 99.3,
          "rank": 1
        },
        {
          "stage": "New",
          "customers_current": 2000,
          "customers_prior": 2000,
          "customers_delta": 0,
          "customers_delta_pct": 0.0,
          "value_current": 500000,
          "value_prior": 500000,
          "value_delta": 0,
          "value_delta_pct": 0.0,
          "trips_per_customer_current": 1.8,
          "trips_per_customer_prior": 1.8,
          "trips_per_customer_delta_pct": 0.0,
          "basket_current": 138.89,
          "basket_prior": 138.89,
          "basket_delta_pct": 0.0,
          "contribution_pct": 0.7,
          "rank": 2
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
        "label": "PCW Customers",
        "value": 15000000,
        "type": "increase",
        "regional_breakdown": [
          { "region": "Southeast", "value": 6200000, "pct": 41.3 },
          { "region": "Northeast", "value": 4100000, "pct": 27.3 },
          { "region": "West",      "value": 3000000, "pct": 20.0 },
          { "region": "Midwest",   "value": 1700000, "pct": 11.4 }
        ]
      },
      {
        "label": "FS-only Active",
        "value": 12500000,
        "type": "increase",
        "regional_breakdown": [
          { "region": "Southeast", "value": 4500000, "pct": 36.0 },
          { "region": "Northeast", "value": 3750000, "pct": 30.0 },
          { "region": "West",      "value": 2500000, "pct": 20.0 },
          { "region": "Midwest",   "value": 1750000, "pct": 14.0 }
        ]
      },
      {
        "label": "Reactivated",
        "value": 8000000,
        "type": "increase",
        "regional_breakdown": [
          { "region": "Southeast", "value": 2800000, "pct": 35.0 },
          { "region": "Midwest",   "value": 2400000, "pct": 30.0 },
          { "region": "Northeast", "value": 1600000, "pct": 20.0 },
          { "region": "West",      "value": 1200000, "pct": 15.0 }
        ]
      },
      {
        "label": "Non-member",
        "value": 500000,
        "type": "increase",
        "regional_breakdown": [
          { "region": "West",      "value": 200000, "pct": 40.0 },
          { "region": "Southeast", "value": 150000, "pct": 30.0 },
          { "region": "Northeast", "value": 100000, "pct": 20.0 },
          { "region": "Midwest",   "value": 50000,  "pct": 10.0 }
        ]
      },
      {
        "label": "Rx-only",
        "value": 500000,
        "type": "increase",
        "regional_breakdown": [
          { "region": "Southeast", "value": 200000, "pct": 40.0 },
          { "region": "Northeast", "value": 150000, "pct": 30.0 },
          { "region": "Midwest",   "value": 100000, "pct": 20.0 },
          { "region": "West",      "value": 50000,  "pct": 10.0 }
        ]
      },
      {
        "label": "Retail-only Churned",
        "value": -3000000,
        "type": "decrease",
        "regional_breakdown": [
          { "region": "Northeast", "value": -1200000, "pct": 40.0 },
          { "region": "Midwest",   "value": -900000,  "pct": 30.0 },
          { "region": "Southeast", "value": -600000,  "pct": 20.0 },
          { "region": "West",      "value": -300000,  "pct": 10.0 }
        ]
      }
    ],
    "total": {
      "label": "Current Year Total",
      "value": 285000000
    }
  },
  "narrative_focus": "attention",
  "narrative_opening": "This week requires attention in two areas: <strong>Retail-only churn</strong> is accelerating with -8K customers (-$3M impact), while <strong>PCW customer growth</strong> continues strong at +45K customers (+$15M). The churn issue merits immediate investigation to understand root causes and prevent further deterioration.",
  "recommendations": [
    "Investigate: Why are retail-only customers churning? Are there geographic patterns we can identify?",
    "Action: Can we convert at-risk retail-only customers to PCW before they churn? What intervention tactics work?",
    "Monitor: Is the pharmacy-only segment stagnating (+0.4% growth)? Should we be concerned about engagement decline?",
    "Validate: Which reactivation tactics are working best to ensure we sustain the +114% growth rate?"
  ],
  "strategic_pillars": {
    "grow_active_customers": {
      "pillar_name": "Grow Active Customers",
      "metrics": {
        "lagging": [
          {
            "name": "Active Customer Count",
            "current": 2100000,
            "prior": 1950000,
            "trend": 7.7,
            "unit": "customers"
          },
          {
            "name": "New Customer Acquisition",
            "current": 45000,
            "prior": 39000,
            "trend": 15.4,
            "unit": "customers/quarter"
          },
          {
            "name": "CAC",
            "current": 22,
            "prior": 22,
            "trend": 0,
            "unit": "dollars"
          }
        ],
        "leading": [
          {
            "name": "Onboarding Velocity (3+ trips/30 days)",
            "current": 62,
            "prior": 59,
            "trend": 5.1,
            "unit": "percent"
          },
          {
            "name": "New → Active Conversion",
            "current": 78,
            "prior": 76,
            "trend": 2.6,
            "unit": "percent"
          }
        ]
      }
    },
    "improve_retention": {
      "pillar_name": "Improve Retention",
      "metrics": {
        "lagging": [
          {
            "name": "Retention Rate (YoY)",
            "current": 82,
            "prior": 76,
            "trend": 7.9,
            "unit": "percent"
          },
          {
            "name": "Churn Rate",
            "current": 18,
            "prior": 24,
            "trend": -25.0,
            "unit": "percent"
          },
          {
            "name": "At-Risk Customer Count",
            "current": 215000,
            "prior": 215000,
            "trend": 0,
            "unit": "customers"
          }
        ],
        "leading": [
          {
            "name": "Recency Score (Avg Days)",
            "current": 18,
            "prior": 21,
            "trend": -14.3,
            "unit": "days"
          },
          {
            "name": "PCW Conversion Rate",
            "current": 12,
            "prior": 10,
            "trend": 20.0,
            "unit": "percent"
          },
          {
            "name": "Maturity Tier Progression",
            "current": 23,
            "prior": 20,
            "trend": 15.0,
            "unit": "percent"
          }
        ]
      }
    },
    "increase_frequency_basket": {
      "pillar_name": "Increase Visit Frequency & Basket",
      "metrics": {
        "lagging": [
          {
            "name": "Trips per Customer",
            "current": 2.24,
            "prior": 2.16,
            "trend": 3.7,
            "unit": "trips"
          },
          {
            "name": "Basket Size",
            "current": 60.64,
            "prior": 58.92,
            "trend": 2.9,
            "unit": "dollars"
          }
        ],
        "leading": [
          {
            "name": "Category Penetration",
            "current": 3.2,
            "prior": 2.96,
            "trend": 8.1,
            "unit": "categories"
          },
          {
            "name": "Multi-Mission Trip %",
            "current": 42,
            "prior": 41,
            "trend": 2.4,
            "unit": "percent"
          },
          {
            "name": "Digital Trip %",
            "current": 28,
            "prior": 27,
            "trend": 3.7,
            "unit": "percent"
          }
        ]
      }
    }
  },
  "insights": {
    "rx_fs_connection": {
      "insight_id": "rx_fs_connection",
      "insight_title": "Rx-FS Connection Is the Golden Path to Retention",
      "hypothesis": "Customers who shop both Rx and Front Store (PCW) are stickier and more valuable",
      "tier2_area": "cross_business_behavior",
      "layer1": {
        "segment": "Retail-Only Active Customers",
        "pct_of_base": 28,
        "customer_count": 591000,
        "state": "PCW conversion opportunity"
      },
      "layer2": {
        "type": "lagging",
        "observable_outcome": "Only 12% convert to PCW within 12 months",
        "baseline": "88% stay retail-only",
        "measurement": "PCW conversion rate tracking"
      },
      "layer3": {
        "type": "leading",
        "indicator": "First Rx fill within 90 days",
        "signal_strength": 85,
        "lead_time_months": 12,
        "attribution": "First Rx fill creates pharmacy dependency, leading to cross-shopping behavior and higher retention"
      },
      "layer4": {
        "retention_lift_pct": 42,
        "clv_lift_dollars": 385,
        "total_opportunity_millions": 204
      },
      "what_this_means": {
        "current_state": "88% of retail-only customers never adopt pharmacy, missing CVS's core value proposition. They remain vulnerable to Amazon and Walmart competition.",
        "opportunity": "Convert retail shoppers to PCW through first Rx incentive. PCW customers have 42% higher retention and $385 higher lifetime value.",
        "early_warning": {
          "metric": "Days since acquisition without Rx fill",
          "threshold": ">120 days = low PCW conversion likelihood",
          "signal": "Extended retail-only tenure predicts permanent single-channel status"
        },
        "intervention": {
          "tactic": "3 Free Rx Fills promotion for retail-only customers",
          "timing": "Trigger at 60-day mark after acquisition",
          "targeting": "Customers with 2+ FS trips but zero Rx fills"
        },
        "expected_impact": {
          "conversion_target_pct": 10,
          "customer_count": 59000,
          "value_millions": 22.7,
          "roi_multiple": 15.1
        },
        "opportunity_cost": {
          "if_optimize": "Pharmacy lock-in creates sustainable retention advantage and cross-shopping synergy",
          "if_dont_optimize": "FS-only (retail-only) customers remain vulnerable to e-commerce competitors with no switching cost",
          "risk": "Single-channel customers have 58% higher churn rate than PCW customers"
        }
      }
    }
  },
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
    },
    "FS-only Active": {
      "Active": [
        {
          "tier": "tier_1_new",
          "label": "Tier 1 - New Customer",
          "customers": 95000,
          "definition": "< 3 months, < 5 trips",
          "avg_value": 75,
          "yoy_pct": 22.0,
          "value_total": 7125000
        },
        {
          "tier": "tier_2_growing",
          "label": "Tier 2 - Growing",
          "customers": 175000,
          "definition": "3-12 months, 5-15 trips",
          "avg_value": 110,
          "yoy_pct": 18.0,
          "value_total": 19250000
        },
        {
          "tier": "tier_3_high_value",
          "label": "Tier 3 - High Value",
          "customers": 195000,
          "definition": "12+ months, 15-30 trips",
          "avg_value": 155,
          "yoy_pct": 15.0,
          "value_total": 30225000
        },
        {
          "tier": "tier_4_vip",
          "label": "Tier 4 - VIP",
          "customers": 95000,
          "definition": "24+ months, 30-50 trips",
          "avg_value": 215,
          "yoy_pct": 12.0,
          "value_total": 20425000
        },
        {
          "tier": "tier_5_champion",
          "label": "Tier 5 - Champion",
          "customers": 31000,
          "definition": "36+ months, 50+ trips",
          "avg_value": 335,
          "yoy_pct": 8.0,
          "value_total": 10385000
        }
      ]
    },
    "Rx-only": {
      "Active": [
        {
          "tier": "tier_1_new",
          "label": "Tier 1 - New Customer",
          "customers": 75000,
          "definition": "< 3 months, < 5 trips",
          "avg_value": 80,
          "yoy_pct": 2.0,
          "value_total": 6000000
        },
        {
          "tier": "tier_2_growing",
          "label": "Tier 2 - Growing",
          "customers": 145000,
          "definition": "3-12 months, 5-15 trips",
          "avg_value": 105,
          "yoy_pct": 1.5,
          "value_total": 15225000
        },
        {
          "tier": "tier_3_high_value",
          "label": "Tier 3 - High Value",
          "customers": 155000,
          "definition": "12+ months, 15-30 trips",
          "avg_value": 145,
          "yoy_pct": 0.5,
          "value_total": 22475000
        },
        {
          "tier": "tier_4_vip",
          "label": "Tier 4 - VIP",
          "customers": 80000,
          "definition": "24+ months, 30-50 trips",
          "avg_value": 195,
          "yoy_pct": -0.5,
          "value_total": 15600000
        },
        {
          "tier": "tier_5_champion",
          "label": "Tier 5 - Champion",
          "customers": 30000,
          "definition": "36+ months, 50+ trips",
          "avg_value": 305,
          "yoy_pct": -1.0,
          "value_total": 9150000
        }
      ]
    },
    "Non-member": {
      "Active": [
        {
          "tier": "tier_1_new",
          "label": "Tier 1 - New Customer",
          "customers": 55000,
          "definition": "< 3 months, < 5 trips",
          "avg_value": 45,
          "yoy_pct": 3.0,
          "value_total": 2475000
        },
        {
          "tier": "tier_2_growing",
          "label": "Tier 2 - Growing",
          "customers": 25000,
          "definition": "3-12 months, 5-15 trips",
          "avg_value": 70,
          "yoy_pct": 1.0,
          "value_total": 1750000
        },
        {
          "tier": "tier_3_high_value",
          "label": "Tier 3 - High Value",
          "customers": 5000,
          "definition": "12+ months, 15-30 trips",
          "avg_value": 95,
          "yoy_pct": 0.0,
          "value_total": 475000
        },
        {
          "tier": "tier_4_vip",
          "label": "Tier 4 - VIP",
          "customers": 0,
          "definition": "24+ months, 30-50 trips",
          "avg_value": 0,
          "yoy_pct": 0.0,
          "value_total": 0
        },
        {
          "tier": "tier_5_champion",
          "label": "Tier 5 - Champion",
          "customers": 0,
          "definition": "36+ months, 50+ trips",
          "avg_value": 0,
          "yoy_pct": 0.0,
          "value_total": 0
        }
      ]
    }
  },
  "behavioral_cohorts": {
    "tier_1_new": [
      {
        "name": "Exploring + High Engagement",
        "recency_score": 5,
        "frequency_score": 3,
        "breadth_score": 3,
        "coupon_score": 4,
        "channel_score": 5,
        "customers": 18000,
        "description": "New customers exploring multiple categories with high digital engagement",
        "yoy_pct": 20.0,
        "avg_value": 95
      },
      {
        "name": "Slow Start",
        "recency_score": 3,
        "frequency_score": 2,
        "breadth_score": 2,
        "coupon_score": 2,
        "channel_score": 2,
        "customers": 15000,
        "description": "New customers with cautious, low-engagement shopping patterns",
        "yoy_pct": 15.0,
        "avg_value": 75
      },
      {
        "name": "Digital First",
        "recency_score": 4,
        "frequency_score": 3,
        "breadth_score": 2,
        "coupon_score": 1,
        "channel_score": 5,
        "customers": 8000,
        "description": "Digitally-native new customers with strong online channel preference",
        "yoy_pct": 18.0,
        "avg_value": 105
      },
      {
        "name": "Coupon Driven",
        "recency_score": 4,
        "frequency_score": 3,
        "breadth_score": 3,
        "coupon_score": 5,
        "channel_score": 3,
        "customers": 4000,
        "description": "New customers highly responsive to promotional offers",
        "yoy_pct": 17.0,
        "avg_value": 110
      }
    ],
    "tier_2_growing": [
      {
        "name": "High Recency + Medium Frequency",
        "recency_score": 5,
        "frequency_score": 3,
        "breadth_score": 3,
        "coupon_score": 3,
        "channel_score": 4,
        "customers": 35000,
        "description": "Growing customers with strong recent activity and moderate visit patterns",
        "yoy_pct": 18.0,
        "avg_value": 125
      },
      {
        "name": "Steady Builder",
        "recency_score": 4,
        "frequency_score": 4,
        "breadth_score": 3,
        "coupon_score": 3,
        "channel_score": 3,
        "customers": 28000,
        "description": "Consistent customers building stable shopping routines",
        "yoy_pct": 15.0,
        "avg_value": 130
      },
      {
        "name": "Coupon Hunter",
        "recency_score": 4,
        "frequency_score": 3,
        "breadth_score": 2,
        "coupon_score": 5,
        "channel_score": 3,
        "customers": 15000,
        "description": "Deal-focused customers driven by promotional incentives",
        "yoy_pct": 12.0,
        "avg_value": 115
      },
      {
        "name": "Omnichannel Adopter",
        "recency_score": 5,
        "frequency_score": 4,
        "breadth_score": 4,
        "coupon_score": 3,
        "channel_score": 5,
        "customers": 5000,
        "description": "Digitally-engaged customers adopting multiple shopping channels",
        "yoy_pct": 16.0,
        "avg_value": 155
      },
      {
        "name": "Inconsistent Visitor",
        "recency_score": 2,
        "frequency_score": 2,
        "breadth_score": 2,
        "coupon_score": 3,
        "channel_score": 2,
        "customers": 2000,
        "description": "Irregular shoppers with low engagement across dimensions",
        "yoy_pct": 14.0,
        "avg_value": 85
      }
    ],
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
    ],
    "tier_4_vip": [
      {
        "name": "VIP All-Around",
        "recency_score": 5,
        "frequency_score": 5,
        "breadth_score": 5,
        "coupon_score": 4,
        "channel_score": 5,
        "customers": 42000,
        "description": "Elite customers with excellent engagement across all dimensions",
        "yoy_pct": 8.0,
        "avg_value": 295
      },
      {
        "name": "Pharmacy Dependent",
        "recency_score": 5,
        "frequency_score": 5,
        "breadth_score": 3,
        "coupon_score": 3,
        "channel_score": 4,
        "customers": 28000,
        "description": "Loyal VIP customers with strong pharmacy-driven shopping patterns",
        "yoy_pct": 6.5,
        "avg_value": 255
      },
      {
        "name": "Weekend Warrior",
        "recency_score": 4,
        "frequency_score": 4,
        "breadth_score": 4,
        "coupon_score": 4,
        "channel_score": 3,
        "customers": 18000,
        "description": "High-value customers with predictable weekend shopping routines",
        "yoy_pct": 7.0,
        "avg_value": 240
      },
      {
        "name": "Digital VIP",
        "recency_score": 5,
        "frequency_score": 5,
        "breadth_score": 4,
        "coupon_score": 4,
        "channel_score": 5,
        "customers": 5000,
        "description": "Tech-savvy VIP customers maximizing digital channels and tools",
        "yoy_pct": 5.5,
        "avg_value": 315
      },
      {
        "name": "Value Optimizer",
        "recency_score": 4,
        "frequency_score": 4,
        "breadth_score": 3,
        "coupon_score": 5,
        "channel_score": 3,
        "customers": 2000,
        "description": "Strategic VIP shoppers maximizing deals and promotional value",
        "yoy_pct": 6.0,
        "avg_value": 220
      }
    ],
    "tier_5_champion": [
      {
        "name": "Omnichannel Champion",
        "recency_score": 5,
        "frequency_score": 5,
        "breadth_score": 5,
        "coupon_score": 5,
        "channel_score": 5,
        "customers": 18000,
        "description": "Top-tier customers excelling in all behavioral dimensions",
        "yoy_pct": 5.0,
        "avg_value": 485
      },
      {
        "name": "Pharmacy Champion",
        "recency_score": 5,
        "frequency_score": 5,
        "breadth_score": 4,
        "coupon_score": 4,
        "channel_score": 4,
        "customers": 10000,
        "description": "Elite pharmacy-centered customers with deep health and wellness commitment",
        "yoy_pct": 3.5,
        "avg_value": 405
      },
      {
        "name": "Mission Diverse",
        "recency_score": 5,
        "frequency_score": 5,
        "breadth_score": 5,
        "coupon_score": 3,
        "channel_score": 4,
        "customers": 5000,
        "description": "Champion customers shopping across all categories with broad missions",
        "yoy_pct": 4.0,
        "avg_value": 395
      },
      {
        "name": "Loyalty Maximizer",
        "recency_score": 5,
        "frequency_score": 5,
        "breadth_score": 4,
        "coupon_score": 5,
        "channel_score": 5,
        "customers": 2000,
        "description": "Strategic champions optimizing all loyalty benefits and digital tools",
        "yoy_pct": 2.5,
        "avg_value": 455
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
      ],
      "income_bands": [
        { "band": "Under $50K",  "customers": 12000, "yoy_pct": 8.2,  "pct_of_cohort": 26.7 },
        { "band": "$50K-$100K",  "customers": 22000, "yoy_pct": 11.5, "pct_of_cohort": 48.9 },
        { "band": "Over $100K",  "customers": 11000, "yoy_pct": 7.8,  "pct_of_cohort": 24.4 }
      ],
      "gender": [
        { "label": "Female",        "customers": 26100, "yoy_pct": 10.2, "pct_of_cohort": 58.0 },
        { "label": "Male",          "customers": 16200, "yoy_pct": 9.8,  "pct_of_cohort": 36.0 },
        { "label": "Other/Unknown", "customers": 2700,  "yoy_pct": 12.1, "pct_of_cohort": 6.0  }
      ]
    },
    "Exploring + High Engagement": {
      "age_groups": [
        {
          "range": "18-24",
          "customers": 4500,
          "avg_basket": 42.50,
          "yoy_pct": 22.0,
          "pct_of_cohort": 25.0
        },
        {
          "range": "25-34",
          "customers": 6500,
          "avg_basket": 55.75,
          "yoy_pct": 20.5,
          "pct_of_cohort": 36.1
        },
        {
          "range": "35-44",
          "customers": 4000,
          "avg_basket": 62.30,
          "yoy_pct": 18.8,
          "pct_of_cohort": 22.2
        },
        {
          "range": "45-64",
          "customers": 2500,
          "avg_basket": 68.50,
          "yoy_pct": 19.5,
          "pct_of_cohort": 13.9
        },
        {
          "range": "65+",
          "customers": 500,
          "avg_basket": 58.20,
          "yoy_pct": 15.0,
          "pct_of_cohort": 2.8
        }
      ],
      "household_types": [
        {
          "type": "Single",
          "customers": 6500,
          "yoy_pct": 21.0,
          "pct_of_cohort": 36.1
        },
        {
          "type": "Couple",
          "customers": 3000,
          "yoy_pct": 18.5,
          "pct_of_cohort": 16.7
        },
        {
          "type": "Family with Kids",
          "customers": 7500,
          "yoy_pct": 20.0,
          "pct_of_cohort": 41.7
        },
        {
          "type": "Multi-Generational",
          "customers": 1000,
          "yoy_pct": 19.0,
          "pct_of_cohort": 5.6
        }
      ],
      "income_bands": [
        { "band": "Under $50K",  "customers": 6300, "yoy_pct": 19.5, "pct_of_cohort": 35.0 },
        { "band": "$50K-$100K",  "customers": 8100, "yoy_pct": 22.0, "pct_of_cohort": 45.0 },
        { "band": "Over $100K",  "customers": 3600, "yoy_pct": 18.2, "pct_of_cohort": 20.0 }
      ],
      "gender": [
        { "label": "Female",        "customers": 10440, "yoy_pct": 21.3, "pct_of_cohort": 58.0 },
        { "label": "Male",          "customers": 6480,  "yoy_pct": 20.1, "pct_of_cohort": 36.0 },
        { "label": "Other/Unknown", "customers": 1080,  "yoy_pct": 25.0, "pct_of_cohort": 6.0  }
      ]
    },
    "Digital First": {
      "age_groups": [
        {
          "range": "18-24",
          "customers": 2400,
          "avg_basket": 52.00,
          "yoy_pct": 20.0,
          "pct_of_cohort": 30.0
        },
        {
          "range": "25-34",
          "customers": 3200,
          "avg_basket": 68.50,
          "yoy_pct": 18.5,
          "pct_of_cohort": 40.0
        },
        {
          "range": "35-44",
          "customers": 1600,
          "avg_basket": 75.20,
          "yoy_pct": 16.0,
          "pct_of_cohort": 20.0
        },
        {
          "range": "45-64",
          "customers": 640,
          "avg_basket": 82.50,
          "yoy_pct": 15.5,
          "pct_of_cohort": 8.0
        },
        {
          "range": "65+",
          "customers": 160,
          "avg_basket": 70.00,
          "yoy_pct": 12.0,
          "pct_of_cohort": 2.0
        }
      ],
      "household_types": [
        {
          "type": "Single",
          "customers": 3200,
          "yoy_pct": 19.0,
          "pct_of_cohort": 40.0
        },
        {
          "type": "Couple",
          "customers": 1600,
          "yoy_pct": 17.5,
          "pct_of_cohort": 20.0
        },
        {
          "type": "Family with Kids",
          "customers": 2800,
          "yoy_pct": 18.0,
          "pct_of_cohort": 35.0
        },
        {
          "type": "Multi-Generational",
          "customers": 400,
          "yoy_pct": 16.0,
          "pct_of_cohort": 5.0
        }
      ],
      "income_bands": [
        { "band": "Under $50K",  "customers": 4840, "yoy_pct": 14.2, "pct_of_cohort": 22.0 },
        { "band": "$50K-$100K",  "customers": 10780, "yoy_pct": 18.5, "pct_of_cohort": 49.0 },
        { "band": "Over $100K",  "customers": 6380, "yoy_pct": 22.1, "pct_of_cohort": 29.0 }
      ],
      "gender": [
        { "label": "Female",        "customers": 11440, "yoy_pct": 17.8, "pct_of_cohort": 52.0 },
        { "label": "Male",          "customers": 8800,  "yoy_pct": 16.2, "pct_of_cohort": 40.0 },
        { "label": "Other/Unknown", "customers": 1760,  "yoy_pct": 24.5, "pct_of_cohort": 8.0  }
      ]
    },
    "Steady Builder": {
      "age_groups": [
        {
          "range": "18-24",
          "customers": 2240,
          "avg_basket": 48.50,
          "yoy_pct": 14.0,
          "pct_of_cohort": 8.0
        },
        {
          "range": "25-34",
          "customers": 6160,
          "avg_basket": 62.00,
          "yoy_pct": 16.5,
          "pct_of_cohort": 22.0
        },
        {
          "range": "35-44",
          "customers": 8960,
          "avg_basket": 72.50,
          "yoy_pct": 15.5,
          "pct_of_cohort": 32.0
        },
        {
          "range": "45-64",
          "customers": 8400,
          "avg_basket": 78.20,
          "yoy_pct": 14.8,
          "pct_of_cohort": 30.0
        },
        {
          "range": "65+",
          "customers": 2240,
          "avg_basket": 72.00,
          "yoy_pct": 13.5,
          "pct_of_cohort": 8.0
        }
      ],
      "household_types": [
        {
          "type": "Single",
          "customers": 5600,
          "yoy_pct": 14.5,
          "pct_of_cohort": 20.0
        },
        {
          "type": "Couple",
          "customers": 7000,
          "yoy_pct": 15.5,
          "pct_of_cohort": 25.0
        },
        {
          "type": "Family with Kids",
          "customers": 12600,
          "yoy_pct": 15.0,
          "pct_of_cohort": 45.0
        },
        {
          "type": "Multi-Generational",
          "customers": 2800,
          "yoy_pct": 15.2,
          "pct_of_cohort": 10.0
        }
      ],
      "income_bands": [
        { "band": "Under $50K",  "customers": 9520,  "yoy_pct": 6.1, "pct_of_cohort": 34.0 },
        { "band": "$50K-$100K",  "customers": 13440, "yoy_pct": 7.8, "pct_of_cohort": 48.0 },
        { "band": "Over $100K",  "customers": 5040,  "yoy_pct": 5.2, "pct_of_cohort": 18.0 }
      ],
      "gender": [
        { "label": "Female",        "customers": 16240, "yoy_pct": 7.2, "pct_of_cohort": 58.0 },
        { "label": "Male",          "customers": 10080, "yoy_pct": 6.8, "pct_of_cohort": 36.0 },
        { "label": "Other/Unknown", "customers": 1680,  "yoy_pct": 9.5, "pct_of_cohort": 6.0  }
      ]
    },
    "Omnichannel Adopter": {
      "age_groups": [
        {
          "range": "18-24",
          "customers": 500,
          "avg_basket": 68.00,
          "yoy_pct": 18.0,
          "pct_of_cohort": 10.0
        },
        {
          "range": "25-34",
          "customers": 1500,
          "avg_basket": 82.50,
          "yoy_pct": 17.0,
          "pct_of_cohort": 30.0
        },
        {
          "range": "35-44",
          "customers": 1500,
          "avg_basket": 88.75,
          "yoy_pct": 16.0,
          "pct_of_cohort": 30.0
        },
        {
          "range": "45-64",
          "customers": 1200,
          "avg_basket": 92.00,
          "yoy_pct": 15.5,
          "pct_of_cohort": 24.0
        },
        {
          "range": "65+",
          "customers": 300,
          "avg_basket": 85.50,
          "yoy_pct": 14.0,
          "pct_of_cohort": 6.0
        }
      ],
      "household_types": [
        {
          "type": "Single",
          "customers": 1250,
          "yoy_pct": 16.5,
          "pct_of_cohort": 25.0
        },
        {
          "type": "Couple",
          "customers": 1250,
          "yoy_pct": 16.0,
          "pct_of_cohort": 25.0
        },
        {
          "type": "Family with Kids",
          "customers": 2000,
          "yoy_pct": 16.0,
          "pct_of_cohort": 40.0
        },
        {
          "type": "Multi-Generational",
          "customers": 500,
          "yoy_pct": 15.5,
          "pct_of_cohort": 10.0
        }
      ],
      "income_bands": [
        { "band": "Under $50K",  "customers": 7200, "yoy_pct": 4.1, "pct_of_cohort": 48.0 },
        { "band": "$50K-$100K",  "customers": 5700, "yoy_pct": 3.8, "pct_of_cohort": 38.0 },
        { "band": "Over $100K",  "customers": 2100, "yoy_pct": 2.9, "pct_of_cohort": 14.0 }
      ],
      "gender": [
        { "label": "Female",        "customers": 10050, "yoy_pct": 3.9, "pct_of_cohort": 67.0 },
        { "label": "Male",          "customers": 4350,  "yoy_pct": 3.5, "pct_of_cohort": 29.0 },
        { "label": "Other/Unknown", "customers": 600,   "yoy_pct": 5.8, "pct_of_cohort": 4.0  }
      ]
    },
    "VIP All-Around": {
      "age_groups": [
        {
          "range": "18-24",
          "customers": 840,
          "avg_basket": 105.00,
          "yoy_pct": 8.5,
          "pct_of_cohort": 2.0
        },
        {
          "range": "25-34",
          "customers": 4200,
          "avg_basket": 125.50,
          "yoy_pct": 9.0,
          "pct_of_cohort": 10.0
        },
        {
          "range": "35-44",
          "customers": 10500,
          "avg_basket": 142.75,
          "yoy_pct": 8.5,
          "pct_of_cohort": 25.0
        },
        {
          "range": "45-64",
          "customers": 18900,
          "avg_basket": 158.20,
          "yoy_pct": 7.8,
          "pct_of_cohort": 45.0
        },
        {
          "range": "65+",
          "customers": 7560,
          "avg_basket": 148.50,
          "yoy_pct": 7.0,
          "pct_of_cohort": 18.0
        }
      ],
      "household_types": [
        {
          "type": "Single",
          "customers": 6300,
          "yoy_pct": 7.5,
          "pct_of_cohort": 15.0
        },
        {
          "type": "Couple",
          "customers": 12600,
          "yoy_pct": 8.5,
          "pct_of_cohort": 30.0
        },
        {
          "type": "Family with Kids",
          "customers": 16800,
          "yoy_pct": 8.0,
          "pct_of_cohort": 40.0
        },
        {
          "type": "Multi-Generational",
          "customers": 6300,
          "yoy_pct": 7.8,
          "pct_of_cohort": 15.0
        }
      ],
      "income_bands": [
        { "band": "Under $50K",  "customers": 14080, "yoy_pct": -8.2,  "pct_of_cohort": 44.0 },
        { "band": "$50K-$100K",  "customers": 13440, "yoy_pct": -11.5, "pct_of_cohort": 42.0 },
        { "band": "Over $100K",  "customers": 4480,  "yoy_pct": -9.8,  "pct_of_cohort": 14.0 }
      ],
      "gender": [
        { "label": "Female",        "customers": 18560, "yoy_pct": -9.8,  "pct_of_cohort": 58.0 },
        { "label": "Male",          "customers": 11520, "yoy_pct": -10.2, "pct_of_cohort": 36.0 },
        { "label": "Other/Unknown", "customers": 1920,  "yoy_pct": -7.1,  "pct_of_cohort": 6.0  }
      ]
    },
    "Pharmacy Dependent": {
      "age_groups": [
        {
          "range": "18-24",
          "customers": 280,
          "avg_basket": 82.00,
          "yoy_pct": 6.0,
          "pct_of_cohort": 1.0
        },
        {
          "range": "25-34",
          "customers": 1400,
          "avg_basket": 95.50,
          "yoy_pct": 7.0,
          "pct_of_cohort": 5.0
        },
        {
          "range": "35-44",
          "customers": 4200,
          "avg_basket": 108.75,
          "yoy_pct": 6.8,
          "pct_of_cohort": 15.0
        },
        {
          "range": "45-64",
          "customers": 14000,
          "avg_basket": 125.20,
          "yoy_pct": 6.5,
          "pct_of_cohort": 50.0
        },
        {
          "range": "65+",
          "customers": 8120,
          "avg_basket": 118.50,
          "yoy_pct": 6.0,
          "pct_of_cohort": 29.0
        }
      ],
      "household_types": [
        {
          "type": "Single",
          "customers": 4200,
          "yoy_pct": 6.2,
          "pct_of_cohort": 15.0
        },
        {
          "type": "Couple",
          "customers": 11200,
          "yoy_pct": 6.8,
          "pct_of_cohort": 40.0
        },
        {
          "type": "Family with Kids",
          "customers": 7000,
          "yoy_pct": 6.5,
          "pct_of_cohort": 25.0
        },
        {
          "type": "Multi-Generational",
          "customers": 5600,
          "yoy_pct": 6.5,
          "pct_of_cohort": 20.0
        }
      ],
      "income_bands": [
        { "band": "Under $50K",  "customers": 4750, "yoy_pct": 5.8, "pct_of_cohort": 25.0 },
        { "band": "$50K-$100K",  "customers": 9120, "yoy_pct": 6.2, "pct_of_cohort": 48.0 },
        { "band": "Over $100K",  "customers": 5130, "yoy_pct": 4.9, "pct_of_cohort": 27.0 }
      ],
      "gender": [
        { "label": "Female",        "customers": 11020, "yoy_pct": 5.9, "pct_of_cohort": 58.0 },
        { "label": "Male",          "customers": 6840,  "yoy_pct": 5.5, "pct_of_cohort": 36.0 },
        { "label": "Other/Unknown", "customers": 1140,  "yoy_pct": 7.2, "pct_of_cohort": 6.0  }
      ]
    },
    "Omnichannel Champion": {
      "age_groups": [
        {
          "range": "18-24",
          "customers": 360,
          "avg_basket": 165.00,
          "yoy_pct": 5.5,
          "pct_of_cohort": 2.0
        },
        {
          "range": "25-34",
          "customers": 1800,
          "avg_basket": 195.50,
          "yoy_pct": 5.8,
          "pct_of_cohort": 10.0
        },
        {
          "range": "35-44",
          "customers": 5400,
          "avg_basket": 225.75,
          "yoy_pct": 5.2,
          "pct_of_cohort": 30.0
        },
        {
          "range": "45-64",
          "customers": 7200,
          "avg_basket": 248.20,
          "yoy_pct": 4.8,
          "pct_of_cohort": 40.0
        },
        {
          "range": "65+",
          "customers": 3240,
          "avg_basket": 238.50,
          "yoy_pct": 4.5,
          "pct_of_cohort": 18.0
        }
      ],
      "household_types": [
        {
          "type": "Single",
          "customers": 2700,
          "yoy_pct": 4.8,
          "pct_of_cohort": 15.0
        },
        {
          "type": "Couple",
          "customers": 6300,
          "yoy_pct": 5.5,
          "pct_of_cohort": 35.0
        },
        {
          "type": "Family with Kids",
          "customers": 6300,
          "yoy_pct": 5.0,
          "pct_of_cohort": 35.0
        },
        {
          "type": "Multi-Generational",
          "customers": 2700,
          "yoy_pct": 4.8,
          "pct_of_cohort": 15.0
        }
      ],
      "income_bands": [
        { "band": "Under $50K",  "customers": 9840,  "yoy_pct": -2.1, "pct_of_cohort": 41.0 },
        { "band": "$50K-$100K",  "customers": 10320, "yoy_pct": -3.5, "pct_of_cohort": 43.0 },
        { "band": "Over $100K",  "customers": 3840,  "yoy_pct": -1.8, "pct_of_cohort": 16.0 }
      ],
      "gender": [
        { "label": "Female",        "customers": 13920, "yoy_pct": -2.8, "pct_of_cohort": 58.0 },
        { "label": "Male",          "customers": 8640,  "yoy_pct": -3.1, "pct_of_cohort": 36.0 },
        { "label": "Other/Unknown", "customers": 1440,  "yoy_pct": -1.2, "pct_of_cohort": 6.0  }
      ]
    },
    "Mission Diverse": {
      "age_groups": [
        {
          "range": "18-24",
          "customers": 200,
          "avg_basket": 145.00,
          "yoy_pct": 4.5,
          "pct_of_cohort": 4.0
        },
        {
          "range": "25-34",
          "customers": 750,
          "avg_basket": 168.50,
          "yoy_pct": 4.2,
          "pct_of_cohort": 15.0
        },
        {
          "range": "35-44",
          "customers": 1500,
          "avg_basket": 188.75,
          "yoy_pct": 4.0,
          "pct_of_cohort": 30.0
        },
        {
          "range": "45-64",
          "customers": 1850,
          "avg_basket": 205.20,
          "yoy_pct": 3.8,
          "pct_of_cohort": 37.0
        },
        {
          "range": "65+",
          "customers": 700,
          "avg_basket": 195.50,
          "yoy_pct": 3.5,
          "pct_of_cohort": 14.0
        }
      ],
      "household_types": [
        {
          "type": "Single",
          "customers": 750,
          "yoy_pct": 3.8,
          "pct_of_cohort": 15.0
        },
        {
          "type": "Couple",
          "customers": 1500,
          "yoy_pct": 4.2,
          "pct_of_cohort": 30.0
        },
        {
          "type": "Family with Kids",
          "customers": 2000,
          "yoy_pct": 4.0,
          "pct_of_cohort": 40.0
        },
        {
          "type": "Multi-Generational",
          "customers": 750,
          "yoy_pct": 4.0,
          "pct_of_cohort": 15.0
        }
      ],
      "income_bands": [
        { "band": "Under $50K",  "customers": 3520, "yoy_pct": 28.5, "pct_of_cohort": 32.0 },
        { "band": "$50K-$100K",  "customers": 4840, "yoy_pct": 32.1, "pct_of_cohort": 44.0 },
        { "band": "Over $100K",  "customers": 2640, "yoy_pct": 25.8, "pct_of_cohort": 24.0 }
      ],
      "gender": [
        { "label": "Female",        "customers": 6380, "yoy_pct": 29.8, "pct_of_cohort": 58.0 },
        { "label": "Male",          "customers": 3960, "yoy_pct": 28.2, "pct_of_cohort": 36.0 },
        { "label": "Other/Unknown", "customers": 660,  "yoy_pct": 35.5, "pct_of_cohort": 6.0  }
      ]
    }
  },
  "regional_performance": {
    "enterprise": {
      "customers": 2100000,
      "clv_per_customer": 142,
      "retention_rate": 82,
      "yoy_pct": 7.7
    },
    "regions": {
      "northeast": {
        "label": "Northeast",
        "customers": 485000,
        "clv_per_customer": 148,
        "retention_rate": 83,
        "yoy_pct": 6.2,
        "dmas": [
          { "rank": 1, "dma": "New York",     "state": "NY", "customers": 182000, "clv_per_customer": 155, "yoy_pct": 5.8 },
          { "rank": 2, "dma": "Boston",       "state": "MA", "customers": 95000,  "clv_per_customer": 149, "yoy_pct": 7.1 },
          { "rank": 3, "dma": "Philadelphia", "state": "PA", "customers": 88000,  "clv_per_customer": 144, "yoy_pct": 6.4 },
          { "rank": 4, "dma": "Hartford",     "state": "CT", "customers": 45000,  "clv_per_customer": 138, "yoy_pct": 8.2 }
        ]
      },
      "southeast": {
        "label": "Southeast",
        "customers": 712000,
        "clv_per_customer": 138,
        "retention_rate": 81,
        "yoy_pct": 9.8,
        "dmas": [
          { "rank": 1, "dma": "Atlanta",       "state": "GA", "customers": 145000, "clv_per_customer": 142, "yoy_pct": 11.2 },
          { "rank": 2, "dma": "Miami",         "state": "FL", "customers": 138000, "clv_per_customer": 135, "yoy_pct": 10.5 },
          { "rank": 3, "dma": "Tampa",         "state": "FL", "customers": 102000, "clv_per_customer": 131, "yoy_pct": 9.8  },
          { "rank": 4, "dma": "Charlotte",     "state": "NC", "customers": 95000,  "clv_per_customer": 140, "yoy_pct": 10.1 },
          { "rank": 5, "dma": "Orlando",       "state": "FL", "customers": 88000,  "clv_per_customer": 128, "yoy_pct": 9.2  },
          { "rank": 6, "dma": "Nashville",     "state": "TN", "customers": 72000,  "clv_per_customer": 143, "yoy_pct": 12.4 },
          { "rank": 7, "dma": "Richmond",      "state": "VA", "customers": 45000,  "clv_per_customer": 137, "yoy_pct": 7.8  },
          { "rank": 8, "dma": "Raleigh",       "state": "NC", "customers": 27000,  "clv_per_customer": 145, "yoy_pct": 13.2 }
        ]
      },
      "midwest": {
        "label": "Midwest",
        "customers": 412000,
        "clv_per_customer": 135,
        "retention_rate": 80,
        "yoy_pct": 5.8,
        "dmas": [
          { "rank": 1, "dma": "Chicago",       "state": "IL", "customers": 165000, "clv_per_customer": 141, "yoy_pct": 6.2 },
          { "rank": 2, "dma": "Detroit",       "state": "MI", "customers": 88000,  "clv_per_customer": 132, "yoy_pct": 5.5 },
          { "rank": 3, "dma": "Cleveland",     "state": "OH", "customers": 72000,  "clv_per_customer": 130, "yoy_pct": 4.9 },
          { "rank": 4, "dma": "St. Louis",     "state": "MO", "customers": 48000,  "clv_per_customer": 128, "yoy_pct": 5.8 },
          { "rank": 5, "dma": "Cincinnati",    "state": "OH", "customers": 25000,  "clv_per_customer": 135, "yoy_pct": 6.8 },
          { "rank": 6, "dma": "Indianapolis",  "state": "IN", "customers": 14000,  "clv_per_customer": 126, "yoy_pct": 4.2 }
        ]
      },
      "west": {
        "label": "West",
        "customers": 491000,
        "clv_per_customer": 152,
        "retention_rate": 84,
        "yoy_pct": 8.5,
        "dmas": [
          { "rank": 1, "dma": "Los Angeles",   "state": "CA", "customers": 198000, "clv_per_customer": 158, "yoy_pct": 8.1 },
          { "rank": 2, "dma": "Phoenix",       "state": "AZ", "customers": 95000,  "clv_per_customer": 148, "yoy_pct": 9.8 },
          { "rank": 3, "dma": "Las Vegas",     "state": "NV", "customers": 68000,  "clv_per_customer": 145, "yoy_pct": 11.5},
          { "rank": 4, "dma": "San Diego",     "state": "CA", "customers": 55000,  "clv_per_customer": 155, "yoy_pct": 7.8 },
          { "rank": 5, "dma": "Portland",      "state": "OR", "customers": 35000,  "clv_per_customer": 149, "yoy_pct": 9.2 },
          { "rank": 6, "dma": "Seattle",       "state": "WA", "customers": 28000,  "clv_per_customer": 161, "yoy_pct": 10.5},
          { "rank": 7, "dma": "Denver",        "state": "CO", "customers": 12000,  "clv_per_customer": 143, "yoy_pct": 7.2 }
        ]
      }
    }
  },
  "business_health": {
    "aggregate": {
      "clv_per_customer_current": 142,
      "clv_per_customer_prior": 118,
      "clv_per_customer_delta": 24,
      "clv_per_customer_delta_pct": 20.3,
      "retention_rate_current": 82,
      "retention_rate_prior": 76,
      "retention_rate_delta_pp": 6,
      "total_clv_pool_current": 298200000,
      "total_clv_pool_prior": 247400000,
      "total_clv_pool_delta": 50800000,
      "total_clv_pool_delta_pct": 20.5
    },
    "by_segment": {
      "PCW Customers": {
        "clv_per_customer": 245,
        "retention_rate": 88,
        "contribution_to_clv_pool_pct": 45.2
      },
      "FS-only Active": {
        "clv_per_customer": 68,
        "retention_rate": 64,
        "contribution_to_clv_pool_pct": 18.4
      },
      "Rx-only": {
        "clv_per_customer": 185,
        "retention_rate": 78,
        "contribution_to_clv_pool_pct": 24.6
      },
      "Non-member": {
        "clv_per_customer": 35,
        "retention_rate": 48,
        "contribution_to_clv_pool_pct": 3.8
      },
      "Reactivated Customers": {
        "clv_per_customer": 95,
        "retention_rate": 72,
        "contribution_to_clv_pool_pct": 6.2
      },
      "Retail-only Churned": {
        "clv_per_customer": 0,
        "retention_rate": 0,
        "contribution_to_clv_pool_pct": 0
      }
    }
  },
  "behavioral_reconciliation": {
    "PCW Customers": {
      "prior_value": 49500000,
      "current_value": 55000000,
      "total_delta": 5500000,
      "total_delta_pct": 11.1,
      "effects": [
        {
          "effect_type": "retention_lift",
          "effect_label": "Retention Lift Effect",
          "value": 2200000,
          "pct_of_total": 40.0,
          "rank": 2,
          "drivers": [
            {
              "behavior": "PCW connection rate 90%",
              "impact": "+3.2pp retention",
              "from_pillar": "improve_retention",
              "pillar_metric": "PCW Conversion Rate"
            },
            {
              "behavior": "Digital adoption 45%",
              "impact": "+1.8pp retention",
              "from_pillar": "increase_frequency_basket",
              "pillar_metric": "Digital Trip %"
            }
          ],
          "cohorts": [
            {
              "name": "Tier 2→3 graduates",
              "customers": 35000,
              "retention_rate": 94,
              "retention_lift_pp": 26
            },
            {
              "name": "PCW digital users",
              "customers": 171000,
              "retention_rate": 96,
              "retention_lift_pp": 14
            }
          ]
        },
        {
          "effect_type": "clv_expansion",
          "effect_label": "CLV Expansion Effect",
          "value": 2400000,
          "pct_of_total": 43.6,
          "rank": 1,
          "sub_effects": [
            {
              "sub_type": "mix_effect",
              "sub_label": "Mix Effect (Maturity Progression)",
              "value": 1200000,
              "pct_of_total": 21.8,
              "drivers": [
                {
                  "behavior": "Tier 2→3 migration: 35K customers",
                  "impact": "+$48 CLV per customer (from $95 to $143)",
                  "from_pillar": "improve_retention",
                  "pillar_metric": "Maturity Tier Progression"
                },
                {
                  "behavior": "Tier 3→4 migration: 22K customers",
                  "impact": "+$62 CLV per customer (from $143 to $205)",
                  "from_pillar": "improve_retention",
                  "pillar_metric": "Maturity Tier Progression"
                }
              ],
              "cohorts": [
                {
                  "tier_transition": "Tier 2→3",
                  "customers": 35000,
                  "clv_lift": 48,
                  "clv_from": 95,
                  "clv_to": 143,
                  "total_clv_impact": 1680000
                },
                {
                  "tier_transition": "Tier 3→4",
                  "customers": 22000,
                  "clv_lift": 62,
                  "clv_from": 143,
                  "clv_to": 205,
                  "total_clv_impact": 1364000
                }
              ]
            },
            {
              "sub_type": "frequency_effect",
              "sub_label": "Frequency Effect",
              "value": 900000,
              "pct_of_total": 16.4,
              "drivers": [
                {
                  "behavior": "Trips/customer 2.1→2.4 (+14%)",
                  "impact": "+$32 CLV per customer from frequency lift",
                  "from_pillar": "increase_frequency_basket",
                  "pillar_metric": "Trips per Customer"
                },
                {
                  "behavior": "Multi-mission trips 42%",
                  "impact": "Drives visit frequency via mission variety",
                  "from_pillar": "increase_frequency_basket",
                  "pillar_metric": "Multi-Mission Trip %"
                }
              ],
              "cohorts": [
                {
                  "name": "High Recency + High Frequency",
                  "customers": 45000,
                  "trip_increase": 0.3,
                  "trip_frequency_current": 2.4,
                  "trip_frequency_prior": 2.1,
                  "clv_impact_per_customer": 20
                }
              ]
            },
            {
              "sub_type": "basket_effect",
              "sub_label": "Basket Effect",
              "value": 300000,
              "pct_of_total": 5.5,
              "drivers": [
                {
                  "behavior": "Category penetration 3.2 avg categories",
                  "impact": "Basket $58.92→$60.64 (+2.9%)",
                  "from_pillar": "increase_frequency_basket",
                  "pillar_metric": "Basket Size"
                }
              ],
              "cohorts": [
                {
                  "name": "Multi-category shoppers",
                  "customers": 55000,
                  "basket_lift": 5.45,
                  "basket_from": 58.92,
                  "basket_to": 64.37
                }
              ]
            }
          ]
        },
        {
          "effect_type": "volume",
          "effect_label": "Volume Effect (Customer Growth)",
          "value": 900000,
          "pct_of_total": 16.4,
          "rank": 3,
          "drivers": [
            {
              "behavior": "Faster onboarding: 45d→32d",
              "impact": "+6pp new→active conversion",
              "from_pillar": "grow_active_customers",
              "pillar_metric": "Onboarding Velocity (3+ trips/30 days)"
            },
            {
              "behavior": "New→Active conversion 78%",
              "impact": "+3pp vs prior year",
              "from_pillar": "grow_active_customers",
              "pillar_metric": "New → Active Conversion"
            }
          ],
          "cohorts": [
            {
              "name": "New PCW customers",
              "customers": 8500,
              "onboarding_days_current": 32,
              "onboarding_days_prior": 45,
              "conversion_rate": 78,
              "avg_clv": 106
            }
          ]
        }
      ]
    }
  }
};
