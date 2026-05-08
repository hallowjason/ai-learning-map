/**
 * Course content loader.
 *
 * In production: fetches the markdown from GitHub raw URL (instant updates on push).
 * In dev (no NEXT_PUBLIC_CONTENT_BASE_URL): falls back to bundled local copy.
 */

import { parseCourse } from './parseCourse';
import type { Practice } from './types';

const COURSE_FILENAME = '課程架構.md';
const ATTACHMENTS_DIR = '附件';
const IMAGE_EXT = /\.(?:png|jpe?g|gif|webp|svg)$/i;

/**
 * Convert Obsidian-flavored syntax in the source markdown to standard markdown.
 *
 *   ![[name.png]]   → ![name](<assetBase>/附件/name.png)   (inline image)
 *   [[name]]        → **「name」**                          (handout reference)
 *
 * `assetBase` should be the directory whose `附件/` subfolder hosts the images.
 * In production we point this at the GitHub raw root; in dev we fall back to
 * a relative path served by Next.js.
 */
export function transformObsidianSyntax(md: string, assetBase: string): string {
  const base = assetBase.replace(/\/$/, '');
  const dir = encodeURIComponent(ATTACHMENTS_DIR);

  let out = md.replace(/!\[\[([^\]|]+?)(?:\|[^\]]*)?\]\]/g, (_full, name: string) => {
    const trimmed = name.trim();
    if (!IMAGE_EXT.test(trimmed)) return _full;
    return `![${trimmed}](${base}/${dir}/${encodeURIComponent(trimmed)})`;
  });

  out = out.replace(/\[\[([^\]|]+?)(?:\|[^\]]*)?\]\]/g, (_full, name: string) => {
    return `**「${name.trim()}」**`;
  });

  return out;
}

export async function loadCourse(): Promise<Practice[]> {
  const base = process.env.NEXT_PUBLIC_CONTENT_BASE_URL;
  let md: string;
  let assetBase: string;

  if (base) {
    const root = base.replace(/\/$/, '');
    const url = `${root}/${encodeURIComponent(COURSE_FILENAME)}`;
    const res = await fetch(url, { next: { revalidate: 300 } } as RequestInit);
    if (!res.ok) throw new Error(`Failed to fetch course markdown: ${res.status}`);
    md = await res.text();
    assetBase = root;
  } else {
    // Local fallback for dev / when env var isn't set
    const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const res = await fetch(`${prefix}/${encodeURIComponent(COURSE_FILENAME)}`);
    if (!res.ok) throw new Error('Local course markdown not found at /' + COURSE_FILENAME);
    md = await res.text();
    assetBase = prefix;
  }

  return parseCourse(transformObsidianSyntax(md, assetBase));
}
