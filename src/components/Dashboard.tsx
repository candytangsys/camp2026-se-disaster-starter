import type { Assignment, Report, Site, Task } from "../contracts";
import { StatTile } from "./StatTile";
import { AttentionCarousel, type AttentionItem } from "./AttentionCarousel";
import { labelForStatus } from "./status-labels";

function needsReportReview(report: Report): boolean {
  return (
    report.needsManualReview ||
    report.verificationStatus === "needs_review" ||
    report.verificationStatus === "unverified"
  );
}

function needsSiteReview(site: Site): boolean {
  return site.status === "needs_review" || site.status === "unknown";
}

function buildAttentionItems(
  reports: Report[],
  sites: Site[],
  tasks: Task[],
): AttentionItem[] {
  const items: AttentionItem[] = [];

  for (const report of reports) {
    if (!needsReportReview(report)) continue;
    items.push({
      id: `report-${report.id}`,
      kind: "report",
      severity: report.needsManualReview ? "critical" : "warning",
      title: report.locationText ?? `通報人角色：${report.reporterRole}`,
      detail: report.rawText,
      statusLabel: labelForStatus(report.verificationStatus),
    });
  }

  for (const site of sites) {
    if (!needsSiteReview(site)) continue;
    items.push({
      id: `site-${site.id}`,
      kind: "site",
      severity: "warning",
      title: site.name,
      detail: site.addressText ?? "地點狀態尚待確認。",
      statusLabel: labelForStatus(site.status),
    });
  }

  for (const task of tasks) {
    if (task.matchMode === "locked") {
      items.push({
        id: `task-${task.id}`,
        kind: "task",
        severity: "critical",
        title: task.title,
        detail: task.description,
        statusLabel: "已鎖定・需協調者處理",
      });
    } else if (task.status === "needs_review") {
      items.push({
        id: `task-${task.id}`,
        kind: "task",
        severity: "warning",
        title: task.title,
        detail: task.description,
        statusLabel: labelForStatus(task.status),
      });
    }
  }

  return items;
}

export function Dashboard({
  reports,
  sites,
  tasks,
  assignments,
}: {
  reports: Report[];
  sites: Site[];
  tasks: Task[];
  assignments: Assignment[];
}) {
  const reportsNeedingReview = reports.filter(needsReportReview).length;
  const sitesNeedingReview = sites.filter(needsSiteReview).length;
  const tasksLocked = tasks.filter(
    (task) => task.matchMode === "locked",
  ).length;
  const tasksOpen = tasks.filter((task) => task.status === "open").length;
  const assignmentsPending = assignments.filter(
    (assignment) => assignment.status === "requested",
  ).length;

  const attentionItems = buildAttentionItems(reports, sites, tasks);

  return (
    <div className="dashboard">
      <div className="dashboard__stats">
        <StatTile label="通報總數" value={reports.length} />
        <StatTile
          label="待人工確認通報"
          value={reportsNeedingReview}
          severity="warning"
        />
        <StatTile
          label="鎖定任務（需協調者）"
          value={tasksLocked}
          severity="critical"
        />
        <StatTile label="可處理任務" value={tasksOpen} />
        <StatTile
          label="地點待查核"
          value={sitesNeedingReview}
          severity="warning"
        />
        <StatTile
          label="待決指派"
          value={assignmentsPending}
          severity="warning"
        />
      </div>

      <div className="dashboard__attention">
        <h3>需要立即關注</h3>
        <AttentionCarousel items={attentionItems} />
      </div>
    </div>
  );
}
