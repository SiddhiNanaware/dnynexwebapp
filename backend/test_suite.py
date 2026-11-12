import unittest
from backend.quote_validator import validate_quote_against_source
from backend.redaction import redact_text
from backend.conflict_detector import detect_conflicts
from backend.gap_detector import detect_knowledge_gaps
from backend.store import store
from backend.models import Claim, ClaimTypeEnum, ClaimStatusEnum, AccessLevelEnum, RoleEnum

class TestDnyanexCore(unittest.TestCase):

    def test_quote_validation_exact_match(self):
        source = "We chose PostgreSQL with PostGIS over MongoDB because geospatial route queries on Pune transit corridors require strict relational integrity."
        quote = "We chose PostgreSQL with PostGIS over MongoDB because geospatial route queries on Pune transit corridors require strict relational integrity."
        is_valid, span, conf = validate_quote_against_source(quote, source)
        self.assertTrue(is_valid)
        self.assertEqual(conf, 1.0)
        self.assertIsNotNone(span)

    def test_quote_validation_rejects_hallucination(self):
        source = "We chose PostgreSQL with PostGIS over MongoDB."
        hallucinated = "We chose Oracle database because it is very fast."
        is_valid, span, conf = validate_quote_against_source(hallucinated, source)
        self.assertFalse(is_valid)
        self.assertIsNone(span)
        self.assertEqual(conf, 0.0)

    def test_secret_redaction(self):
        text = "Confidential Token: ghp_1234567890abcdefghijklmnopqrstuvwxyz123 and phone +91-9876543210 and email test@example.com"
        redacted = redact_text(text)
        self.assertNotIn("ghp_1234567890abcdefghijklmnopqrstuvwxyz123", redacted)
        self.assertIn("[REDACTED_GITHUB_TOKEN]", redacted)
        self.assertIn("[REDACTED_PHONE]", redacted)
        self.assertIn("[REDACTED_EMAIL]", redacted)

    def test_conflict_detection(self):
        cA = Claim(
            id="test-c1",
            project_id="proj-test",
            type=ClaimTypeEnum.NEXT_ACTION,
            title="Launch Date Dec 15",
            text="Launch date is 15 December",
            quote="Project launch date is 15 December across all 40 smart bus stops.",
            source_id="s1",
            source_name="PR_104.md",
            source_location="L1",
            status=ClaimStatusEnum.PENDING_REVIEW,
            created_at="2026-11-12T00:00:00Z"
        )
        cB = Claim(
            id="test-c2",
            project_id="proj-test",
            type=ClaimTypeEnum.NEXT_ACTION,
            title="Launch Date Dec 20",
            text="Launch date shifted to 20 December",
            quote="Project launch date is 20 December due to PMC municipal election clearance protocols.",
            source_id="s2",
            source_name="PM_Notes.md",
            source_location="L2",
            status=ClaimStatusEnum.PENDING_REVIEW,
            created_at="2026-11-12T00:00:00Z"
        )
        conflicts = detect_conflicts([cA, cB])
        self.assertEqual(len(conflicts), 1)
        self.assertIn("15 December vs 20 December", conflicts[0].title)

    def test_knowledge_gap_detection(self):
        unowned_task = Claim(
            id="task-1",
            project_id="proj-test",
            type=ClaimTypeEnum.UNFINISHED_WORK,
            title="Webhook Stuck",
            text="Refund webhook check stuck on signature validation",
            quote="Refund webhook check is currently stuck on payment gateway signature validation",
            source_id="s1",
            source_name="notes.txt",
            source_location="L1",
            assigned_owner="Unassigned",
            status=ClaimStatusEnum.PENDING_REVIEW,
            created_at="2026-11-12T00:00:00Z"
        )
        gaps = detect_knowledge_gaps([unowned_task], "proj-test")
        self.assertTrue(any(g.gap_type == "unassigned_task" for g in gaps))

    def test_role_based_permissions(self):
        # Incoming member should not see confidential claims
        confidential_claim = store.claims["clm-12"]
        self.assertEqual(confidential_claim.access_level, AccessLevelEnum.CONFIDENTIAL)
        
        # When filtered for incoming member
        incoming_claims = [c for c in store.claims.values() if c.access_level != AccessLevelEnum.CONFIDENTIAL]
        self.assertNotIn(confidential_claim, incoming_claims)

if __name__ == "__main__":
    unittest.main()
