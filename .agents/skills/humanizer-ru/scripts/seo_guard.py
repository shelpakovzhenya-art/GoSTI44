#!/usr/bin/env python3
"""Check that an SEO edit preserves coverage from a Markdown source."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


def words(text: str) -> list[str]:
    return re.findall(r"[\wёЁ-]+", text.lower(), flags=re.UNICODE)


def headings(text: str) -> list[str]:
    return [line.strip() for line in text.splitlines() if re.match(r"^#{1,3}\s+", line)]


def section_count(text: str, title: str) -> int:
    return sum(1 for line in text.splitlines() if line.strip().lower() == title.lower())


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("edited", type=Path)
    parser.add_argument("--keyword", required=True)
    args = parser.parse_args()

    source = args.source.read_text(encoding="utf-8")
    edited = args.edited.read_text(encoding="utf-8")
    errors: list[str] = []
    source_words = len(words(source))
    edited_words = len(words(edited))
    minimum = round(source_words * 0.95)
    if edited_words < minimum:
        errors.append(f"объём: {edited_words} слов, минимум {minimum}")
    if headings(source) != headings(edited):
        errors.append("заголовки H1-H3 изменены или переставлены")
    if source.count("|") and edited.count("|") < source.count("|"):
        errors.append("таблица удалена или сокращена")
    for title in ("## Часто задаваемые вопросы", "## Что делать дальше"):
        if section_count(source, title) and not section_count(edited, title):
            errors.append(f"потерян раздел: {title}")
    source_key = source.lower().count(args.keyword.lower())
    edited_key = edited.lower().count(args.keyword.lower())
    if source_key and edited_key < source_key:
        errors.append(f"ключ встречается {edited_key} раз, было {source_key}")
    if errors:
        for item in errors:
            print(f"ERROR: {item}")
        return 1
    print(f"SEO guard: clean ({edited_words}/{source_words} слов, ключ: {edited_key})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
