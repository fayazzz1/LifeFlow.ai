import { useMemo, useEffect, useState } from "react";

interface FlowMeterProps {
  percentage: number;
}

const FlowMeter = ({ percentage }: FlowMeterProps) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  const [animatedPct, setAnimatedPct] = useState(0);

  // Animate the ring on mount / value change
  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedPct(clamped), 100);
    return () => clearTimeout(timeout);
  }, [clamped]);

  // SVG arc parameters
  const radius = 56;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * animatedPct) / 100;

  const label = useMemo(() => {
    if (clamped === 0) return "Standby";
    if (clamped < 33) return "Low";
    if (clamped < 66) return "Medium";
    if (clamped < 90) return "High";
    return "Peak Flow";
  }, [clamped]);

  const glowColor =
    clamped < 33
      ? "rgba(100, 120, 200, 0.2)"
      : clamped < 66
        ? "rgba(139, 92, 246, 0.25)"
        : "rgba(139, 92, 246, 0.4)";

  return (
    <div className="glass-panel p-6 flex flex-col items-center" id="daily-flow-meter">
      <h3
        className="text-base font-medium tracking-wide mb-5"
        style={{ color: "var(--obsidian-text-secondary)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.75rem" }}
      >
        Daily Flow
      </h3>

      <div className="relative" style={{ width: 140, height: 140 }}>
        {/* Background ring */}
        <svg width="140" height="140" viewBox="0 0 140 140" className="absolute inset-0">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="rgba(100, 120, 200, 0.06)"
            strokeWidth={stroke}
          />
        </svg>

        {/* Progress ring */}
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          className="absolute inset-0"
          style={{ transform: "rotate(-90deg)" }}
        >
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(258, 72%, 60%)" />
              <stop offset="100%" stopColor="hsl(240, 70%, 58%)" />
            </linearGradient>
            <filter id="ringGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            filter="url(#ringGlow)"
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-semibold"
            style={{ color: "hsl(258, 72%, 68%)", lineHeight: 1 }}
          >
            {Math.round(clamped)}%
          </span>
          <span
            className="text-xs mt-1 font-medium"
            style={{ color: "var(--obsidian-text-muted)", letterSpacing: "0.08em" }}
          >
            {label}
          </span>
        </div>

        {/* Glow overlay */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `inset 0 0 30px ${glowColor}`,
            transition: "box-shadow 1.5s ease",
          }}
        />
      </div>

      <p
        className="text-xs mt-5 text-center"
        style={{ color: "var(--obsidian-text-muted)", maxWidth: 180 }}
      >
        Real-time productivity momentum
      </p>
    </div>
  );
};

export default FlowMeter;
