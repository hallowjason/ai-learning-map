import type { Zone, ZoneId } from './types';

export { ZONE_PAIR_IMAGES } from './types';

// Practice → Zone mapping (md original order)
export const ZONE_PRACTICES: Record<ZoneId, string[]> = {
  1: ['0', '1', '2'],   // Lesson 1 上半 — 建立信心
  2: ['3', '4'],        // Lesson 1 下半 — 建立習慣
  3: ['5', '6'],        // Lesson 2 上半 — 擴展能力
  4: ['7', '8'],        // Lesson 2 下半 — 個人化
};

// Cluster coords are normalized 0..1 within the zone's HALF of the paired image.
// One half = one viewport-width.
export const ZONES: Zone[] = [
  {
    id: 1,
    title: 'Lesson 1 上半',
    subtitle: '建立信心',
    practiceIds: ZONE_PRACTICES[1],
    pair: 'A',
    half: 'left',
    // yellow rapeseed meadow in front of cottage
    cluster: { x: 0.30, y: 0.62, w: 0.55, h: 0.22 },
  },
  {
    id: 2,
    title: 'Lesson 1 下半',
    subtitle: '建立習慣',
    practiceIds: ZONE_PRACTICES[2],
    pair: 'A',
    half: 'right',
    // open grassy slope along foreground path, clear of conifers
    cluster: { x: 0.18, y: 0.60, w: 0.55, h: 0.25 },
  },
  {
    id: 3,
    title: 'Lesson 2 上半',
    subtitle: '擴展能力',
    practiceIds: ZONE_PRACTICES[3],
    pair: 'B',
    half: 'left',
    // flat grass bank to the right of the creek/footbridge
    cluster: { x: 0.30, y: 0.60, w: 0.55, h: 0.25 },
  },
  {
    id: 4,
    title: 'Lesson 2 下半',
    subtitle: '個人化',
    practiceIds: ZONE_PRACTICES[4],
    pair: 'B',
    half: 'right',
    // open dirt trail at mountain base, below the zigzag path
    cluster: { x: 0.10, y: 0.65, w: 0.50, h: 0.22 },
  },
];

export function getZone(id: ZoneId): Zone {
  return ZONES[id - 1];
}

export function practiceIdToZone(practiceId: string): ZoneId {
  for (const zone of ZONES) {
    if (zone.practiceIds.includes(practiceId)) return zone.id;
  }
  return 1;
}

export const TOTAL_PRACTICES = ZONES.reduce((sum, z) => sum + z.practiceIds.length, 0);
