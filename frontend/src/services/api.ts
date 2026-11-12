import { 
  Project, Source, Claim, Task, Decision, 
  VoiceNote, SmartNotification, TeamMember, 
  User, ProjectActivity, Conflict, HandoverVersion 
} from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  async login(username: string, password: string): Promise<{ token: string; user: User } | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async register(data: any): Promise<{ token: string; user: User } | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  // Team
  async getTeam(): Promise<TeamMember[]> {
    try {
      const res = await fetch(`${API_BASE}/team`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async updateTeamMember(id: string, data: any): Promise<TeamMember | null> {
    try {
      const res = await fetch(`${API_BASE}/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async createProject(name: string, description: string): Promise<Project | null> {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  // Sources
  async getSources(projectId?: string): Promise<Source[]> {
    try {
      const url = projectId ? `${API_BASE}/sources?project_id=${projectId}` : `${API_BASE}/sources`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async uploadSource(data: { project_id: string; name: string; type: string; content: string; access_level: string }): Promise<Source | null> {
    try {
      const res = await fetch(`${API_BASE}/sources/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  // Claims
  async getClaims(projectId?: string, status?: string, role?: string): Promise<Claim[]> {
    try {
      let url = `${API_BASE}/claims?`;
      if (projectId) url += `project_id=${projectId}&`;
      if (status) url += `status=${status}&`;
      if (role) url += `role=${encodeURIComponent(role)}&`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async approveClaim(id: string, notes?: string): Promise<Claim | null> {
    try {
      const res = await fetch(`${API_BASE}/claims/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async rejectClaim(id: string, notes?: string): Promise<Claim | null> {
    try {
      const res = await fetch(`${API_BASE}/claims/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  // Voice Notes
  async getVoiceNotes(projectId?: string): Promise<VoiceNote[]> {
    try {
      const url = projectId ? `${API_BASE}/ai/notes?project_id=${projectId}` : `${API_BASE}/ai/notes`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async createVoiceNote(data: { project_id: string; title: string; audio_duration: string; transcript: string; notes?: string; tags?: string }): Promise<VoiceNote | null> {
    try {
      const res = await fetch(`${API_BASE}/ai/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async deleteVoiceNote(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/ai/notes/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {}
    return false;
  },

  // AI Chat
  async askChatbot(projectId: string, question: string, role: string, language: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, question, user_role: role, language })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  // Tasks & Decisions
  async getTasks(projectId?: string): Promise<Task[]> {
    try {
      const url = projectId ? `${API_BASE}/tasks?project_id=${projectId}` : `${API_BASE}/tasks`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async getDecisions(projectId?: string): Promise<Decision[]> {
    try {
      const url = projectId ? `${API_BASE}/decisions?project_id=${projectId}` : `${API_BASE}/decisions`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async getActivity(projectId?: string): Promise<ProjectActivity[]> {
    try {
      const url = projectId ? `${API_BASE}/activity?project_id=${projectId}` : `${API_BASE}/activity`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  // Notifications
  async getNotifications(): Promise<SmartNotification[]> {
    try {
      const res = await fetch(`${API_BASE}/notifications`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async markNotificationRead(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' });
      return res.ok;
    } catch (e) {}
    return false;
  },

  async clearAllNotifications(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/notifications`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {}
    return false;
  },

  // Analytics
  async getAnalyticsOverview(projectId?: string): Promise<any> {
    try {
      const url = projectId ? `${API_BASE}/analytics/overview?project_id=${projectId}` : `${API_BASE}/analytics/overview`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  }
};
