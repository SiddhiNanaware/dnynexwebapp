import { Project, Source, Claim, Conflict, KnowledgeGap, HandoverVersion, Acknowledgement, AuditLog } from '../types';

export const INITIAL_PROJECT: Project = {
  id: "proj-pune-smart-mobility",
  name: "Smart Pune Mobility Project",
  tagline: "Real-time PMPML transit telemetry, QR ticketing, and BRTS handover system",
  description: "Intelligent public transit monitoring and commuter information system for Pune Municipal Corporation corridors (Swargate to Katraj & Shivajinagar).",
  owner_id: "user-siddhi",
  created_at: "2026-10-15T10:00:00Z",
  members: [
    { user_id: "user-siddhi", name: "Siddhi Rameshwar Nanaware", email: "siddhi@mahaminds.org", role: "Project Owner" },
    { user_id: "user-zahur", name: "Mhd Zahur Himayat Husain Rizvi", email: "zahur@mahaminds.org", role: "Reviewer / Team Leader" },
    { user_id: "user-rahul", name: "Rahul Deshmukh", email: "rahul.deshmukh@puneengg.ac.in", role: "Departing Member" },
    { user_id: "user-sonakshi", name: "Sonakshi Padmaraj Nazarkar", email: "sonakshi@mahaminds.org", role: "Incoming Member" },
    { user_id: "user-parineeta", name: "Parineeta Amol Meshram", email: "parineeta@mahaminds.org", role: "Incoming Member" },
  ],
  handover_readiness_score: 85,
  continuity_score: 90,
  single_point_of_failure: "Rahul Deshmukh holds 65% of telemetry & payment logic knowledge",
  status: "Ready for Final Review"
};

export const INITIAL_SOURCES: Source[] = [
  {
    id: "src-arch-spec",
    project_id: "proj-pune-smart-mobility",
    name: "PMC_BRTS_Architecture_Spec_v2.md",
    type: "markdown",
    access_level: "internal",
    size_bytes: 4280,
    uploaded_at: "2026-10-28T14:30:00Z",
    uploaded_by: "Rahul Deshmukh",
    chunks_count: 4,
    content: `# PMC Smart Pune Mobility — Architecture Specification v2.4
Author: Rahul Deshmukh (Departing Senior Backend Lead)
Reviewer: Siddhi Rameshwar Nanaware (Project Owner)
Date: 28 October 2026

## 1. Executive Summary
The Smart Pune Mobility system aggregates real-time telemetry from 1,200 PMPML city buses and Shivajinagar / Swargate BRTS corridors to provide real-time bus tracking and automated QR ticketing.

## 2. Core Decisions & Technology Choices
- Decision: We chose PostgreSQL with PostGIS over MongoDB because geospatial route queries on Pune transit corridors require strict relational integrity and fast spatial bounding box indexing.
- Decision: Redis cache was deployed for live GPS coordinates with a 15-second TTL to avoid database lock contention.
- Decision: Razorpay was selected as our primary payment gateway for generating QR commuter transit tickets.

## 3. Component Ownership
- Payment Gateway & Telemetry Pipeline: Owned by Rahul Deshmukh until 15 November 2026.
- GTFS Realtime Feed Ingestion: Assigned to Parineeta Amol Meshram.
- Frontend Commuter PWA & Station Displays: Owned by Sonakshi Padmaraj Nazarkar.

## 4. Current Dependencies
- PMPML Bus GPS Telemetry API: Hosted on MSRTC central cloud servers. Depends on vendor API key and bearer token.
- Pune Municipal Corporation BRTS Optical Fiber Network at Swargate depot.`
  },
  {
    id: "src-sprint-retro",
    project_id: "proj-pune-smart-mobility",
    name: "Sprint_24_Retro_DepartingNotes.txt",
    type: "txt",
    access_level: "internal",
    size_bytes: 3120,
    uploaded_at: "2026-11-05T17:15:00Z",
    uploaded_by: "Rahul Deshmukh",
    chunks_count: 4,
    content: `Sprint Retrospective & Handover Notes — Pune Transit Pod
Meeting Date: 05 November 2026
Attendees: Rahul Deshmukh, Siddhi Nanaware, Parineeta Meshram

### Unfinished Work & Work In Progress:
- Incomplete: Refund webhook check is currently stuck on payment gateway signature validation for dropped transactions.
- PR #108 for fare reconciliation remains half-done and needs an automated unit test suite.

### Recurring Problems:
- Recurring bug: GPS telemetry packets intermittently drop on campus Wi-Fi at COEP Shivajinagar transit hub during peak evening hours (17:30 to 19:30).
- Memory leak in node-cache when bus count exceeds 1,400 active connections.

### Risks and Blockers:
- Critical Risk: MSRTC vendor contract renewal deadline is 31 December 2026; if not renewed, the telemetry API endpoint will terminate.
- Blocker: Staging cluster does not have access to the production PMC database replica.

### Open Questions:
- Should offline ticket validation fallback to QR timestamp signatures or cached SQLite on conductor handheld terminals?`
  },
  {
    id: "src-pr-104",
    project_id: "proj-pune-smart-mobility",
    name: "GitHub_PR_104_Discussion.md",
    type: "github",
    access_level: "public",
    size_bytes: 1840,
    uploaded_at: "2026-11-08T12:00:00Z",
    uploaded_by: "System (GitHub Sync)",
    github_repo: "mahaminds/pune-mobility-engine",
    chunks_count: 2,
    content: `# GitHub PR #104 Discussion — Deployment Schedule & Configuration
Repository: mahaminds/pune-mobility-engine

Comment by @rahul-deshmukh (07 Nov 2026, 14:22):
"All migration scripts for the Swargate corridor are ready. Project launch date is 15 December across all 40 smart bus stops."

Comment by @tanvi-pm (08 Nov 2026, 09:15):
"Please hold on the 15th date. Project launch date is 20 December due to PMC municipal election clearance protocols."

Comment by @siddhi-owner (08 Nov 2026, 11:30):
"We will resolve this conflict in the Round 2 handover review desk before publishing."`
  },
  {
    id: "src-vendor-contract",
    project_id: "proj-pune-smart-mobility",
    name: "MSRTC_Vendor_Contracts_Internal.txt",
    type: "txt",
    access_level: "confidential",
    size_bytes: 1450,
    uploaded_at: "2026-11-09T09:40:00Z",
    uploaded_by: "Siddhi Rameshwar Nanaware",
    chunks_count: 1,
    content: `CONFIDENTIAL — MSRTC & PMC Vendor Agreement Annexure
Classification: Restricted / Internal

1. Telemetry API Endpoint: https://telemetry.punemobility.internal/v3/feed
2. Authentication Token: [REDACTED_GITHUB_TOKEN]
3. Account Manager: Contact person name is not listed; only general helpline 020-24440000 provided.
4. Renewal SLA: Notice required 30 days prior to expiry on 31 December 2026.`
  }
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: "clm-1",
    project_id: "proj-pune-smart-mobility",
    type: "Decisions",
    title: "PostgreSQL with PostGIS Selected for Transit Routes",
    text: "The team chose PostgreSQL with PostGIS over MongoDB because geospatial route queries on Pune transit corridors require strict relational integrity and fast spatial bounding box indexing.",
    status: "Approved",
    confidence: 0.98,
    quote: "We chose PostgreSQL with PostGIS over MongoDB because geospatial route queries on Pune transit corridors require strict relational integrity and fast spatial bounding box indexing.",
    source_id: "src-arch-spec",
    source_name: "PMC_BRTS_Architecture_Spec_v2.md",
    source_location: "Section 2, Paragraph 1",
    access_level: "internal",
    date: "2026-10-28",
    assigned_reviewer: "Mhd Zahur Himayat Husain Rizvi",
    reviewer_decision: "Approved",
    reviewer_notes: "Verified against architecture requirements. Essential for spatial routing.",
    assigned_owner: "Sonakshi Padmaraj Nazarkar",
    created_at: "2026-10-28T15:00:00Z"
  },
  {
    id: "clm-2",
    project_id: "proj-pune-smart-mobility",
    type: "Decisions",
    title: "Redis Cache for Real-Time GPS Telemetry Coordinates",
    text: "Redis cache was deployed for live GPS coordinates with a 15-second TTL to avoid database lock contention.",
    status: "Approved",
    confidence: 0.97,
    quote: "Redis cache was deployed for live GPS coordinates with a 15-second TTL to avoid database lock contention.",
    source_id: "src-arch-spec",
    source_name: "PMC_BRTS_Architecture_Spec_v2.md",
    source_location: "Section 2, Paragraph 2",
    access_level: "internal",
    date: "2026-10-28",
    assigned_reviewer: "Mhd Zahur Himayat Husain Rizvi",
    reviewer_decision: "Approved",
    assigned_owner: "Parineeta Amol Meshram",
    created_at: "2026-10-28T15:05:00Z"
  },
  {
    id: "clm-3",
    project_id: "proj-pune-smart-mobility",
    type: "Decisions",
    title: "Razorpay Payment Gateway Selected for QR Commuter Ticketing",
    text: "Razorpay was selected as our primary payment gateway for generating QR commuter transit tickets.",
    status: "Approved",
    confidence: 0.96,
    quote: "Razorpay was selected as our primary payment gateway for generating QR commuter transit tickets.",
    source_id: "src-arch-spec",
    source_name: "PMC_BRTS_Architecture_Spec_v2.md",
    source_location: "Section 2, Paragraph 3",
    access_level: "internal",
    date: "2026-10-28",
    assigned_reviewer: "Mhd Zahur Himayat Husain Rizvi",
    reviewer_decision: "Approved",
    assigned_owner: "Rahul Deshmukh",
    created_at: "2026-10-28T15:10:00Z"
  },
  {
    id: "clm-4",
    project_id: "proj-pune-smart-mobility",
    type: "Unfinished work",
    title: "Refund Webhook Stuck on Signature Validation",
    text: "Refund webhook check is currently stuck on payment gateway signature validation for dropped transactions.",
    status: "Pending Review",
    confidence: 0.95,
    quote: "Refund webhook check is currently stuck on payment gateway signature validation for dropped transactions.",
    source_id: "src-sprint-retro",
    source_name: "Sprint_24_Retro_DepartingNotes.txt",
    source_location: "Section: Unfinished Work, Line 2",
    access_level: "internal",
    date: "2026-11-05",
    assigned_owner: "Unassigned",
    created_at: "2026-11-05T17:30:00Z"
  },
  {
    id: "clm-5",
    project_id: "proj-pune-smart-mobility",
    type: "Unfinished work",
    title: "Fare Reconciliation PR #108 Lacks Automated Unit Tests",
    text: "PR #108 for fare reconciliation remains half-done and needs an automated unit test suite.",
    status: "Verified",
    confidence: 0.94,
    quote: "PR #108 for fare reconciliation remains half-done and needs an automated unit test suite.",
    source_id: "src-sprint-retro",
    source_name: "Sprint_24_Retro_DepartingNotes.txt",
    source_location: "Section: Unfinished Work, Line 3",
    access_level: "internal",
    date: "2026-11-05",
    assigned_owner: "Rahul Deshmukh",
    created_at: "2026-11-05T17:32:00Z"
  },
  {
    id: "clm-6",
    project_id: "proj-pune-smart-mobility",
    type: "Recurring problems",
    title: "Intermittent GPS Packet Loss on Shivajinagar Campus Wi-Fi",
    text: "GPS telemetry packets intermittently drop on campus Wi-Fi at COEP Shivajinagar transit hub during peak evening hours (17:30 to 19:30).",
    status: "Verified",
    confidence: 0.93,
    quote: "GPS telemetry packets intermittently drop on campus Wi-Fi at COEP Shivajinagar transit hub during peak evening hours (17:30 to 19:30).",
    source_id: "src-sprint-retro",
    source_name: "Sprint_24_Retro_DepartingNotes.txt",
    source_location: "Section: Recurring Problems, Line 1",
    access_level: "internal",
    date: "2026-11-05",
    assigned_owner: "Parineeta Amol Meshram",
    created_at: "2026-11-05T17:35:00Z"
  },
  {
    id: "clm-7",
    project_id: "proj-pune-smart-mobility",
    type: "Risks",
    title: "MSRTC Vendor Contract Expiry on 31 December 2026",
    text: "MSRTC vendor contract renewal deadline is 31 December 2026; if not renewed, the telemetry API endpoint will terminate.",
    status: "Approved",
    confidence: 0.99,
    quote: "MSRTC vendor contract renewal deadline is 31 December 2026; if not renewed, the telemetry API endpoint will terminate.",
    source_id: "src-sprint-retro",
    source_name: "Sprint_24_Retro_DepartingNotes.txt",
    source_location: "Section: Risks and Blockers, Line 1",
    access_level: "internal",
    date: "2026-11-05",
    assigned_reviewer: "Mhd Zahur Himayat Husain Rizvi",
    reviewer_decision: "Approved",
    assigned_owner: "Siddhi Rameshwar Nanaware",
    created_at: "2026-11-05T17:40:00Z"
  },
  {
    id: "clm-8",
    project_id: "proj-pune-smart-mobility",
    type: "Dependencies",
    title: "MSRTC Telemetry Cloud Feed Dependency",
    text: "PMPML Bus GPS Telemetry API: Hosted on MSRTC central cloud servers. Depends on vendor API key and bearer token.",
    status: "Approved",
    confidence: 0.96,
    quote: "PMPML Bus GPS Telemetry API: Hosted on MSRTC central cloud servers. Depends on vendor API key and bearer token.",
    source_id: "src-arch-spec",
    source_name: "PMC_BRTS_Architecture_Spec_v2.md",
    source_location: "Section 4, Line 1",
    access_level: "internal",
    date: "2026-10-28",
    assigned_reviewer: "Mhd Zahur Himayat Husain Rizvi",
    reviewer_decision: "Approved",
    assigned_owner: "Rahul Deshmukh",
    created_at: "2026-10-28T15:20:00Z"
  },
  {
    id: "clm-9",
    project_id: "proj-pune-smart-mobility",
    type: "Next actions",
    title: "Rollout Target Stated as 15 December by Lead Engineer",
    text: "All migration scripts for the Swargate corridor are ready. Project launch date is 15 December across all 40 smart bus stops.",
    status: "Conflicting",
    confidence: 0.91,
    quote: "Project launch date is 15 December across all 40 smart bus stops.",
    source_id: "src-pr-104",
    source_name: "GitHub_PR_104_Discussion.md",
    source_location: "PR #104 Comment 1",
    access_level: "public",
    date: "2026-11-07",
    assigned_owner: "Rahul Deshmukh",
    created_at: "2026-11-07T14:25:00Z"
  },
  {
    id: "clm-10",
    project_id: "proj-pune-smart-mobility",
    type: "Next actions",
    title: "Rollout Postponed to 20 December by PM for Election Clearance",
    text: "Please hold on the 15th date. Project launch date is 20 December due to PMC municipal election clearance protocols.",
    status: "Conflicting",
    confidence: 0.92,
    quote: "Project launch date is 20 December due to PMC municipal election clearance protocols.",
    source_id: "src-pr-104",
    source_name: "GitHub_PR_104_Discussion.md",
    source_location: "PR #104 Comment 2",
    access_level: "public",
    date: "2026-11-08",
    assigned_owner: "Siddhi Rameshwar Nanaware",
    created_at: "2026-11-08T09:20:00Z"
  },
  {
    id: "clm-11",
    project_id: "proj-pune-smart-mobility",
    type: "Open questions",
    title: "Offline Ticket Validation Fallback Mechanism",
    text: "Should offline ticket validation fallback to QR timestamp signatures or cached SQLite on conductor handheld terminals?",
    status: "Verified",
    confidence: 0.90,
    quote: "Should offline ticket validation fallback to QR timestamp signatures or cached SQLite on conductor handheld terminals?",
    source_id: "src-sprint-retro",
    source_name: "Sprint_24_Retro_DepartingNotes.txt",
    source_location: "Section: Open Questions, Line 1",
    access_level: "internal",
    date: "2026-11-05",
    assigned_owner: "Sonakshi Padmaraj Nazarkar",
    created_at: "2026-11-05T17:45:00Z"
  },
  {
    id: "clm-12",
    project_id: "proj-pune-smart-mobility",
    type: "Dependencies",
    title: "Confidential MSRTC Telemetry API Credentials",
    text: "Confidential production telemetry endpoint and authentication token for live transit feed.",
    status: "Approved",
    confidence: 0.99,
    quote: "Telemetry API Endpoint: https://telemetry.punemobility.internal/v3/feed",
    source_id: "src-vendor-contract",
    source_name: "MSRTC_Vendor_Contracts_Internal.txt",
    source_location: "Section 1",
    access_level: "confidential",
    date: "2026-11-09",
    assigned_reviewer: "Mhd Zahur Himayat Husain Rizvi",
    reviewer_decision: "Approved",
    assigned_owner: "Siddhi Rameshwar Nanaware",
    created_at: "2026-11-09T09:50:00Z"
  }
];

export const INITIAL_CONFLICTS: Conflict[] = [
  {
    id: "conf-1",
    project_id: "proj-pune-smart-mobility",
    title: "Launch Timeline Discrepancy: 15 December vs 20 December",
    claim_a_id: "clm-9",
    claim_b_id: "clm-10",
    claim_a_title: "Target rollout is 15 December (Rahul Deshmukh)",
    claim_a_quote: "Project launch date is 15 December across all 40 smart bus stops.",
    claim_a_source: "GitHub_PR_104_Discussion.md",
    claim_b_title: "Rollout shifted to 20 December (PMC Election Protocol)",
    claim_b_quote: "Project launch date is 20 December due to PMC municipal election clearance protocols.",
    claim_b_source: "GitHub_PR_104_Discussion.md",
    difference: "Engineering proposed Dec 15 rollout, but PMC administrative clearance demands Dec 20 launch.",
    status: "unresolved"
  }
];

export const INITIAL_GAPS: KnowledgeGap[] = [
  {
    id: "gap-1",
    project_id: "proj-pune-smart-mobility",
    gap_type: "unassigned_task",
    title: "Refund Webhook Stuck Without Assigned Owner",
    description: "Payment refund webhook check is failing on signature validation. Rahul is departing in 3 days, and no junior engineer has been designated as owner.",
    severity: "critical",
    status: "open",
    suggested_action: "Assign Sonakshi Padmaraj Nazarkar as owner and pair with Rahul on signature validation before exit."
  },
  {
    id: "gap-2",
    project_id: "proj-pune-smart-mobility",
    gap_type: "missing_contact",
    title: "MSRTC Telemetry Vendor Account POC Missing",
    description: "The internal contract document lists phone helpline 020-24440000 but no named technical account manager or escalation email address.",
    severity: "high",
    status: "open",
    suggested_action: "Contact PMC transit liaison office to confirm primary technical contact for API contract renewal."
  },
  {
    id: "gap-3",
    project_id: "proj-pune-smart-mobility",
    gap_type: "repeated_bug",
    title: "COEP Shivajinagar Campus Wi-Fi Dropouts Lack Documented Mitigation",
    description: "GPS packet drops happen daily between 17:30 and 19:30. No automated retry queue or offline buffer configuration is documented.",
    severity: "medium",
    status: "open",
    suggested_action: "Document Redis queue retry backoff settings in the incoming transit engineer runbook."
  }
];

export const INITIAL_HANDOVERS: HandoverVersion[] = [
  {
    id: "ho-v1",
    project_id: "proj-pune-smart-mobility",
    version: "v1.0.0",
    title: "Smart Pune Mobility Project — Engineering Handover Release v1.0",
    status: "published",
    published_at: "2026-11-10T16:00:00Z",
    published_by: "Mhd Zahur Himayat Husain Rizvi (Reviewer)",
    readiness_score: 85,
    total_approved_claims: 6,
    summary: "Formal handover dossier from departing lead Rahul Deshmukh to incoming engineer Sonakshi Padmaraj Nazarkar. Contains verified architectural decisions, live dependencies, critical risk notices, and first-week onboarding agenda.",
    decisions_count: 3,
    responsibilities_count: 3,
    open_tasks_count: 2,
    risks_count: 1,
    first_days_action_plan: [
      "Day 1: Clone mahaminds/pune-mobility-engine and verify local Docker environment with PostgreSQL PostGIS extensions.",
      "Day 2: Pair with Rahul Deshmukh on the Razorpay refund webhook signature validation in PR #108.",
      "Day 3: Review MSRTC telemetry API contract renewal terms with Project Owner Siddhi Nanaware.",
      "Day 4: Inspect Shivajinagar Wi-Fi telemetry packet drop logs and implement Redis buffer retry queue.",
      "Day 5: Verify corridor bus tracking endpoints in staging and submit formal handover acknowledgement."
    ]
  }
];

export const INITIAL_ACKS: Acknowledgement[] = [
  {
    id: "ack-1",
    handover_id: "ho-v1",
    project_id: "proj-pune-smart-mobility",
    user_id: "user-sonakshi",
    user_name: "Sonakshi Padmaraj Nazarkar",
    user_role: "Incoming Member",
    acknowledged_at: "2026-11-11T11:20:00Z",
    notes: "I have reviewed all approved architectural decisions, tested the PostGIS local setup, and confirmed my responsibility for the transit displays.",
    comprehension_confirmed: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    project_id: "proj-pune-smart-mobility",
    actor_id: "user-siddhi",
    actor_name: "Siddhi Rameshwar Nanaware",
    action: "create_project",
    target_type: "project",
    target_id: "proj-pune-smart-mobility",
    timestamp: "2026-10-15T10:00:00Z",
    details: "Created project Smart Pune Mobility Project with team MahaMinds"
  },
  {
    id: "log-2",
    project_id: "proj-pune-smart-mobility",
    actor_id: "user-rahul",
    actor_name: "Rahul Deshmukh",
    action: "ingest_source",
    target_type: "source",
    target_id: "src-arch-spec",
    timestamp: "2026-10-28T14:30:00Z",
    details: "Uploaded PMC_BRTS_Architecture_Spec_v2.md (access: internal)"
  },
  {
    id: "log-3",
    project_id: "proj-pune-smart-mobility",
    actor_id: "user-zahur",
    actor_name: "Mhd Zahur Himayat Husain Rizvi",
    action: "approve_claim",
    target_type: "claim",
    target_id: "clm-1",
    timestamp: "2026-10-29T10:15:00Z",
    details: "Approved claim: PostgreSQL with PostGIS Selected for Transit Routes (Verbatim quote checked)"
  },
  {
    id: "log-4",
    project_id: "proj-pune-smart-mobility",
    actor_id: "user-zahur",
    actor_name: "Mhd Zahur Himayat Husain Rizvi",
    action: "publish_handover",
    target_type: "handover",
    target_id: "ho-v1",
    timestamp: "2026-11-10T16:00:00Z",
    details: "Published Handover Version v1.0.0 after passing review gate"
  },
  {
    id: "log-5",
    project_id: "proj-pune-smart-mobility",
    actor_id: "user-sonakshi",
    actor_name: "Sonakshi Padmaraj Nazarkar",
    action: "acknowledge_handover",
    target_type: "handover",
    target_id: "ho-v1",
    timestamp: "2026-11-11T11:20:00Z",
    details: "Incoming member signed acknowledgement for v1.0.0"
  }
];
