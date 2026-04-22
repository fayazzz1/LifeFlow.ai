import { useMemo } from "react";

const InsightsPanel = () => {
  const insights = [
    "You skip Deep Work mostly on weekends.",
    "High calorie anomalies strongly correlate with missed morning runs.",
  ];

  const heatmap = useMemo(() => {
    return Array.from({ length: 42 }, () => {
      const r = Math.random();
      if (r > 0.85) return "heat-3";
      if (r > 0.6) return "heat-2";
      if (r > 0.3) return "heat-1";
      return "";
    });
  }, []);

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-medium tracking-tight mb-6">Insights Engine</h3>
      <div className="space-y-3 mb-6">
        {insights.map((t, i) => (
          <div key={i} className="insight-card">{t}</div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-3">Consistency Vector</p>
      <div className="grid grid-cols-14 gap-1.5">
        {heatmap.map((cls, i) => (
          <div key={i} className={`heat-cell ${cls}`} />
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
