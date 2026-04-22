import { useState } from "react";

const NutritionPanel = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{
    food: string;
    cal: string;
    pro: number;
    carb: number;
    fat: number;
  } | null>(null);

  const handleUpload = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setResult({
        food: "Grilled Salmon & Quinoa",
        cal: "520 kcal",
        pro: 65,
        carb: 35,
        fat: 45,
      });
    }, 1500);
  };

  const macros = result
    ? [
        { label: "Protein", short: "PRO", value: result.pro, color: "hsl(258, 72%, 60%)" },
        { label: "Carbs", short: "CRB", value: result.carb, color: "hsl(240, 70%, 58%)" },
        { label: "Fat", short: "FAT", value: result.fat, color: "hsl(200, 90%, 55%)" },
      ]
    : [];

  return (
    <div className="glass-panel p-5" id="nutrition-panel">
      <h3
        className="text-xs font-medium tracking-widest uppercase mb-5"
        style={{ color: "var(--obsidian-text-muted)", letterSpacing: "0.08em" }}
      >
        AI Nutrition
      </h3>

      {!result && !scanning && (
        <div
          onClick={handleUpload}
          className="rounded-xl py-8 px-5 text-center cursor-pointer transition-all"
          style={{
            border: "1.5px dashed rgba(139, 92, 246, 0.15)",
            background: "rgba(139, 92, 246, 0.02)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(139, 92, 246, 0.35)";
            (e.currentTarget as HTMLElement).style.background = "rgba(139, 92, 246, 0.04)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(139, 92, 246, 0.15)";
            (e.currentTarget as HTMLElement).style.background = "rgba(139, 92, 246, 0.02)";
          }}
        >
          <div
            className="text-2xl mb-2"
            style={{ filter: "grayscale(0.3)" }}
          >
            📸
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--obsidian-text-secondary)" }}>
            Drop Food Image
          </p>
          <span className="text-xs" style={{ color: "var(--obsidian-text-muted)" }}>
            or tap to capture
          </span>
        </div>
      )}

      {scanning && (
        <div className="text-center py-8">
          <div
            className="inline-block w-8 h-8 rounded-full border-2 mb-3"
            style={{
              borderColor: "rgba(139, 92, 246, 0.15)",
              borderTopColor: "hsl(258, 72%, 60%)",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p className="text-sm" style={{ color: "hsl(258, 72%, 65%)" }}>
            Analyzing...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {result && (
        <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
          <p className="text-xs mb-1" style={{ color: "var(--obsidian-text-muted)" }}>
            {result.food}
          </p>
          <p
            className="text-2xl font-semibold mb-5"
            style={{ color: "hsl(258, 72%, 68%)" }}
          >
            {result.cal}
          </p>

          <div className="space-y-3">
            {macros.map((m) => (
              <div key={m.short}>
                <div className="flex justify-between items-center mb-1">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--obsidian-text-muted)", letterSpacing: "0.04em" }}
                  >
                    {m.short}
                  </span>
                  <span className="text-xs" style={{ color: "var(--obsidian-text-muted)" }}>
                    {m.value}%
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(100, 120, 200, 0.06)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${m.value}%`,
                      background: `linear-gradient(90deg, ${m.color}, ${m.color}88)`,
                      transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: `0 0 8px ${m.color}33`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setResult(null)}
            className="mt-5 w-full py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: "rgba(139, 92, 246, 0.06)",
              border: "1px solid rgba(139, 92, 246, 0.12)",
              color: "var(--obsidian-text-muted)",
            }}
          >
            Scan Another
          </button>
        </div>
      )}
    </div>
  );
};

export default NutritionPanel;
