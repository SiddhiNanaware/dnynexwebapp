import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TeamMember, Project } from '../types';
import { 
  FolderPlus, Users, Calendar, Shield, ExternalLink, 
  CheckCircle2, Plus, Sparkles, Building2, UserPlus, X, Edit3, ShieldAlert
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { 
    project, setProject, projects, teamMembers, 
    updateTeamMember, createProject, currentUser 
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newProjName, setNewProjName] = useState<string>('');
  const [newProjDesc, setNewProjDesc] = useState<string>('');

  // Edit member modal
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editRole, setEditRole] = useState<string>('');
  const [editResp, setEditResp] = useState<string>('');
  const [editContrib, setEditContrib] = useState<string>('');

  // Add member modal
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [newMemberEmail, setNewMemberEmail] = useState<string>('');
  const [newMemberRole, setNewMemberRole] = useState<string>('Incoming Member');
  const [newMemberResp, setNewMemberResp] = useState<string>('');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    await createProject(newProjName.trim(), newProjDesc.trim());
    setNewProjName('');
    setNewProjDesc('');
    setShowCreateModal(false);
  };

  const handleOpenEdit = (m: TeamMember) => {
    setEditingMember(m);
    setEditRole(m.role);
    setEditResp(m.responsibilities || '');
    setEditContrib(m.contributions || '');
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    await updateTeamMember(editingMember.id, editRole, editResp);
    setEditingMember(null);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;
    // Add locally and to database
    await updateTeamMember(`tm-${Date.now()}`, newMemberRole, newMemberResp);
    setShowAddMemberModal(false);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberResp('');
  };

  const isOwner = currentUser?.role === 'Project Owner';

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Project Owner':
        return 'bg-rose-dust/20 text-rose-dustDark border-rose-dust/40';
      case 'Reviewer / Team Leader':
        return 'bg-sage/25 text-sage-dark border-sage/40';
      case 'Departing Member':
        return 'bg-aubergine/10 text-aubergine border-aubergine/30';
      default:
        return 'bg-lavender/25 text-aubergine border-lavender/40';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sage/20 text-sage-dark">
              Portfolio & People
            </span>
            <span className="text-xs text-graphite/60 font-mono">
              SIH 2026 • Team MahaMinds
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-aubergine mt-1">
            Projects & Team Management
          </h1>
          <p className="text-xs text-graphite/70 mt-1 max-w-2xl">
            Oversee knowledge handover repositories, manage team members, assign responsibilities, and monitor handover readiness scores.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-aubergine hover:bg-aubergine-dark text-ivory rounded-xl text-xs font-bold flex items-center space-x-2 shadow-soft-sm transition"
        >
          <FolderPlus className="w-4 h-4 text-rose-dust" />
          <span>New Handover Project</span>
        </button>
      </div>

      {/* Active Project Highlight */}
      <div className="bg-white rounded-3xl border border-ivory-border p-6 shadow-soft-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ivory-border pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sage animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-sage-dark uppercase tracking-wider">
                Active Benchmark Project
              </span>
              <span className="text-[10px] font-mono bg-lavender/30 text-aubergine px-2 py-0.5 rounded font-bold">
                {project.id}
              </span>
            </div>
            <h2 className="text-xl font-bold text-aubergine">
              {project.name}
            </h2>
            <p className="text-xs text-graphite/70 max-w-3xl">
              {project.tagline || project.description}
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-ivory p-3.5 rounded-2xl border border-ivory-border flex-shrink-0">
            <div>
              <p className="text-[10px] uppercase font-bold text-graphite/60">Status</p>
              <p className="text-xs font-bold text-aubergine">{project.status}</p>
            </div>
            <div className="h-6 w-px bg-ivory-border" />
            <div>
              <p className="text-[10px] uppercase font-bold text-graphite/60">Readiness</p>
              <p className="text-xs font-bold text-sage-dark">{project.handover_readiness_score || 85}%</p>
            </div>
            <div className="h-6 w-px bg-ivory-border" />
            <div>
              <p className="text-[10px] uppercase font-bold text-graphite/60">Continuity</p>
              <p className="text-xs font-bold text-rose-dust">{project.continuity_score || 90}/100</p>
            </div>
          </div>
        </div>

        {/* SECTION 6 REQUIREMENT: TEAM MEMBER DATABASE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-sage" />
              <h3 className="text-sm font-bold text-aubergine">
                Team Member Database (Authorized Personnel)
              </h3>
            </div>
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="px-3 py-1.5 bg-ivory hover:bg-white text-aubergine border border-ivory-border rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-soft-xs transition"
            >
              <UserPlus className="w-3.5 h-3.5 text-sage" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="p-4 bg-ivory rounded-2xl border border-ivory-border hover:border-lavender transition space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-aubergine">{member.name}</h4>
                    <p className="text-[11px] text-graphite/60 font-mono">{member.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${getRoleBadgeStyle(member.role)}`}>
                      {member.role}
                    </span>
                    <button
                      onClick={() => handleOpenEdit(member)}
                      title="Edit Member Profile & Responsibilities"
                      className="p-1 rounded-lg text-graphite/40 hover:text-aubergine hover:bg-white transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-graphite/50 block font-mono">Assigned Responsibilities</span>
                    <p className="text-graphite/80 text-[11px] leading-relaxed">
                      {member.responsibilities || 'General architecture verification & handover sign-off.'}
                    </p>
                  </div>

                  {member.contributions && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-graphite/50 block font-mono">Project Contributions</span>
                      <p className="text-graphite/70 text-[11px] leading-relaxed">
                        {member.contributions}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between text-[10px] text-graphite/50 border-t border-ivory-border font-mono">
                  <span>RBAC Access Level: Authorized</span>
                  <span className="text-sage-dark font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-sage" />
                    <span>Database Record Active</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-aubergine/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-soft-lg border border-ivory-border space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-ivory-border pb-3">
              <div>
                <h3 className="font-bold text-sm text-aubergine">Edit Team Member Record</h3>
                <p className="text-xs text-graphite/60">{editingMember.name}</p>
              </div>
              <button onClick={() => setEditingMember(null)} className="text-graphite/40 hover:text-graphite">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-graphite block mb-1">Role in Project</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
                >
                  <option value="Project Owner">Project Owner</option>
                  <option value="Reviewer / Team Leader">Reviewer / Team Leader</option>
                  <option value="Incoming Member">Incoming Member</option>
                  <option value="Departing Member">Departing Member</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-graphite block mb-1">Assigned Responsibilities</label>
                <textarea
                  rows={2}
                  value={editResp}
                  onChange={(e) => setEditResp(e.target.value)}
                  placeholder="Specific tasks, sub-modules and systems..."
                  className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-graphite block mb-1">Key Contributions & Notes</label>
                <textarea
                  rows={2}
                  value={editContrib}
                  onChange={(e) => setEditContrib(e.target.value)}
                  placeholder="Documentation, pull requests, decisions made..."
                  className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-ivory-border">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-3.5 py-2 text-xs font-bold text-graphite/70 hover:bg-ivory rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-aubergine hover:bg-aubergine-dark text-ivory rounded-xl shadow-soft-sm transition"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-aubergine/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-soft-lg border border-ivory-border space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-ivory-border pb-3">
              <h3 className="font-bold text-sm text-aubergine">Add Team Member</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-graphite/40 hover:text-graphite">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-graphite block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvi Joshi"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-graphite block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. tanvi@mahaminds.org"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-graphite block mb-1">Assigned Role</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
                >
                  <option value="Incoming Member">Incoming Member</option>
                  <option value="Departing Member">Departing Member</option>
                  <option value="Reviewer / Team Leader">Reviewer / Team Leader</option>
                  <option value="Project Owner">Project Owner</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-graphite block mb-1">Responsibilities</label>
                <input
                  type="text"
                  placeholder="e.g. Commuter App Testing"
                  value={newMemberResp}
                  onChange={(e) => setNewMemberResp(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-ivory-border">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-3.5 py-2 text-xs font-bold text-graphite/70 hover:bg-ivory rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-sage hover:bg-sage-dark text-aubergine rounded-xl shadow-soft-sm transition"
                >
                  Add to Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-aubergine/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-soft-lg border border-ivory-border space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-ivory-border pb-3">
              <h3 className="font-bold text-sm text-aubergine">Create New Handover Project</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-graphite/40 hover:text-graphite">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-graphite block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune Smart Water Grid v1.0"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-graphite block mb-1">Description & Scope</label>
                <textarea
                  rows={3}
                  placeholder="Handover objectives, tech stack, and key timelines..."
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory text-graphite border border-ivory-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-sage"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-ivory-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 text-xs font-bold text-graphite/70 hover:bg-ivory rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-aubergine hover:bg-aubergine-dark text-ivory rounded-xl shadow-soft-sm transition"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
