import { useState, useRef, useEffect, useCallback } from "react";
import type { Habit, HabitLogs } from "@/hooks/useHabits";

interface HabitGridProps {
  habits: Habit[];
  logs: HabitLogs;
  onAdvanceCell: (habitId: string, day: number) => number;
  onResetCell: (habitId: string, day: number) => void;
  getCellValue: (habitId: string, day: number) => number;
  onAddHabit: (name: string) => void;
  onRenameHabit: (id: string, newName: string) => void;
  onDeleteHabit: (id: string) => void;
  onXPGain: (amount: number) => void;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const HabitGrid = ({
  habits,
  logs,
  onAdvanceCell,
  onResetCell,
  getCellValue,
  onAddHabit,
  onRenameHabit,
  onDeleteHabit,
  onXPGain,
}: HabitGridProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [showTooltip, setShowTooltip] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);

  // Dismiss first-use tooltip after 6 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowTooltip(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // Focus inputs
  useEffect(() => {
    if (editingId && editRef.current) editRef.current.focus();
  }, [editingId]);
  useEffect(() => {
    if (addingNew && newRef.current) newRef.current.focus();
  }, [addingNew]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCellClick = useCallback(
    (habitId: string, day: number, e: React.MouseEvent) => {
      const currentVal = getCellValue(habitId, day);
      if (currentVal >= 3) return; // Don't reset past completed

      const newVal = onAdvanceCell(habitId, day);
      if (newVal === 3) {
        onXPGain(15);
        spawnXPPop(e.clientX, e.clientY);
      }
    },
    [getCellValue, onAdvanceCell, onXPGain]
  );

  const spawnXPPop = (x: number, y: number) => {
    const pop = document.createElement("div");
    pop.innerText = "+15 XP";
    pop.style.cssText = `position:fixed;left:${x}px;top:${y}px;color:hsl(258,72%,65%);font-weight:600;pointer-events:none;transition:all 0.8s cubic-bezier(0.16,1,0.3,1);z-index:999;font-size:13px;text-shadow:0 0 10px rgba(139,92,246,0.5);`;
    document.body.appendChild(pop);
    requestAnimationFrame(() => {
      pop.style.transform = "translateY(-35px)";
      pop.style.opacity = "0";
    });
    setTimeout(() => pop.remove(), 800);
  };

  const getCellClass = (habitId: string, day: number) => {
    const val = getCellValue(habitId, day);
    if (val === 1) return "day-cell state-1";
    if (val === 2) return "day-cell state-2";
    if (val === 3) return "day-cell state-3";
    return "day-cell";
  };

  const startEdit = (habit: Habit) => {
    setEditingId(habit.id);
    setEditValue(habit.name);
    setMenuOpenId(null);
  };

  const commitEdit = () => {
    if (editingId && editValue.trim()) {
      onRenameHabit(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue("");
  };

  const commitNewHabit = () => {
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim());
    }
    setAddingNew(false);
    setNewHabitName("");
  };

  const handleDeleteHabit = (id: string) => {
    onDeleteHabit(id);
    setMenuOpenId(null);
  };

  return (
    <div className="glass-panel p-5 relative" id="habit-grid-section">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3
            className="text-base font-medium"
            style={{ color: "var(--obsidian-text-primary)", letterSpacing: "0.02em" }}
          >
            Action Protocol
          </h3>
          <span
            className="text-xs"
            style={{ color: "var(--obsidian-text-muted)", letterSpacing: "0.04em" }}
          >
            Current Week
          </span>
        </div>
        <button
          onClick={() => setAddingNew(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(139, 92, 246, 0.06)",
            border: "1px solid rgba(139, 92, 246, 0.15)",
            color: "hsl(258, 72%, 68%)",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = "rgba(139, 92, 246, 0.12)";
            (e.target as HTMLElement).style.borderColor = "rgba(139, 92, 246, 0.3)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = "rgba(139, 92, 246, 0.06)";
            (e.target as HTMLElement).style.borderColor = "rgba(139, 92, 246, 0.15)";
          }}
          id="add-habit-btn"
        >
          <span style={{ fontSize: 14 }}>+</span> Add Habit
        </button>
      </div>

      {/* First-use tooltip */}
      {showTooltip && habits.length > 0 && (
        <div
          className="mb-4 px-3 py-2 rounded-lg text-xs flex items-center gap-2"
          style={{
            background: "rgba(139, 92, 246, 0.06)",
            border: "1px solid rgba(139, 92, 246, 0.1)",
            color: "var(--obsidian-text-secondary)",
            animation: "fadeUp 0.4s ease forwards",
          }}
        >
          <span style={{ fontSize: 14 }}>💡</span>
          Click cells to track progress (3 levels). Use ⋮ menu to rename or delete habits.
          <button
            onClick={() => setShowTooltip(false)}
            className="ml-auto opacity-50 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 480 }}>
          <thead>
            <tr>
              <th
                className="text-left font-normal text-xs pb-3 pr-4"
                style={{ color: "var(--obsidian-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                Habit
              </th>
              {DAYS.map((d, i) => (
                <th
                  key={i}
                  className="font-normal text-xs pb-3"
                  style={{ color: "var(--obsidian-text-muted)", letterSpacing: "0.04em", width: 50 }}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((h) => (
              <tr key={h.id} className="group">
                {/* Habit name cell */}
                <td
                  className="py-2.5 pr-4"
                  style={{
                    borderBottom: "1px solid rgba(100, 120, 200, 0.04)",
                    position: "relative",
                  }}
                >
                  <div className="flex items-center gap-2">
                    {editingId === h.id ? (
                      <input
                        ref={editRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit();
                          if (e.key === "Escape") {
                            setEditingId(null);
                            setEditValue("");
                          }
                        }}
                        className="bg-transparent border-b font-medium text-sm outline-none w-full"
                        style={{
                          borderColor: "rgba(139, 92, 246, 0.4)",
                          color: "var(--obsidian-text-primary)",
                          paddingBottom: 2,
                        }}
                      />
                    ) : (
                      <span
                        className="font-medium text-sm cursor-text"
                        style={{ color: "var(--obsidian-text-primary)" }}
                        onDoubleClick={() => startEdit(h)}
                        title="Double-click to rename"
                      >
                        {h.name}
                      </span>
                    )}

                    {/* 3 dots menu */}
                    <div className="relative" style={{ marginLeft: "auto" }}>
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === h.id ? null : h.id)}
                        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity p-1 rounded"
                        style={{ color: "var(--obsidian-text-muted)", fontSize: 16, lineHeight: 1 }}
                        aria-label="Habit options"
                      >
                        ⋮
                      </button>
                      {menuOpenId === h.id && (
                        <div ref={menuRef} className="habit-options-menu absolute right-0 top-full mt-1">
                          <button onClick={() => startEdit(h)}>
                            ✏️ Rename
                          </button>
                          <button className="destructive" onClick={() => handleDeleteHabit(h.id)}>
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Day cells */}
                {DAYS.map((_, dayIdx) => (
                  <td
                    key={dayIdx}
                    className="py-2.5"
                    style={{ borderBottom: "1px solid rgba(100, 120, 200, 0.04)" }}
                  >
                    <div className="day-cell-wrap flex flex-col items-center gap-0.5">
                      <div
                        className={getCellClass(h.id, dayIdx)}
                        onClick={(e) => handleCellClick(h.id, dayIdx, e)}
                        style={{ margin: "0 auto" }}
                        title={
                          getCellValue(h.id, dayIdx) === 0
                            ? "Click to start"
                            : getCellValue(h.id, dayIdx) === 3
                              ? "Completed! Use reset to clear"
                              : `Level ${getCellValue(h.id, dayIdx)}/3`
                        }
                      >
                        {getCellValue(h.id, dayIdx) === 3 && (
                          <span style={{ fontSize: 12, zIndex: 1, filter: "drop-shadow(0 0 4px rgba(255,255,255,0.4))" }}>
                            ✓
                          </span>
                        )}
                      </div>
                      {/* Reset button — only visible on hover when cell has value */}
                      {getCellValue(h.id, dayIdx) > 0 && (
                        <button
                          className="reset-btn"
                          onClick={() => onResetCell(h.id, dayIdx)}
                          title="Reset"
                          aria-label="Reset habit day"
                        >
                          ↺
                        </button>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}

            {/* Add new habit row */}
            {addingNew && (
              <tr>
                <td className="py-2.5 pr-4" colSpan={8}>
                  <div className="flex items-center gap-3">
                    <input
                      ref={newRef}
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitNewHabit();
                        if (e.key === "Escape") {
                          setAddingNew(false);
                          setNewHabitName("");
                        }
                      }}
                      placeholder="Enter habit name..."
                      className="bg-transparent border-b font-medium text-sm outline-none flex-1"
                      style={{
                        borderColor: "rgba(139, 92, 246, 0.3)",
                        color: "var(--obsidian-text-primary)",
                        paddingBottom: 4,
                      }}
                    />
                    <button
                      onClick={commitNewHabit}
                      className="px-3 py-1 rounded-lg text-xs font-medium"
                      style={{
                        background: "rgba(139, 92, 246, 0.15)",
                        color: "hsl(258, 72%, 68%)",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setAddingNew(false);
                        setNewHabitName("");
                      }}
                      className="px-3 py-1 rounded-lg text-xs"
                      style={{ color: "var(--obsidian-text-muted)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {habits.length === 0 && !addingNew && (
        <div
          className="text-center py-10"
          style={{ color: "var(--obsidian-text-muted)" }}
        >
          <p className="text-sm mb-3">No habits yet. Start building your protocol.</p>
          <button
            onClick={() => setAddingNew(true)}
            className="btn-glow px-5 py-2.5 rounded-xl text-sm font-medium"
          >
            + Create First Habit
          </button>
        </div>
      )}
    </div>
  );
};

export default HabitGrid;
