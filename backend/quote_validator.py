import re
from typing import Tuple, Optional

def normalize_whitespace(text: str) -> str:
    """Normalize irregular whitespaces, line breaks, and smart quotes."""
    if not text:
        return ""
    # Normalize quotes
    t = text.replace('“', '"').replace('”', '"').replace("‘", "'").replace("’", "'")
    # Replace multiple spaces/newlines with single space
    return re.sub(r'\s+', ' ', t).strip()

def validate_quote_against_source(quote: str, source_text: str) -> Tuple[bool, Optional[Tuple[int, int]], float]:
    """
    Validates if `quote` exists in `source_text`.
    Returns:
        (is_valid: bool, span: (start_idx, end_idx) or None, match_confidence: float)
    """
    if not quote or not source_text:
        return False, None, 0.0
    
    clean_quote = quote.strip()
    
    # 1. Exact verbatim match
    exact_idx = source_text.find(clean_quote)
    if exact_idx != -1:
        return True, (exact_idx, exact_idx + len(clean_quote)), 1.0

    # 2. Case-insensitive exact match
    lower_source = source_text.lower()
    lower_quote = clean_quote.lower()
    case_idx = lower_source.find(lower_quote)
    if case_idx != -1:
        return True, (case_idx, case_idx + len(clean_quote)), 0.98

    # 3. Normalized whitespace & smart quote match
    norm_source = normalize_whitespace(source_text)
    norm_quote = normalize_whitespace(clean_quote)
    
    if norm_quote in norm_source:
        # Locate approximate span in original text
        # Regex search with flexible whitespace
        words = [re.escape(w) for w in norm_quote.split()]
        if words:
            flex_pattern = re.compile(r'\s+'.join(words), re.IGNORECASE)
            match = flex_pattern.search(source_text)
            if match:
                return True, (match.start(), match.end()), 0.95
    
    # 4. If less than 60% of significant words match in a local window, it's NOT a quote
    return False, None, 0.0
