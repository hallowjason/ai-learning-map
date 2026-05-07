/**
 * Course content loader.
 *
 * In production: fetches the markdown from GitHub raw URL (instant updates on push).
 * In dev (no NEXT_PUBLIC_CONTENT_BASE_URL): falls back to bundled local copy.
 */

import { parseCourse } from './parseCourse';
import type { Practice } from './types';

const COURSE_FILENAME = '課程架構.md';

export async function loadCourse(): Promise<Practice[]> {
  const base = process.env.NEXT_PUBLIC_CONTENT_BASE_URL;
  let md: string;

  if (base) {
    const url = `${base.replace(/\/$/, '')}/${encodeURIComponent(COURSE_FILENAME)}`;
    const res = await fetch(url, { next: { revalidate: 300 } } as RequestInit);
    if (!res.ok) throw new Error(`Failed to fetch course markdown: ${res.status}`);
    md = await res.text();
  } else {
    // Local fallback for dev / when env var isn't set
    const res = await fetch('/' + COURSE_FILENAME);
    if (!res.ok) throw new Error('Local course markdown not found at /' + COURSE_FILENAME);
    md = await res.text();
  }

  return parseCourse(md);
}
