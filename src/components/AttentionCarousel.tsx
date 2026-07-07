import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion";

export type AttentionSeverity = "warning" | "critical";

export type AttentionItem = {
  id: string;
  kind: "report" | "site" | "task";
  severity: AttentionSeverity;
  title: string;
  detail: string;
  statusLabel: string;
};

const kindLabel: Record<AttentionItem["kind"], string> = {
  report: "通報",
  site: "地點",
  task: "任務",
};

const AUTO_ADVANCE_MS = 5000;

export function AttentionCarousel({ items }: { items: AttentionItem[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(reducedMotion);
  const timerRef = useRef<number>();

  useEffect(() => {
    if (paused || items.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timerRef.current);
  }, [paused, items.length]);

  if (items.length === 0) {
    return (
      <div className="attention-carousel attention-carousel--empty">
        <p>
          <span aria-hidden="true">✓</span> 目前沒有需要立即關注的項目。
        </p>
      </div>
    );
  }

  const current = items[Math.min(index, items.length - 1)];

  return (
    <div
      className="attention-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(reducedMotion)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(reducedMotion)}
    >
      <div
        key={current.id}
        className={`attention-carousel__card attention-carousel__card--${current.severity}`}
      >
        <div className="attention-carousel__meta">
          <span className="tag">{kindLabel[current.kind]}</span>
          <span>
            <span aria-hidden="true">
              {current.severity === "critical" ? "‼" : "⚠"}
            </span>{" "}
            {current.statusLabel}
          </span>
        </div>
        <h4>{current.title}</h4>
        <p>{current.detail}</p>
      </div>

      <div className="attention-carousel__controls">
        <button
          type="button"
          aria-label="上一筆"
          onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
        >
          ‹
        </button>
        <div className="attention-carousel__dots">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={i === index ? "active" : ""}
              aria-label={`第 ${i + 1} 筆，共 ${items.length} 筆`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="下一筆"
          onClick={() => setIndex((i) => (i + 1) % items.length)}
        >
          ›
        </button>
        <button
          type="button"
          className="attention-carousel__pause"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? "▶ 播放" : "⏸ 暫停"}
        </button>
      </div>
    </div>
  );
}
