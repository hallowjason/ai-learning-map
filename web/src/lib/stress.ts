/**
 * Stress-test fake user generator (URL `?stress=N`).
 *
 * Synthesises N plausible Taiwanese names distributed across the 4 zones with
 * a workshop-realistic skew (more in early zones), so we can preview density
 * before the real workshop. The current logged-in `myName` is always included
 * (and never duplicated) so the user can still see themselves.
 */

import type { UserRow } from './types';

const SURNAMES = [
  '王', '李', '陳', '張', '劉', '楊', '黃', '吳', '周', '徐',
  '孫', '胡', '朱', '高', '林', '何', '郭', '馬', '羅', '梁',
  '宋', '謝', '韓', '唐', '馮', '董', '蕭', '程', '曹', '袁',
];

const GIVEN_NAMES = [
  '雅婷', '志明', '建宏', '美玲', '俊傑', '怡君', '文豪', '慧君', '家豪', '宇婷',
  '子豪', '心怡', '育銘', '佳穎', '育成', '靜宜', '韋翔', '婉婷', '宥儒', '若涵',
  '宛庭', '佳蓉', '彥廷', '宥安', '禹岑', '姿婷', '凱翔', '妍臻', '奕辰', '冠廷',
  '柏翰', '欣怡', '思妤', '彥宏', '宜蓁', '俊豪', '雅雯', '哲瑋', '佳怡', '柏宇',
];

// Cheap deterministic pseudo-random; same seed → same value.
function rand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function pickName(seed: number): string {
  const sur = SURNAMES[seed % SURNAMES.length];
  const giv = GIVEN_NAMES[Math.floor(seed / SURNAMES.length) % GIVEN_NAMES.length];
  return sur + giv;
}

// Workshop-realistic distribution: most participants are early in the journey.
const ZONE_DISTRIBUTION: Array<[number, number]> = [
  [1, 0.40], // zone 1
  [2, 0.25], // zone 2
  [3, 0.20], // zone 3
  [4, 0.15], // zone 4
];

function pickZone(r: number): number {
  let acc = 0;
  for (const [zone, weight] of ZONE_DISTRIBUTION) {
    acc += weight;
    if (r < acc) return zone;
  }
  return 4;
}

export function generateStressUsers(count: number, myName?: string | null): UserRow[] {
  const now = new Date().toISOString();
  const users: UserRow[] = [];
  const seen = new Set<string>();

  if (myName) {
    users.push({
      name: myName,
      display_name: null,
      current_zone: 1,
      lotus_in_zone: 1,
      completed_practices: ['0'],
      created_at: now,
      last_active: now,
    });
    seen.add(myName);
  }

  let i = 0;
  while (users.length < count && i < count * 4) {
    const name = pickName(i);
    i += 1;
    if (seen.has(name)) continue;
    seen.add(name);

    const zone = pickZone(rand(i + 1));
    const lotus = Math.floor(rand(i + 100) * 4); // 0..3

    users.push({
      name,
      display_name: null,
      current_zone: zone,
      lotus_in_zone: lotus,
      completed_practices: [],
      created_at: now,
      last_active: now,
    });
  }

  return users;
}
