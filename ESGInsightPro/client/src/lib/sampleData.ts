/**
 * Sample ESG Data for MVP Demo
 * 
 * Preloaded contexts including emission data, anomaly reports,
 * audit logs, and compliance information per technical specs
 */

import type { ESGDataContent } from '@shared/schema';

export interface EmissionAnomaly {
  id: string;
  metricId: string;
  facility: string;
  geography: string;
  value: number;
  historicalAvg: number;
  anomalyScore: number;
  confidence: number;
  flagReason: string;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  standardDeviations: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
  ipAddress: string;
}

export interface ComplianceContext {
  framework: string;
  requirement: string;
  description: string;
  applicability: string;
  deadline?: string;
  status: 'compliant' | 'non-compliant' | 'in-progress' | 'not-applicable';
}

// Sample emission anomalies
export const sampleAnomalies: EmissionAnomaly[] = [
  {
    id: 'anomaly-001',
    metricId: 'metric-abc123',
    facility: 'Dubai HQ',
    geography: 'UAE',
    value: 8900,
    historicalAvg: 1200,
    anomalyScore: 0.89,
    confidence: 0.94,
    flagReason: 'Statistical outlier (6.8σ above mean)',
    impactLevel: 'critical',
    detectedAt: '2025-09-24T14:30:00Z',
    standardDeviations: 6.8
  },
  {
    id: 'anomaly-002',
    metricId: 'metric-def456',
    facility: 'Abu Dhabi Plant',
    geography: 'UAE',
    value: 3450,
    historicalAvg: 3200,
    anomalyScore: 0.45,
    confidence: 0.72,
    flagReason: 'Moderate deviation from seasonal pattern',
    impactLevel: 'medium',
    detectedAt: '2025-09-23T10:15:00Z',
    standardDeviations: 2.1
  }
];

// Sample audit trail
export const sampleAuditLogs: AuditLog[] = [
  {
    id: 'audit-001',
    timestamp: '2025-09-24T16:45:00Z',
    userId: 'user-123',
    userName: 'Sarah Johnson',
    action: 'DATA_UPDATED',
    entityType: 'emission_record',
    entityId: 'metric-abc123',
    changes: {
      value: { from: 1200, to: 8900 },
      note: 'Updated with Q3 actuals from facility report'
    },
    ipAddress: '192.168.1.100'
  },
  {
    id: 'audit-002',
    timestamp: '2025-09-24T15:30:00Z',
    userId: 'user-456',
    userName: 'Michael Chen',
    action: 'REPORT_APPROVED',
    entityType: 'csrd_report',
    entityId: 'report-xyz789',
    changes: {
      status: { from: 'draft', to: 'approved' },
      approver: 'michael.chen@acme.com'
    },
    ipAddress: '192.168.1.105'
  },
  {
    id: 'audit-003',
    timestamp: '2025-09-24T14:00:00Z',
    userId: 'user-789',
    userName: 'Emma Martinez',
    action: 'DATA_IMPORTED',
    entityType: 'bulk_upload',
    entityId: 'upload-batch-456',
    changes: {
      recordsImported: 245,
      source: 'supplier_data_q3.xlsx',
      validationErrors: 3
    },
    ipAddress: '192.168.1.110'
  }
];

// Sample compliance contexts
export const sampleComplianceContexts: ComplianceContext[] = [
  {
    framework: 'CSRD',
    requirement: 'ESRS E1 - Climate Change',
    description: 'Disclosure of Scope 1, 2, and 3 greenhouse gas emissions with breakdown by source and geography',
    applicability: 'All EU entities with >250 employees or >€40M revenue',
    deadline: '2025-10-08',
    status: 'in-progress'
  },
  {
    framework: 'GRI',
    requirement: 'GRI 305 - Emissions',
    description: 'Report direct (Scope 1) GHG emissions, energy indirect (Scope 2) GHG emissions, and other indirect (Scope 3) GHG emissions',
    applicability: 'Voluntary reporting standard - recommended for all organizations',
    status: 'compliant'
  },
  {
    framework: 'SFDR',
    requirement: 'Principal Adverse Impacts (PAI)',
    description: 'Disclosure of adverse sustainability impacts of investment decisions',
    applicability: 'Financial market participants >€500M AUM',
    status: 'not-applicable'
  },
  {
    framework: 'ISSB',
    requirement: 'IFRS S2 - Climate-related Disclosures',
    description: 'Disclose information about climate-related risks and opportunities that could affect entity\'s prospects',
    applicability: 'Listed companies from 2024',
    deadline: '2025-12-31',
    status: 'in-progress'
  }
];

// Sample dashboard data
export const sampleDashboardData = {
  totalScope1: 8900,
  totalScope2: 4230,
  totalScope3: 15600,
  dataQualityScore: 87.3,
  waterConsumption: 12450,
  wasteGenerated: 2340,
  renewableEnergyPercent: 42.5,
  carbonIntensity: 2.8
};

// Sample suggested prompts by context
export const getSuggestedPromptsByContext = (pageType: string, userRole: string) => {
  const prompts: Record<string, Record<string, string[]>> = {
    dashboard: {
      ESG_ANALYST: [
        "Why was metric-abc123 flagged as anomalous?",
        "Summarize this emissions dashboard",
        "Which facilities are the highest emitters?"
      ],
      AUDITOR: [
        "Show me the audit trail for Q3 data",
        "What evidence supports our CSRD compliance?",
        "Who approved the recent emissions data?"
      ],
      SUPPLIER: [
        "How do I submit my emissions data?",
        "What is the data quality score requirement?",
        "When is the next reporting deadline?"
      ],
      SUSTAINABILITY_MANAGER: [
        "Are we on track for 2025 targets?",
        "What are the key compliance risks?",
        "Generate executive summary"
      ]
    },
    data_entry: {
      ESG_ANALYST: [
        "What file format should I use for upload?",
        "How do I map CSV columns to emissions data?",
        "Explain data validation errors"
      ],
      SUPPLIER: [
        "What data am I required to submit?",
        "How do I correct validation errors?",
        "What happens after I upload data?"
      ]
    },
    audit: {
      AUDITOR: [
        "Explain these audit log entries",
        "Show me data lineage for this metric",
        "Who has modified this record?"
      ],
      ESG_ANALYST: [
        "Show recent changes to emissions data",
        "What is the approval workflow status?",
        "Track this metric's history"
      ]
    }
  };

  return prompts[pageType]?.[userRole] || [
    "What is CSRD compliance?",
    "Explain anomaly detection",
    "How do I get started?"
  ];
};

// Mock MCP LLM response generator
export const generateMockResponse = (
  query: string, 
  context: { pageType?: string; userRole?: string; metricId?: string }
): {
  text: string;
  confidence: number;
  intent: string;
  suggestedPrompts: string[];
  dataSources: string[];
} => {
  const lowerQuery = query.toLowerCase();
  
  // Anomaly explanation response
  if (lowerQuery.includes('flagged') || lowerQuery.includes('anomal')) {
    const anomaly = sampleAnomalies[0];
    return {
      text: `This emission record was flagged as **anomalous** because:

1. **Statistical Outlier**: The value (**${anomaly.value.toLocaleString()} tCO₂e**) is ${anomaly.standardDeviations}σ (standard deviations) above the historical mean of ${anomaly.historicalAvg.toLocaleString()} tCO₂e.

2. **High Confidence Detection**: Our AI cleansing service detected this with **${(anomaly.confidence * 100).toFixed(1)}% confidence** using multivariate time-series analysis.

3. **Impact Assessment**: This anomaly has a **${anomaly.impactLevel}** impact level and affects your Q3 Scope 1 total by approximately **+545%**.

**Possible Causes:**
- Data entry error (unit conversion mistake)
- Extraordinary business event (equipment malfunction, temporary operations)
- Change in calculation methodology

**Recommended Actions:**
- Review source documentation for ${anomaly.facility}
- Verify with facility operations team
- Flag for manual review if confirmed accurate`,
      confidence: 0.94,
      intent: 'explain',
      suggestedPrompts: [
        "Show me the historical trend for this facility",
        "How do I correct this value?",
        "What impact does this have on my Q3 report?"
      ],
      dataSources: [
        'ai_cleansing_service:anomaly_detection',
        'esg_data_service:metric_history',
        'facility_operations:dubai_hq'
      ]
    };
  }
  
  // CSRD compliance response
  if (lowerQuery.includes('csrd') || lowerQuery.includes('compliance')) {
    return {
      text: `**CSRD (Corporate Sustainability Reporting Directive)** is the EU's comprehensive ESG reporting regulation that came into effect in 2024.

**Key Points:**

**Applicability:**
- Large EU companies (>250 employees or >€40M revenue)
- Listed SMEs (from 2026)
- Non-EU companies with significant EU operations

**Reporting Requirements:**
- Double materiality assessment
- ESRS (European Sustainability Reporting Standards) disclosure
- Climate (E1), Pollution (E2), Water (E3), Biodiversity (E4), Circular Economy (E5)
- Social and governance factors (S1-S4, G1)

**Your Organization:**
Based on your profile, you **are required** to comply with CSRD. Your next reporting deadline is **October 8, 2025** (14 days remaining).

**Current Status:**
- ✅ Scope 1 & 2 emissions data: Complete
- ⚠️ Scope 3 calculations: In progress (65% complete)
- ✅ Social disclosures: Complete
- ⏳ Governance disclosures: Pending review`,
      confidence: 0.98,
      intent: 'guide',
      suggestedPrompts: [
        "What are the mandatory ESRS E1 disclosures?",
        "How do I perform a double materiality assessment?",
        "Generate CSRD compliance checklist"
      ],
      dataSources: [
        'regulatory_knowledge_base:csrd_2024',
        'user_profile:compliance_requirements',
        'org_settings:reporting_obligations'
      ]
    };
  }
  
  // Dashboard summary response
  if (lowerQuery.includes('summarize') || lowerQuery.includes('dashboard')) {
    return {
      text: `**ESG Dashboard Summary** - ${new Date().toLocaleDateString()}

**Emissions Performance:**
- 📊 **Total Scope 1:** 8,900 tCO₂e (+642% vs. historical avg) ⚠️
- 📊 **Total Scope 2:** 4,230 tCO₂e (-12% improvement)
- 📊 **Total Scope 3:** 15,600 tCO₂e (on target)

**Key Insights:**
1. **Critical Alert**: Dubai HQ facility showing anomalous Scope 1 emissions - requires immediate investigation
2. **Positive Trend**: Scope 2 emissions decreased due to increased renewable energy usage (42.5%)
3. **Data Quality**: Current score of 87.3% - excellent for reporting standards

**Facility Breakdown:**
- 🏭 **Dubai HQ:** 8,900 tCO₂e (anomaly detected)
- 🏭 **Abu Dhabi Plant:** 3,200 tCO₂e (normal)
- 🏭 **Sharjah Warehouse:** 1,450 tCO₂e (normal)

**Action Items:**
- Investigate Dubai HQ anomaly (high priority)
- Complete Scope 3 supplier data collection (65% done)
- Review CSRD report before Oct 8 deadline`,
      confidence: 0.92,
      intent: 'summarize',
      suggestedPrompts: [
        "What's driving the Scope 2 improvement?",
        "Compare this month to same period last year",
        "Which metrics need immediate attention?"
      ],
      dataSources: [
        'esg_data_service:current_metrics',
        'ai_cleansing_service:anomaly_detection',
        'dashboard_state:current_view'
      ]
    };
  }

  // Audit trail response
  if (lowerQuery.includes('audit') || lowerQuery.includes('who') || lowerQuery.includes('changed')) {
    const log = sampleAuditLogs[0];
    return {
      text: `**Audit Trail Summary**

**Recent Change:**
- **Action:** ${log.action.replace('_', ' ')}
- **User:** ${log.userName} (${log.userId})
- **Timestamp:** ${new Date(log.timestamp).toLocaleString()}
- **Entity:** ${log.entityType} (ID: ${log.entityId})

**Changes Made:**
\`\`\`
Value updated: ${log.changes.value.from} → ${log.changes.value.to} tCO₂e
Note: "${log.changes.note}"
\`\`\`

**Verification:**
- Source IP: ${log.ipAddress}
- Authorization: Verified ✓
- Compliance: Meets SOC 2 audit requirements

**Data Lineage:**
1. Original data: Manual entry (Sept 1, 2025)
2. AI validation: Passed initial checks (Sept 15)
3. Update: ${new Date(log.timestamp).toLocaleDateString()} by ${log.userName}
4. Current status: Flagged for anomaly review`,
      confidence: 0.96,
      intent: 'explain',
      suggestedPrompts: [
        "Show me all changes by this user",
        "What triggered the anomaly flag?",
        "Export audit trail for compliance"
      ],
      dataSources: [
        'audit_trail_service:recent_logs',
        'user_profile_service:user_details',
        'data_lineage:metric_history'
      ]
    };
  }

  // Default helpful response
  return {
    text: `I understand you're asking about: "${query}"

I'm here to help with:
- **Compliance Questions**: CSRD, SFDR, GRI, ISSB frameworks
- **Data Validation**: Anomaly explanations, quality scores
- **Platform Guidance**: Features, navigation, workflows
- **Dashboard Insights**: Metric summaries, trend analysis
- **Audit Support**: Data lineage, approval trails

Could you provide more context about what you'd like to know? For example:
- Are you asking about a specific metric or facility?
- Do you need compliance guidance for a particular framework?
- Would you like help navigating to a specific feature?`,
    confidence: 0.65,
    intent: 'guide',
    suggestedPrompts: [
      "Explain CSRD compliance requirements",
      "Why was this emission flagged?",
      "Summarize my dashboard metrics"
    ],
    dataSources: [
      'help_docs:general_guidance'
    ]
  };
};
