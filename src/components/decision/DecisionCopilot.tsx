import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, BookOpen, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CopilotMessage } from '../../types/decision';
import { toast } from 'react-hot-toast';

interface DecisionCopilotProps {
  onSuggestAction?: (actionType: string) => void;
}

export default function DecisionCopilot({ onSuggestAction }: DecisionCopilotProps) {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Honorable Member of Parliament, I am your Policy and Decision Advisor. I can analyze and query Bangalore Central's active theme clusters, priority hotspots, and Local Development Plans. What policy question can I address for you today?",
      timestamp: '14:47',
      confidence: '100% System Base',
      source: 'CivicPulse Executive Engine',
      evidence: 'System Initialization Ledger'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Keep track of which assistant message metadata is expanded
  const [expandedMetadata, setExpandedMetadata] = useState<Record<string, boolean>>({});

  const suggestedQuestions = [
    { text: "What should I build first?", id: "build_first" },
    { text: "Why is Ward 8 highest priority?", id: "ward_8_priority" },
    { text: "Show healthcare recommendations.", id: "healthcare_recs" },
    { text: "Compare Ward 8 and Ward 12.", id: "compare_wards" },
    { text: "What fits within ₹5 Crore?", id: "budget_fit" },
    { text: "Generate proposal for water supply.", id: "water_supply_proposal" }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate grounded answering engine
    setTimeout(() => {
      let replyText = "";
      let evidence = "";
      let confidence = "";
      let source = "";

      const normalizedText = textToSend.toLowerCase();

      if (normalizedText.includes("build first") || normalizedText.includes("what should i build")) {
        replyText = "Based on multi-dimensional analysis of Bangalore Central, you should prioritize constructing a Primary Health Centre in Ward 8 (Koramangala Central). There are 0 public clinics in this high-density quadrant, and health-related distress signals from citizen channels have grown by 142% over the last quarter.";
        evidence = "482 citizen signals, 14km travel distance gap, and 142% quarter-on-quarter complaint surge.";
        confidence = "94% Priority Confidence";
        source = "CivicPulse Telemetry Analysis + BBMP Health Asset Registry.";
      } else if (normalizedText.includes("ward 8") || normalizedText.includes("highest priority")) {
        replyText = "Ward 8 (Koramangala Central) ranks highest because of the critical healthcare infrastructure gap. While roads and lighting are partially covered in current budgets, healthcare represents a 100% deficit with severe travel distances (14.2 km) under congested hours affecting over 18,200 residents.";
        evidence = "Total lack of medical outposts, 42-minute travel commute times, and dense population census metrics.";
        confidence = "96% Priority Rating";
        source = "Google Maps Traffic telemetry + BBMP Administrative Master Records.";
      } else if (normalizedText.includes("healthcare") || normalizedText.includes("health")) {
        replyText = "I recommend establishing a Primary Health Centre & Emergency Outpost in Ward 8 Central. Secondary recommendations include expanding mobile diagnostic clinics to cover Ward 12 and Ward 15 outskirts, which are experiencing minor surges in elderly sanitation needs.";
        evidence = "Critical gap in Ward 8 Central; minor outpatient congestion trends in adjacent wards.";
        confidence = "92% Healthcare Alignment Score";
        source = "National Health Mission eligibility criteria + BBMP clinical database.";
      } else if (normalizedText.includes("compare")) {
        replyText = "Ward 8 has a higher infrastructure deficit than Ward 12. Ward 12 (Indiranagar) has better-distributed street lighting and closer municipal clinic linkages. Ward 8 faces active waterlogging-related contamination vectors combined with absolute health coverage voids.";
        evidence = "Ward 8 clinic count: 0 (within 10km); Ward 12 clinic count: 2 (within 5km). Waterlogged complaint density is 3.5x higher in Ward 8.";
        confidence = "95% Comparative Grounding";
        source = "Constituency Asset Mapping + Live Citizen Triage Records.";
      } else if (normalizedText.includes("5 crore") || normalizedText.includes("fits")) {
        replyText = "Under a ₹5 Crore budget, the optimal combination is the 'Balanced Option': Construct the Ward 8 Primary Health Centre (estimated ₹3.5 Crore) and implement Smart Streetlighting core extensions (estimated ₹0.70 Crore). This deployment retains 94% of priority demand while directly benefiting 18,200 citizens.";
        evidence = "Optimized model results selecting Tier-1 deficit assets within ₹5.0 Cr limits.";
        confidence = "98% Optimization Precision";
        source = "Treasury Budget Allocator + National Urban Health Mission matching co-grants.";
      } else if (normalizedText.includes("water") || normalizedText.includes("water supply")) {
        replyText = "To address water supply demands, establishing a Clean RO Water Filtration Grid in Ward 8 Central is recommended. This asset costs approximately ₹75 Lakhs, serving 4,500 local residents with high-purity water, directly mitigating 124 recorded contamination reports.";
        evidence = "124 specific water quality complaints in Southwest Ring Area.";
        confidence = "89% Water Quality Correlation";
        source = "CivicPulse WhatsApp/SMS Triage pipeline.";
      } else {
        replyText = "I have scanned the Bangalore Central database regarding your query. The current highest priority remains the Ward 8 Primary Health Centre, which is supported by 482 public upvotes and represents a critical healthcare gap in our local plan.";
        evidence = "Ward 8 Healthcare Deficit Cluster.";
        confidence = "85% Grounded Baseline";
        source = "CivicPulse Regional Database Mapping.";
      }

      const botId = `msg-${Date.now()}-bot`;
      const botMsg: CopilotMessage = {
        id: botId,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidence,
        confidence,
        source
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
    }, 1000);

    setInput('');
  };

  const toggleMetadata = (id: string) => {
    setExpandedMetadata(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div id="section-8-ai-copilot" className="card space-y-4">
      {/* Title block */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
        <Bot size={18} className="text-[var(--text-1)]" />
        <div>
          <h3 className="text-sm font-bold text-[var(--text-1)] leading-tight font-display">Section 8: Grounded AI Copilot & Policy Advisor</h3>
          <span className="text-[10px] font-mono text-[var(--text-3)]">EXCLUSIVELY INDEXED ON BANGALORE CENTRAL CONSTITUENCY DATASETS</span>
        </div>
      </div>

      {/* Grid Layout: Left (Chat occupies full width style) & Right (Suggested Prompts column) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 3 columns: Chat Messages & Form */}
        <div className="lg:col-span-3 flex flex-col h-[520px] justify-between">
          
          {/* Messages viewport */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              const isExpanded = !!expandedMetadata[msg.id];
              return (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] font-mono font-bold text-[var(--text-3)] mb-1 uppercase tracking-wider">
                    {msg.role === 'user' ? 'MP STAFF' : 'DECISION ADVISOR'}
                  </span>

                  <div className={`p-3.5 rounded-lg text-xs leading-relaxed max-w-[90%] ${
                    msg.role === 'user'
                      ? 'bg-[var(--primary)] text-[var(--bg)] font-medium'
                      : 'bg-[var(--surface-2)] text-[var(--text-1)] border border-[var(--border)]'
                  }`}>
                    <p>{msg.text}</p>

                    {/* Grounded Metadata - COLLAPSIBLE */}
                    {isAssistant && msg.evidence && (
                      <div className="mt-3 pt-1 border-t border-[var(--border)]/60">
                        <button
                          type="button"
                          onClick={() => toggleMetadata(msg.id)}
                          className="flex items-center gap-1 text-[9px] font-mono font-bold text-[var(--text-3)] hover:text-[var(--text-1)] uppercase transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                          <span>{isExpanded ? 'Hide Grounding Metadata' : 'View Grounding Metadata Trace'}</span>
                        </button>

                        {isExpanded && (
                          <div className="mt-2.5 space-y-1.5 font-mono text-[10px] text-[var(--text-2)] animate-fadeIn">
                            <div className="flex items-start gap-1">
                              <span className="font-bold text-[var(--text-1)]">EVIDENCE:</span>
                              <span>{msg.evidence}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-[var(--text-1)]">CONFIDENCE:</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{msg.confidence}</span>
                            </div>
                            <div className="flex items-start gap-1">
                              <span className="font-bold text-[var(--text-1)]">SOURCE:</span>
                              <span>{msg.source}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[var(--text-3)] font-mono">
                <Loader2 size={12} className="animate-spin" />
                <span>Scanning constituency indices for direct signal grounding...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input box form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter policy prompt (e.g., 'Compare HSR water reports to existing LDP')..."
              className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--border-hover)] rounded-lg p-3 text-xs text-[var(--text-1)] outline-none"
            />
            <button
              type="submit"
              className="btn btn-primary text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send size={12} /> Send
            </button>
          </form>

        </div>

        {/* Right 1 column: Suggested Prompts list */}
        <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-[var(--border)] pt-4 lg:pt-0 lg:pl-4 flex flex-col justify-start">
          <span className="text-[10px] font-mono font-bold text-[var(--text-3)] uppercase block mb-3 tracking-wider">
            SUGGESTED GROUNDED COGNITIVE ASSISTS:
          </span>
          <div className="flex flex-col gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSend(q.text)}
                className="w-full text-left p-2.5 bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text-1)] text-[10px] font-mono rounded cursor-pointer transition-all duration-150 leading-relaxed"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
