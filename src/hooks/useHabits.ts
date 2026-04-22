import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface Habit {
  id: string;
  name: string;
  createdAt: number;
}

// Each cell value: 0=empty, 1=partial, 2=medium, 3=completed
export type HabitLogs = Record<string, number>;

const DEFAULT_HABITS: Habit[] = [
  { id: "h1", name: "Deep Work Session", createdAt: Date.now() },
  { id: "h2", name: "Morning Run", createdAt: Date.now() },
  { id: "h3", name: "Track Nutrition", createdAt: Date.now() },
];

export function useHabits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>("lf_habits", DEFAULT_HABITS);
  const [logs, setLogs] = useLocalStorage<HabitLogs>("lf_habit_logs", {});

  const addHabit = useCallback(
    (name: string) => {
      const newHabit: Habit = {
        id: `h_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name,
        createdAt: Date.now(),
      };
      setHabits((prev) => [...prev, newHabit]);
    },
    [setHabits]
  );

  const renameHabit = useCallback(
    (id: string, newName: string) => {
      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...h, name: newName } : h))
      );
    },
    [setHabits]
  );

  const deleteHabit = useCallback(
    (id: string) => {
      setHabits((prev) => prev.filter((h) => h.id !== id));
      // Clean up logs for deleted habit
      setLogs((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          if (key.startsWith(`${id}_`)) delete next[key];
        });
        return next;
      });
    },
    [setHabits, setLogs]
  );

  const advanceCell = useCallback(
    (habitId: string, day: number): number => {
      const key = `${habitId}_${day}`;
      let newVal = 0;
      setLogs((prev) => {
        const current = prev[key] || 0;
        // Only advance if not already at max (3)
        if (current < 3) {
          newVal = current + 1;
        } else {
          newVal = current; // Stay at 3, don't reset
        }
        return { ...prev, [key]: newVal };
      });
      return newVal;
    },
    [setLogs]
  );

  const resetCell = useCallback(
    (habitId: string, day: number) => {
      const key = `${habitId}_${day}`;
      setLogs((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [setLogs]
  );

  const getCellValue = useCallback(
    (habitId: string, day: number): number => {
      return logs[`${habitId}_${day}`] || 0;
    },
    [logs]
  );

  const getTodayCompletionRate = useCallback((): number => {
    const today = new Date().getDay(); // 0=Sun ... 6=Sat
    const dayIndex = today === 0 ? 6 : today - 1; // Convert to M=0 ... S=6
    let completed = 0;
    habits.forEach((h) => {
      if ((logs[`${h.id}_${dayIndex}`] || 0) === 3) completed++;
    });
    return habits.length > 0 ? completed / habits.length : 0;
  }, [habits, logs]);

  return {
    habits,
    logs,
    addHabit,
    renameHabit,
    deleteHabit,
    advanceCell,
    resetCell,
    getCellValue,
    getTodayCompletionRate,
  };
}
