import React from 'react';
import { AlertTriangle, CheckCircle, Info, Sparkles, ArrowRight } from 'lucide-react';

interface DemandVsPlanProps {
  citizenDemand: string[];
  ldpProjects: string[];
  highlights: {
    matches: string[];
    conflicts: string[];
    missing: string[];
    duplicated: string[];
  };
  summary: string;
}

export default function DemandVsPlan({ citizenDemand, ldpProjects, highlights, summary }: DemandVsPlanProps) {
  return (
    <div id="section-4-demand-vs-ldp" className="card space-y-6">
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
        <Sparkles size={18} className="text-[var(--text-1)]" />
        <h3 className="text-lg font-bold text-[var(--text-1)] uppercase tracking-wide font-display">
          Section 4: Demand vs. Local Development Plan (LDP) Analysis
        </h3>
      </div>

      {/* Narrative AI Summary Block - Max 3 lines */}
      <div className="bg-[var(--surface-2)] rounded-lg p-4 border border-[var(--border)]">
        <span className="text-xs font-mono font-bold text-[var(--text-1)] block mb-1">
          DECISION COCKPIT SUMMARY & ALIGNMENT ASSESSMENT
        </span>
        <p className="text-xs text-[var(--text-2)] leading-relaxed font-sans max-h-[60px] overflow-hidden">
          The current Local Development Plan is heavily focused on arterial road cosmetics (constituting 68% of capital outlay), completely bypassing localized healthcare and sanitation needs. There is a critical, high-stress mismatch between citizen-voted priorities and municipal engineering outlays.
        </p>
      </div>

      {/* Two-Column Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Input Inputs - Citizen Demand & AI Matchmaker */}
        <div className="space-y-6">
          <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--surface-2)]">
            <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2">
              <span className="text-xs font-mono font-bold text-[var(--text-2)] tracking-wider uppercase">
                CITIZEN DEMAND
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-semibold">
                482 SIGNALS
              </span>
            </div>
            <ul className="space-y-3">
              {citizenDemand.map((item, idx) => (
                <li key={idx} className="text-xs text-[var(--text-2)] flex items-start gap-2">
                  <span className="text-[var(--text-3)] mt-0.5">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Alignment Segment (Matches, Conflicts, Missing) */}
          <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--surface-2)]">
            <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2">
              <span className="text-xs font-mono font-bold text-[var(--text-1)] tracking-wider uppercase">
                AI ALIGNMENT GAP DETECTOR
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[var(--primary)] text-[var(--bg)] rounded font-semibold">
                ANALYTICS SYSTEM
              </span>
            </div>

            <div className="space-y-4">
              {/* Matches */}
              <div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase block mb-1.5">
                  ✓ MATCHES APPROVED
                </span>
                {highlights.matches.length > 0 ? (
                  highlights.matches.map((item, i) => (
                    <div key={i} className="text-xs text-[var(--text-2)] flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded">
                      <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-[var(--text-3)] italic block pl-1">No direct active health matches found in current LDP.</span>
                )}
              </div>

              {/* Conflicts */}
              <div>
                <span className="text-[10px] font-bold text-rose-500 uppercase block mb-1.5">
                  ⚠ BUDGETARY CONFLICTS / COMPETING OUTLAYS
                </span>
                {highlights.conflicts.map((item, i) => (
                  <div key={i} className="text-xs text-[var(--text-2)] flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 p-2 rounded">
                    <AlertTriangle size={12} className="text-rose-500 flex-shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>

              {/* Missing Projects */}
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase block mb-1.5">
                  🔍 CRITICAL MISSING INFRASTRUCTURE
                </span>
                {highlights.missing.map((item, i) => (
                  <div key={i} className="text-xs text-[var(--text-2)] flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 p-2 rounded mb-1">
                    <Info size={12} className="text-amber-500 flex-shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Existing Municipal Plan */}
        <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--surface-2)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2">
              <span className="text-xs font-mono font-bold text-[var(--text-2)] tracking-wider uppercase">
                EXISTING MUNICIPAL PLAN (LDP)
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded font-semibold">
                ₹6.0 CR BUDGETED
              </span>
            </div>
            
            <ul className="space-y-4">
              {ldpProjects.map((item, idx) => (
                <li key={idx} className="text-xs text-[var(--text-2)] flex items-start gap-2 bg-[var(--surface)] p-3 border border-[var(--border)] rounded-lg">
                  <span className="text-[var(--text-3)] mt-0.5 font-bold">LDP-{idx+1}</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual direction cue indicator */}
          <div className="mt-6 pt-4 border-t border-[var(--border)] text-center text-[10px] font-mono text-[var(--text-3)] flex items-center justify-center gap-2">
            <span>CITIZEN DEMAND</span>
            <ArrowRight size={10} />
            <span className="text-[var(--text-1)] font-bold">AI REALIGNMENT</span>
            <ArrowRight size={10} />
            <span>MUNICIPAL PLAN RECONSTRUCTION</span>
          </div>
        </div>

      </div>
    </div>
  );
}
