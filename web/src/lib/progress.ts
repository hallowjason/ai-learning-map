import { supabase } from './supabase';
import { ZONES, practiceIdToZone } from './zones';
import type { UserRow, ZoneId } from './types';

/**
 * Upsert a user by name. If they're new, create the row. Otherwise update last_active.
 * Returns the current row for the given name.
 */
export async function signInByName(name: string): Promise<UserRow> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Name cannot be empty');

  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('name', trimmed)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('users')
      .update({ last_active: new Date().toISOString() })
      .eq('name', trimmed)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('users')
    .insert({ name: trimmed })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Mark a practice as completed. Adds a lotus, advances zone if all practices in
 * the current zone are done. Returns the updated row.
 */
export async function completePractice(name: string, practiceId: string): Promise<UserRow> {
  const { data: user, error: readErr } = await supabase
    .from('users')
    .select('*')
    .eq('name', name)
    .single();
  if (readErr) throw readErr;

  // No double-counting
  if (user.completed_practices.includes(practiceId)) return user;

  const practiceZone = practiceIdToZone(practiceId);
  // Only count toward lotus if the practice belongs to the user's current zone
  const newCompleted = [...user.completed_practices, practiceId];
  let newLotus = user.lotus_in_zone;
  let newZone: ZoneId = user.current_zone as ZoneId;

  if (practiceZone === user.current_zone) {
    newLotus += 1;
    const zoneSize = ZONES[user.current_zone - 1].practiceIds.length;
    if (newLotus >= zoneSize) {
      // advance to next zone, reset lotus
      newZone = Math.min(4, (user.current_zone + 1)) as ZoneId;
      newLotus = newZone === user.current_zone ? newLotus : 0; // 0 if advanced
    }
  }

  const { data, error } = await supabase
    .from('users')
    .update({
      completed_practices: newCompleted,
      lotus_in_zone: newLotus,
      current_zone: newZone,
      last_active: new Date().toISOString(),
    })
    .eq('name', name)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Subscribe to all user changes via Supabase Realtime.
 * Calls onUpdate every time a row is inserted/updated/deleted.
 */
export function subscribeAllUsers(onChange: (rows: UserRow[]) => void) {
  let cache: Map<string, UserRow> = new Map();

  const refresh = async () => {
    const { data } = await supabase.from('users').select('*');
    if (data) {
      cache = new Map(data.map((r) => [r.name, r]));
      onChange(Array.from(cache.values()));
    }
  };

  refresh();

  const channel = supabase
    .channel('users-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'users' },
      (payload) => {
        if (payload.eventType === 'DELETE') {
          const oldName = (payload.old as UserRow).name;
          cache.delete(oldName);
        } else {
          const row = payload.new as UserRow;
          cache.set(row.name, row);
        }
        onChange(Array.from(cache.values()));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
