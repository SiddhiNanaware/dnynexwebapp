import re

# Redaction patterns for secrets, credentials, phone numbers, personal emails
API_KEY_PATTERNS = [
    (re.compile(r'(?i)(sk-[a-zA-Z0-9_-]{20,})'), r'[REDACTED_API_KEY]'),
    (re.compile(r'(?i)(ghp_[a-zA-Z0-9]{30,})'), r'[REDACTED_GITHUB_TOKEN]'),
    (re.compile(r'(?i)(bearer\s+[a-zA-Z0-9\._\-]{20,})'), r'Bearer [REDACTED_TOKEN]'),
    (re.compile(r'(?i)(api[_-]?key["\']?\s*[:=]\s*["\']?)([^"\'\s]{8,})'), r'\1[REDACTED_KEY]'),
    (re.compile(r'(?i)(password["\']?\s*[:=]\s*["\']?)([^"\'\s]{6,})'), r'\1[REDACTED_PASSWORD]'),
    (re.compile(r'(?i)(secret["\']?\s*[:=]\s*["\']?)([^"\'\s]{8,})'), r'\1[REDACTED_SECRET]'),
]

CONTACT_PATTERNS = [
    # Indian phone numbers (+91 or standard 10 digit)
    (re.compile(r'(\+?91[\-\s]?)?[6789]\d{9}'), r'[REDACTED_PHONE]'),
    # Email pattern
    (re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'), r'[REDACTED_EMAIL]'),
]

def redact_text(text: str, mask_personal_data: bool = True) -> str:
    """
    Redact secrets, tokens, passwords and optionally contact data.
    Ensures safe transmission to AI and reviewer displays.
    """
    if not text:
        return ""
    
    redacted = text
    for pattern, replacement in API_KEY_PATTERNS:
        redacted = pattern.sub(replacement, redacted)
    
    if mask_personal_data:
        for pattern, replacement in CONTACT_PATTERNS:
            redacted = pattern.sub(replacement, redacted)
            
    return redacted
