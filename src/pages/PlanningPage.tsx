import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import MPDecisionCockpit from '../components/MPDecisionCockpit';
import { Loader } from 'lucide-react';

export default function PlanningPage() {
  const [clusters, setClusters] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [ldpProjects, setLdpProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlanningData = async () => {
    try {
      if (!isFirebaseConfigured) {
        setLoading(false);
        return;
      }

      const [clustersSnap, recsSnap, suggestionsSnap, ldpSnap] = await Promise.all([
        getDocs(collection(db, 'clusters')),
        getDocs(collection(db, 'recommendations')),
        getDocs(collection(db, 'suggestions')),
        getDocs(collection(db, 'developmentPlans'))
      ]);

      setClusters(clustersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setRecommendations(recsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setSuggestions(suggestionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLdpProjects(ldpSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Failed to load AI planning datasets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanningData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <Loader className="shimmer" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        <span style={{ fontSize: '14px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>LOADING PLATFORM DATASETS...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Decision Support System
        </span>
        <h1 style={{ fontSize: '32px', fontWeight: 600, marginTop: '4px' }}>AI Planning Cockpit</h1>
      </div>

      <MPDecisionCockpit 
        clusters={clusters}
        recommendations={recommendations}
        suggestions={suggestions}
        ldpProjects={ldpProjects}
        onDataRefresh={loadPlanningData}
      />
    </div>
  );
}
