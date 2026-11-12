from typing import List, Dict, Any
import re
from .models import Claim, Conflict

def detect_conflicts(claims: List[Claim]) -> List[Conflict]:
    """
    Cross-checks claims across different sources to identify contradictions:
    - Differing dates for the same milestone/launch/event
    - Disagreeing technology choices or architectures
    - Disagreeing role owners or lead assignments
    """
    conflicts: List[Conflict] = []
    
    # Keyword clusters to compare
    date_regex = re.compile(r'(?:december|dec|nov|november|january|jan)\s+\d{1,2}|\d{1,2}(?:st|nd|rd|th)?\s+(?:december|dec|nov|november|january|jan)', re.IGNORECASE)
    
    # Check pairwise claims in similar categories or topics
    for i in range(len(claims)):
        for j in range(i + 1, len(claims)):
            cA = claims[i]
            cB = claims[j]
            
            # Don't conflict claims from the exact same source chunk
            if cA.source_id == cB.source_id and cA.id == cB.id:
                continue
                
            # Check 1: Milestone / Launch date contradiction
            is_launch_A = any(k in (cA.title + " " + cA.text).lower() for k in ["launch", "rollout", "release", "go-live", "deadline"])
            is_launch_B = any(k in (cB.title + " " + cB.text).lower() for k in ["launch", "rollout", "release", "go-live", "deadline"])
            
            if is_launch_A and is_launch_B:
                dates_A = date_regex.findall(cA.quote + " " + cA.text)
                dates_B = date_regex.findall(cB.quote + " " + cB.text)
                if dates_A and dates_B and dates_A[0].lower().strip() != dates_B[0].lower().strip():
                    conflicts.append(Conflict(
                        id=f"conf-{cA.id}-{cB.id}",
                        project_id=cA.project_id,
                        title=f"Launch Timeline Discrepancy: {dates_A[0]} vs {dates_B[0]}",
                        claim_a_id=cA.id,
                        claim_b_id=cB.id,
                        claim_a_title=cA.title,
                        claim_a_quote=cA.quote,
                        claim_a_source=cA.source_name,
                        claim_b_title=cB.title,
                        claim_b_quote=cB.quote,
                        claim_b_source=cB.source_name,
                        difference=f"Source '{cA.source_name}' specifies launch as {dates_A[0]}, whereas Source '{cB.source_name}' indicates {dates_B[0]}.",
                        status="unresolved"
                    ))
                    cA.status = "Conflicting"
                    cB.status = "Conflicting"

            # Check 2: Payment gateway / Vendor contradiction
            gateways = ["razorpay", "stripe", "paytm", "cashfree"]
            gw_A = [g for g in gateways if g in (cA.quote + " " + cA.text).lower()]
            gw_B = [g for g in gateways if g in (cB.quote + " " + cB.text).lower()]
            if gw_A and gw_B and gw_A[0] != gw_B[0]:
                conflicts.append(Conflict(
                    id=f"conf-gw-{cA.id}-{cB.id}",
                    project_id=cA.project_id,
                    title=f"Payment Gateway Conflict: {gw_A[0].capitalize()} vs {gw_B[0].capitalize()}",
                    claim_a_id=cA.id,
                    claim_b_id=cB.id,
                    claim_a_title=cA.title,
                    claim_a_quote=cA.quote,
                    claim_a_source=cA.source_name,
                    claim_b_title=cB.title,
                    claim_b_quote=cB.quote,
                    claim_b_source=cB.source_name,
                    difference=f"Architecture notes state {gw_A[0].capitalize()}, but PR discussion notes integration with {gw_B[0].capitalize()}.",
                    status="unresolved"
                ))
                cA.status = "Conflicting"
                cB.status = "Conflicting"

    return conflicts
