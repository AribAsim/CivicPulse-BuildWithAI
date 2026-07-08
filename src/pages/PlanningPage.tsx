import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { 
  Check, Info, Loader2, Shield, Sparkles, TrendingUp, X, 
  ArrowUpRight, Database
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import newly refactored modular decision components
import DemandVsPlan from '../components/decision/DemandVsPlan';
import BudgetOptimizer from '../components/decision/BudgetOptimizer';
import ProposalGenerator from '../components/decision/ProposalGenerator';
import DecisionCopilot from '../components/decision/DecisionCopilot';
import { Proposal } from '../types/decision';

export default function PlanningPage() {
  const [loading, setLoading] = useState(true);
  const [recommendationStatus, setRecommendationStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [currentBudget, setCurrentBudget] = useState<number>(5.0); // 5 Crores default
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return ( 
      <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
        <span className="text-xs font-mono font-bold text-[var(--text-3)] tracking-wider">
          GROUNDING DECISION COCKPIT DATASETS...
        </span>
      </div>
      </>
    );
  }

  const citizenDemandVectors = [
    '482 public upvotes specifically requesting local water treatment and healthcare clinic expansion.',
    'Water quality turbidity and vector-borne contamination spikes recorded over 124 distinct reports.',
    'Urgent emergency accessibility blockages highlighted along Southwest commuter exits.'
  ];

  const ldpCapitalProjects = [
    'Outer Ring Road Highway pothole overhaul and asphalt restoration. [₹1.2 Cr spent]',
    'Commercial Sector-8 arterial loop road widening and signal automation. [₹4.2 Cr allocated]',
    'Northeast low-elevation stormwater drainage grid (Tendering Phase). [₹1.8 Cr budgeted]'
  ];

  const alignmentHighlights = {
    matches: [],
    conflicts: ['Road Widening and Health Outposts compete for identical capital allocation limits within Ward 8.'],
    missing: ['Primary Health Centre (PHC) & Emergency Outpost is entirely absent from the active 5-Year LDP Scheme.'],
    duplicated: []
  };

  const alignmentSummary = 'The current Local Development Plan is heavily focused on arterial road cosmetics (constituting 68% of capital outlay), completely bypassing localized healthcare and sanitation needs. There is a critical, high-stress mismatch between citizen-voted priorities and municipal engineering outlays.';

  const activeProposal: Proposal = {
    title: 'Ward 8 Primary Health Centre & Emergency Outpost',
    location: 'Bangalore Central - Ward 8 (Koramangala Central Quadrant)',
    executiveSummary: 'Establish a new, rapid-deployment Primary Health Centre (PHC) equipped with baseline stabilization beds, pediatric care facilities, and diagnostic labs in Ward 8. This asset is designed to bridge the absolute healthcare void in this quadrant, saving emergency transit times and building resilient local healthcare networks.',
    problemStatement: 'Ward 8 suffers from an absolute public health coverage deficit. The closest public hospital is located 14.2 km away, requiring a 42-minute commute under normal traffic congestion. Over the last 30 days, waterlogged contamination reports have surged by 142%, leading to public health risks that require localized preventive screening.',
    evidence: 'Supported by 482 verified citizen reports routed through the WhatsApp/SMS Triage feed, which identifies healthcare accessibility and water pollution vectors as the highest-priority community problems.',
    beneficiaries: 'Estimated 18,200 active residents residing in the immediate Koramangala Central low-income and transit segments.',
    priorityJustification: 'This project carries an AI Priority Index of 96/100, ranking 1st in Bangalore Central. The LDP contains zero medical allocations, presenting a critical gap where citizen upvote volume and infrastructure lack coincide.',
    implementationTimeline: [
      { phase: 'Phase I: Land Clearance', duration: 'Weeks 1-4', task: 'Land allocation and regulatory clearance under NUHM guidelines.' },
      { phase: 'Phase II: Civil Structuring', duration: 'Weeks 5-16', task: 'Pre-fabricated modular structural construction and power-redundancy grid setup.' },
      { phase: 'Phase III: Medical Outfitting', duration: 'Weeks 17-24', task: 'Procurement of core diagnostics, pediatric stabilization units, and smart RO filtration.' },
      { phase: 'Phase IV: Staffing & Go-Live', duration: 'Weeks 25-28', task: 'Integration of ward healthcare staff, final clinical testing, and public opening.' }
    ],
    expectedImpact: 'Establishes permanent healthcare protection, reduces average travel times to public healthcare from 42 mins to 4 mins, and directly increases local citizen health satisfaction indices by 84%.'
  };

  const handleStatusChange = (status: 'approved' | 'rejected') => {
    setRecommendationStatus(status);
    if (status === 'approved') {
      toast.success('Recommendation Approved! State synchronized with legislative registry.');
    } else {
      toast.error('Recommendation Rejected. Marked for revision and sector recalculation.');
    }
  };

  const radius = 54;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (96 / 100) * circumference;

  const evidenceDeposits = [
    {
      id: 1,
      title: 'Citizen Demand Vectors',
      short: '482 verified, unique citizen health distress and sanitary leak signals reported.',
      source: 'WhatsApp/SMS Feed',
      confidence: '98%',
      auditTrail: 'Verified via Koramangala Central vector node mapping and telemetry. Active hash synchronized with local civic feedback channels.',
      records: '482 distinct geo-coded signals'
    },
    {
      id: 2,
      title: 'Infrastructure Gap Metrics',
      short: 'Ward 8 Central currently registers 0 active primary clinics within a 10km catchment corridor.',
      source: 'BBMP Asset Registry',
      confidence: '100%',
      auditTrail: 'Verified against Bruhat Bengaluru Mahanagara Palike (BBMP) active asset databases. No pending medical construction on record.',
      records: '0 active facilities mapped'
    },
    {
      id: 3,
      title: 'Population Census Impact',
      short: 'Target sector holds high density demographic profile of 26,400 active residents.',
      source: 'Demographic Database',
      confidence: '95%',
      auditTrail: 'Validated against national census track logs with a 1.2% variance estimate for high-density floating transit segments.',
      records: '26,400 active citizens'
    },
    {
      id: 4,
      title: 'Real-time Travel Distance',
      short: 'Average transit commute under traffic congestion to closest clinical hub is 42 minutes.',
      source: 'Google Maps Telemetry',
      confidence: '91%',
      auditTrail: 'Derived from real-time transit telemetry loops over a 30-day period. Commute peak duration spans 38 to 52 minutes.',
      records: '42m mean duration threshold'
    },
    {
      id: 5,
      title: 'Existing Plan Allocations',
      short: 'The active 5-Year LDP contains ₹0 allocated for health infrastructure or clinic outlays.',
      source: 'LDP Plan Archive',
      confidence: '100%',
      auditTrail: 'Scanned from published municipal capital outlays and gazette documents. Zero line items for healthcare.',
      records: '₹0 / ₹6.0 Cr allocated'
    },
    {
      id: 6,
      title: 'Historical Trend Projections',
      short: 'Public health indicators demonstrate a 142% quarter-on-quarter surge in disease reports.',
      source: 'Predictive Risk Engine',
      confidence: '88%',
      auditTrail: 'Generated using historical regression patterns against local water pollution feedback logs and medical records.',
      records: '142% YoY surge projection'
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col gap-8 font-sans">
      
      {/* HEADER BLOCK */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--border)]">
        <div>
          <span className="text-[11px] font-mono font-bold text-[var(--text-3)] tracking-wider uppercase block mb-1">
            FLAGSHIP EXECUTIVE ACTION PORTAL
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-1)] font-display">
            Decision Intelligence Workspace
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:border-l border-[var(--border)] md:pl-8">
          <div>
            <span className="block text-[10px] font-mono font-bold text-[var(--text-3)] uppercase tracking-wider mb-1">
              CONSTITUENCY
            </span>
            <strong className="text-xs font-mono font-bold text-[var(--text-1)] uppercase">
              Bangalore Central
            </strong>
          </div>

          <div>
            <span className="block text-[10px] font-mono font-bold text-[var(--text-3)] uppercase tracking-wider mb-1">
              AI ADVISOR STATUS
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Fully Grounded
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-mono font-bold text-[var(--text-3)] uppercase tracking-wider mb-1">
              LAST DATA RE-INDEX
            </span>
            <strong className="text-xs font-mono font-bold text-[var(--text-1)]">
              July 1, 2026
            </strong>
          </div>
        </div>
      </header>

      {/* EXECUTIVE RECOMMENDATION */}
      <section id="executive-recommendation" className="card relative overflow-hidden p-6 md:p-8">
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--primary)] opacity-[0.015] rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: Recommendation details (7/12 width) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 text-[10px] font-mono bg-red-500/10 text-red-500 border border-red-500/10 rounded-full font-bold uppercase tracking-wider">
                  Priority: Critical
                </span>
                <span className="px-2.5 py-1 text-[10px] font-mono bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)] rounded-full font-bold uppercase tracking-wider">
                  CP-REC-08-HEALTH
                </span>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[var(--text-1)] tracking-tight leading-snug font-display">
                  Construct Primary Health Centre & Emergency Outpost
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-3)] font-mono">
                  <Database size={13} className="text-[var(--text-2)]" />
                  <span>Target Site: Ward 8 - Koramangala Central (Southeast Link Zone)</span>
                </div>
              </div>

              {/* Reason for Priority */}
              <div className="border-l-2 border-[var(--text-3)] pl-4 py-1 space-y-1">
                <span className="text-[10px] font-mono font-bold text-[var(--text-3)] uppercase tracking-wider block">
                  Reason for Priority
                </span>
                <p className="text-xs md:text-sm text-[var(--text-2)] leading-relaxed">
                  The nearest regional public health facility is located 14.2 km away. Citizen healthcare signals have surged by 142% over the last quarter due to rising localized waterlogging and contamination reports in the Koramangala Central corridor.
                </p>
              </div>

              {/* Trade-offs */}
              <div className="border-l-2 border-[var(--border)] pl-4 py-1 space-y-1">
                <span className="text-[10px] font-mono font-bold text-[var(--text-3)] uppercase tracking-wider block">
                  Decision Trade-offs & Alternatives
                </span>
                <p className="text-xs md:text-sm text-[var(--text-2)] leading-relaxed">
                  Alternative: Private-public partnership model or mobile clinical fleet. Trade-off: expanding partnerships is 40% cheaper but fails to establish permanent local health infrastructure. Mobile diagnostics cover larger physical sectors but are incapable of handling emergency stabilization.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => handleStatusChange('approved')}
                className={`btn text-xs px-5 py-3 flex-1 justify-center font-bold tracking-wider uppercase transition-all duration-200 ${
                  recommendationStatus === 'approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white'
                }`}
              >
                <Check size={14} className="mr-1.5" /> {recommendationStatus === 'approved' ? 'Approved & Registered' : 'Approve Outpost Project'}
              </button>
              <button
                onClick={() => handleStatusChange('rejected')}
                className={`btn text-xs px-5 py-3 flex-1 justify-center font-bold tracking-wider uppercase transition-all duration-200 ${
                  recommendationStatus === 'rejected'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/50 text-rose-600 hover:bg-rose-100/50 dark:hover:bg-rose-900/30'
                }`}
              >
                <X size={14} className="mr-1.5" /> {recommendationStatus === 'rejected' ? 'Rejected' : 'Reject Outpost Project'}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Quantitative Metadata & Schemes (5/12 width) */}
          <div className="lg:col-span-5 bg-[var(--surface-2)] border border-[var(--border)] p-6 rounded-xl space-y-6 flex flex-col justify-between">
            {/* Priority Score & Confidence */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center w-16 h-16 bg-[var(--surface)] border border-[var(--border)] rounded-full">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="24" stroke="transparent" strokeWidth="4" fill="transparent" />
                    <circle cx="32" cy="32" r="24" stroke="var(--text-1)" strokeWidth="4" fill="transparent" strokeDasharray={2*Math.PI*24} strokeDashoffset={2*Math.PI*24 - (96/100)*(2*Math.PI*24)} strokeLinecap="round" />
                  </svg>
                  <span className="absolute font-mono text-sm font-bold text-[var(--text-1)]">96</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[var(--text-3)] block uppercase tracking-wider">PRIORITY SCORE</span>
                  <strong className="text-xs text-[var(--text-1)] uppercase font-display font-semibold">OUTLAY DEFICIT GAP</strong>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-mono text-[var(--text-3)] block uppercase tracking-wider font-semibold">CONFIDENCE</span>
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                  <Sparkles size={11} className="text-amber-500 animate-pulse" /> 94%
                </span>
              </div>
            </div>

            {/* Metrics List */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                <span className="block text-[8px] font-mono text-[var(--text-3)] uppercase font-bold">EST. BENEFICIARIES</span>
                <strong className="text-xs font-mono text-[var(--text-1)]">18,200 residents</strong>
              </div>
              <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                <span className="block text-[8px] font-mono text-[var(--text-3)] uppercase font-bold">ESTIMATED BUDGET</span>
                <strong className="text-xs font-mono text-[var(--text-1)]">₹ {currentBudget.toFixed(1)} Crores</strong>
              </div>
            </div>

            {/* Timeline Info */}
            <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg space-y-1">
              <span className="block text-[8px] font-mono text-[var(--text-3)] uppercase font-bold">ACTIVE TIMELINE</span>
              <strong className="text-xs text-[var(--text-1)]">28 Weeks total (Phased implementation approved)</strong>
            </div>

            {/* Government Scheme Co-funding Match */}
            <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg space-y-1.5">
              <span className="block text-[8px] font-mono text-[var(--text-3)] uppercase tracking-wider font-bold">GOVERNMENT SCHEME ALIGNMENT</span>
              <div className="flex items-center justify-between">
                <strong className="text-xs text-[var(--text-1)] font-display font-semibold">National Health Mission (NHM)</strong>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">60% Central Co-grant</span>
              </div>
              <p className="text-[10px] text-[var(--text-2)] leading-relaxed">
                Eligible under Tier-2 population density criteria; matches ₹3.0 Cr from Central funds.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* EVIDENCE ENGINE */}
      <section id="evidence-engine" className="card space-y-6">
        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
          <Database size={18} className="text-[var(--text-1)]" />
          <h3 className="text-sm font-bold text-[var(--text-1)] uppercase tracking-wider font-display">
            Section 2: Grounded Policy Evidence Engine
          </h3>
        </div>

        {/* 3-Column Grid for dense, clean Bento look */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {evidenceDeposits.map((item) => {
            const isSelected = selectedEvidenceId === item.id;
            return (
              <div 
                key={item.id}
                onClick={() => setSelectedEvidenceId(isSelected ? null : item.id)}
                className={`card p-4 flex flex-col justify-between h-[180px] max-h-[180px] overflow-y-auto transition-all cursor-pointer relative scrollbar-thin ${
                  isSelected ? 'border-[var(--text-1)] ring-1 ring-[var(--text-1)] bg-[var(--surface)]' : 'bg-[var(--surface)] hover:bg-[var(--surface-2)]/30'
                }`}
                id={`evidence-card-${item.id}`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-[var(--text-3)] uppercase tracking-wider block">
                      DEPOSIT 0{item.id}
                    </span>
                    <span className="px-1.5 py-0.5 text-[8px] font-mono bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 rounded font-bold uppercase">
                      Active
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--text-1)] font-display flex items-center justify-between gap-2 leading-tight">
                    <span>{item.title}</span>
                    <ArrowUpRight size={12} className="text-[var(--text-3)] flex-shrink-0" />
                  </h4>
                  
                  {/* Metric Display */}
                  <div className="flex items-center gap-1.5 bg-[var(--surface-2)] border border-[var(--border)] px-2 py-0.5 rounded text-[9px] font-mono text-[var(--text-1)] w-fit my-1">
                    <span className="text-[var(--text-3)] font-semibold">METRIC:</span>
                    <strong className="font-bold">{item.records}</strong>
                  </div>

                  <p className="text-[11px] text-[var(--text-2)] leading-relaxed line-clamp-2">
                    {item.short}
                  </p>
                </div>

                <div className="border-t pt-2 mt-2 border-[var(--border)] flex flex-col gap-1">
                  <div className="flex items-center justify-between font-mono text-[9px] text-[var(--text-3)]">
                    <span>
                      CONF: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{item.confidence}</strong>
                    </span>
                    <span>
                      SRC: {item.source}
                    </span>
                  </div>
                  <div className="text-right text-[8px] font-mono text-[var(--text-1)] font-bold uppercase tracking-wider">
                    {isSelected ? 'Click to collapse' : 'Click for details'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Evidence detailed trace ledger */}
        {selectedEvidenceId && (
          <div className="card bg-[var(--surface-2)] border border-[var(--border)] p-5 rounded-lg space-y-3 text-xs text-[var(--text-2)] animate-fadeIn">
            <div className="flex items-center gap-1.5 text-[9px] font-bold font-mono text-[var(--text-1)] uppercase">
              <Shield size={12} className="text-emerald-500" /> Grounded Verification Ledger Detail Track
            </div>
            <div>
              <span className="font-semibold text-[var(--text-1)] block mb-1">Audit Trail Trace:</span>
              <p className="leading-relaxed font-sans">{evidenceDeposits.find(e => e.id === selectedEvidenceId)?.auditTrail}</p>
            </div>
            <div className="flex justify-between items-center bg-[var(--surface)] p-2.5 rounded border border-[var(--border)] font-mono text-[10px]">
              <span>RECORDS REGISTERED AND SYNCHRONIZED:</span>
              <strong className="text-[var(--text-1)]">{evidenceDeposits.find(e => e.id === selectedEvidenceId)?.records}</strong>
            </div>
          </div>
        )}
      </section>

      {/* PRIORITY ENGINE */}
      <section id="priority-engine" className="card space-y-6 p-6">
        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
          <TrendingUp size={18} className="text-[var(--text-1)]" />
          <h3 className="text-sm font-bold text-[var(--text-1)] uppercase tracking-wider font-display">
            Section 3: AI Priority Score Breakdown
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Progress Bars (2/3 width) */}
          <div className="lg:col-span-2 space-y-4 flex flex-col justify-center">
            {[
              { label: 'Citizen Demand Signals', score: 28, maxScore: 30 },
              { label: 'Infrastructure Density Gap', score: 19, maxScore: 20 },
              { label: 'Population Census Impact', score: 21, maxScore: 25 },
              { label: 'Real-time Travel Distance', score: 15, maxScore: 15 },
              { label: 'Existing LDP Misalignment', score: 8, maxScore: 10 },
              { label: 'Historical Outbreak Trend', score: 5, maxScore: 5 },
            ].map((item, idx) => {
              const pct = (item.score / item.maxScore) * 100;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[var(--text-1)] font-semibold">{item.label}</span>
                    <strong className="text-[var(--text-1)]">{item.score} / {item.maxScore}</strong>
                  </div>
                  <div className="w-full bg-[var(--surface-2)] border border-[var(--border)] h-2 rounded-full overflow-hidden">
                    <div className="bg-[var(--text-1)] h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aggregated Score Panel (1/3 width) */}
          <div className="lg:col-span-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-6 text-center space-y-4 flex flex-col items-center justify-center min-h-[280px]">
            <span className="text-[10px] font-mono font-bold text-[var(--text-3)] block uppercase tracking-wider">
              AGGREGATED OUTLAY DEFICIT
            </span>
            <div className="relative flex items-center justify-center w-24 h-24 bg-[var(--surface)] border border-[var(--border)] rounded-full">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="transparent" strokeWidth="6" fill="transparent" />
                <circle cx="48" cy="48" r="38" stroke="var(--text-1)" strokeWidth="6" fill="transparent" strokeDasharray={2*Math.PI*38} strokeDashoffset={2*Math.PI*38 - (96/100)*(2*Math.PI*38)} strokeLinecap="round" />
              </svg>
              <span className="absolute font-mono text-2xl font-bold text-[var(--text-1)]">96%</span>
            </div>
            <span className="px-2.5 py-1 text-[9px] font-mono bg-red-500/10 text-red-500 border border-red-500/10 rounded-full font-bold uppercase tracking-wider inline-block">
              CRITICAL DEMAND INDICES
            </span>
          </div>

        </div>
      </section>

      {/* DEMAND vs PLAN */}
      <section id="demand-vs-plan">
        <DemandVsPlan 
          citizenDemand={citizenDemandVectors} 
          ldpProjects={ldpCapitalProjects} 
          highlights={alignmentHighlights} 
          summary={alignmentSummary} 
        />
      </section>

      {/* BUDGET OPTIMIZER */}
      <section id="budget-optimizer">
        <BudgetOptimizer 
          currentBudget={currentBudget} 
          onBudgetChange={(b) => setCurrentBudget(b)} 
        />
      </section>

      {/* PROPOSAL GENERATOR */}
      <section id="proposal-generator">
        <ProposalGenerator proposal={activeProposal} />
      </section>

      {/* DECISION COPILOT */}
      <section id="decision-copilot">
        <DecisionCopilot />
      </section>

    </div>
  );
}
