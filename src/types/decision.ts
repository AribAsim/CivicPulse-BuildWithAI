export interface EvidenceSource {
  data: string;
  source: string;
  confidence: string;
}

export interface PriorityItem {
  label: string;
  score: number;
  maxScore: number;
}

export interface SchemeMatch {
  title: string;
  type: 'national' | 'state' | 'funding' | 'csr';
  eligibility: string;
  reason: string;
  expectedFunding: string;
  evidence: string;
}

export interface BudgetOption {
  type: 'conservative' | 'balanced' | 'maximum';
  title: string;
  projects: string[];
  utilization: string;
  beneficiaries: string;
  priorityRetained: string;
  costEffectiveness: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  evidence?: string;
  confidence?: string;
  source?: string;
}

export interface Proposal {
  title: string;
  location: string;
  executiveSummary: string;
  problemStatement: string;
  evidence: string;
  beneficiaries: string;
  priorityJustification: string;
  implementationTimeline: { phase: string; duration: string; task: string }[];
  expectedImpact: string;
}
