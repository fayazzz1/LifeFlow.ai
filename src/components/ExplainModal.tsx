import { useState, useEffect } from "react";

interface ExplainModalProps {
  open: boolean;
  onClose: () => void;
}

const ExplainModal = ({ open, onClose }: ExplainModalProps) => {
  const [text, setText] = useState("Analyzing behavioral pipeline...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setText("Analyzing behavioral pipeline...");
      const timer = setTimeout(() => {
        setLoading(false);
        setText(
          "The data indicates a cyclical vulnerability.\n\nYour Morning Run adherence dropped by 24% over the last 14 days. The database shows a hard connection between these missed runs and late-night caloric intake (specifically carbs).\n\nAction Required: Anchor your final meal to 8 PM. System predictions show this single correction will restore your morning productivity score by 40%."
        );
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: "rgba(5, 8, 14, 0.65)",
        backdropFilter: "blur(10px)",
        animation: "fadeIn 0.3s ease forwards",
      }}
      onClick={onClose}
    >
      <div
        className="max-w-lg w-full mx-4 p-8 rounded-2xl"
        style={{
          background: "rgba(15, 20, 30, 0.92)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.5), 0 0 80px -20px rgba(139, 92, 246, 0.08)",
          animation: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <span style={{ fontSize: 16 }}>✨</span>
          </div>
          <h2
            className="text-base font-semibold"
            style={{ color: "hsl(258, 72%, 72%)" }}
          >
            Life Explanation
          </h2>
        </div>

        {loading && (
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-4 h-4 rounded-full border-2"
              style={{
                borderColor: "rgba(139, 92, 246, 0.15)",
                borderTopColor: "hsl(258, 72%, 60%)",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        <p
          className="text-sm leading-relaxed whitespace-pre-line mb-6"
          style={{
            color: "var(--obsidian-text-secondary)",
            animation: loading ? "none" : "fadeUp 0.4s ease forwards",
          }}
        >
          {text}
        </p>

        <button
          onClick={onClose}
          className="btn-glow px-5 py-2.5 rounded-xl text-sm font-medium"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ExplainModal;
