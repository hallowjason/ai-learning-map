"use client";

import { useEffect, useMemo, useState } from "react";
import { ZONES } from "@/lib/zones";
import type { UserRow, ZoneId } from "@/lib/types";

interface RosterPanelProps {
  users: UserRow[];
  myName: string | null;
  open: boolean;
  initialZone: ZoneId | null;
  onClose: () => void;
}

export default function RosterPanel({
  users,
  myName,
  open,
  initialZone,
  onClose,
}: RosterPanelProps) {
  const [query, setQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState<ZoneId | null>(initialZone);
  const [trackedOpen, setTrackedOpen] = useState(open);
  const [trackedInitial, setTrackedInitial] = useState(initialZone);

  // Derive-during-render: sync filter when panel opens with a new zone, reset
  // search when it closes. Avoids the `set-state-in-effect` antipattern.
  if (open !== trackedOpen) {
    setTrackedOpen(open);
    if (!open) setQuery("");
  }
  if (open && initialZone !== trackedInitial) {
    setTrackedInitial(initialZone);
    setZoneFilter(initialZone);
  }

  // Esc-to-close
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const grouped = useMemo(() => {
    const filtered = users.filter((u) => {
      if (zoneFilter && u.current_zone !== zoneFilter) return false;
      if (query && !u.name.includes(query)) return false;
      return true;
    });
    const byZone: Record<ZoneId, UserRow[]> = { 1: [], 2: [], 3: [], 4: [] };
    for (const u of filtered) {
      const z = Math.min(4, Math.max(1, u.current_zone)) as ZoneId;
      byZone[z].push(u);
    }
    // sort within each zone: me first, then alpha-stable
    for (const z of [1, 2, 3, 4] as ZoneId[]) {
      byZone[z].sort((a, b) => {
        if (a.name === myName) return -1;
        if (b.name === myName) return 1;
        return a.name.localeCompare(b.name, "zh-Hant");
      });
    }
    return { filtered, byZone };
  }, [users, query, zoneFilter, myName]);

  if (!open) return null;

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden
      />
      {/* Sheet */}
      <aside
        role="dialog"
        aria-label="夥伴名單"
        className="fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-cream border-l flex flex-col"
        style={{ borderColor: "var(--color-border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-wider text-coral font-medium">
              夥伴名單
            </p>
            <h2 className="font-display text-xl font-semibold text-ink tracking-tight">
              {zoneFilter
                ? `Zone ${zoneFilter}・${ZONES[zoneFilter - 1].subtitle}`
                : `全部夥伴 (${users.length})`}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉名單"
            className="text-ink-soft hover:text-ink text-2xl leading-none p-1"
          >
            ×
          </button>
        </div>

        {/* Filters */}
        <div className="px-5 py-3 space-y-2 border-b" style={{ borderColor: "var(--color-border)" }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋名字…"
            className="w-full px-3 py-2 rounded-md border bg-cream text-ink text-sm focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              active={zoneFilter === null}
              onClick={() => setZoneFilter(null)}
              label="全部"
            />
            {ZONES.map((z) => (
              <FilterChip
                key={z.id}
                active={zoneFilter === z.id}
                onClick={() => setZoneFilter(z.id)}
                label={`Zone ${z.id}`}
              />
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {grouped.filtered.length === 0 ? (
            <p className="text-sm text-ink-soft text-center py-8">
              {query ? `沒找到「${query}」` : "這個 zone 還沒有人"}
            </p>
          ) : (
            ([1, 2, 3, 4] as ZoneId[])
              .filter((z) => grouped.byZone[z].length > 0)
              .map((z) => (
                <section key={z} className="mb-5 last:mb-0">
                  <h3 className="text-[10px] uppercase tracking-wider text-ink-soft font-medium mb-2">
                    Zone {z}・{ZONES[z - 1].subtitle}
                    <span className="ml-2 text-ink-soft/70">
                      ({grouped.byZone[z].length})
                    </span>
                  </h3>
                  <ul className="space-y-1">
                    {grouped.byZone[z].map((u) => (
                      <li
                        key={u.name}
                        className={`flex items-center justify-between px-3 py-2 rounded-md ${
                          u.name === myName ? "bg-coral/10" : ""
                        }`}
                      >
                        <span
                          className={`text-sm ${
                            u.name === myName ? "font-bold text-ink" : "text-ink"
                          }`}
                        >
                          {u.name}
                          {u.name === myName && (
                            <span className="ml-1.5 text-[10px] text-coral">（你）</span>
                          )}
                        </span>
                        {u.lotus_in_zone > 0 && (
                          <span className="text-xs whitespace-nowrap" aria-label={`蓮花 ${u.lotus_in_zone}`}>
                            {"🪷".repeat(Math.min(5, u.lotus_in_zone))}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ))
          )}
        </div>
      </aside>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs transition border ${
        active
          ? "bg-ink text-cream border-ink"
          : "bg-cream text-ink-soft hover:text-ink"
      }`}
      style={!active ? { borderColor: "var(--color-border)" } : undefined}
    >
      {label}
    </button>
  );
}
