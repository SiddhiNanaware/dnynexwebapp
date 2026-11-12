import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, AlertTriangle, TrendingUp, Users, 
  Share2, ShieldAlert, CheckCircle2, PieChart, Layers, 
  Activity, ArrowUpRight, Filter, Calendar
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { project, claims, conflicts, teamMembers } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeTab, setActiveTab] = useState<'all' | 'spof' | 'coverage'>('all');

  const total = claims.length || 18;
  const approved = claims.filter(c => c.status === 'Approved').length || 12;
  const verified = claims.filter(c => c.status === 'Verified').length || 4;
  const pending = claims.filter(c => c.status === 'Pending Review').length || 2;
  const conflicting = conflicts.length || 1;

  // Chart 1: Bar Graph Data (Module Breakdown)
  const moduleData = [
    { name: 'Telemetry API', count: 5, color: '#292337', pct: 85 },
    { name: 'QR Ticketing', count: 4, color: '#D58C96', pct: 75 },
    { name: 'PostGIS Routes', count: 3, color: '#91A997', pct: 90 },
    { name: 'Refund Webhooks', count: 3, color: '#B8AECF', pct: 40 },
    { name: 'PMC Municipal', count: 3, color: '#34343C', pct: 60 }
  ];

  // Chart 2: Line Graph Data Points (14-Day Velocity)
  const linePoints = [
    { day: 'D1', val: 20 },
    { day: 'D3', val: 35 },
    { day: 'D5', val: 48 },
    { day: 'D7', val: 62 },
    { day: 'D9', val: 74 },
    { day: 'D11', val: 81 },
    { day: 'D14', val: 88 }
  ];

  // Chart 4: Area Graph Data (Cumulative KB Ingested)
  const areaPoints = [
    { label: 'W1', kb: 12 },
    { label: 'W2', kb: 28 },
    { label: 'W3', kb: 54 },
    { label: 'W4', kb: 92 },
    { label: 'W5', kb: 146 }
  ];

  // Chart 5: Horizontal Bar Data (Team Member Knowledge Distribution)
  const memberOwnership = [
    { name: 'Parineeta Meshram', role: 'Departing Member', count: 9, pct: 45, color: '#D58C96', risk: 'High SPOF' },
    { name: 'Sonakshi Nazarkar', role: 'Incoming Member', count: 4, pct: 20, color: '#91A997', risk: 'Target Transferee' },
    { name: 'Siddhi Nanaware', role: 'Project Owner', count: 5, pct: 25, color: '#292337', risk: 'Governance' },
    { name: 'Mhd Zahur Rizvi', role: 'Reviewer / Team Leader', count: 2, pct: 10, color: '#B8AECF', risk: 'Verification' }
  ];

  // Chart 6: Stacked Bar Data (Knowledge Layer Completeness)
  const stackedLayers = [
    { domain: 'Core Decisions', approved: 70, pending: 20, missing: 10 },
    { domain: 'Responsibilities', approved: 80, pending: 15, missing: 5 },
    { domain: 'Unfinished Tasks', approved: 50, pending: 35, missing: 15 },
    { domain: 'Architecture Risks', approved: 60, pending: 30, missing: 10 }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sage/20 text-sage-dark">
              Deep Continuity Intelligence
            </span>
            <span className="text-xs text-graphite/60 font-mono">
              6 Real-Time Graph Models
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-aubergine mt-1">
            Analytics & Knowledge Resiliency Radar
          </h1>
          <p className="text-xs text-graphite/70 mt-1 max-w-2xl">
            Visual inspection of documentation completeness, team knowledge concentration, single-person dependency risks, and transfer trajectory.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center space-x-1.5 bg-ivory p-1.5 rounded-2xl border border-ivory-border text-xs font-semibold">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-xl transition ${
                timeRange === r 
                  ? 'bg-aubergine text-ivory shadow-soft-xs font-bold' 
                  : 'text-graphite/60 hover:text-aubergine'
              }`}
            >
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-ivory-border shadow-soft-xs">
          <p className="text-[10px] uppercase font-bold text-graphite/60 font-mono">Total Verified Claims</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-aubergine">{approved + verified}</span>
            <span className="text-xs text-sage-dark font-semibold">/ {total} Total</span>
          </div>
          <p className="text-[10px] text-sage-dark mt-1">94% Grounded in Evidence</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-ivory-border shadow-soft-xs">
          <p className="text-[10px] uppercase font-bold text-graphite/60 font-mono">Continuity Index</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-rose-dust">{project.continuity_score || 90}</span>
            <span className="text-xs text-graphite/40 font-mono">/ 100</span>
          </div>
          <p className="text-[10px] text-rose-dust mt-1">+14% vs Sprint Baseline</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-ivory-border shadow-soft-xs">
          <p className="text-[10px] uppercase font-bold text-graphite/60 font-mono">Handover Readiness</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-sage-dark">{project.handover_readiness_score || 85}%</span>
          </div>
          <p className="text-[10px] text-sage-dark mt-1">Ready for Incoming Sign-off</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-ivory-border shadow-soft-xs">
          <p className="text-[10px] uppercase font-bold text-graphite/60 font-mono">Unresolved Discrepancies</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-rose-dustDark">{conflicting}</span>
            <span className="text-xs text-rose-dustDark font-semibold">Flagged</span>
          </div>
          <p className="text-[10px] text-graphite/50 mt-1">Awaiting Reviewer Resolution</p>
        </div>
      </div>

      {/* SINGLE POINT OF FAILURE DETECTOR CARD */}
      <div className="p-5 rounded-3xl bg-rose-dust/10 border border-rose-dust/30 space-y-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-rose-dustDark" />
          <h3 className="font-bold text-sm text-aubergine">
            Single Point of Failure (SPOF) Detection Alert
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-dust/20 text-rose-dustDark font-bold ml-auto">
            High Risk Concentration
          </span>
        </div>
        <p className="text-xs text-graphite/80 leading-relaxed">
          <strong className="text-aubergine">Parineeta Meshram</strong> currently holds <span className="font-bold text-rose-dustDark">65% of telemetry & payment logic knowledge</span>. If handover is not completed before departure, recovery time for Swargate corridor telemetry will exceed 14 engineering days.
        </p>
        <div className="flex items-center space-x-4 pt-1 text-xs">
          <div className="flex items-center space-x-1.5 text-sage-dark font-bold">
            <CheckCircle2 className="w-4 h-4 text-sage" />
            <span>Target Transferee Assigned: Sonakshi Nazarkar</span>
          </div>
          <div className="text-graphite/60 font-mono text-[11px]">
            Knowledge Extraction: 85% Complete
          </div>
        </div>
      </div>

      {/* 6 GRAPHS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* GRAPH 1: VERTICAL BAR GRAPH */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-sage-dark font-bold uppercase tracking-wider">Graph 1 • Bar Chart</span>
              <h3 className="text-sm font-bold text-aubergine">Claims Ingestion by Subsystem</h3>
            </div>
            <BarChart3 className="w-4 h-4 text-graphite/40" />
          </div>

          <p className="text-xs text-graphite/60">
            Number of verified knowledge claims ingested per project module.
          </p>

          <div className="space-y-3 pt-2">
            {moduleData.map((m) => (
              <div key={m.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-graphite">{m.name}</span>
                  <span className="font-mono text-aubergine font-bold">{m.count} claims ({m.pct}%)</span>
                </div>
                <div className="w-full h-3 bg-ivory rounded-full overflow-hidden border border-ivory-border">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${m.pct}%`, backgroundColor: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GRAPH 2: LINE GRAPH (Readiness Velocity) */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-sage-dark font-bold uppercase tracking-wider">Graph 2 • Line Trend</span>
              <h3 className="text-sm font-bold text-aubergine">Readiness Score Velocity (14-Day)</h3>
            </div>
            <TrendingUp className="w-4 h-4 text-graphite/40" />
          </div>

          <p className="text-xs text-graphite/60">
            Cumulative progression toward complete handover verification.
          </p>

          {/* SVG Line Chart */}
          <div className="pt-2">
            <div className="h-44 w-full bg-ivory/50 rounded-2xl border border-ivory-border p-3 flex flex-col justify-between">
              <div className="flex-1 relative flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 350 100" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="25" x2="350" y2="25" stroke="#E2DEC8" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="350" y2="50" stroke="#E2DEC8" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="350" y2="75" stroke="#E2DEC8" strokeDasharray="3 3" />
                  
                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke="#147D73"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="0,80 50,65 110,52 170,38 230,26 290,19 350,12"
                  />
                  {/* Glowing Points */}
                  <circle cx="0" cy="80" r="4" fill="#292337" />
                  <circle cx="50" cy="65" r="4" fill="#292337" />
                  <circle cx="110" cy="52" r="4" fill="#292337" />
                  <circle cx="170" cy="38" r="4" fill="#292337" />
                  <circle cx="230" cy="26" r="4" fill="#292337" />
                  <circle cx="290" cy="19" r="4" fill="#292337" />
                  <circle cx="350" cy="12" r="5" fill="#D58C96" stroke="#292337" strokeWidth="2" />
                </svg>
              </div>

              {/* Day Labels */}
              <div className="flex justify-between text-[10px] font-mono text-graphite/50 pt-2 border-t border-ivory-border">
                {linePoints.map(p => (
                  <span key={p.day}>{p.day} ({p.val}%)</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GRAPH 3: DONUT / PIE CHART (Claim Status Breakdown) */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-sage-dark font-bold uppercase tracking-wider">Graph 3 • Donut Chart</span>
              <h3 className="text-sm font-bold text-aubergine">Claim Verification Status Distribution</h3>
            </div>
            <PieChart className="w-4 h-4 text-graphite/40" />
          </div>

          <p className="text-xs text-graphite/60">
            Proportion of claims approved, verified, pending, and flagged.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 pt-2">
            {/* Visual SVG Donut */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-32 h-32 transform -rotate-90">
                {/* Background Ring */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2DEC8" strokeWidth="4.5" />
                {/* Approved Segment (60%) */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#91A997" strokeWidth="4.5"
                  strokeDasharray="60 40" strokeDashoffset="0"
                />
                {/* Verified Segment (25%) */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#292337" strokeWidth="4.5"
                  strokeDasharray="25 75" strokeDashoffset="-60"
                />
                {/* Pending Segment (10%) */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#B8AECF" strokeWidth="4.5"
                  strokeDasharray="10 90" strokeDashoffset="-85"
                />
                {/* Conflicting Segment (5%) */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#D58C96" strokeWidth="4.5"
                  strokeDasharray="5 95" strokeDashoffset="-95"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-bold text-aubergine">{total}</span>
                <span className="text-[9px] block text-graphite/50 font-mono">Claims</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-sage" />
                <span className="text-graphite font-medium">Approved ({approved})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-aubergine" />
                <span className="text-graphite font-medium">Verified ({verified})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-lavender" />
                <span className="text-graphite font-medium">Pending Review ({pending})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-dust" />
                <span className="text-graphite font-medium">Conflicting ({conflicting})</span>
              </div>
            </div>
          </div>
        </div>

        {/* GRAPH 4: AREA CHART (Cumulative Ingested Volume) */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-sage-dark font-bold uppercase tracking-wider">Graph 4 • Area Chart</span>
              <h3 className="text-sm font-bold text-aubergine">Cumulative Ingestion Volume (KB)</h3>
            </div>
            <Activity className="w-4 h-4 text-graphite/40" />
          </div>

          <p className="text-xs text-graphite/60">
            Growth in documented artifacts and extracted source verbatim quotes.
          </p>

          <div className="pt-2">
            <div className="h-44 w-full bg-ivory/50 rounded-2xl border border-ivory-border p-3 flex flex-col justify-between">
              <div className="flex-1 relative flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 350 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#91A997" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#91A997" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Fill */}
                  <polygon
                    fill="url(#areaGrad)"
                    points="0,90 80,75 160,55 240,30 350,5 350,100 0,100"
                  />
                  {/* Stroke */}
                  <polyline
                    fill="none"
                    stroke="#91A997"
                    strokeWidth="3"
                    points="0,90 80,75 160,55 240,30 350,5"
                  />
                </svg>
              </div>

              <div className="flex justify-between text-[10px] font-mono text-graphite/50 pt-2 border-t border-ivory-border">
                {areaPoints.map(p => (
                  <span key={p.label}>{p.label}: {p.kb} KB</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GRAPH 5: HORIZONTAL BAR CHART (Team Ownership) */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-sage-dark font-bold uppercase tracking-wider">Graph 5 • Horizontal Bar</span>
              <h3 className="text-sm font-bold text-aubergine">Knowledge Concentration by Member</h3>
            </div>
            <Users className="w-4 h-4 text-graphite/40" />
          </div>

          <p className="text-xs text-graphite/60">
            Ownership distribution highlighting single-person risk.
          </p>

          <div className="space-y-3 pt-2">
            {memberOwnership.map((m) => (
              <div key={m.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-graphite">{m.name}</span>
                    <span className="text-[10px] text-graphite/50 ml-1.5 font-mono">({m.role})</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-aubergine">{m.pct}% ({m.count} items)</span>
                </div>
                <div className="w-full h-3 bg-ivory rounded-full overflow-hidden border border-ivory-border">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${m.pct}%`, backgroundColor: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GRAPH 6: STACKED BAR CHART (Knowledge Layers) */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-sage-dark font-bold uppercase tracking-wider">Graph 6 • Stacked Bar</span>
              <h3 className="text-sm font-bold text-aubergine">Domain Completeness by Layer</h3>
            </div>
            <Layers className="w-4 h-4 text-graphite/40" />
          </div>

          <p className="text-xs text-graphite/60">
            Layer breakdown into Approved (green), Pending (lavender), and Missing (rose).
          </p>

          <div className="space-y-3 pt-2">
            {stackedLayers.map((layer) => (
              <div key={layer.domain} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-graphite">{layer.domain}</span>
                  <span className="font-mono text-[11px] text-graphite/60">
                    {layer.approved}% Complete
                  </span>
                </div>
                <div className="w-full h-3.5 bg-ivory rounded-full overflow-hidden flex border border-ivory-border">
                  <div style={{ width: `${layer.approved}%` }} className="bg-sage h-full" title={`Approved: ${layer.approved}%`} />
                  <div style={{ width: `${layer.pending}%` }} className="bg-lavender h-full" title={`Pending: ${layer.pending}%`} />
                  <div style={{ width: `${layer.missing}%` }} className="bg-rose-dust h-full" title={`Missing: ${layer.missing}%`} />
                </div>
              </div>
            ))}
          </div>

          {/* Stacked legend */}
          <div className="flex items-center justify-center space-x-4 pt-2 text-[11px] text-graphite/60 border-t border-ivory-border">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sage" />
              <span>Approved</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-lavender" />
              <span>Pending</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-dust" />
              <span>Missing Evidence</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
