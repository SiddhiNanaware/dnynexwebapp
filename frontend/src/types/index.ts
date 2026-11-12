export type RoleType = 
  | 'Project Owner'
  | 'Reviewer / Team Leader'
  | 'Departing Member'
  | 'Incoming Member';

export type ClaimCategory = 
  | 'Decisions'
  | 'Responsibilities and owners'
  | 'Unfinished work'
  | 'Dependencies'
  | 'Risks'
  | 'Blockers'
  | 'Recurring problems'
  | 'Open questions'
  | 'Next actions';

export type ClaimStatus = 
  | 'Verified'
  | 'Inferred'
  | 'Conflicting'
  | 'Missing Evidence'
  | 'Pending Review'
  | 'Approved'
  | 'Rejected';

export type AccessLevel = 'public' | 'internal' | 'confidential';

export type LanguageCode = 'en' | 'mr' | 'hi';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: RoleType;
  avatar?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  responsibilities?: string;
  contributions?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  owner_id: string;
  status: string;
  handover_readiness_score: number;
  continuity_score: number;
  single_point_of_failure?: string | null;
  created_at: string;
  updated_at?: string;
  members?: any[];
}

export interface Source {
  id: string;
  project_id: string;
  name: string;
  type: string;
  access_level: AccessLevel;
  content: string;
  size_bytes: number;
  chunks_count: number;
  uploaded_by: string;
  uploaded_at: string;
  github_repo?: string | null;
}

export interface Claim {
  id: string;
  project_id: string;
  source_id?: string;
  source_name: string;
  type: ClaimCategory;
  title: string;
  text: string;
  status: ClaimStatus;
  confidence: number;
  quote: string;
  source_location?: string;
  access_level: AccessLevel;
  date?: string | null;
  assigned_owner?: string | null;
  assigned_reviewer?: string | null;
  reviewer_decision?: string | null;
  reviewer_notes?: string | null;
  verified_by?: string | null;
  uncertainty_flag?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  category: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  due_date?: string;
  created_at: string;
}

export interface Decision {
  id: string;
  project_id: string;
  title: string;
  rationale: string;
  chosen_option: string;
  alternatives_considered?: string;
  status: string;
  decided_by: string;
  decided_at: string;
}

export interface VoiceNote {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  audio_duration: string;
  transcript: string;
  notes?: string;
  tags?: string;
  created_at: string;
  updated_at?: string;
}

export interface SmartNotification {
  id: string;
  user_id: string;
  project_id?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  is_read: boolean;
  is_urgent: boolean;
  created_at: string;
}

export interface HandoverVersion {
  id: string;
  project_id: string;
  version: string;
  title: string;
  status: 'draft' | 'published';
  published_at: string;
  published_by: string;
  readiness_score: number;
  total_approved_claims: number;
  summary: string;
  decisions_count: number;
  responsibilities_count: number;
  open_tasks_count: number;
  risks_count: number;
  first_days_action_plan: string[];
}

export interface Acknowledgement {
  id: string;
  handover_id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  acknowledged_at: string;
  notes?: string | null;
  comprehension_confirmed: boolean;
}

export interface ProjectActivity {
  id: string;
  project_id: string;
  actor_name: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface Conflict {
  id: string;
  project_id: string;
  title: string;
  claim_a_id: string;
  claim_b_id: string;
  claim_a_title: string;
  claim_a_quote: string;
  claim_a_source: string;
  claim_b_title: string;
  claim_b_quote: string;
  claim_b_source: string;
  difference: string;
  status: 'unresolved' | 'resolved';
  resolution?: string;
  resolved_by?: string;
  resolved_at?: string;
}

export interface ChatCitation {
  claim_id: string;
  claim_title?: string;
  title?: string;
  quote: string;
  source_name: string;
  category?: string;
}

export interface KnowledgeGap {
  id: string;
  project_id: string;
  title?: string;
  area?: string;
  description: string;
  assigned_to?: string;
  status: string;
  priority?: string;
  severity?: string;
  suggested_action?: string;
  gap_type?: string;
}

export interface AuditLog {
  id: string;
  project_id: string;
  actor_id?: string;
  actor_name: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details: string;
  timestamp: string;
}


export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: ChatCitation[];
  hasEvidence?: boolean;
}
