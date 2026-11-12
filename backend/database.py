import sqlite3
import os
import json
import hashlib
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "dnyanex.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    """Secure PBKDF2 hash with salt for credentials."""
    salt = "dnyanex_salt_2026_mahaminds"
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. users
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        avatar TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    ''')

    # 2. team_members (with the 4 exact names)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS team_members (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL,
        responsibilities TEXT,
        contributions TEXT,
        avatar TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    ''')

    # 3. projects
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        tagline TEXT,
        description TEXT,
        owner_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'In Review',
        handover_readiness_score INTEGER DEFAULT 0,
        continuity_score INTEGER DEFAULT 0,
        single_point_of_failure TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    ''')

    # 4. project_members
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS project_members (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        joined_at TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
    ''')

    # 5. sources
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sources (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        access_level TEXT NOT NULL DEFAULT 'internal',
        content TEXT NOT NULL,
        size_bytes INTEGER DEFAULT 0,
        chunks_count INTEGER DEFAULT 0,
        uploaded_by TEXT NOT NULL,
        uploaded_at TEXT NOT NULL,
        github_repo TEXT,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
    ''')

    # 6. artifacts
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS artifacts (
        id TEXT PRIMARY KEY,
        source_id TEXT NOT NULL,
        project_id TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        text_chunk TEXT NOT NULL,
        start_char INTEGER DEFAULT 0,
        end_char INTEGER DEFAULT 0,
        access_level TEXT NOT NULL DEFAULT 'internal',
        created_at TEXT NOT NULL,
        FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
    )
    ''')

    # 7. claims
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS claims (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        source_id TEXT NOT NULL,
        source_name TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending Review',
        confidence REAL DEFAULT 0.95,
        quote TEXT NOT NULL,
        source_location TEXT,
        access_level TEXT NOT NULL DEFAULT 'internal',
        date TEXT,
        assigned_owner TEXT,
        assigned_reviewer TEXT,
        reviewer_decision TEXT,
        reviewer_notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
    ''')

    # 8. evidence
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS evidence (
        id TEXT PRIMARY KEY,
        claim_id TEXT NOT NULL,
        source_id TEXT NOT NULL,
        artifact_id TEXT,
        quote TEXT NOT NULL,
        confidence REAL DEFAULT 0.95,
        created_at TEXT NOT NULL,
        FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE
    )
    ''')

    # 9. tasks
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        assigned_to TEXT,
        category TEXT NOT NULL DEFAULT 'General',
        status TEXT NOT NULL DEFAULT 'Pending',
        priority TEXT NOT NULL DEFAULT 'Medium',
        due_date TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
    ''')

    # 10. decisions
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS decisions (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        title TEXT NOT NULL,
        rationale TEXT NOT NULL,
        chosen_option TEXT NOT NULL,
        alternatives_considered TEXT,
        status TEXT NOT NULL DEFAULT 'Approved',
        decided_by TEXT NOT NULL,
        decided_at TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
    ''')

    # 11. project_activity
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS project_activity (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        actor_name TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
    ''')

    # 12. handovers
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS handovers (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        version TEXT NOT NULL,
        title TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'published',
        published_by TEXT NOT NULL,
        published_at TEXT NOT NULL,
        readiness_score INTEGER DEFAULT 0,
        total_approved_claims INTEGER DEFAULT 0,
        summary TEXT NOT NULL,
        decisions_count INTEGER DEFAULT 0,
        responsibilities_count INTEGER DEFAULT 0,
        open_tasks_count INTEGER DEFAULT 0,
        risks_count INTEGER DEFAULT 0,
        first_days_action_plan TEXT,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
    ''')

    # 13. acknowledgements
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS acknowledgements (
        id TEXT PRIMARY KEY,
        handover_id TEXT NOT NULL,
        project_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_role TEXT NOT NULL,
        acknowledged_at TEXT NOT NULL,
        notes TEXT,
        comprehension_confirmed INTEGER DEFAULT 1,
        FOREIGN KEY (handover_id) REFERENCES handovers(id) ON DELETE CASCADE
    )
    ''')

    # 14. voice_notes (DnyanPakshi Notes)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS voice_notes (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        audio_duration TEXT DEFAULT '00:00',
        transcript TEXT NOT NULL,
        notes TEXT,
        tags TEXT DEFAULT 'general',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
    ''')

    # 15. chat_history (DNYANEX Intelligence conversation)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS chat_history (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        message TEXT NOT NULL,
        citations TEXT,
        has_evidence INTEGER DEFAULT 1,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
    ''')

    # 16. notifications (Smart Alerts with buzzer trigger)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        project_id TEXT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'info',
        is_read INTEGER DEFAULT 0,
        is_urgent INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )
    ''')

    # 17. audit_logs
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        actor_id TEXT NOT NULL,
        actor_name TEXT NOT NULL,
        action TEXT NOT NULL,
        target_type TEXT NOT NULL,
        target_id TEXT NOT NULL,
        details TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )
    ''')

    conn.commit()
    seed_initial_data(conn)
    conn.close()

def seed_initial_data(conn):
    cursor = conn.cursor()

    # Seed Team Members (EXACT 4 names requested)
    cursor.execute("SELECT COUNT(*) FROM team_members")
    if cursor.fetchone()[0] == 0:
        now = datetime.utcnow().isoformat() + "Z"
        members = [
            ("tm-1", "Siddhi Nanaware", "siddhi@mahaminds.org", "Project Owner", "Project architecture, scope validation, PMC municipal protocols", "Led initial architecture definition and vendor liaison", "SN", now, now),
            ("tm-2", "Sonakshi Nazarkar", "sonakshi@mahaminds.org", "Incoming Member", "Transit display systems, commuter UI, unit tests for webhooks", "Incoming Transit Systems Lead taking over Swargate telemetry", "SZ", now, now),
            ("tm-3", "Mhd Zahur Rizvi", "zahur@mahaminds.org", "Reviewer / Team Leader", "Human approval gate, evidence verification, conflict arbitration", "Primary review board signatory and verification gatekeeper", "ZR", now, now),
            ("tm-4", "Parineeta Meshram", "parineeta@mahaminds.org", "Departing Member", "GTFS Realtime Feed Ingestion, Redis telemetry queue cache", "Maintained live GPS coordinate pipeline for 1,200 buses", "PM", now, now)
        ]
        cursor.executemany('''
        INSERT INTO team_members (id, name, email, role, responsibilities, contributions, avatar, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', members)

    # Seed Default Users for Authentication
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        now = datetime.utcnow().isoformat() + "Z"
        pw = hash_password("dnyanex2026")
        users = [
            ("usr-siddhi", "siddhi", "siddhi@mahaminds.org", pw, "Siddhi Nanaware", "Project Owner", "SN", now, now),
            ("usr-zahur", "zahur", "zahur@mahaminds.org", pw, "Mhd Zahur Rizvi", "Reviewer / Team Leader", "ZR", now, now),
            ("usr-zagur", "zagur", "zahur@mahaminds.org", pw, "Mhd Zahur Rizvi", "Reviewer / Team Leader", "ZR", now, now),
            ("usr-sonakshi", "sonakshi", "sonakshi@mahaminds.org", pw, "Sonakshi Nazarkar", "Incoming Member", "SZ", now, now),
            ("usr-parineeta", "parineeta", "parineeta@mahaminds.org", pw, "Parineeta Meshram", "Departing Member", "PM", now, now)
        ]
        cursor.executemany('''
        INSERT INTO users (id, username, email, password_hash, name, role, avatar, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', users)

    # Seed Demo Project: Smart Pune Mobility Project
    cursor.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] == 0:
        now = "2026-10-15T10:00:00Z"
        proj_id = "proj-pune-smart-mobility"
        cursor.execute('''
        INSERT INTO projects (id, name, tagline, description, owner_id, status, handover_readiness_score, continuity_score, single_point_of_failure, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            proj_id,
            "Smart Pune Mobility Project",
            "Real-time PMPML transit telemetry, QR ticketing, and BRTS handover system",
            "Intelligent public transit monitoring and commuter information system for Pune Municipal Corporation corridors (Swargate to Katraj & Shivajinagar).",
            "usr-siddhi",
            "Ready for Review",
            85,
            90,
            "Parineeta Meshram holds 65% of telemetry & payment logic knowledge",
            now,
            now
        ))

        # Project Members
        cursor.executemany('''
        INSERT INTO project_members (id, project_id, user_id, name, role, joined_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', [
            ("pm-1", proj_id, "usr-siddhi", "Siddhi Nanaware", "Project Owner", now),
            ("pm-2", proj_id, "usr-zahur", "Mhd Zahur Rizvi", "Reviewer / Team Leader", now),
            ("pm-3", proj_id, "usr-sonakshi", "Sonakshi Nazarkar", "Incoming Member", now),
            ("pm-4", proj_id, "usr-parineeta", "Parineeta Meshram", "Departing Member", now)
        ])

        # Seed Documents / Sources
        src1_content = """# PMC Smart Pune Mobility — Architecture Specification v2.4
Author: Parineeta Meshram (Departing Senior Backend Lead)
Reviewer: Siddhi Nanaware (Project Owner)
Date: 28 October 2026

## 1. Executive Summary
The Smart Pune Mobility system aggregates real-time telemetry from 1,200 PMPML city buses and Shivajinagar / Swargate BRTS corridors to provide real-time bus tracking and automated QR ticketing.

## 2. Core Decisions & Technology Choices
- Decision: We chose PostgreSQL with PostGIS over MongoDB because geospatial route queries on Pune transit corridors require strict relational integrity and fast spatial bounding box indexing.
- Decision: Redis cache was deployed for live GPS coordinates with a 15-second TTL to avoid database lock contention.
- Decision: Razorpay was selected as our primary payment gateway for generating QR commuter transit tickets.

## 3. Component Ownership
- Payment Gateway & Telemetry Pipeline: Owned by Parineeta Meshram until 15 November 2026.
- GTFS Realtime Feed Ingestion: Assigned to Sonakshi Nazarkar.
- Frontend Commuter PWA & Station Displays: Owned by Sonakshi Nazarkar.

## 4. Current Dependencies
- PMPML Bus GPS Telemetry API: Hosted on MSRTC central cloud servers. Depends on vendor API key and bearer token.
- Pune Municipal Corporation BRTS Optical Fiber Network at Swargate depot."""

        src2_content = """Sprint Retrospective & Handover Notes — Pune Transit Pod
Meeting Date: 05 November 2026
Attendees: Parineeta Meshram, Siddhi Nanaware, Sonakshi Nazarkar

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
- Should offline ticket validation fallback to QR timestamp signatures or cached SQLite on conductor handheld terminals?"""

        src3_content = """# GitHub PR #104 Discussion — Deployment Schedule & Configuration
Repository: mahaminds/pune-mobility-engine

Comment by @parineeta-lead (07 Nov 2026, 14:22):
"All migration scripts for the Swargate corridor are ready. Project launch date is 15 December across all 40 smart bus stops."

Comment by @siddhi-owner (08 Nov 2026, 09:15):
"Please hold on the 15th date. Project launch date is 20 December due to PMC municipal election clearance protocols."

Comment by @zahur-reviewer (08 Nov 2026, 11:30):
"We will resolve this conflict in the Round 2 handover review desk before publishing." """

        cursor.executemany('''
        INSERT INTO sources (id, project_id, name, type, access_level, content, size_bytes, chunks_count, uploaded_by, uploaded_at, github_repo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', [
            ("src-arch-spec", proj_id, "PMC_BRTS_Architecture_Spec_v2.md", "markdown", "internal", src1_content, len(src1_content), 4, "Parineeta Meshram", "2026-10-28T14:30:00Z", None),
            ("src-sprint-retro", proj_id, "Sprint_24_Retro_DepartingNotes.txt", "txt", "internal", src2_content, len(src2_content), 4, "Parineeta Meshram", "2026-11-05T17:15:00Z", None),
            ("src-pr-104", proj_id, "GitHub_PR_104_Discussion.md", "github", "public", src3_content, len(src3_content), 2, "System (GitHub Sync)", "2026-11-08T12:00:00Z", "mahaminds/pune-mobility-engine")
        ])

        # Seed Claims with Verified Exact Quotes
        claims_data = [
            ("clm-1", proj_id, "src-arch-spec", "PMC_BRTS_Architecture_Spec_v2.md", "Decisions", "PostgreSQL with PostGIS Selected for Transit Routes", "The team chose PostgreSQL with PostGIS over MongoDB because geospatial route queries on Pune transit corridors require strict relational integrity and fast spatial bounding box indexing.", "Approved", 0.98, "We chose PostgreSQL with PostGIS over MongoDB because geospatial route queries on Pune transit corridors require strict relational integrity and fast spatial bounding box indexing.", "Section 2, Paragraph 1", "internal", "2026-10-28", "Sonakshi Nazarkar", "Mhd Zahur Rizvi", "Approved", "Verified against architecture spec. Essential for spatial transit indexing.", "2026-10-28T15:00:00Z", "2026-10-28T15:00:00Z"),
            ("clm-2", proj_id, "src-arch-spec", "PMC_BRTS_Architecture_Spec_v2.md", "Decisions", "Redis Cache for Real-Time GPS Telemetry Coordinates", "Redis cache was deployed for live GPS coordinates with a 15-second TTL to avoid database lock contention.", "Approved", 0.97, "Redis cache was deployed for live GPS coordinates with a 15-second TTL to avoid database lock contention.", "Section 2, Paragraph 2", "internal", "2026-10-28", "Parineeta Meshram", "Mhd Zahur Rizvi", "Approved", "Prevents database lock during high load.", "2026-10-28T15:05:00Z", "2026-10-28T15:05:00Z"),
            ("clm-3", proj_id, "src-arch-spec", "PMC_BRTS_Architecture_Spec_v2.md", "Decisions", "Razorpay Payment Gateway Selected for QR Commuter Ticketing", "Razorpay was selected as our primary payment gateway for generating QR commuter transit tickets.", "Approved", 0.96, "Razorpay was selected as our primary payment gateway for generating QR commuter transit tickets.", "Section 2, Paragraph 3", "internal", "2026-10-28", "Parineeta Meshram", "Mhd Zahur Rizvi", "Approved", "Direct UPI QR integration verified.", "2026-10-28T15:10:00Z", "2026-10-28T15:10:00Z"),
            ("clm-4", proj_id, "src-sprint-retro", "Sprint_24_Retro_DepartingNotes.txt", "Unfinished work", "Refund Webhook Stuck on Signature Validation", "Refund webhook check is currently stuck on payment gateway signature validation for dropped transactions.", "Pending Review", 0.95, "Refund webhook check is currently stuck on payment gateway signature validation for dropped transactions.", "Section: Unfinished Work, Line 2", "internal", "2026-11-05", "Sonakshi Nazarkar", None, None, None, "2026-11-05T17:30:00Z", "2026-11-05T17:30:00Z"),
            ("clm-5", proj_id, "src-sprint-retro", "Sprint_24_Retro_DepartingNotes.txt", "Unfinished work", "Fare Reconciliation PR #108 Lacks Automated Unit Tests", "PR #108 for fare reconciliation remains half-done and needs an automated unit test suite.", "Verified", 0.94, "PR #108 for fare reconciliation remains half-done and needs an automated unit test suite.", "Section: Unfinished Work, Line 3", "internal", "2026-11-05", "Sonakshi Nazarkar", None, None, None, "2026-11-05T17:32:00Z", "2026-11-05T17:32:00Z"),
            ("clm-6", proj_id, "src-sprint-retro", "Sprint_24_Retro_DepartingNotes.txt", "Recurring problems", "Intermittent GPS Packet Loss on Shivajinagar Campus Wi-Fi", "GPS telemetry packets intermittently drop on campus Wi-Fi at COEP Shivajinagar transit hub during peak evening hours (17:30 to 19:30).", "Verified", 0.93, "GPS telemetry packets intermittently drop on campus Wi-Fi at COEP Shivajinagar transit hub during peak evening hours (17:30 to 19:30).", "Section: Recurring Problems, Line 1", "internal", "2026-11-05", "Parineeta Meshram", None, None, None, "2026-11-05T17:35:00Z", "2026-11-05T17:35:00Z"),
            ("clm-7", proj_id, "src-sprint-retro", "Sprint_24_Retro_DepartingNotes.txt", "Risks", "MSRTC Vendor Contract Expiry on 31 December 2026", "MSRTC vendor contract renewal deadline is 31 December 2026; if not renewed, the telemetry API endpoint will terminate.", "Approved", 0.99, "MSRTC vendor contract renewal deadline is 31 December 2026; if not renewed, the telemetry API endpoint will terminate.", "Section: Risks and Blockers, Line 1", "internal", "2026-11-05", "Siddhi Nanaware", "Mhd Zahur Rizvi", "Approved", "Critical SLA notice communicated to municipal office.", "2026-11-05T17:40:00Z", "2026-11-05T17:40:00Z"),
            ("clm-8", proj_id, "src-arch-spec", "PMC_BRTS_Architecture_Spec_v2.md", "Dependencies", "MSRTC Telemetry Cloud Feed Dependency", "PMPML Bus GPS Telemetry API: Hosted on MSRTC central cloud servers. Depends on vendor API key and bearer token.", "Approved", 0.96, "PMPML Bus GPS Telemetry API: Hosted on MSRTC central cloud servers. Depends on vendor API key and bearer token.", "Section 4, Line 1", "internal", "2026-10-28", "Parineeta Meshram", "Mhd Zahur Rizvi", "Approved", "Vendor SLA attached.", "2026-10-28T15:20:00Z", "2026-10-28T15:20:00Z"),
            ("clm-9", proj_id, "src-pr-104", "GitHub_PR_104_Discussion.md", "Next actions", "Rollout Target Stated as 15 December by Lead Engineer", "All migration scripts for the Swargate corridor are ready. Project launch date is 15 December across all 40 smart bus stops.", "Conflicting", 0.91, "Project launch date is 15 December across all 40 smart bus stops.", "PR #104 Comment 1", "public", "2026-11-07", "Parineeta Meshram", None, None, None, "2026-11-07T14:25:00Z", "2026-11-07T14:25:00Z"),
            ("clm-10", proj_id, "src-pr-104", "GitHub_PR_104_Discussion.md", "Next actions", "Rollout Postponed to 20 December by PM for Election Clearance", "Please hold on the 15th date. Project launch date is 20 December due to PMC municipal election clearance protocols.", "Conflicting", 0.92, "Project launch date is 20 December due to PMC municipal election clearance protocols.", "PR #104 Comment 2", "public", "2026-11-08", "Siddhi Nanaware", None, None, None, "2026-11-08T09:20:00Z", "2026-11-08T09:20:00Z")
        ]
        cursor.executemany('''
        INSERT INTO claims (id, project_id, source_id, source_name, type, title, text, status, confidence, quote, source_location, access_level, date, assigned_owner, assigned_reviewer, reviewer_decision, reviewer_notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', claims_data)

        # Seed Tasks
        tasks_data = [
            ("tsk-1", proj_id, "Resolve Refund Webhook Signature Mismatch", "Fix dropped payment signature verification in PR #108 before exit", "Sonakshi Nazarkar", "Payment", "Pending", "High", "2026-11-18", now, now),
            ("tsk-2", proj_id, "Implement Redis GPS Retry Queue", "Buffer telemetry packets during Shivajinagar Wi-Fi dropouts", "Parineeta Meshram", "Telemetry", "In Progress", "Medium", "2026-11-20", now, now),
            ("tsk-3", proj_id, "Audit MSRTC Vendor Contract Terms", "Confirm API SLA and bearer token rotation with liaison desk", "Siddhi Nanaware", "Security", "Completed", "High", "2026-11-10", now, now),
            ("tsk-4", proj_id, "Conduct Swargate Station Display Acceptance Test", "Verify real-time bus arrivals on physical passenger display screens", "Sonakshi Nazarkar", "Display UI", "Pending", "Medium", "2026-11-25", now, now)
        ]
        cursor.executemany('''
        INSERT INTO tasks (id, project_id, title, description, assigned_to, category, status, priority, due_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', tasks_data)

        # Seed Decisions
        decisions_data = [
            ("dec-1", proj_id, "PostgreSQL with PostGIS Selected", "Geospatial queries require relational spatial index and polygon buffering", "PostgreSQL PostGIS", "MongoDB, MySQL Spatial", "Approved", "Parineeta Meshram", "2026-10-28"),
            ("dec-2", proj_id, "Redis Coordinate Cache with 15s TTL", "Avoids database lock contention for 1,200 concurrent bus GPS feeds", "Redis In-Memory Cache", "Memcached, Direct DB Writes", "Approved", "Parineeta Meshram", "2026-10-28"),
            ("dec-3", proj_id, "Razorpay UPI QR Commuter Ticketing", "Fastest consumer scan-and-pay latency across Pune transit stops", "Razorpay Standard Checkout", "Paytm QR, Cashfree", "Approved", "Siddhi Nanaware", "2026-10-28")
        ]
        cursor.executemany('''
        INSERT INTO decisions (id, project_id, title, rationale, chosen_option, alternatives_considered, status, decided_by, decided_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', decisions_data)

        # Seed Initial Voice Notes (DnyanPakshi Notes)
        voice_notes_data = [
            ("vn-1", proj_id, "usr-parineeta", "Refund Webhook Handoff Briefing", "01:45", "Parineeta: I left detailed debug logs in the terminal. The Razorpay webhook fails only when transaction amounts contain decimal paisa. Sonakshi should round up to the nearest integer.", "Key takeaway: Check decimal paisa rounding logic in line 44 of webhook_service.py", "payment, handoff, bugfix", now, now),
            ("vn-2", proj_id, "usr-sonakshi", "Station Display PWA Checklist", "00:52", "Sonakshi: Met with Swargate station manager. The display screens require WebSocket auto-reconnect if the optical fiber switch drops for more than 5 seconds.", "Implement exponential backoff reconnect for station frontend", "frontend, displays, swargate", now, now)
        ]
        cursor.executemany('''
        INSERT INTO voice_notes (id, project_id, user_id, title, audio_duration, transcript, notes, tags, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', voice_notes_data)

        # Seed Notifications (Smart Alerts)
        notifs_data = [
            ("notif-1", "usr-siddhi", proj_id, "New Claim Waiting for Sign-off", "Refund Webhook Stuck claim submitted for Review Centre verification.", "warning", 0, 1, now),
            ("notif-2", "usr-siddhi", proj_id, "Discrepancy Detected", "Launch Timeline conflict found between PR #104 and Sprint Retro.", "alert", 0, 1, now),
            ("notif-3", "usr-siddhi", proj_id, "Handover Dossier v1.0 Released", "Engineering Handover v1.0.0 published by Mhd Zahur Rizvi.", "success", 0, 0, now)
        ]
        cursor.executemany('''
        INSERT INTO notifications (id, user_id, project_id, title, message, type, is_read, is_urgent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', notifs_data)

        # Seed Handover v1.0
        plan = json.dumps([
            "Day 1: Setup local Docker with PostGIS extensions & verify database migrations",
            "Day 2: Pair with departing lead on Razorpay refund webhook signature validation",
            "Day 3: Review MSRTC telemetry contract renewal terms with Project Owner Siddhi Nanaware",
            "Day 4: Implement Redis queue retry buffer for Shivajinagar Wi-Fi dropouts",
            "Day 5: Verify staging corridor feeds and submit handover receipt acknowledgement"
        ])
        cursor.execute('''
        INSERT INTO handovers (id, project_id, version, title, status, published_by, published_at, readiness_score, total_approved_claims, summary, decisions_count, responsibilities_count, open_tasks_count, risks_count, first_days_action_plan)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            "ho-v1",
            proj_id,
            "v1.0.0",
            "Smart Pune Mobility Project — Engineering Handover Release v1.0",
            "published",
            "Mhd Zahur Rizvi (Reviewer)",
            "2026-11-10T16:00:00Z",
            85,
            6,
            "Formal handover dossier from departing lead Parineeta Meshram to incoming engineer Sonakshi Nazarkar. Contains verified architectural decisions, live dependencies, critical risk notices, and first-week onboarding agenda.",
            3,
            3,
            2,
            1,
            plan
        ))

        # Seed Acknowledgement
        cursor.execute('''
        INSERT INTO acknowledgements (id, handover_id, project_id, user_id, user_name, user_role, acknowledged_at, notes, comprehension_confirmed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            "ack-1",
            "ho-v1",
            proj_id,
            "usr-sonakshi",
            "Sonakshi Nazarkar",
            "Incoming Member",
            "2026-11-11T11:20:00Z",
            "Confirmed understanding of PostgreSQL routing architecture, MSRTC telemetry renewal risk, and transit display responsibilities.",
            1
        ))

        # Seed Activity & Audit Logs
        cursor.executemany('''
        INSERT INTO project_activity (id, project_id, actor_name, action, details, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', [
            ("act-1", proj_id, "Siddhi Nanaware", "Project Created", "Initialized Smart Pune Mobility Project", "2026-10-15T10:00:00Z"),
            ("act-2", proj_id, "Parineeta Meshram", "Document Uploaded", "Uploaded PMC_BRTS_Architecture_Spec_v2.md", "2026-10-28T14:30:00Z"),
            ("act-3", proj_id, "Mhd Zahur Rizvi", "Claim Approved", "Approved PostgreSQL with PostGIS decision", "2026-10-29T10:15:00Z"),
            ("act-4", proj_id, "Mhd Zahur Rizvi", "Handover Published", "Published Handover v1.0.0 after review gate check", "2026-11-10T16:00:00Z"),
            ("act-5", proj_id, "Sonakshi Nazarkar", "Handover Acknowledged", "Incoming member signed handover v1.0.0", "2026-11-11T11:20:00Z")
        ])

    conn.commit()

# Initialize upon module load
init_db()
