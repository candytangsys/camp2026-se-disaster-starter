export const statusLabels: Record<string, string> = {
  unverified: "未查核",
  needs_review: "待人工確認",
  verified: "已確認",
  rejected: "已拒絕",
  unknown: "未知",
  reported_open: "有人回報開放",
  reported_closed: "有人回報關閉",
  verified_open: "確認開放",
  verified_closed: "確認關閉",
  draft: "草稿",
  open: "可處理",
  matching: "媒合中",
  assigned: "已指派",
  fulfilled: "已完成",
  cancelled: "已取消",
  requested: "請求中",
  confirmed: "已確認承接",
  completed: "已完成",
};

export function labelForStatus(status: string): string {
  return statusLabels[status] ?? status;
}

export const needTypeLabels: Record<string, string> = {
  cleanup: "清理",
  delivery: "運送",
  repair: "修繕",
  care: "照護",
  other: "其他",
};

export const matchModeLabels: Record<string, string> = {
  self_claim: "自助認領",
  assigned: "指派",
  hybrid: "混合",
  locked: "鎖定（需協調者處理）",
};

export function labelForNeedType(needType: string): string {
  return needTypeLabels[needType] ?? needType;
}

export function labelForMatchMode(matchMode: string): string {
  return matchModeLabels[matchMode] ?? matchMode;
}
