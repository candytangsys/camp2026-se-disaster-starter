import type { Assignment, Task } from "../contracts";
import { SourceLabel } from "./SourceLabel";
import { StatusBadge } from "./StatusBadge";
import { TaskProgress } from "./TaskProgress";
import { formatDateTime } from "../lib/date";
import { labelForMatchMode, labelForNeedType } from "./status-labels";

export function TaskCard({
  task,
  assignments,
}: {
  task: Task;
  assignments: Assignment[];
}) {
  const isLocked = task.matchMode === "locked";

  return (
    <article className="record-card task-card">
      <div className="record-card__header">
        <h3>{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>
      <p>{task.description}</p>

      <TaskProgress
        peopleNeeded={task.peopleNeeded}
        peopleClaimed={task.peopleClaimed}
      />

      <div className="task-card__tags">
        <span className="tag">{labelForNeedType(task.needType)}</span>
        <span className={`tag${isLocked ? " tag--locked" : ""}`}>
          {isLocked ? "🔒 " : ""}
          {labelForMatchMode(task.matchMode)}
        </span>
        {task.requiredSkills?.map((skill) => (
          <span className="tag" key={skill}>
            技能：{skill}
          </span>
        ))}
      </div>

      {assignments.length > 0 ? (
        <div className="task-card__assignments">
          <h4>人員指派</h4>
          <ul>
            {assignments.map((assignment) => (
              <li key={assignment.id}>
                <span>
                  {assignment.volunteerGroupId} · {assignment.peopleCount} 人
                </span>
                <StatusBadge status={assignment.status} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="record-card__meta">
        <SourceLabel sourceType={task.sourceType} />
        <span>更新：{formatDateTime(task.updatedAt)}</span>
      </div>
    </article>
  );
}
