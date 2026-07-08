import React, { useState, useEffect } from 'react';
import { Coins, Shield, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';
import { BudgetOption } from '../../types/decision';

interface BudgetOptimizerProps {
  onBudgetChange: (budget: number) => void;
  currentBudget: number;
}

export default function BudgetOptimizer({ onBudgetChange, currentBudget }: BudgetOptimizerProps) {
  const [selectedOption, setSelectedOption] = useState<'conservative' | 'balanced' | 'maximum'>('balanced');
  const [options, setOptions] = useState<BudgetOption[]>([]);

  // Calculate dynamic options based on current budget input
  useEffect(() => {
    const b = currentBudget;
    
    const conservativeUtil = Math.min(b * 0.45, 1.8).toFixed(2);
    const balancedUtil = Math.min(b * 0.84, 4.2).toFixed(2);
    const maxUtil = Math.min(b * 0.99, b - 0.05).toFixed(2);

    const conservativeBeneficiaries = Math.floor(b * 1300 + 1500).toLocaleString();
    const balancedBeneficiaries = Math.floor(b * 2600 + 4000).toLocaleString();
    const maxBeneficiaries = Math.floor(b * 3800 + 6000).toLocaleString();

    const conservativePriority = Math.min(60 + b * 2.5, 75).toFixed(0) + '%';
    const balancedPriority = Math.min(85 + b * 1.5, 94).toFixed(0) + '%';
    const maxPriority = Math.min(92 + b * 0.8, 98).toFixed(0) + '%';

    const calcConservativeProjects = () => {
      if (b < 3) return ['Ward 8 Sanitation Overhaul (₹0.75 Cr)', 'Mobile Health Diagnostic Fleet (₹0.90 Cr)'];
      if (b < 7) return ['Ward 8 Sanitation Overhaul (₹0.75 Cr)', 'Mobile Health Diagnostic Fleet (₹1.10 Cr)'];
      return ['Mobile Health Diagnostic Fleet (₹1.50 Cr)', 'Local Ward Drainage Silt Traps (₹1.20 Cr)'];
    };

    const calcBalancedProjects = () => {
      if (b < 3) return ['Construct Mobile Stabilizer Hub (₹1.80 Cr)', 'Smart Streetlighting segment (₹0.40 Cr)'];
      if (b < 7) return ['Construct Ward 8 Primary Health Centre (₹3.50 Cr)', 'Smart Streetlighting segment (₹0.70 Cr)'];
      return ['Construct Ward 8 Primary Health Centre (₹4.50 Cr)', 'Northeast Stormwater Grid (₹1.80 Cr)'];
    };

    const calcMaxProjects = () => {
      if (b < 3) return ['Construct Mobile Stabilizer Hub (₹1.80 Cr)', 'Smart Streetlighting (₹0.40 Cr)', 'Sanitation Fleet (₹0.60 Cr)'];
      if (b < 7) return ['Construct Ward 8 Primary Health Centre (₹3.50 Cr)', 'Smart Streetlighting (₹0.70 Cr)', 'Clean RO Water Filtration Grid (₹0.75 Cr)'];
      return ['Construct Ward 8 Primary Health Centre (₹4.50 Cr)', 'Northeast Stormwater Grid (₹1.80 Cr)', 'Central Smart Lighting Core (₹1.20 Cr)', 'Community Sanitation Kiosks (₹0.45 Cr)'];
    };

    setOptions([
      {
        type: 'conservative',
        title: 'Conservative Option (Pre-cautionary Allocations)',
        projects: calcConservativeProjects(),
        utilization: `₹${conservativeUtil} Cr / ₹${b.toFixed(1)} Cr`,
        beneficiaries: `${conservativeBeneficiaries} citizens`,
        priorityRetained: conservativePriority,
        costEffectiveness: 'High (Immediate low-cost interventions with low ongoing debt)'
      },
      {
        type: 'balanced',
        title: 'Balanced Option (Recommended AI Synthesis)',
        projects: calcBalancedProjects(),
        utilization: `₹${balancedUtil} Cr / ₹${b.toFixed(1)} Cr`,
        beneficiaries: `${balancedBeneficiaries} citizens`,
        priorityRetained: balancedPriority,
        costEffectiveness: 'Very High (Strategic infrastructure combined with baseline safety)'
      },
      {
        type: 'maximum',
        title: 'Maximum Impact Option (Full Capital Deployment)',
        projects: calcMaxProjects(),
        utilization: `₹${maxUtil} Cr / ₹${b.toFixed(1)} Cr`,
        beneficiaries: `${maxBeneficiaries} citizens`,
        priorityRetained: maxPriority,
        costEffectiveness: 'Excellent (Maximum asset expansion leveraging full available limits)'
      }
    ]);
  }, [currentBudget]);

  return (
    <div id="section-5-budget-optimizer" className="card space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2">
          <Coins size={18} className="text-[var(--text-1)]" />
          <h3 className="text-lg font-bold text-[var(--text-1)] uppercase tracking-wide font-display">
            Section 5: AI Capital Budget Optimizer & Allocator
          </h3>
        </div>

        {/* Dynamic Budget Controls */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold text-[var(--text-3)] block">CONSTITUENCY ALLOCATION:</span>
          <div className="flex border border-[var(--border)] rounded overflow-hidden">
            {[2, 5, 8, 12].map((preset) => (
              <button
                key={preset}
                onClick={() => onBudgetChange(preset)}
                className={`px-3 py-1 text-xs font-mono font-bold border-r last:border-0 border-[var(--border)] cursor-pointer transition-colors ${
                  currentBudget === preset
                    ? 'bg-[var(--primary)] text-[var(--bg)]'
                    : 'bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--border)]'
                }`}
              >
                ₹{preset} Cr
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slide range controller */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-[var(--text-2)]">Fine-tune Available Capital:</span>
          <span className="text-sm font-mono font-bold text-[var(--text-1)]">₹ {currentBudget.toFixed(2)} Crores</span>
        </div>
        <input
          type="range"
          min="1"
          max="15"
          step="0.25"
          value={currentBudget}
          onChange={(e) => onBudgetChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
        />
      </div>

      {/* Three Equal-Width Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.type;
          return (
            <div
              key={opt.type}
              onClick={() => setSelectedOption(opt.type)}
              className={`p-5 rounded-lg border flex flex-col justify-between transition-all cursor-pointer h-full ${
                isSelected
                  ? 'border-[var(--primary)] bg-[var(--surface)] ring-1 ring-[var(--primary)] shadow-sm'
                  : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-neutral-400'
              }`}
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                  <div className="flex items-center gap-1.5">
                    {opt.type === 'conservative' && <Shield size={14} className="text-[var(--text-2)]" />}
                    {opt.type === 'balanced' && <Zap size={14} className="text-amber-500" />}
                    {opt.type === 'maximum' && <TrendingUp size={14} className="text-blue-500" />}
                    <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-1)]">
                      {opt.type === 'conservative' ? 'Conservative' : opt.type === 'balanced' ? 'Balanced Model' : 'Maximum Impact'}
                    </span>
                  </div>
                  {opt.type === 'balanced' && (
                    <span className="px-1.5 py-0.5 text-[8px] font-mono rounded bg-amber-400 text-slate-950 font-bold">
                      AI RECOM
                    </span>
                  )}
                </div>

                {/* Bullets only, no long paragraphs */}
                <div>
                  <span className="text-[10px] font-bold text-[var(--text-3)] uppercase block mb-2 tracking-wider">
                    PROPOSED ALLOCATIONS
                  </span>
                  <ul className="space-y-2">
                    {opt.projects.map((proj, i) => (
                      <li key={i} className="text-[11px] text-[var(--text-2)] flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[var(--primary)] mt-1.5 flex-shrink-0" />
                        <span>{proj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Metrics block */}
              <div className="mt-6 pt-4 border-t border-[var(--border)] space-y-3">
                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="p-2 bg-[var(--surface-2)] rounded border border-[var(--border)]">
                    <span className="block text-[8px] text-[var(--text-3)] font-mono">DEPLOYED</span>
                    <strong className="text-xs font-mono text-[var(--text-1)]">{opt.utilization.split('/')[0].trim()}</strong>
                  </div>
                  <div className="p-2 bg-[var(--surface-2)] rounded border border-[var(--border)]">
                    <span className="block text-[8px] text-[var(--text-3)] font-mono">PRIORITY</span>
                    <strong className="text-xs font-mono text-emerald-600 dark:text-emerald-400">{opt.priorityRetained}</strong>
                  </div>
                </div>

                <div className="p-2 bg-[var(--surface-2)] rounded border border-[var(--border)] flex justify-between items-center">
                  <span className="text-[8px] text-[var(--text-3)] font-mono">BENEFICIARIES</span>
                  <strong className="text-xs font-mono text-[var(--text-1)]">{opt.beneficiaries.split(' ')[0]}</strong>
                </div>

                {/* Selection button */}
                <button
                  type="button"
                  className={`w-full py-2 text-xs font-mono font-bold rounded flex items-center justify-center gap-1.5 border transition-all ${
                    isSelected
                      ? 'bg-[var(--primary)] text-[var(--bg)] border-[var(--primary)]'
                      : 'bg-transparent text-[var(--text-2)] border-[var(--border)] hover:border-neutral-400'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 size={12} /> SELECTED
                    </>
                  ) : (
                    'ACTIVATE MODEL'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
