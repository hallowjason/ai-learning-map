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
  image: string;          // path to background image
  // Where the floating nameplate cluster sits inside this zone (0..1 ratios)
  cluster: { x: number; y: number; w: number; h: number };
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
