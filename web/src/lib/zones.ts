import type { Zone, ZoneId } from './types';

// Practice → Zone mapping (md original order)
export const ZONE_PRACTICES: Record<ZoneId, string[]> = {
  1: ['0', '1', '2'],         // Lesson 1 上半 — 建立信心
  2: ['3', '4a'],             // Lesson 1 下半 — 建立習慣
  3: ['7', '5', '6'],         // Lesson 2 上半 — 擴展能力
  4: ['8', '9', '4b'],        // Lesson 2 下半 — 個人化
};

export const ZONES: Zone[] = [
  {
    id: 1,
    title: 'Lesson 1 上半',
    subtitle: '建立信心',
    practiceIds: ZONE_PRACTICES[1],
    image: '/assets/zone1.png',
    // village zone — open meadow center-right
    cluster: { x: 0.45, y: 0.65, w: 0.45, h: 0.25 },
  },
  {
    id: 2,
    title: 'Lesson 1 下半',
    subtitle: '建立習慣',
    practiceIds: ZONE_PRACTICES[2],
    image: '/assets/zone2.png',
    // forest clearing — center
    cluster: { x: 0.30, y: 0.70, w: 0.55, h: 0.22 },
  },
  {
    id: 3,
    title: 'Lesson 2 上半',
    subtitle: '擴展能力',
    practiceIds: ZONE_PRACTICES[3],
    image: '/assets/zone3.png',
    // riverbank foreground — left half
    cluster: { x: 0.10, y: 0.70, w: 0.50, h: 0.22 },
  },
  {
    id: 4,
    title: 'Lesson 2 下半',
    subtitle: '個人化',
    practiceIds: ZONE_PRACTICES[4],
    image: '/assets/zone4.png',
    // plateau at mountain base — bottom-left
    cluster: { x: 0.05, y: 0.72, w: 0.50, h: 0.22 },
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
