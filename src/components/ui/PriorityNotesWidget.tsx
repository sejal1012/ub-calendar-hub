import React, { useEffect, useMemo, useState, ChangeEvent, KeyboardEvent } from "react";

/**
 * PriorityNotesWidget — compact, dynamic priority note-taker (TSX)
 * Scopes: today | week | month | semester | year
 * - Type your priority → click Add → it appears under the selected scope.
 * - Notes persist in localStorage.
 * - Switch scopes to view/add notes per scope.
 * - No checkboxes; click a note to toggle done. Delete or clear as needed.
 *
 * Usage:
 *   // Save as PriorityNotesWidget.tsx
 *   import PriorityNotesWidget from "./PriorityNotesWidget";
 *   export default function App(){ return <PriorityNotesWidget /> }
 */

export const SCOPES = ["today", "week", "month", "semester", "year"] as const;

export type Scope = typeof SCOPES[number];

export interface Note {
  id: string;
  text: string;
  createdAt: number; // epoch ms
  done: boolean;
}

export type Store = Record<Scope, Note[]>;

const LS_KEY = "priorityNotes.v1" as const;

function emptyStore(): Store {
  return { today: [], week: [], month: [], semester: [], year: [] };
}

function loadStore(): Store {
  const empty = emptyStore();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<Store>;
    return { ...empty, ...parsed } as Store;
  } catch {
    return empty;
  }
}

function saveStore(store: Store): void {
  localStorage.setItem(LS_KEY, JSON.stringify(store));
}

const PriorityNotesWidget: React.FC = () => {
  const [scope, setScope] = useState<Scope>("today");
  const [input, setInput] = useState<string>("");
  const [store, setStore] = useState<Store>(() => loadStore());

  useEffect(() => {
    saveStore(store);
  }, [store]);

  const notes = useMemo<Note[]>(() => store[scope], [store, scope]);
const API_URL = "https://ubhacking2025-ubprioritize-ai.onrender.com/api/schedule/priorityschedule"; // change to your endpoint
type CreateNoteResponse = { id?: string }; // shape your API returns
// Replace your current addNote with this one
async function addNote(): Promise<void> {
  const text = input.trim();
  if (!text) return;

  // 1) optimistic add
  const tempId = `tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const optimistic: Note = {
    id: tempId,
    text,
    createdAt: Date.now(),
    done: false,
  };

  setStore((s) => ({ ...s, [scope]: [optimistic, ...s[scope]] }));
  setInput("");

  try {
    // 2) call your POST API
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priorityScope: scope,          // e.g. "today" | "week" | ...
        priorities:text,           // note text
      }),
    });

    if (!resp.ok) throw new Error(`Server responded ${resp.status}`);
    const data: CreateNoteResponse = await resp.json();

    // 3) if backend returns a canonical id, swap it in
    if (data?.id) {
      setStore((s) => ({
        ...s,
        [scope]: s[scope].map((n) =>
          n.id === tempId ? { ...n, id: data.id! } : n
        ),
      }));
    }
  } catch (err) {
    // 4) rollback on error
    console.error(err);
    setStore((s) => ({
      ...s,
      [scope]: s[scope].filter((n) => n.id !== tempId),
    }));
    alert("Could not save note. Please try again.");
  }
}


  function toggleDone(id: string): void {
    setStore((s) => ({
      ...s,
      [scope]: s[scope].map((n) => (n.id === id ? { ...n, done: !n.done } : n)),
    }));
  }

  function removeNote(id: string): void {
    setStore((s) => ({
      ...s,
      [scope]: s[scope].filter((n) => n.id !== id),
    }));
  }

  function clearAll(): void {
    if (!window.confirm(`Clear all ${scope} notes?`)) return;
    setStore((s) => ({ ...s, [scope]: [] }));
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addNote();
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Tiny BullRush glyph */}
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
            <svg viewBox="0 0 64 64" width="18" height="18" aria-hidden>
              <rect x="10" y="14" width="44" height="36" rx="8" fill="#fff" />
              <rect x="10" y="14" width="44" height="10" rx="8" fill="#3b82f6" />
              <g transform="translate(0,2)">
                <circle cx="32" cy="36" r="10.5" stroke="#0f172a" strokeWidth="2" fill="none" />
                <path d="M22 31c3-4 6-6 10-6s7 2 10 6" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M20 29c4-5 8-7 12-7s8 2 12 7" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M27 37l3 3 7-8" stroke="#1d4ed8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </span>
          <h2 className="text-base font-semibold text-neutral-900">BullRush Priorities</h2>
        </div>

        <select
          className="rounded-lg border border-neutral-300 bg-white px-2 py-1 text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={scope}
          onChange={(e) => setScope(e.target.value as Scope)}
          aria-label="Select priority scope"
        >
          {SCOPES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Composer */}
      <div className="mb-3 flex gap-2">
        <input
          value={input}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          placeholder={`Add a ${scope} priority…`}
          className="flex-1 rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Priority text"
        />
        <button
          onClick={addNote}
          className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Add priority"
        >
          Add
        </button>
      </div>

      {/* Notes list (click to toggle done) */}
      <ul className="space-y-2">
        {notes.length === 0 && (
          <li className="text-sm text-neutral-500">No notes for this scope yet.</li>
        )}
        {notes.map((n) => (
          <li
            key={n.id}
            className="group flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-2 hover:bg-neutral-50"
          >
            <button
              onClick={() => toggleDone(n.id)}
              className={`flex-1 text-left text-sm ${n.done ? "text-neutral-400 line-through" : "text-neutral-900"}`}
              aria-label={n.done ? "Mark as not done" : "Mark as done"}
            >
              {n.text}
            </button>
            <div className="ml-3 flex items-center gap-2">
              <time className="hidden text-xs text-neutral-400 sm:inline">
                {new Date(n.createdAt).toLocaleString()}
              </time>
              <button
                onClick={() => removeNote(n.id)}
                className="rounded-lg border border-transparent px-2 py-1 text-xs font-medium text-neutral-500 hover:border-neutral-300 hover:bg-white"
                aria-label="Delete note"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer actions */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-neutral-500">
          {notes.length} note{notes.length !== 1 ? "s" : ""} in {scope}
        </span>
        <button
          onClick={clearAll}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          Clear {scope}
        </button>
      </div>
    </div>
  );
};

export default PriorityNotesWidget;
