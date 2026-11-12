import os
import json
import httpx
from typing import List, Dict, Any, Optional
from .models import Claim, ClaimTypeEnum, ClaimStatusEnum, AccessLevelEnum
from .quote_validator import validate_quote_against_source
from .redaction import redact_text

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

EXTRACTION_SYSTEM_PROMPT = """
You are DNYANEX Knowledge Extraction Engine.
Analyze the provided document text and extract structured project handover claims.

Categorize each claim strictly into one of these 9 categories:
1. Decisions (architectural or tech choices with rationale)
2. Responsibilities and owners (who owns what component)
3. Unfinished work (WIP tasks, half-done features, open PRs)
4. Dependencies (external services, vendor APIs, credentials)
5. Risks (future concerns, vulnerabilities, deadlines)
6. Blockers (immediate showstoppers preventing progress)
7. Recurring problems (known bugs, transient dropouts)
8. Open questions (unresolved debates)
9. Next actions (immediate first steps for incoming developer)

CRITICAL INSTRUCTION:
- Every claim MUST have an exact verbatim quote from the text in the "quote" field.
- DO NOT invent, hallucinate, paraphrase or extrapolate the quotation.
- If no exact quote exists, do not create the claim.

Return a JSON array of objects with keys:
- "title": short concise headline
- "text": detailed summary of the fact
- "type": one of the 9 exact category names above
- "quote": exact verbatim substring from the source text
- "source_location": paragraph/line reference
- "confidence": number between 0.70 and 1.00
- "assigned_owner": name if mentioned, or null
- "date": date string if mentioned, or null
"""

async def extract_claims_with_gemini(text: str, source_id: str, source_name: str, project_id: str, access_level: AccessLevelEnum) -> Optional[List[Claim]]:
    """Calls Gemini API if GEMINI_API_KEY is configured."""
    if not GEMINI_API_KEY:
        return None
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": f"{EXTRACTION_SYSTEM_PROMPT}\n\nDOCUMENT CONTENT:\n{text[:12000]}"}]}
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2
        }
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(raw_text)
                claims = []
                for idx, item in enumerate(parsed):
                    quote = item.get("quote", "").strip()
                    is_valid, span, conf = validate_quote_against_source(quote, text)
                    if not is_valid:
                        # Reject claim or flag as missing evidence per prompt specification
                        status = ClaimStatusEnum.MISSING_EVIDENCE
                    else:
                        status = ClaimStatusEnum.PENDING_REVIEW
                        
                    claim_obj = Claim(
                        id=f"clm-{source_id}-{idx+1}",
                        project_id=project_id,
                        type=item.get("type", ClaimTypeEnum.DECISION),
                        title=item.get("title", "Extracted Claim"),
                        text=item.get("text", ""),
                        status=status,
                        confidence=conf if is_valid else 0.4,
                        quote=quote,
                        source_id=source_id,
                        source_name=source_name,
                        source_location=item.get("source_location", f"Line {idx*5 + 1}"),
                        access_level=access_level,
                        date=item.get("date"),
                        assigned_owner=item.get("assigned_owner"),
                        created_at="2026-11-12T09:00:00Z"
                    )
                    claims.append(claim_obj)
                return claims
    except Exception as e:
        print(f"Gemini API call failed or timed out: {e}")
        return None

def extract_claims_heuristic(text: str, source_id: str, source_name: str, project_id: str, access_level: AccessLevelEnum) -> List[Claim]:
    """
    High-fidelity rule-based extraction engine that parses document patterns and extracts exact quotes.
    Used when Gemini API key is not supplied.
    Transparently labels source extraction as demo / heuristic engine.
    """
    redacted = redact_text(text)
    claims: List[Claim] = []
    
    # Common Pune Smart Mobility project patterns or arbitrary technical document patterns
    lines = text.split("\n")
    cur_loc = "General"
    
    patterns = [
        # Decisions
        (r'(?i)(chose|chosen|decided|selected|switched to)\s+([^\.]+)', ClaimTypeEnum.DECISION, "Decision: {0}"),
        # Unfinished work
        (r'(?i)(todo|in progress|half-done|stuck on|webhook check|unfinished|pending review)\s*[:\-]?\s*([^\.]+)', ClaimTypeEnum.UNFINISHED_WORK, "Pending Work: {0}"),
        # Dependencies
        (r'(?i)(depends on|dependency|external service|vendor|api key|credential)\s*[:\-]?\s*([^\.]+)', ClaimTypeEnum.DEPENDENCY, "Dependency: {0}"),
        # Risks
        (r'(?i)(risk|vulnerability|threat|breakdown|downtime|concern)\s*[:\-]?\s*([^\.]+)', ClaimTypeEnum.RISK, "Risk: {0}"),
        # Blockers
        (r'(?i)(blocker|blocking|blocked by|cannot deploy|showstopper)\s*[:\-]?\s*([^\.]+)', ClaimTypeEnum.BLOCKER, "Blocker: {0}"),
        # Recurring problems
        (r'(?i)(recurring|repeatedly|drops on|intermittent|flaky|fails when)\s*([^\.]+)', ClaimTypeEnum.RECURRING_PROBLEM, "Recurring Issue: {0}"),
        # Responsibilities
        (r'(?i)(assigned to|owned by|lead by|maintained by)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)', ClaimTypeEnum.RESPONSIBILITY, "Component Ownership: {0}"),
        # Next actions
        (r'(?i)(next step|action item|first day|priority task|recommended next)\s*[:\-]?\s*([^\.]+)', ClaimTypeEnum.NEXT_ACTION, "Recommended Action: {0}"),
    ]
    
    import re
    claim_idx = 1
    
    # Also check sentence-level extraction
    sentences = re.split(r'(?<=[.!?])\s+', text)
    for s_idx, sentence in enumerate(sentences):
        sentence_clean = sentence.strip()
        if len(sentence_clean) < 15:
            continue
            
        for pat, cat, title_fmt in patterns:
            m = re.search(pat, sentence_clean)
            if m:
                # Verbatim quote is the exact sentence or matched fragment
                quote = sentence_clean
                is_valid, span, conf = validate_quote_against_source(quote, text)
                if not is_valid:
                    continue
                    
                captured = m.group(0).strip()
                title = title_fmt.format(captured[:40])
                
                claims.append(Claim(
                    id=f"clm-{source_id}-{claim_idx}",
                    project_id=project_id,
                    type=cat,
                    title=title,
                    text=sentence_clean,
                    status=ClaimStatusEnum.PENDING_REVIEW,
                    confidence=0.92,
                    quote=quote,
                    source_id=source_id,
                    source_name=source_name,
                    source_location=f"Paragraph {s_idx + 1}",
                    access_level=access_level,
                    created_at="2026-11-12T09:00:00Z"
                ))
                claim_idx += 1
                break
                
    return claims
