import argparse
from datetime import datetime
import json
import re
import sys
from typing import Any, Dict, List, Optional
import requests

ROOT = "https://ensembledata.com/apis"
INSTAGRAM_ENDPOINT = "/instagram/user/posts"
TIKTOK_ENDPOINT = "/tt/user/posts"

DEFAULT_TOKEN = "5f6K4GBvvLwvSViO"
DEFAULT_IG_USER_ID = "6934209395"
DEFAULT_TIKTOK_USERNAME = "uj_university"

DEFAULT_SUPABASE_URL = "https://yfzdfzpvlsguacjffipw.supabase.co"
DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmemRmenB2bHNndWFjamZmaXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMDU1NzgsImV4cCI6MjEwNzU4MTU3OH0.aUq_7Wdp-l_cyxpznl-m3GvwAxM4uVajbX5VYgiRU9U"
DEFAULT_SUPABASE_TABLE = "campus_events"

# Campus keywords mapping
CAMPUS_KEYWORDS = {
    "APK": ["kingsway", "apk", "auckland park kingsway", "rossmore", "arts centre"],
    "APB": ["bunting", "apb", "auckland park bunting", "fada", "aw muller stadium", "bunting theatre"],
    "JBS": ["jbs", "johannesburg business school"],
    "SWC": ["swc", "soweto campus", "soweto"],
    "DFC": ["dfc", "doornfontein campus", "doornfontein"],
}

CAMPUS_FULL_NAMES = {
    "APK": "UJ Auckland Park Kingsway Campus, Kingsway Avenue, Rossmore, Johannesburg",
    "APB": "UJ Auckland Park Bunting Road Campus, Bunting Road, Auckland Park, Johannesburg",
    "JBS": "Johannesburg Business School, 69 Kingsway Avenue, Auckland Park, Johannesburg",
    "SWC": "UJ Soweto Campus, Chris Hani Road, Soweto, Johannesburg",
    "DFC": "UJ Doornfontein Campus, Siemert Road, Doornfontein, Johannesburg",
}

# Regex patterns for free/paid entry
FREE_PATTERNS = [
    re.compile(r"\br\s?0(?:[.,]00)?\b", re.I),
    re.compile(r"\bfree\s+(?:entry|event|admission|ticket|entrance|access)\b", re.I),
    re.compile(r"\badmission\s+(?:is\s+)?free\b", re.I),
    re.compile(r"\bentry\s+is\s+free\b", re.I),
    re.compile(r"\bno\s+charge\b", re.I),
    re.compile(r"\bfree\b", re.I),
]

PAID_PATTERNS = [
    re.compile(r"\br\s?[1-9]\d*(?:[.,]\d{2})?\b", re.I),
    re.compile(r"\btickets?\s+(?:on|via|at)\b", re.I),
    re.compile(r"\bquicket\b", re.I),
    re.compile(r"\bentry\s+fee\b", re.I),
    re.compile(r"\bticket\s+price\b", re.I),
    re.compile(r"\bbuy\s+tickets?\b", re.I),
]

CATEGORY_KEYWORDS = {
    "Culture": ["art", "theatre", "music", "choir", "dance", "exhibition", "creative", "fada", "culture", "showcase"],
    "Sport": ["run", "race", "marathon", "football", "rugby", "cricket", "basketball", "sport", "stadium", "tournament"],
    "Careers": ["career", "cv", "resume", "clinic", "interview", "hiring", "internship", "job", "expo", "work"],
    "Academic": ["lecture", "symposium", "conference", "research", "faculty", "seminar", "workshop", "webinar"],
    "Open Day": ["open day", "campus tour", "orientation", "prospective"],
}


def detect_campus(text: str) -> str:
    """Identifies campus (APK, APB, JBS, SWC, DFC) from caption keywords."""
    text_lower = text.lower()
    for campus, keywords in CAMPUS_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            return campus
    return "APK"  # Default fallback


def detect_free(text: str) -> bool:
    """Determines whether the event is free or paid."""
    if any(p.search(text) for p in FREE_PATTERNS):
        return True
    if any(p.search(text) for p in PAID_PATTERNS):
        return False
    return True  # Default to free if no price signal is given


def detect_time(text: str) -> str:
    """Extracts start time (e.g. '18:00', '14h30', '10am') from text."""
    # Pattern: 14:00, 09:30
    match = re.search(r"\b([01]?\d|2[0-3])[:.]([0-5]\d)\b", text)
    if match:
        return f"{int(match.group(1)):02d}:{match.group(2)}"
    # Pattern: 14h00, 9h30
    match = re.search(r"\b([01]?\d|2[0-3])\s*h\s*([0-5]\d)?\b", text, re.I)
    if match:
        mins = match.group(2) or "00"
        return f"{int(match.group(1)):02d}:{mins}"
    # Pattern: 2pm, 10am
    match = re.search(r"\b([1-9]|1[0-2])\s*(am|pm)\b", text, re.I)
    if match:
        hr = int(match.group(1))
        meridiem = match.group(2).lower()
        if meridiem == "pm" and hr < 12:
            hr += 12
        elif meridiem == "am" and hr == 12:
            hr = 0
        return f"{hr:02d}:00"
    return "12:00"  # Default midday


def detect_date(text: str, fallback_timestamp: Optional[int] = None) -> str:
    """Extracts date (ISO format YYYY-MM-DD) from text or post timestamp."""
    month_map = {
        "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
        "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12,
        "january": 1, "february": 2, "march": 3, "april": 4, "june": 6,
        "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12,
    }
    months_regex = "|".join(month_map.keys())
    # Pattern: "26 Sep", "26 September", "26 September 2026"
    match = re.search(rf"\b(\d{{1,2}})\s+({months_regex})(?:\s+(\d{{4}}))?\b", text, re.I)
    if match:
        day = int(match.group(1))
        month = month_map[match.group(2).lower()]
        year = int(match.group(3)) if match.group(3) else datetime.now().year
        return f"{year:04d}-{month:02d}-{day:02d}"

    # Pattern: "Sep 26", "October 14, 2026"
    match = re.search(rf"\b({months_regex})\s+(\d{{1,2}})(?:,? +(\d{{4}}))?\b", text, re.I)
    if match:
        month = month_map[match.group(1).lower()]
        day = int(match.group(2))
        year = int(match.group(3)) if match.group(3) else datetime.now().year
        return f"{year:04d}-{month:02d}-{day:02d}"

    if fallback_timestamp:
        return datetime.fromtimestamp(fallback_timestamp).strftime("%Y-%m-%d")

    return datetime.now().strftime("%Y-%m-%d")


def detect_category(text: str) -> str:
    """Categorizes the event."""
    text_lower = text.lower()
    for cat, kws in CATEGORY_KEYWORDS.items():
        if any(kw in text_lower for kw in kws):
            return cat
    return "Culture"


def detect_venue(text: str, campus: str) -> str:
    """Extracts venue/room or combines with campus location."""
    venue_matches = re.findall(
        r"\b(?:at|venue|location|room|auditorium|theatre|hall|complex|centre|gallery)\b[:\s]+([^.,\n]+)",
        text,
        re.I,
    )
    campus_full = CAMPUS_FULL_NAMES.get(campus, CAMPUS_FULL_NAMES["APK"])
    if venue_matches:
        specific = venue_matches[0].strip().title()
        if len(specific) > 3:
            return f"{specific}, {campus_full}"
    return campus_full


def isolate_campus_event(
    caption: str,
    source: str,
    url: str,
    timestamp: Optional[int] = None,
) -> Dict[str, Any]:
    """
    Isolates all required event information from a social post:
      - title
      - source
      - location (venue)
      - campus (APK, APB, JBS, SWC, DFC)
      - date (ISO YYYY-MM-DD)
      - time (HH:MM)
      - free (boolean: True or False)
      - url (direct post link)
      - category
      - status ('Verified')
      - priceCheckedOn (current ISO date)
      - attendees (0)
    """
    clean_text = " ".join(caption.split())

    # Title: Extract first headline sentence cleanly
    first_sentence = re.split(r"[.!?\n]", clean_text)[0].strip()
    if len(first_sentence) > 80:
        title = first_sentence[:80].rsplit(" ", 1)[0]
    else:
        title = first_sentence or "Campus Event"

    campus = detect_campus(clean_text)
    venue = detect_venue(clean_text, campus)
    date_str = detect_date(clean_text, timestamp)
    time_str = detect_time(clean_text)
    is_free = detect_free(clean_text)
    category = detect_category(clean_text)

    return {
        "title": title,
        "source": source,
        "location": venue,
        "campus": campus,
        "date": date_str,
        "time": time_str,
        "status": "Verified",
        "category": category,
        "free": is_free,
        "priceCheckedOn": datetime.now().strftime("%Y-%m-%d"),
        "attendees": 0,
        "url": url,
    }


# Real Instagram shortcodes are 9-12 alphanumeric/hyphen/underscore characters.
# This guards against test codes (e.g. 'C_TEST_IG01') producing broken /p/ URLs.
_IG_CODE_RE = re.compile(r'^[A-Za-z0-9_-]{9,12}$')


def parse_instagram_raw(raw_data: Any, handle: str = "@uj_university") -> List[Dict[str, Any]]:
    """Parses raw EnsembleData Instagram JSON and extracts CampusEvents."""
    events = []
    posts = []
    if isinstance(raw_data, dict):
        posts = raw_data.get("data", {}).get("posts", []) or raw_data.get("posts", [])
    elif isinstance(raw_data, list):
        posts = raw_data

    for item in posts:
        caption = item.get("caption", {}).get("text", "") if isinstance(item.get("caption"), dict) else ""
        code = item.get("code") or item.get("id")
        taken_at = item.get("taken_at")
        if not code or not caption:
            continue

        # Skip any code that doesn't look like a real Instagram shortcode.
        # Real codes: 9-12 chars, only letters, digits, hyphens, underscores.
        if not _IG_CODE_RE.match(str(code)):
            print(f"[Instagram] Skipping post with invalid shortcode: '{code}' — would produce a broken URL.")
            continue

        url = f"https://www.instagram.com/p/{code}/"
        source = f"Instagram, {handle}"
        event = isolate_campus_event(caption, source, url, taken_at)
        events.append(event)

    return events


def parse_tiktok_raw(raw_data: Any, username: str = "uj_university") -> List[Dict[str, Any]]:
    """Parses raw EnsembleData TikTok JSON and extracts CampusEvents."""
    events = []
    posts = []
    if isinstance(raw_data, dict):
        data_block = raw_data.get("data", {})
        if isinstance(data_block, dict):
            posts = data_block.get("aweme_list", [])
        elif isinstance(data_block, list):
            posts = data_block
    elif isinstance(raw_data, list):
        posts = raw_data

    for item in posts:
        caption = item.get("desc", "")
        aweme_id = item.get("aweme_id") or item.get("id")
        created_time = item.get("create_time")
        if not aweme_id or not caption:
            continue

        url = f"https://www.tiktok.com/@{username.lstrip('@')}/video/{aweme_id}"
        source = f"TikTok, @{username.lstrip('@')}"
        event = isolate_campus_event(caption, source, url, created_time)
        events.append(event)

    return events


def _handle_response(response: requests.Response, platform_name: str, output_filename: str):
    """Processes, logs, and persists API responses."""
    print(f"[{platform_name}] HTTP Status: {response.status_code}")

    try:
        data = response.json()
    except Exception:
        data = {"raw_text": response.text}

    if response.status_code == 200:
        with open(output_filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"[{platform_name}] Raw posts saved to '{output_filename}'")
        return data

    if response.status_code == 495 or "limit reached" in str(data).lower():
        print(f"[{platform_name} Notice]: Maximum daily request quota reached on EnsembleData.")
        print("Note: Free-tier tokens have a daily quota. When the limit resets, live posts will be parsed.\n")
    else:
        print(f"[{platform_name} Error Response]: {data}\n")

    return data


def fetch_instagram_posts(
    user_id: str = DEFAULT_IG_USER_ID,
    token: str = DEFAULT_TOKEN,
    depth: int = 1,
    root: str = ROOT,
    endpoint: str = INSTAGRAM_ENDPOINT,
):
    """Fetches Instagram user posts via EnsembleData API."""
    url = f"{root.rstrip('/')}{endpoint}"
    params = {"user_id": user_id, "token": token, "depth": depth}

    print("=" * 60)
    print(f"Fetching Instagram Posts (User ID: {user_id})")
    print("=" * 60)

    try:
        response = requests.get(url, params=params, timeout=30)
    except requests.RequestException as exc:
        print(f"[Instagram] Network error: {exc}", file=sys.stderr)
        return None

    return _handle_response(response, "Instagram", "instagram_posts.json")


def fetch_tiktok_posts(
    username: str = DEFAULT_TIKTOK_USERNAME,
    token: str = DEFAULT_TOKEN,
    depth: int = 1,
    root: str = ROOT,
    endpoint: str = TIKTOK_ENDPOINT,
):
    """Fetches TikTok user posts/videos via EnsembleData API."""
    url = f"{root.rstrip('/')}{endpoint}"
    params = {
        "username": username.lstrip("@"),
        "token": token,
        "depth": depth,
        "start_cursor": 0,
        "new_version": False,
        "download_video": False,
    }

    print("=" * 60)
    print(f"Fetching TikTok Posts (@{username.lstrip('@')})")
    print("=" * 60)

    try:
        response = requests.get(url, params=params, timeout=30)
    except requests.RequestException as exc:
        print(f"[TikTok] Network error: {exc}", file=sys.stderr)
        return None

    return _handle_response(response, "TikTok", "tiktok_posts.json")


def sync_to_campus_events(
    new_events: List[Dict[str, Any]],
    file_path: str = "src/lib/campus-events.ts",
) -> int:
    """
    Directly syncs isolated events into src/lib/campus-events.ts under socialEventEntries.
    Deduplicates by event['url'].
    Returns count of newly added events.
    """
    import os
    if not new_events:
        return 0

    target = file_path
    if not os.path.exists(target):
        alt = os.path.join(os.path.dirname(__file__), file_path)
        if os.path.exists(alt):
            target = alt

    try:
        with open(target, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as exc:
        print(f"[Sync Warning] Could not open {target}: {exc}")
        return 0

    pattern = re.compile(
        r"(const\s+socialEventEntries:\s*CampusEvent\[\]\s*=\s*\[)([\s\S]*?)(\];)",
        re.MULTILINE,
    )
    match = pattern.search(content)
    if not match:
        print(f"[Sync Warning] 'const socialEventEntries: CampusEvent[] = [...]' not found in {target}")
        return 0

    existing_urls = set(re.findall(r'url:\s*"([^"]+)"', match.group(2)))
    to_add = [e for e in new_events if e.get("url") and e["url"] not in existing_urls]

    if not to_add:
        print(f"[Sync] All {len(new_events)} events already exist in {target}. No duplicates added.")
        return 0

    ts_entries = []
    for event in to_add:
        entry = (
            "  {\n"
            f'    title: {json.dumps(event["title"])},\n'
            f'    source: {json.dumps(event["source"])},\n'
            f'    location: {json.dumps(event["location"])},\n'
            f'    campus: {json.dumps(event["campus"])},\n'
            f'    date: {json.dumps(event["date"])},\n'
            f'    time: {json.dumps(event["time"])},\n'
            f'    status: {json.dumps(event.get("status", "Verified"))},\n'
            f'    category: {json.dumps(event.get("category", "Culture"))},\n'
            f'    free: {"true" if event.get("free") else "false"},\n'
            f'    priceCheckedOn: {json.dumps(event.get("priceCheckedOn", datetime.now().strftime("%Y-%m-%d")))},\n'
            f'    attendees: {event.get("attendees", 0)},\n'
            f'    url: {json.dumps(event["url"])},\n'
            "  },"
        )
        ts_entries.append(entry)

    existing_block = match.group(2).rstrip()
    if existing_block.strip():
        new_block = existing_block + "\n" + "\n".join(ts_entries) + "\n"
    else:
        new_block = "\n" + "\n".join(ts_entries) + "\n"

    new_content = content[:match.start()] + match.group(1) + new_block + match.group(3) + content[match.end():]

    with open(target, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"\n[Sync Complete] Added {len(to_add)} events directly into {target}!")
    print("These events are now live in the website's campus index, search, and AI assistant.")
    return len(to_add)


def save_to_supabase(
    events: List[Dict[str, Any]],
    supabase_url: str = DEFAULT_SUPABASE_URL,
    supabase_key: str = DEFAULT_SUPABASE_KEY,
    table_name: str = DEFAULT_SUPABASE_TABLE,
) -> bool:
    """
    Saves isolated events to Supabase via its PostgREST REST API.
    Uses 'Prefer: resolution=merge-duplicates' so duplicate URLs are updated without error.
    """
    if not events:
        return False

    if not supabase_key:
        print("[Supabase Notice] No API key provided. Skipping Supabase upload.")
        print("Tip: Provide --supabase-key '<YOUR_KEY>' to sync events to Supabase.\n")
        return False

    endpoint = f"{supabase_url.rstrip('/')}/rest/v1/{table_name}?on_conflict=url"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }

    rows = []
    for e in events:
        rows.append({
            "title": e["title"],
            "source": e["source"],
            "location": e["location"],
            "campus": e["campus"],
            "date": e["date"],
            "time": e["time"],
            "status": e.get("status", "Verified"),
            "category": e.get("category", "Culture"),
            "free": e.get("free", True),
            "price_checked_on": e.get("priceCheckedOn", datetime.now().strftime("%Y-%m-%d")),
            "attendees": e.get("attendees", 0),
            "url": e["url"],
        })

    try:
        response = requests.post(endpoint, json=rows, headers=headers, timeout=15)
        if response.status_code in (200, 201):
            print(f"[Supabase Success] Successfully synced {len(rows)} events to '{table_name}' table!")
            return True
        else:
            print(f"[Supabase Error {response.status_code}]: {response.text}")
            return False
    except Exception as exc:
        print(f"[Supabase Network Error]: {exc}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Scrape and isolate campus event info from Instagram and TikTok via EnsembleData"
    )
    parser.add_argument(
        "--platform",
        choices=["instagram", "tiktok", "all"],
        default="all",
        help="Which platform to fetch: 'instagram', 'tiktok', or 'all' (default: all)",
    )
    parser.add_argument("--token", default=DEFAULT_TOKEN, help="EnsembleData API token")
    parser.add_argument("--ig-user-id", default=DEFAULT_IG_USER_ID, help="Target Instagram user ID")
    parser.add_argument("--tt-username", default=DEFAULT_TIKTOK_USERNAME, help="Target TikTok username")
    parser.add_argument("--depth", type=int, default=1, help="Crawl depth (default: 1)")
    parser.add_argument(
        "--test-extraction",
        action="store_true",
        help="Run extraction test on sample Instagram and TikTok captions to demonstrate isolation",
    )
    parser.add_argument(
        "--no-sync",
        action="store_true",
        help="Skip syncing events to src/lib/campus-events.ts",
    )
    parser.add_argument(
        "--supabase-url",
        default=DEFAULT_SUPABASE_URL,
        help="Supabase project URL (default: %(default)s)",
    )
    parser.add_argument(
        "--supabase-key",
        default=DEFAULT_SUPABASE_KEY,
        help="Supabase anon or service-role API key",
    )
    parser.add_argument(
        "--supabase-table",
        default=DEFAULT_SUPABASE_TABLE,
        help="Supabase table name (default: %(default)s)",
    )

    args = parser.parse_args()


    isolated_events: List[Dict[str, Any]] = []

    # If user wants to see the extractor in action immediately on sample posts:
    if args.test_extraction:
        print("\n--- Running Information Extraction Demonstration ---")
        sample_ig = {
            "data": {
                "posts": [
                    {
                        "code": "C_TEST_IG01",
                        "taken_at": 1728900000,
                        "caption": {
                            "text": "Join us for the UJ Annual Careers Fair 2026! Venue: Library Auditorium, Kingsway Campus (APK). Date: 24 October 2026 at 10:00. Free entry for all students! No tickets required."
                        },
                    },
                    {
                        "code": "C_TEST_IG02",
                        "taken_at": 1728910000,
                        "caption": {
                            "text": "FADA Creative Design Showcase at Bunting Theatre, APB. Friday 30 Oct, 18h00. Tickets R50 via Quicket."
                        },
                    },
                ]
            }
        }
        sample_tt = {
            "data": {
                "aweme_list": [
                    {
                        "aweme_id": "7198273918237192",
                        "create_time": 1728920000,
                        "desc": "Are you ready for the inter-campus Derby at AW Muller Stadium, APB? Kickoff at 15:00 on 14 Nov. Free admission!",
                    }
                ]
            }
        }
        isolated_events.extend(parse_instagram_raw(sample_ig, "@uj_careerservices"))
        isolated_events.extend(parse_tiktok_raw(sample_tt, "uj_sport"))

        output_file = "isolated_campus_events.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(isolated_events, f, indent=2, ensure_ascii=False)

        print(f"\n[Extraction Completed] Successfully isolated {len(isolated_events)} events!")
        print(f"Saved to '{output_file}':\n")
        print(json.dumps(isolated_events, indent=2))

        if not args.no_sync:
            sync_to_campus_events(isolated_events)
        save_to_supabase(isolated_events, args.supabase_url, args.supabase_key, args.supabase_table)
        return

    # Real fetch flow
    ig_raw = None
    tt_raw = None

    if args.platform in ("instagram", "all"):
        ig_raw = fetch_instagram_posts(user_id=args.ig_user_id, token=args.token, depth=args.depth)
        if ig_raw and isinstance(ig_raw, dict) and "detail" not in ig_raw:
            events = parse_instagram_raw(ig_raw)
            isolated_events.extend(events)

    if args.platform in ("tiktok", "all"):
        tt_raw = fetch_tiktok_posts(username=args.tt_username, token=args.token, depth=args.depth)
        if tt_raw and isinstance(tt_raw, dict) and "detail" not in tt_raw:
            events = parse_tiktok_raw(tt_raw, args.tt_username)
            isolated_events.extend(events)

    if isolated_events:
        output_file = "isolated_campus_events.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(isolated_events, f, indent=2, ensure_ascii=False)
        print(f"\n[Success] Isolated {len(isolated_events)} events into '{output_file}'!")

        if not args.no_sync:
            sync_to_campus_events(isolated_events)
        save_to_supabase(isolated_events, args.supabase_url, args.supabase_key, args.supabase_table)


if __name__ == "__main__":
    main()


