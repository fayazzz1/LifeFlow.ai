import { useState, useCallback, useMemo } from "react";
import FlowMeter from "@/components/FlowMeter";
import HabitGrid from "@/components/HabitGrid";
import NutritionPanel from "@/components/NutritionPanel";
import PredictionsPanel from "@/components/PredictionsPanel";
import InsightsPopup from "@/components/InsightsPopup";
import ExplainModal from "@/components/ExplainModal";
import { useHabits } from "@/hooks/useHabits";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const Index = () => {
  const [xp, setXp] = useLocalStorage<number>("lf_xp", 1250);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    habits,
    logs,
    addHabit,
    renameHabit,
    deleteHabit,
    advanceCell,
    resetCell,
    getCellValue,
    getTodayCompletionRate,
  } = useHabits();

  // Compute flow percentage from habit logs
  const flowPct = useMemo(() => {
    const maxScore = habits.length * 7 * 3;
    if (maxScore === 0) return 0;
    const currScore = Object.values(logs).reduce((a, b) => a + b, 0);
    return Math.min(100, (currScore / maxScore) * 100 * 3);
  }, [habits, logs]);

  const completionRate = getTodayCompletionRate();

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const handleXPGain = useCallback(
    (amount: number) => {
      setXp((prev: number) => prev + amount);
    },
    [setXp]
  );

  return (
    <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 py-8 sm:py-10">
      {/* ── Header ─────────────────────────────────────── */}
      <header
        className="flex flex-col sm:flex-row justify-between sm:items-end gap-5 mb-8"
        style={{ animation: "fadeUp 0.5s ease forwards" }}
      >
        <div>
          <h1
            className="text-3xl sm:text-4xl font-semibold"
            style={{
              color: "var(--obsidian-text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {greeting}.
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--obsidian-text-muted)", letterSpacing: "0.02em" }}
          >
            {dateStr}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* XP Badge */}
          <div
            className="glass-panel px-4 py-2.5 flex flex-col items-center"
            style={{ minWidth: 80 }}
          >
            <span
              className="text-[0.65rem] uppercase tracking-widest"
              style={{ color: "var(--obsidian-text-muted)" }}
            >
              Neural XP
            </span>
            <span
              className="text-lg font-semibold mt-0.5"
              style={{ color: "hsl(258, 72%, 68%)" }}
            >
              {xp}
            </span>
          </div>
          {/* Explain button */}
          <button
            onClick={() => setModalOpen(true)}
            className="btn-glow px-5 sm:px-6 py-3 rounded-full text-sm font-medium"
            id="explain-life-btn"
          >
            ✨ Explain My Life
          </button>
        </div>
      </header>

      {/* ── Main 2-column layout ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section — Daily Flow + Habit Grid */}
        <div
          className="lg:col-span-8 flex flex-col gap-6"
          style={{ animation: "fadeUp 0.5s ease 0.1s both" }}
        >
          {/* Daily Flow + quick stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-1">
              <FlowMeter percentage={flowPct} />
            </div>
            {/* Quick stats cards */}
            <div className="sm:col-span-2 grid grid-cols-2 gap-4">
              <div className="glass-panel p-4 flex flex-col justify-between">
                <span
                  className="text-[0.65rem] uppercase tracking-widest"
                  style={{ color: "var(--obsidian-text-muted)" }}
                >
                  Today's Completion
                </span>
                <div className="mt-3">
                  <span
                    className="text-2xl font-semibold"
                    style={{ color: "hsl(258, 72%, 68%)" }}
                  >
                    {Math.round(completionRate * 100)}%
                  </span>
                  <div
                    className="h-1 rounded-full mt-2 overflow-hidden"
                    style={{ background: "rgba(100, 120, 200, 0.06)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${completionRate * 100}%`,
                        background: "linear-gradient(90deg, hsl(258 72% 60%), hsl(240 70% 58%))",
                        transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="glass-panel p-4 flex flex-col justify-between">
                <span
                  className="text-[0.65rem] uppercase tracking-widest"
                  style={{ color: "var(--obsidian-text-muted)" }}
                >
                  Active Habits
                </span>
                <div className="mt-3">
                  <span
                    className="text-2xl font-semibold"
                    style={{ color: "var(--obsidian-text-primary)" }}
                  >
                    {habits.length}
                  </span>
                  <p className="text-xs mt-1" style={{ color: "var(--obsidian-text-muted)" }}>
                    protocols active
                  </p>
                </div>
              </div>
              {/* Predictions inline */}
              <div className="col-span-2">
                <PredictionsPanel />
              </div>
            </div>
          </div>

          {/* Habit Grid */}
          <HabitGrid
            habits={habits}
            logs={logs}
            onAdvanceCell={advanceCell}
            onResetCell={resetCell}
            getCellValue={getCellValue}
            onAddHabit={addHabit}
            onRenameHabit={renameHabit}
            onDeleteHabit={deleteHabit}
            onXPGain={handleXPGain}
          />
        </div>

        {/* Right Section — Nutrition */}
        <div
          className="lg:col-span-4 flex flex-col gap-6"
          style={{ animation: "fadeUp 0.5s ease 0.2s both" }}
        >
          <NutritionPanel />

          {/* Consistency heatmap card */}
          <ConsistencyCard />
        </div>
      </div>

      {/* ── Modals & Popups ────────────────────────────── */}
      <InsightsPopup completionRate={completionRate} />
      <ExplainModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

/* ── Consistency mini-card ────────────────────────────── */
const ConsistencyCard = () => {
  const heatmap = Array.from({ length: 42 }, () => {
    const r = Math.random();
    if (r > 0.85) return "heat-3";
    if (r > 0.6) return "heat-2";
    if (r > 0.3) return "heat-1";
    return "";
  });

  return (
    <div className="glass-panel p-5" id="consistency-card">
      <h3
        className="text-xs font-medium tracking-widest uppercase mb-4"
        style={{ color: "var(--obsidian-text-muted)", letterSpacing: "0.08em" }}
      >
        Consistency Vector
      </h3>
      <div className="grid grid-cols-7 gap-1.5">
        {heatmap.map((cls, i) => (
          <div key={i} className={`heat-cell ${cls}`} />
        ))}
      </div>
      <div className="flex justify-between mt-3">
        <span className="text-[0.6rem]" style={{ color: "var(--obsidian-text-muted)" }}>
          6 weeks ago
        </span>
        <span className="text-[0.6rem]" style={{ color: "var(--obsidian-text-muted)" }}>
          Today
        </span>
      </div>
    </div>
  );
};

export default Index;
