from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class RoleEnum(str, Enum):
    OWNER = "Project Owner"
    REVIEWER = "Reviewer / Team Leader"
    DEPARTING = "Departing Member"
    INCOMING = "Incoming Member"

class ClaimTypeEnum(str, Enum):
    DECISION = "Decisions"
    RESPONSIBILITY = "Responsibilities and owners"
    UNFINISHED_WORK = "Unfinished work"
    DEPENDENCY = "Dependencies"
    RISK = "Risks"
    BLOCKER = "Blockers"
    RECURRING_PROBLEM = "Recurring problems"
    OPEN_QUESTION = "Open questions"
    NEXT_ACTION = "Next actions"

class ClaimStatusEnum(str, Enum):
    VERIFIED = "Verified"
    INFERRED = "Inferred"
    CONFLICTING = "Conflicting"
    MISSING_EVIDENCE = "Missing Evidence"
    PENDING_REVIEW = "Pending Review"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class AccessLevelEnum(str, Enum):
    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"

# Auth Models
class RegisterRequest(BaseModel):
    username: str
    password: str
    name: str
    email: str
    role: RoleEnum = RoleEnum.INCOMING

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    name: str
    email: str
    role: str
    avatar: Optional[str] = None
    created_at: str

class LoginResponse(BaseModel):
    token: str
    user: UserResponse
    message: str

# Team Models
class TeamMemberModel(BaseModel):
    id: str
    name: str
    email: str
    role: str
    responsibilities: Optional[str] = None
    contributions: Optional[str] = None
    avatar: Optional[str] = None
    created_at: str
    updated_at: str

# Project Models
class ProjectModel(BaseModel):
    id: str
    name: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    owner_id: str
    status: str
    handover_readiness_score: int
    continuity_score: int
    single_point_of_failure: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None

class CreateProjectRequest(BaseModel):
    name: str
    tagline: Optional[str] = "Knowledge stays. Teams move forward."
    description: Optional[str] = ""

# Source Models
class SourceModel(BaseModel):
    id: str
    project_id: str
    name: str
    type: str
    access_level: str
    content: str
    size_bytes: int
    chunks_count: int
    uploaded_by: str
    uploaded_at: str
    github_repo: Optional[str] = None

class UploadSourceRequest(BaseModel):
    project_id: str
    name: str
    type: str
    content: str
    access_level: str = "internal"
    github_repo: Optional[str] = None

# Claim Models
class ClaimModel(BaseModel):
    id: str
    project_id: str
    source_id: str
    source_name: str
    type: str
    title: str
    text: str
    status: str = "Pending Review"
    confidence: float = 0.95
    quote: str
    source_location: Optional[str] = None
    access_level: str = "internal"
    date: Optional[str] = None
    assigned_owner: Optional[str] = None
    assigned_reviewer: Optional[str] = None
    reviewer_decision: Optional[str] = None
    reviewer_notes: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None

# Task Models
class TaskModel(BaseModel):
    id: str
    project_id: str
    title: str
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    category: str = "General"
    status: str = "Pending"
    priority: str = "Medium"
    due_date: Optional[str] = None
    created_at: str
    updated_at: str

# Decision Models
class DecisionModel(BaseModel):
    id: str
    project_id: str
    title: str
    rationale: str
    chosen_option: str
    alternatives_considered: Optional[str] = None
    status: str = "Approved"
    decided_by: str
    decided_at: str

# Voice Note Models (DnyanPakshi Notes)
class VoiceNoteModel(BaseModel):
    id: str
    project_id: str
    user_id: str
    title: str
    audio_duration: str = "00:00"
    transcript: str
    notes: Optional[str] = None
    tags: str = "general"
    created_at: str
    updated_at: str

class CreateVoiceNoteRequest(BaseModel):
    project_id: str
    title: str
    audio_duration: Optional[str] = "00:30"
    transcript: str
    notes: Optional[str] = None
    tags: Optional[str] = "general"

# Notification Models (Smart Alerts)
class NotificationModel(BaseModel):
    id: str
    user_id: str
    project_id: Optional[str] = None
    title: str
    message: str
    type: str = "info"
    is_read: bool = False
    is_urgent: bool = False
    created_at: str

class CreateNotificationRequest(BaseModel):
    user_id: str
    project_id: Optional[str] = None
    title: str
    message: str
    type: str = "info"
    is_urgent: bool = False

# Chat Models
class ChatRequest(BaseModel):
    project_id: str
    question: str
    user_role: str = "Incoming Member"
    language: str = "en"

class ChatCitation(BaseModel):
    claim_id: str
    claim_title: str
    quote: str
    source_name: str
    category: str

class ChatResponse(BaseModel):
    answer: str
    language: str
    citations: List[ChatCitation] = []
    has_sufficient_evidence: bool = True
    confidence: float = 0.95

# Activity Log
class ActivityModel(BaseModel):
    id: str
    project_id: str
    actor_name: str
    action: str
    details: str
    timestamp: str

class Conflict(BaseModel):
    id: str
    project_id: str
    title: str
    claim_a_id: str
    claim_b_id: str
    claim_a_title: str
    claim_a_quote: str
    claim_a_source: str
    claim_b_title: str
    claim_b_quote: str
    claim_b_source: str
    difference: str
    status: str = "unresolved"
    resolution: Optional[str] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[str] = None
    reviewer_notes: Optional[str] = None

class KnowledgeGap(BaseModel):
    id: str
    project_id: str
    gap_type: str
    title: str
    description: str
    severity: str = "medium"
    status: str = "open"
    suggested_action: str
    assigned_to: Optional[str] = None
    resolved_at: Optional[str] = None

class HandoverVersion(BaseModel):
    id: str
    project_id: str
    version: str
    title: str
    status: str = "published"
    published_at: str
    published_by: str
    readiness_score: int
    total_approved_claims: int
    summary: str
    decisions_count: int
    responsibilities_count: int
    open_tasks_count: int
    risks_count: int
    first_days_action_plan: List[str]

class Acknowledgement(BaseModel):
    id: str
    handover_id: str
    project_id: str
    user_id: str
    user_name: str
    user_role: str
    acknowledged_at: str
    notes: Optional[str] = None
    comprehension_confirmed: bool = True

class ProjectMember(BaseModel):
    user_id: str
    name: str
    email: str
    role: RoleEnum

# Backward compatibility aliases
Claim = ClaimModel
Project = ProjectModel
Source = SourceModel
AuditLog = ActivityModel

