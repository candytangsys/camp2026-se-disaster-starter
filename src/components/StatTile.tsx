import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion";
import { useCountUp } from "../lib/use-count-up";

type Severity = "default" | "warning" | "critical";

const severityIcon: Record<Exclude<Severity, "default">, string> = {
  warning: "⚠",
  critical: "‼",
};

const severityLabel: Record<Exclude<Severity, "default">, string> = {
  warning: "需留意",
  critical: "需立即處理",
};

export function StatTile({
  label,
  value,
  severity = "default",
}: {
  label: string;
  value: number;
  severity?: Severity;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const animated = useCountUp(value, 700, reducedMotion);
  const isAlert = severity !== "default" && value > 0;

  return (
    <div
      className={`stat-tile stat-tile--${severity}${isAlert ? " stat-tile--alert" : ""}`}
    >
      <p className="stat-tile__label">{label}</p>
      <p className="stat-tile__value">
        {animated.toLocaleString("zh-Hant-TW")}
      </p>
      {severity !== "default" ? (
        <p
          className={`stat-tile__status${isAlert ? "" : " stat-tile__status--calm"}`}
        >
          <span aria-hidden="true">
            {isAlert ? severityIcon[severity] : "✓"}
          </span>
          {isAlert ? severityLabel[severity] : "目前無待處理項目"}
        </p>
      ) : null}
    </div>
  );
}
