import type {
  Bilingual,
  ExtractionStatus,
  QuestionCategory,
  ScenarioStatus,
  WorkItemType,
} from "./types";

/**
 * Taxonomy labels. These are enum values a human reads off the screen, so they
 * are bilingual like everything else — a Chinese-reading consultant should
 * never hit a raw English enum on the board they are supposed to work.
 */

export const categoryLabel: Record<QuestionCategory, Bilingual> = {
  "process-gap": { en: "Process gap", zh: "流程缺口" },
  "data-definition": { en: "Data definition", zh: "数据定义" },
  authority: { en: "Authority", zh: "权限与授权" },
  "exception-path": { en: "Exception path", zh: "异常路径" },
  integration: { en: "Integration", zh: "系统集成" },
  compliance: { en: "Compliance", zh: "合规" },
  scope: { en: "Scope", zh: "范围" },
};

export const scenarioFilterLabel: Record<ScenarioStatus | "all", Bilingual> = {
  all: { en: "All", zh: "全部" },
  draft: { en: "Draft", zh: "草稿" },
  challenged: { en: "Challenged", zh: "质证中" },
  clarifying: { en: "Clarifying", zh: "澄清中" },
  agreed: { en: "Agreed", zh: "已达成一致" },
  baselined: { en: "Baselined", zh: "已入基线" },
};

export const extractionStatusLabel: Record<ExtractionStatus, Bilingual> = {
  extracted: { en: "Extracted", zh: "已提取" },
  partial: { en: "Partial", zh: "部分提取" },
  failed: { en: "Failed", zh: "提取失败" },
  queued: { en: "Queued", zh: "排队中" },
};

export const workItemTypeLabel: Record<WorkItemType, Bilingual> = {
  document: { en: "Document", zh: "单据" },
  approval: { en: "Approval", zh: "审批" },
  task: { en: "Task", zh: "任务" },
  record: { en: "Record", zh: "记录" },
  "master-data": { en: "Master data", zh: "主数据" },
};

export const sessionStatusLabel: Record<
  "scheduled" | "held" | "written-up",
  Bilingual
> = {
  scheduled: { en: "Scheduled", zh: "已排期" },
  held: { en: "Held", zh: "已召开" },
  "written-up": { en: "Written up", zh: "已归档" },
};

export const scopeDecisionLabel: Record<"in" | "out" | "deferred", Bilingual> = {
  in: { en: "In scope", zh: "范围内" },
  out: { en: "Out of scope", zh: "范围外" },
  deferred: { en: "Deferred", zh: "待定" },
};

export const verdictFilterLabel = {
  all: { en: "All", zh: "全部" },
  open: { en: "Open", zh: "未裁定" },
  upheld: { en: "Upheld", zh: "质证成立" },
  refuted: { en: "Refuted", zh: "质证不成立" },
  "needs-clarification": { en: "Needs clarification", zh: "需澄清" },
} as const;

/**
 * Counts read differently in the two languages — English wants "12 scenarios",
 * Chinese wants "12 个场景". Keeping the whole phrase in one place avoids the
 * concatenation bugs that come from translating the noun alone.
 */
export const countPhrase = {
  total: (n: number): Bilingual => ({ en: `${n} total`, zh: `共 ${n} 条` }),
  findings: (n: number): Bilingual => ({ en: `${n} findings`, zh: `${n} 项发现` }),
  openBlockers: (n: number): Bilingual => ({
    en: `${n} open blockers`,
    zh: `${n} 项未决阻断`,
  }),
  sources: (n: number, pages: number): Bilingual => ({
    en: `${n} sources · ${pages} pages`,
    zh: `${n} 份来源 · ${pages} 页`,
  }),
  sessions: (n: number): Bilingual => ({ en: `${n} sessions`, zh: `${n} 场会议` }),
  capabilities: (n: number): Bilingual => ({
    en: `${n} capabilities`,
    zh: `${n} 项能力`,
  }),
  understanding: (s: number, r: number, w: number): Bilingual => ({
    en: `${s} scenarios · ${r} roles · ${w} work items`,
    zh: `${s} 个场景 · ${r} 个角色 · ${w} 个工作项`,
  }),
  analysed: (done: number, total: number): Bilingual => ({
    en: `${done}/${total} analysed`,
    zh: `已分析 ${done}/${total}`,
  }),
  citedBy: (n: number): Bilingual => ({
    en: `cited by ${n} scenario${n > 1 ? "s" : ""}`,
    zh: `被 ${n} 个场景引用`,
  }),
  unreadable: (n: number): Bilingual => ({
    en: `${n} unreadable`,
    zh: `${n} 页无法识别`,
  }),
  gatesPassing: (pass: number, total: number): Bilingual => ({
    en: `${pass}/${total} gates passing`,
    zh: `${pass}/${total} 项关卡通过`,
  }),
  fullyBound: (bound: number, total: number): Bilingual => ({
    en: `${bound}/${total}`,
    zh: `${bound}/${total}`,
  }),
};
