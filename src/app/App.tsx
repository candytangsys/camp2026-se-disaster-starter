import { useMemo, useState } from "react";
import messyReports from "../fixtures/phase-0/messy-reports.json";
import reportsData from "../fixtures/shared/reports.json";
import sitesData from "../fixtures/shared/sites.json";
import tasksData from "../fixtures/shared/tasks.json";
import assignmentsData from "../fixtures/shared/assignments.json";
import { RecordCard } from "../components/RecordCard";
import { TaskCard } from "../components/TaskCard";
import { Dashboard } from "../components/Dashboard";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import {
  assignmentsSchema,
  reportsSchema,
  sitesSchema,
  tasksSchema,
} from "../contracts";
import { safeParseFixture } from "../lib/load-fixture";

type TabKey =
  "dashboard" | "messy" | "reports" | "sites" | "tasks" | "assignments";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "dashboard", label: "總覽儀表板" },
  { key: "messy", label: "第一階段原始資訊" },
  { key: "reports", label: "通報" },
  { key: "sites", label: "地點" },
  { key: "tasks", label: "志工任務" },
  { key: "assignments", label: "人員指派" },
];

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");

  const parsed = useMemo(() => {
    const reports = safeParseFixture(
      reportsSchema,
      reportsData,
      "src/fixtures/shared/reports.json",
    );
    if (!reports.success) return reports;

    const sites = safeParseFixture(
      sitesSchema,
      sitesData,
      "src/fixtures/shared/sites.json",
    );
    if (!sites.success) return sites;

    const tasks = safeParseFixture(
      tasksSchema,
      tasksData,
      "src/fixtures/shared/tasks.json",
    );
    if (!tasks.success) return tasks;

    const assignments = safeParseFixture(
      assignmentsSchema,
      assignmentsData,
      "src/fixtures/shared/assignments.json",
    );
    if (!assignments.success) return assignments;

    return {
      success: true as const,
      data: {
        reports: reports.data,
        sites: sites.data,
        tasks: tasks.data,
        assignments: assignments.data,
      },
    };
  }, []);

  const records = parsed.success
    ? (() => {
        if (activeTab === "dashboard") return [];
        if (activeTab === "messy") return messyReports;
        if (activeTab === "reports") return parsed.data.reports;
        if (activeTab === "sites") return parsed.data.sites;
        if (activeTab === "tasks") return parsed.data.tasks;
        return parsed.data.assignments;
      })()
    : [];

  return (
    <>
      <div className="topbar">
        <div className="topbar__inner">
          <span>SITCON Camp 2026 · 軟體工程工作坊</span>
          <span>模擬展示系統・非正式災害應變平台</span>
        </div>
      </div>
      <main className="layout">
        <header className="hero">
          <p className="eyebrow">災害應變資訊整合平台（示範）</p>
          <h1>災害資訊積木起始專案</h1>
          <p>
            先面對混亂資料，再透過規格、資料格式、轉換器與測試，把前端原型做成可交接的資訊元件。
          </p>
        </header>

        {parsed.success ? (
          <nav className="tabs" aria-label="資料分類">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={activeTab === tab.key ? "active" : ""}
                type="button"
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        ) : null}

        <section className="panel">
          {!parsed.success ? (
            <ErrorState message={parsed.message} />
          ) : activeTab === "dashboard" ? (
            <Dashboard
              reports={parsed.data.reports}
              sites={parsed.data.sites}
              tasks={parsed.data.tasks}
              assignments={parsed.data.assignments}
            />
          ) : records.length === 0 ? (
            <EmptyState message="目前沒有資料" />
          ) : (
            <>
              <div className="panel__header">
                <h2>{tabs.find((tab) => tab.key === activeTab)?.label}</h2>
                <p>{records.length} 筆資料</p>
              </div>
              <div className="grid">
                {activeTab === "tasks" && parsed.success
                  ? parsed.data.tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        assignments={parsed.data.assignments.filter(
                          (assignment) => assignment.taskId === task.id,
                        )}
                      />
                    ))
                  : records.map((record) => (
                      <RecordCard key={record.id} record={record} />
                    ))}
              </div>
            </>
          )}
        </section>

        <footer className="site-footer">
          <p>
            <strong>資料性質說明：</strong>
            本頁面所有資料為 SITCON Camp 2026
            課程模擬資料，不代表任何真實災害事件或真實個資，僅供工作坊教學使用。
          </p>
          <p>
            主辦單位：SITCON
            學生計算機年會・本系統為前端展示原型，不提供後端服務。
          </p>
        </footer>
      </main>
    </>
  );
}
