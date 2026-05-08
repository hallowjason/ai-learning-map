import type { Practice } from './types';
import { ZONES, practiceIdToZone } from './zones';

// Match a "練習 N: title" line — N can be number with optional letter (e.g. 4a, 4b)
// Tolerates: optional "###" heading prefix, optional space between 練習 and number,
// full-width or half-width colon, no trailing newline.
const PRACTICE_LINE = /^(?:#{1,6}\s+)?練習\s*([0-9]+[a-z]?)\s*[：:](.+)$/m;

// A horizontal rule (`---`) is the section divider in the source markdown.
// In the course md a section heading like "## Lesson 2 下半" always sits *after*
// such a divider, so cutting at the divider drops both from the practice body.
// Subheadings inside a practice (e.g. "#### 細節") are intentionally NOT treated
// as boundaries.
const HORIZONTAL_RULE = /^-{3,}\s*$/;

function isBoundary(line: string): boolean {
  return HORIZONTAL_RULE.test(line);
}

/**
 * Parse the course markdown into a list of practices.
 * Strategy:
 *   1. Find every line that starts a practice (matches PRACTICE_LINE)
 *   2. Each practice's body = text from the line after the heading until either
 *      the next practice OR a section boundary (---, ## heading), whichever comes first
 *   3. Trim leading/trailing whitespace, drop the heading line itself
 */
export function parseCourse(markdown: string): Practice[] {
  const lines = markdown.split('\n');
  type Hit = { line: number; id: string; title: string };
  const hits: Hit[] = [];

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(PRACTICE_LINE);
    if (m) hits.push({ line: i, id: m[1], title: m[2].trim() });
  }

  const practices: Practice[] = [];
  for (let i = 0; i < hits.length; i++) {
    const start = hits[i].line + 1; // skip the heading line itself
    const hardEnd = i + 1 < hits.length ? hits[i + 1].line : lines.length;

    // Walk forward; stop early at any section boundary
    let end = hardEnd;
    for (let j = start; j < hardEnd; j++) {
      if (isBoundary(lines[j])) {
        end = j;
        break;
      }
    }

    const body = lines.slice(start, end).join('\n').trim();
    practices.push({
      id: hits[i].id,
      title: hits[i].title,
      content: body,
      zone: practiceIdToZone(hits[i].id),
    });
  }

  return practices;
}

/**
 * Get practices for a specific zone, in the order defined by zones.ts
 * (ignores order in source markdown — ensures consistent UI ordering).
 */
export function getPracticesForZone(all: Practice[], zoneId: 1 | 2 | 3 | 4): Practice[] {
  const zone = ZONES[zoneId - 1];
  const byId = new Map(all.map((p) => [p.id, p]));
  return zone.practiceIds.map((id) => byId.get(id)).filter((p): p is Practice => !!p);
}
