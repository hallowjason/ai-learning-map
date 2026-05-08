export type ZoneId = 1 | 2 | 3 | 4;

export type Practice = {
  id: string;       // "0", "1", "2", "4a", "4b", etc.
  title: string;    // "確認環境沒問題"
  content: string;  // raw markdown body
  zone: ZoneId;
};

export type Zone = {
  id: ZoneId;
  title: string;          // "Lesson 1 上半"
  subtitle: string;       // "建立信心"
  practiceIds: string[];  // ordered list of practice ids in this zone
  pair: 'A' | 'B';        // which paired wide image (A = zones 1+2, B = zones 3+4)
  half: 'left' | 'right'; // which half of the pair this zone occupies
  // Where the floating nameplate cluster sits inside this zone's half (0..1 ratios,
  // normalized to the half — i.e. one viewport-width).
  cluster: { x: number; y: number; w: number; h: number };
};

export const ZONE_PAIR_IMAGES: Record<'A' | 'B', string> = {
  A: '/assets/zone12.png',
  B: '/assets/zone34.png',
};

export type UserRow = {
  name: string;
  current_zone: number;
  lotus_in_zone: number;
  completed_practices: string[];
  created_at: string;
  last_active: string;
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: Pick<UserRow, 'name'> & Partial<UserRow>;
        Update: Partial<UserRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
