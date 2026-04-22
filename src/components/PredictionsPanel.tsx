const PredictionsPanel = () => {
  return (
    <div
      className="glass-panel p-5"
      id="predictions-panel"
      style={{
        borderColor: "rgba(239, 68, 68, 0.08)",
        background: "rgba(15, 20, 30, 0.55)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.12)",
          }}
        >
          <span style={{ fontSize: 12 }}>⚡</span>
        </div>
        <h3
          className="text-xs font-medium tracking-widest uppercase"
          style={{ color: "var(--obsidian-text-muted)", letterSpacing: "0.08em" }}
        >
          Future Simulation
        </h3>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <span
            className="text-xs font-medium block mb-0.5"
            style={{ color: "var(--obsidian-text-muted)", letterSpacing: "0.04em" }}
          >
            VECTOR
          </span>
          <p className="text-sm" style={{ color: "var(--obsidian-text-secondary)" }}>
            You are consistently missing evening tracking.
          </p>
        </div>
        <div>
          <span
            className="text-xs font-medium block mb-0.5"
            style={{ color: "var(--obsidian-text-muted)", letterSpacing: "0.04em" }}
          >
            PREDICTED OUTCOME
          </span>
          <p className="text-sm" style={{ color: "var(--obsidian-text-secondary)" }}>
            High chance of weekend burnout and nutritional overshoot.
          </p>
        </div>
      </div>

      <div
        className="p-3.5 rounded-xl"
        style={{
          background: "rgba(99, 102, 241, 0.04)",
          borderLeft: "2px solid rgba(99, 102, 241, 0.3)",
        }}
      >
        <span
          className="text-xs font-medium block mb-1"
          style={{ color: "hsl(240, 70%, 65%)", letterSpacing: "0.04em" }}
        >
          PREDICTION RESPONSE
        </span>
        <p className="text-sm" style={{ color: "var(--obsidian-text-secondary)" }}>
          Lower the Evening workout difficulty target by 20%. System has auto-adjusted.
        </p>
      </div>
    </div>
  );
};

export default PredictionsPanel;
