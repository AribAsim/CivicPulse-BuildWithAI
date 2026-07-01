import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured, fetchWithAuth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
  AlertTriangle, CheckCircle, TrendingUp, Sparkles, Map as MapIcon, 
  PlusCircle, ArrowRight, BrainCircuit, Clock, Landmark, ShieldAlert,
  UserCheck, ChevronRight, FileText, Settings, HelpCircle, Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, profile, userRole, setUserRole } = useAuth();
  
  // Data States
  const [issues, setIssues] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Executive Brief States
  const [executiveBrief, setExecutiveBrief] = useState<string>(() => {
    return sessionStorage.getItem('civicpulse_executive_brief') || '';
  });
  const [generatingBrief, setGeneratingBrief] = useState(false);

  // Real-time synchronization
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    // Sync recent issues (Citizen Signals)
    const issuesQuery = query(collection(db, 'issues'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribeIssues = onSnapshot(issuesQuery, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIssues(list);
    }, (error) => {
      console.error("Firestore loading error on HomePage issues:", error);
    });

    // Sync recent suggestions
    const suggestionsQuery = query(collection(db, 'suggestions'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribeSuggestions = onSnapshot(suggestionsQuery, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuggestions(list);
      setLoading(false);
    }, (error) => {
      console.error("Firestore loading error on HomePage suggestions:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeIssues();
      unsubscribeSuggestions();
    };
  }, []);

  // On-demand generation of Executive Brief
  const handleGenerateBrief = async () => {
    setGeneratingBrief(true);
    try {
      const res = await fetchWithAuth('/api/mp/executive-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        const briefText = data.brief || 'Unable to compile brief.';
        setExecutiveBrief(briefText);
        sessionStorage.setItem('civicpulse_executive_brief', briefText);
        toast.success("Executive briefing compiled successfully!");
      } else {
        toast.error("Failed to generate brief. Please try again.");
      }
    } catch (err) {
      console.error("Error generating executive brief:", err);
      toast.error("Network error compiling brief.");
    } finally {
      setGeneratingBrief(false);
    }
  };

  // Filter priorities (open issues with severity >= 4 or suggestions with high priority scores)
  const getPriorities = () => {
    const openHighIssues = issues
      .filter(i => i.status !== 'resolved' && (i.severity || 1) >= 4)
      .map(i => ({
        id: i.id,
        type: 'issue',
        title: i.title,
        category: i.category,
        urgency: i.severity || 4,
        address: i.address || 'Unknown address',
        time: i.createdAt?.seconds ? new Date(i.createdAt.seconds * 1000).toLocaleDateString() : 'Active'
      }));

    // Limit to top 3 priorities
    return openHighIssues.slice(0, 3);
  };

  const priorities = getPriorities();

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Platform Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Constituency Intelligence Command
          </span>
          <h1 style={{ marginTop: '4px', fontSize: '32px', fontWeight: 600 }}>Executive Overview</h1>
        </div>
        
        {/* Persona Quick Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--surface-2)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <UserCheck size={16} style={{ color: 'var(--text-2)' }} />
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-2)' }}>Active Persona:</span>
          <select 
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value as 'citizen' | 'mp')}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-1)', fontSize: '12px', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
          >
            <option value="citizen" style={{ background: 'var(--surface)' }}>Citizen Advocate</option>
            <option value="mp" style={{ background: 'var(--surface)' }}>MP Office (Staff / Official)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Today's Priorities & Executive Brief */}
      <div className="grid-dashboard-top" style={{ gap: '24px' }}>
        
        {/* LEFT COLUMN: Today's Priorities */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} style={{ color: 'var(--text-1)' }} />
              Today's Priorities
            </h2>
            <p className="text-muted" style={{ fontSize: '11px', marginTop: '2px' }}>
              Critical unresolved issues and high-severity signals needing immediate dispatch attention.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {priorities.length > 0 ? (
              priorities.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/issue/${item.id}`)}
                  style={{ 
                    padding: '14px', 
                    background: 'var(--surface-2)', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  className="hover-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-2)', textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>
                      SEV: {item.urgency}/5
                    </span>
                  </div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, margin: 0, color: 'var(--text-1)' }}>
                    {item.title}
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    📍 {item.address}
                  </p>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-3)', background: 'var(--surface-2)', borderRadius: '8px' }}>
                ✓ No high-priority alerts today. Municipal health indicators are stable.
              </div>
            )}
          </div>
          
          <button 
            onClick={() => navigate('/map')} 
            className="btn btn-secondary text-xs" 
            style={{ width: '100%', justifyContent: 'center', fontSize: '12px', marginTop: 'auto' }}
          >
            Explore All Hazards on Map <ArrowRight size={14} />
          </button>
        </div>

        {/* RIGHT COLUMN: Executive Brief Compiler & Viewer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} />
                Executive Brief
              </h2>
              <p className="text-muted" style={{ fontSize: '11px', marginTop: '2px' }}>
                Grounded 5-minute legislative overview summarizing citizen demand, gaps, and recommended government schemes.
              </p>
            </div>
            
            <button
              onClick={handleGenerateBrief}
              disabled={generatingBrief}
              className="btn btn-primary"
              style={{ padding: '6px 12px', fontSize: '11px' }}
            >
              {generatingBrief ? (
                <>
                  <div className="shimmer" style={{ width: '10px', height: '10px', borderRadius: '50%' }} />
                  Compiling...
                </>
              ) : (
                '🔄 Compile Brief'
              )}
            </button>
          </div>

          <div 
            style={{ 
              background: 'var(--surface-2)', 
              border: '1px solid var(--border)', 
              borderRadius: '8px', 
              padding: '18px', 
              minHeight: '220px',
              maxHeight: '280px',
              overflowY: 'auto',
              fontSize: '12.5px',
              lineHeight: '1.6',
              color: 'var(--text-1)',
              fontFamily: 'var(--font-sans)',
              whiteSpace: 'pre-wrap'
            }}
          >
            {executiveBrief ? (
              executiveBrief
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--text-3)', padding: '24px 0' }}>
                <FileText size={32} style={{ opacity: 0.5 }} />
                <span>Constituency Brief has not been compiled yet.</span>
                <button 
                  onClick={handleGenerateBrief} 
                  className="btn btn-secondary text-xs" 
                  style={{ padding: '6px 12px' }}
                >
                  Generate First Briefing
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bento Grid Part 2: Quick Actions, Demand Map Preview, Recent Citizen Signals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Card 1: Quick Actions */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Quick Actions</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Direct access channels into platform workflows</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/report', { state: { mode: 'problem' } })}
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', padding: '12px 16px', textAlign: 'left' }}
            >
              <span>🚨 Report Ward Problem / Hazard</span>
              <ChevronRight size={14} />
            </button>
            <button 
              onClick={() => navigate('/report', { state: { mode: 'suggestion' } })}
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', padding: '12px 16px', textAlign: 'left' }}
            >
              <span>💡 Propose Development Idea</span>
              <ChevronRight size={14} />
            </button>
            <button 
              onClick={() => navigate('/planning')}
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', padding: '12px 16px', textAlign: 'left' }}
            >
              <span>🏛️ Open MP Decision Cockpit</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Card 2: Demand Map Preview */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapIcon size={16} />
              Demand Map Preview
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Live visualization of citizen distress clusters and regional demand</span>
          </div>

          {/* Styled schematic placeholder map */}
          <div style={{ 
            height: '120px', 
            background: 'var(--surface-2)', 
            border: '1px solid var(--border)', 
            borderRadius: '6px', 
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1, background: 'radial-gradient(circle, var(--text-1) 10%, transparent 10%)', backgroundSize: '16px 16px' }} />
            {/* Styled markers */}
            <div style={{ position: 'absolute', top: '25%', left: '30%', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--bg)', boxShadow: '0 0 8px rgba(0,0,0,0.3)' }} />
            <div style={{ position: 'absolute', top: '55%', left: '60%', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--bg)', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '40%', left: '75%', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-2)' }} />
            
            <span className="text-mono" style={{ fontSize: '10px', color: 'var(--text-3)', zIndex: 1, padding: '4px 8px', background: 'var(--surface)', borderRadius: '4px', border: '1px solid var(--border)' }}>
              LIVE FEED • ACTIVE OVERLAYS
            </span>
          </div>

          <button 
            onClick={() => navigate('/map')} 
            className="btn btn-primary text-xs" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Launch Interactive Map
          </button>
        </div>

        {/* Card 3: Recent Citizen Signals */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} />
              Recent Citizen Signals
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Latest public demand feed & logs</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
            {loading ? (
              <div className="shimmer" style={{ height: '80px', width: '100%' }} />
            ) : issues.length > 0 ? (
              issues.slice(0, 3).map((issue) => (
                <div 
                  key={issue.id} 
                  onClick={() => navigate(`/issue/${issue.id}`)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                  className="hover-card"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {issue.title}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>
                      📂 {issue.category?.toUpperCase()} • {issue.status?.toUpperCase() || 'REPORTED'}
                    </span>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-3)' }} />
                </div>
              ))
            ) : (
              <span style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', padding: '16px 0' }}>No recent citizen signals.</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
