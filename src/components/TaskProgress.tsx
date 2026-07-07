export function TaskProgress({
  peopleNeeded,
  peopleClaimed,
}: {
  peopleNeeded?: number;
  peopleClaimed?: number;
}) {
  if (peopleNeeded === undefined) return null;

  const claimed = peopleClaimed ?? 0;
  const ratio = peopleNeeded > 0 ? Math.min(claimed / peopleNeeded, 1) : 0;
  const isFull = claimed >= peopleNeeded;

  return (
    <div className="task-progress">
      <div className="task-progress__bar">
        <div
          className={`task-progress__fill${isFull ? " task-progress__fill--full" : ""}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <span className="task-progress__label">
        已認領 {claimed} / 需求 {peopleNeeded} 人
      </span>
    </div>
  );
}
