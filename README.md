# DNYANEX — ज्ञान जपा, टीमला पुढे न्या!
### Smart Innovation Hackathon 2026 • Round 2 Submission
**Team:** MahaMinds  
**Tagline:** *"Knowledge stays. Teams move forward."*

---

## 🏛️ 1. Product Identity & Core Purpose
**DNYANEX** converts scattered project knowledge into an evidence-backed, human-approved, and permission-aware knowledge handover.

When a team member leaves a project, repository files stay behind but critical reasoning evaporates:
- *Why was PostgreSQL with PostGIS chosen instead of MongoDB?*
- *Which refund webhook feature is stuck in progress and how should it be completed?*
- *Who is the real external contact when PMPML/MSRTC telemetry API keys expire?*
- *Why did two documents state different launch dates (Dec 15 vs Dec 20)?*

DNYANEX reconstructs this context from authorized sources (PDF, DOCX, Markdown, TXT, CSV, and GitHub PRs) and organizes it into an immutable **Ledger of Claims**. Every claim carries an **exact verbatim quotation** matched directly against source text chunks, flags disagreements side-by-side, and enforces a **mandatory human approval gate** before publishing.

---

## 🎨 2. Visual Identity & Design System
DNYANEX v3.0 features a modern, clean, premium SaaS aesthetic:

- **Midnight Aubergine** (`#292337`): Primary navigation headers, cards, and branding.
- **Soft Ivory** (`#F7F5F0`): Clean, accessible canvas and background surfaces.
- **Dusty Rose** (`#D58C96`): Warm accents, primary highlights, and mascot elements.
- **Sage Green** (`#91A997`): Verification indicators, approved claims, and confidence scores.
- **Muted Lavender** (`#B8AECF`): Secondary badges, voice notes, and category tags.
- **Graphite** (`#34343C`): Sharp, high-contrast readable typography.

### Subtle Pune Visual Identity
- Minimal architectural silhouettes of **Shaniwar Wada** and **Sinhagad Fort**.
- Subtle flowing curves inspired by the **Mula-Mutha river**.
- Cultural touchpoint: The single opening sentence **"ज्ञान जपा, टीमला पुढे न्या!"** welcoming users at the start.
- **English Default:** The entire application defaults to English with active language switching for **English | मराठी | हिंदी**.

---

## 🔐 3. Authentication & Hackathon Judge Quick Access
The first functional screen provides a secure authentication portal:
- Username & Password authentication with PBKDF2/SHA256 hashed password storage.
- Password visibility toggle (Show/Hide).
- Remember Me and Password Recovery flows.
- **1-Click Judge Demo Login Buttons** tailored for immediate evaluation:
  1. **Siddhi Nanaware** — *Project Owner* (Full administrative and scoping rights)
  2. **Mhd Zahur Rizvi** — *Reviewer / Team Leader* (Human approval gate signatory)
  3. **Sonakshi Nazarkar** — *Incoming Member* (Transferee, queries AI, acknowledges receipt)
  4. **Parineeta Meshram** — *Departing Member* (Submits briefings, voice notes, specs)

---

## 👥 4. Team Member Database
The database maintains initial records for Team MahaMinds:
1. **Siddhi Nanaware** — Project Owner
2. **Sonakshi Nazarkar** — Incoming Member
3. **Mhd Zahur Rizvi** — Reviewer / Team Leader
4. **Parineeta Meshram** — Departing Member

The Project Owner can view all members, edit profiles, reassign roles, update responsibilities, inspect contributions, and add new team members.

---

## 🐦 5. DnyanPakshi AI Knowledge Companion & Voice Notes
An intelligent knowledge assistant featuring 5 animated vector states:
1. **Idle** (Gentle eye blink & floating motion)
2. **Listening** (Active green audio wave ring)
3. **Thinking** (Pulsing amber analysis mode)
4. **Talking** (Subtle wing animation & Devanagari crest glow)
5. **Response** (Readout complete with interactive action pills)

### Voice Notes ("DnyanPakshi Notes")
- In-browser microphone audio recording studio.
- Live speech-to-text transcription via the Web Speech API (`webkitSpeechRecognition`).
- Full editing, tagging, and persistent SQLite database storage.
- Audio playback and deletion.

---

## 🔔 6. Interactive Notification Buzzer & Smart Audio
- Synthesized **Web Audio API** dual-tone harmonic chime and buzzer.
- Zero external MP3 downloads required; operates 100% offline.
- Triggered on urgent discrepancy alerts and mascot guidance.
- Mute toggle in top navbar and volume slider in Settings.
- Never autoplays sound loudly without user interaction.

---

## 📊 7. Advanced Analytics (6 Distinct Graph Types)
1. **Vertical Bar Chart:** Claims Ingestion by Subsystem (Telemetry, QR Ticketing, PostGIS, Webhooks, Municipal API).
2. **Line Graph Trend:** 14-Day Readiness & Continuity Velocity curve.
3. **Donut / Pie Chart:** Claim Verification Status Distribution (Approved, Verified, Pending, Conflicting).
4. **Area Chart:** Cumulative Evidence Ingestion Volume in Kilobytes.
5. **Horizontal Bar Chart:** Team Member Knowledge Concentration & Single Point of Failure (SPOF) risk detector.
6. **Stacked Bar Chart:** Domain Completeness across Core Decisions, Responsibilities, Tasks, and Risks.

---

## 📋 8. Intuitive 8-Section Dashboard
Designed for immediate clarity:
1. **Project Header & Continuity Index**
2. **Handover Readiness Score Progress**
3. **4 Prominent Quick Action Cards** (Create Project, Upload Document, Ask DnyanPakshi, View History)
4. **Immediate Next Priorities & Tasks**
5. **Pending Review Queue**
6. **Recent Verbatim Audit Activity**
7. **Single Point of Failure (SPOF) Watch**
8. **Help & Guided Tour Card**

---

## 🗄️ 9. Database Architecture (17 Tables)
Engineered in SQLite with Supabase PostgreSQL schema parity:
- `users`, `team_members`, `projects`, `project_members`, `sources`, `artifacts`
- `claims`, `evidence`, `tasks`, `decisions`, `project_activity`
- `handovers`, `acknowledgements`, `voice_notes`, `chat_history`, `notifications`, `audit_logs`

---

## 🚀 10. Running the Project Locally

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup
```bash
# In the dnyanex root directory
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn pydantic

# Run unit and integration tests
python -m unittest backend.test_suite backend.test_api

# Start FastAPI server (Port 8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

### Frontend Setup
```bash
# In the frontend directory
cd frontend
npm install

# Run TypeScript check
npm run build

# Start Vite development server (Port 5173)
npm run dev
```

---

## 🏆 Smart Innovation Hackathon 2026
**Team MahaMinds**  
*Siddhi Nanaware • Sonakshi Nazarkar • Mhd Zahur Rizvi • Parineeta Meshram*
