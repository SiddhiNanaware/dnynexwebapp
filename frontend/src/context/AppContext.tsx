import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, TeamMember, Project, Source, Claim, Task, 
  Decision, VoiceNote, SmartNotification, ProjectActivity, 
  RoleType, LanguageCode, Conflict 
} from '../types';
import { api } from '../services/api';
import { soundManager } from '../utils/audio';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
  loginAsDemoUser: (username: string) => Promise<boolean>;
  logout: () => void;
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  // Entities
  project: Project;
  setProject: (p: Project) => void;
  projects: Project[];
  teamMembers: TeamMember[];
  sources: Source[];
  claims: Claim[];
  tasks: Task[];
  decisions: Decision[];
  voiceNotes: VoiceNote[];
  notifications: SmartNotification[];
  activities: ProjectActivity[];
  conflicts: Conflict[];
  handovers: any[];
  acknowledgements: any[];
  // Modals & drawers
  selectedClaim: Claim | null;
  setSelectedClaim: (c: Claim | null) => void;
  viewingSource: Source | null;
  setViewingSource: (s: Source | null) => void;
  // Audio & Buzzer Settings
  isSoundMuted: boolean;
  setIsSoundMuted: (m: boolean) => void;
  buzzerVolume: number;
  setBuzzerVolume: (v: number) => void;
  testBuzzerSound: () => void;
  // Operations
  approveClaim: (id: string, notes?: string) => Promise<void>;
  rejectClaim: (id: string, notes?: string) => Promise<void>;
  createVoiceNote: (title: string, duration: string, transcript: string, notes?: string, tags?: string) => Promise<void>;
  deleteVoiceNote: (id: string) => Promise<void>;
  uploadDocument: (name: string, type: string, content: string, accessLevel: string) => Promise<void>;
  createProject: (name: string, description: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  updateTeamMember: (id: string, role: string, resp?: string) => Promise<void>;
  publishHandover: (summary: string, plan: string[]) => Promise<void>;
  acknowledgeHandover: (id: string, notes: string) => Promise<void>;
  refreshAllData: () => Promise<void>;
  roleFilteredClaims: Claim[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial fallback project
const DEFAULT_PROJECT: Project = {
  id: "proj-pune-smart-mobility",
  name: "Smart Pune Mobility Project",
  tagline: "Real-time PMPML transit telemetry, QR ticketing, and BRTS handover system",
  description: "Intelligent public transit monitoring and commuter information system for Pune Municipal Corporation corridors (Swargate to Katraj & Shivajinagar).",
  owner_id: "usr-siddhi",
  status: "Ready for Review",
  handover_readiness_score: 85,
  continuity_score: 90,
  single_point_of_failure: "Parineeta Meshram holds 65% of telemetry & payment logic knowledge",
  created_at: "2026-10-15T10:00:00Z"
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication: starts with null so the login screen appears first, per instruction!
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dnyanex_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [language, setLanguage] = useState<LanguageCode>('en'); // DEFAULT ENGLISH per instruction!
  const [activeTab, setActiveTab] = useState<string>('Dashboard');

  const [project, setProject] = useState<Project>(DEFAULT_PROJECT);
  const [projects, setProjects] = useState<Project[]>([DEFAULT_PROJECT]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "tm-1", name: "Siddhi Nanaware", email: "siddhi@mahaminds.org", role: "Project Owner", responsibilities: "Project architecture, scope validation, PMC municipal protocols", contributions: "Led initial architecture definition and vendor liaison" },
    { id: "tm-2", name: "Sonakshi Nazarkar", email: "sonakshi@mahaminds.org", role: "Incoming Member", responsibilities: "Transit display systems, commuter UI, unit tests for webhooks", contributions: "Incoming Transit Systems Lead taking over Swargate telemetry" },
    { id: "tm-3", name: "Mhd Zahur Rizvi", email: "zahur@mahaminds.org", role: "Reviewer / Team Leader", responsibilities: "Human approval gate, evidence verification, conflict arbitration", contributions: "Primary review board signatory and verification gatekeeper" },
    { id: "tm-4", name: "Parineeta Meshram", email: "parineeta@mahaminds.org", role: "Departing Member", responsibilities: "GTFS Realtime Feed Ingestion, Redis telemetry queue cache", contributions: "Maintained live GPS coordinate pipeline for 1,200 buses" }
  ]);
  const [sources, setSources] = useState<Source[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [handovers, setHandovers] = useState<any[]>([
    {
      id: "hnd-v1",
      version: 1,
      title: "Official Handover Release v1.0 — Smart Pune Mobility",
      status: "Published",
      published_by: "Mhd Zahur Rizvi (Reviewer)",
      created_at: "2026-11-10T16:00:00Z",
      summary: "Production handover release approved by project owner Siddhi Nanaware. All critical Swargate BRTS telemetry and Razorpay ticketing claims verified against source specs."
    }
  ]);
  const [acknowledgements, setAcknowledgements] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([
    {
      id: "conf-1",
      project_id: "proj-pune-smart-mobility",
      title: "Launch Timeline Discrepancy: 15 December vs 20 December",
      claim_a_id: "clm-9",
      claim_b_id: "clm-10",
      claim_a_title: "Target rollout is 15 December (Parineeta Meshram)",
      claim_a_quote: "Project launch date is 15 December across all 40 smart bus stops.",
      claim_a_source: "GitHub_PR_104_Discussion.md",
      claim_b_title: "Rollout shifted to 20 December (PMC Election Protocol)",
      claim_b_quote: "Project launch date is 20 December due to PMC municipal election clearance protocols.",
      claim_b_source: "GitHub_PR_104_Discussion.md",
      difference: "Engineering proposed Dec 15 rollout, but PMC administrative clearance demands Dec 20 launch.",
      status: "unresolved"
    }
  ]);

  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [viewingSource, setViewingSource] = useState<Source | null>(null);

  // Audio & Buzzer
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [buzzerVolume, setBuzzerVolume] = useState<number>(0.6);

  useEffect(() => {
    soundManager.isMuted = isSoundMuted;
    soundManager.volume = buzzerVolume;
  }, [isSoundMuted, buzzerVolume]);

  const testBuzzerSound = () => {
    soundManager.playNotificationBuzzer(true);
  };

  const refreshAllData = async () => {
    const [tm, projs, srcs, clms, tsks, decs, vns, notifs, acts] = await Promise.all([
      api.getTeam(),
      api.getProjects(),
      api.getSources(project.id),
      api.getClaims(project.id),
      api.getTasks(project.id),
      api.getDecisions(project.id),
      api.getVoiceNotes(project.id),
      api.getNotifications(),
      api.getActivity(project.id)
    ]);

    if (tm.length > 0) setTeamMembers(tm);
    if (projs.length > 0) {
      setProjects(projs);
      setProject(projs[0]);
    }
    if (srcs.length > 0) setSources(srcs);
    if (clms.length > 0) setClaims(clms);
    if (tsks.length > 0) setTasks(tsks);
    if (decs.length > 0) setDecisions(decs);
    if (vns.length > 0) setVoiceNotes(vns);
    if (notifs.length > 0) setNotifications(notifs);
    if (acts.length > 0) setActivities(acts);
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const loginAsDemoUser = async (username: string): Promise<boolean> => {
    const res = await api.login(username, "dnyanex2026");
    if (res && res.user) {
      setCurrentUser(res.user);
      localStorage.setItem('dnyanex_user', JSON.stringify(res.user));
      soundManager.playMascotChirp();
      return true;
    } else {
      // Offline fallback demo user
      const demoUserMap: Record<string, User> = {
        siddhi: { id: "usr-siddhi", username: "siddhi", name: "Siddhi Nanaware", email: "siddhi@mahaminds.org", role: "Project Owner" },
        zahur: { id: "usr-zahur", username: "zahur", name: "Mhd Zahur Rizvi", email: "zahur@mahaminds.org", role: "Reviewer / Team Leader" },
        zagur: { id: "usr-zahur", username: "zahur", name: "Mhd Zahur Rizvi", email: "zahur@mahaminds.org", role: "Reviewer / Team Leader" },
        sonakshi: { id: "usr-sonakshi", username: "sonakshi", name: "Sonakshi Nazarkar", email: "sonakshi@mahaminds.org", role: "Incoming Member" },
        parineeta: { id: "usr-parineeta", username: "parineeta", name: "Parineeta Meshram", email: "parineeta@mahaminds.org", role: "Departing Member" }
      };
      const fallback = demoUserMap[username.toLowerCase()] || demoUserMap.siddhi;
      setCurrentUser(fallback);
      localStorage.setItem('dnyanex_user', JSON.stringify(fallback));
      soundManager.playMascotChirp();
      return true;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dnyanex_user');
  };

  const approveClaim = async (id: string, notes?: string) => {
    const updated = await api.approveClaim(id, notes);
    if (updated) {
      setClaims(prev => prev.map(c => c.id === id ? updated : c));
    } else {
      setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'Approved', reviewer_decision: 'Approved by Reviewer Desk' } : c));
    }
    soundManager.playNotificationBuzzer(false);
  };

  const rejectClaim = async (id: string, notes?: string) => {
    const updated = await api.rejectClaim(id, notes);
    if (updated) {
      setClaims(prev => prev.map(c => c.id === id ? updated : c));
    } else {
      setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'Rejected', reviewer_decision: 'Rejected by Reviewer Desk' } : c));
    }
  };

  const createVoiceNote = async (title: string, duration: string, transcript: string, notes?: string, tags?: string) => {
    const created = await api.createVoiceNote({
      project_id: project.id,
      title,
      audio_duration: duration,
      transcript,
      notes,
      tags
    });
    if (created) {
      setVoiceNotes(prev => [created, ...prev]);
    } else {
      const fallback: VoiceNote = {
        id: `vn-${Date.now()}`,
        project_id: project.id,
        user_id: currentUser?.id || "usr-sonakshi",
        title,
        audio_duration: duration,
        transcript,
        notes,
        tags: tags || "general",
        created_at: new Date().toISOString()
      };
      setVoiceNotes(prev => [fallback, ...prev]);
    }
    soundManager.playNotificationBuzzer(false);
  };

  const deleteVoiceNote = async (id: string) => {
    await api.deleteVoiceNote(id);
    setVoiceNotes(prev => prev.filter(v => v.id !== id));
  };

  const uploadDocument = async (name: string, type: string, content: string, accessLevel: string) => {
    const res = await api.uploadSource({
      project_id: project.id,
      name,
      type,
      content,
      access_level: accessLevel
    });
    if (res) {
      setSources(prev => [res, ...prev]);
      const clms = await api.getClaims(project.id);
      if (clms.length > 0) setClaims(clms);
    }
    soundManager.playNotificationBuzzer(false);
  };

  const createProject = async (name: string, description: string) => {
    const created = await api.createProject(name, description);
    if (created) {
      setProjects(prev => [created, ...prev]);
      setProject(created);
    }
  };

  const markNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const clearNotifications = async () => {
    await api.clearAllNotifications();
    setNotifications([]);
  };

  const updateTeamMember = async (id: string, role: string, resp?: string) => {
    const updated = await api.updateTeamMember(id, { role, responsibilities: resp });
    if (updated) {
      setTeamMembers(prev => prev.map(m => m.id === id ? updated : m));
    }
  };

  const publishHandover = async (summary: string, plan: string[]) => {
    const newHandover = {
      id: `hnd-${Date.now()}`,
      version: handovers.length + 1,
      title: `Official Handover Release v${handovers.length + 1}.0 — Smart Pune Mobility`,
      status: 'Published',
      published_by: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Mhd Zahur Rizvi (Reviewer)',
      created_at: new Date().toISOString(),
      summary: summary || 'Complete verified handover dossier.',
      plan
    };
    setHandovers(prev => [newHandover, ...prev]);
    soundManager.playNotificationBuzzer(false);
  };

  const acknowledgeHandover = async (id: string, notes: string) => {
    const ack = {
      id: `ack-${Date.now()}`,
      handover_id: id,
      user_id: currentUser?.id || 'usr-sonakshi',
      user_name: currentUser?.name || 'Sonakshi Nazarkar',
      acknowledged_at: new Date().toISOString(),
      notes
    };
    setAcknowledgements(prev => [ack, ...prev]);
    soundManager.playNotificationBuzzer(false);
  };

  // Role-filtered claims: Incoming Member cannot see confidential claims
  const roleFilteredClaims = claims.filter(c => {
    if (currentUser?.role === 'Incoming Member') {
      return c.access_level !== 'confidential';
    }
    return true;
  });

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginAsDemoUser,
        logout,
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        project,
        setProject,
        projects,
        teamMembers,
        sources,
        claims,
        tasks,
        decisions,
        voiceNotes,
        notifications,
        activities,
        conflicts,
        handovers,
        acknowledgements,
        selectedClaim,
        setSelectedClaim,
        viewingSource,
        setViewingSource,
        isSoundMuted,
        setIsSoundMuted,
        buzzerVolume,
        setBuzzerVolume,
        testBuzzerSound,
        approveClaim,
        rejectClaim,
        createVoiceNote,
        deleteVoiceNote,
        uploadDocument,
        createProject,
        markNotificationRead,
        clearNotifications,
        updateTeamMember,
        publishHandover,
        acknowledgeHandover,
        refreshAllData,
        roleFilteredClaims
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
