from typing import List
from .models import Claim, KnowledgeGap, ClaimTypeEnum

def detect_knowledge_gaps(claims: List[Claim], project_id: str) -> List[KnowledgeGap]:
    """
    Identifies missing expected information that has not been documented:
    - Unfinished tasks without an assigned owner
    - External dependencies without a documented contact
    - Unresolved project decisions or open questions
    - Recurring problems without documented remediation
    """
    gaps: List[KnowledgeGap] = []
    
    # 1. Check unfinished tasks without clear owner
    unfinished = [c for c in claims if c.type == ClaimTypeEnum.UNFINISHED_WORK]
    for task in unfinished:
        if not task.assigned_owner or task.assigned_owner.lower() in ["unassigned", "unknown", "none", ""]:
            gaps.append(KnowledgeGap(
                id=f"gap-unowned-{task.id}",
                project_id=project_id,
                gap_type="unassigned_task",
                title=f"Unfinished Task Lacks Owner: {task.title}",
                description=f"Task '{task.title}' was identified from '{task.source_name}', but no responsible team member is assigned.",
                severity="high",
                status="open",
                suggested_action="Assign a replacement owner from the incoming engineering team before leaver departs."
            ))

    # 2. Check dependencies without clear contact
    dependencies = [c for c in claims if c.type == ClaimTypeEnum.DEPENDENCY]
    for dep in dependencies:
        text_lower = (dep.text + " " + dep.quote).lower()
        if not any(k in text_lower for k in ["contact", "@", "poc", "phone", "slack", "lead", "person"]):
            gaps.append(KnowledgeGap(
                id=f"gap-dep-{dep.id}",
                project_id=project_id,
                gap_type="missing_contact",
                title=f"External Dependency Without Contact POC: {dep.title}",
                description=f"Dependency '{dep.title}' is noted, but no vendor contact email or escalation phone is documented.",
                severity="critical",
                status="open",
                suggested_action="Obtain vendor account rep or technical POC contact details and credentials before leaver departure."
            ))

    # 3. Check recurring problems without solutions
    recurring = [c for c in claims if c.type == ClaimTypeEnum.RECURRING_PROBLEM]
    for prob in recurring:
        text_lower = (prob.text + " " + prob.quote).lower()
        if not any(k in text_lower for k in ["fix", "workaround", "resolved by", "patch", "solution", "remedy"]):
            gaps.append(KnowledgeGap(
                id=f"gap-prob-{prob.id}",
                project_id=project_id,
                gap_type="repeated_bug",
                title=f"Recurring Failure Without Documented Workaround: {prob.title}",
                description=f"Problem '{prob.title}' occurs repeatedly in telemetry/production, but the leaver has not documented recovery steps.",
                severity="medium",
                status="open",
                suggested_action="Interview departing engineer for incident runbook / manual reboot instructions."
            ))

    # 4. Check open questions
    questions = [c for c in claims if c.type == ClaimTypeEnum.OPEN_QUESTION]
    for q in questions:
        gaps.append(KnowledgeGap(
            id=f"gap-q-{q.id}",
            project_id=project_id,
            gap_type="unresolved_decision",
            title=f"Unresolved Question: {q.title}",
            description=f"Question '{q.text}' remains unanswered in the project archive.",
            severity="medium",
            status="open",
            suggested_action="Reviewer or Tech Lead must make an architectural ruling."
        ))

    return gaps
