// Prefix a public/ asset path with NEXT_PUBLIC_BASE_PATH so static-export
// builds served under a sub-path (e.g. GitHub Pages /ai-learning-map) resolve.
// Next.js's <Image unoptimized> + basePath does NOT automatically prefix `src`,
// so consumers of next/image must use this helper for /assets/* paths.
//
// `next.config.ts` already exposes `NEXT_PUBLIC_BASE_PATH` to client code via
// the `env` field, so the value is inlined at build time.

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  if (!path.startsWith("/")) {
    return `${BASE_PATH}/${path}`;
  }
  return `${BASE_PATH}${path}`;
}
