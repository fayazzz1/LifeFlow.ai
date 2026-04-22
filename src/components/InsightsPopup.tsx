import { useState, useEffect, useCallback } from "react";

interface InsightsPopupProps {
  /** 0–1 ratio of today's completed habits */
  completionRate: number;
}

const INSIGHTS = [
  "You skip Deep Work mostly on weekends — try anchoring a 25-min focused block on Saturday mornings.",
  "High calorie anomalies correlate with missed morning runs. Consistent AM activity reduces evening overeating by 34%.",
  "Your best productivity streaks happen Tue–Thu. Protect these days from meetings.",
];

const InsightsPopup = ({ completionRate }: InsightsPopupProps) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const triggerPopup = useCallback(() => {
    if (!dismissed) setVisible(true);
  }, [dismissed]);

  // Trigger when all habits completed
  useEffect(() => {
    if (completionRate >= 1 && !dismissed) {
      const timer = setTimeout(() => triggerPopup(), 800);
      return () => clearTimeout(timer);
    }
  }, [completionRate, dismissed, triggerPopup]);

  // End-of-day trigger (after 9 PM)
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 21 && !dismissed) {
      const timer = setTimeout(() => triggerPopup(), 2000);
      return () => clearTimeout(timer);
    }
  }, [dismissed, triggerPopup]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      style={{
        background: "rgba(5, 8, 14, 0.6)",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.3s ease forwards",
      }}
      onClick={handleDismiss}
    >
      <div
        className="w-full max-w-md mx-4 mb-4 sm:mb-0 p-6 rounded-2xl"
        style={{
          background: "rgba(15, 20, 30, 0.92)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(139, 92, 246, 0.15)",
          boxShadow:
            "0 24px 64px rgba(0, 0, 0, 0.5), 0 0 80px -20px rgba(139, 92, 246, 0.1)",
          animation: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <span style={{ fontSize: 16 }}>🧠</span>
          </div>
          <div>
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--obsidian-text-primary)" }}
            >
              Insights Engine
            </h3>
            <p className="text-xs" style={{ color: "var(--obsidian-text-muted)" }}>
              {completionRate >= 1
                ? "All habits completed — great work!"
                : "End of day analysis"}
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-3 mb-6">
          {INSIGHTS.slice(0, 3).map((insight, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-xl"
              style={{
                background: "rgba(139, 92, 246, 0.03)",
                borderLeft: "2px solid rgba(139, 92, 246, 0.3)",
                animation: `fadeUp 0.4s ease ${0.1 * (i + 1)}s both`,
              }}
            >
              <span
                className="text-xs font-mono mt-0.5 shrink-0"
                style={{ color: "hsl(258, 72%, 60%)", opacity: 0.6 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--obsidian-text-secondary)" }}
              >
                {insight}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(100, 120, 200, 0.04)",
              border: "1px solid rgba(100, 120, 200, 0.08)",
              color: "var(--obsidian-text-muted)",
            }}
          >
            Close
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(139, 92, 246, 0.12)",
              border: "1px solid rgba(139, 92, 246, 0.25)",
              color: "hsl(258, 72%, 68%)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.boxShadow = "0 0 20px rgba(139, 92, 246, 0.15)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.boxShadow = "none";
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightsPopup;
