import type { ActivityEvent, Engagement } from "@/lib/types";

/**
 * The engagement under analysis: procurement for a provincial subsidiary of a
 * state-owned power grid operator, migrating onto Huawei metaERP behind an
 * API abstraction layer.
 */
export const engagement: Engagement = {
  id: "ENG-2026-SGP-01",
  client: {
    en: "State Grid — Provincial Electric Power Co.",
    zh: "国网某省电力有限公司",
  },
  codename: "SGP-PROCURE",
  domain: { en: "Procurement (full lifecycle)", zh: "物资采购（全流程）" },
  targetSystem: {
    en: "Huawei metaERP, accessed through an abstraction API",
    zh: "华为 metaERP（经 API 抽象层接入）",
  },
  repo: "git@internal:allmeta/sgp-procure-analysis.git",
  startedAt: "2026-06-15",
  currentRound: 3,
  leadConsultant: "Wang Lei",
  leadFde: "Chen Yu",
  phases: [
    {
      id: "ingest",
      name: { en: "Ingest & Index", zh: "提取与建索引" },
      purpose: {
        en: "Turn every deck, screenshot, transcript and export into tracked files with a page-level source index.",
        zh: "把每一份PPT、页面截图、口水稿、系统导出都变成可追踪文件，并建立页级来源索引。",
      },
      drivenBy: "extractor",
      status: "done",
      progress: 100,
    },
    {
      id: "understand",
      name: { en: "Reconstruct Understanding", zh: "还原业务理解" },
      purpose: {
        en: "Read page by page; identify scenarios, workflows, roles and work items; find where the business is silent.",
        zh: "逐页理解，识别场景、还原工作流、识别角色与work item，并找出业务缺口。",
      },
      drivenBy: "analyst",
      status: "done",
      progress: 100,
    },
    {
      id: "challenge",
      name: { en: "Independent Challenge", zh: "独立交叉质证" },
      purpose: {
        en: "A second model, blind to the analyst's reasoning, hunts omissions, contradictions and unproven inferences.",
        zh: "由不受分析结论影响的第二个模型，独立检查流程遗漏、矛盾和未经证实的推论。",
      },
      drivenBy: "challenger",
      status: "active",
      progress: 74,
    },
    {
      id: "clarify",
      name: { en: "Consultant Clarification", zh: "顾问澄清" },
      purpose: {
        en: "Put the surviving questions to human ERP consultants; capture every answer back into the repo.",
        zh: "把留存的问题交给ERP顾问逐条澄清，所有记录回写到 git 项目。",
      },
      drivenBy: "human",
      status: "active",
      progress: 58,
    },
    {
      id: "baseline",
      name: { en: "Freeze Baseline", zh: "冻结理解基线" },
      purpose: {
        en: "Lock scope, judge analysis quality, and publish an immutable Business Understanding Baseline.",
        zh: "控制范围、判断分析质量、冻结业务理解基线并发布不可变版本。",
      },
      drivenBy: "synthesizer",
      status: "pending",
      progress: 22,
    },
  ],
};

/**
 * The activity feed is deliberately shaped like a commit log — the product
 * claim is that git is the system of record, so the UI shows refs and paths,
 * not opaque "updated 2 hours ago" rows.
 */
export const activity: ActivityEvent[] = [
  {
    id: "AC-041",
    at: "2026-07-27T09:12:00+08:00",
    actor: "Claude Opus 5",
    seat: "analyst",
    phase: "clarify",
    ref: "a3f91c2",
    message: {
      en: "Revised PR-10 three-way match tolerance after session S-03; spawned Q-031",
      zh: "根据 S-03 会议澄清，修订 PR-10 三单匹配容差；派生 Q-031",
    },
    files: [
      "analysis/scenarios/PR-10-three-way-match.md",
      "analysis/questions/Q-031.md",
    ],
  },
  {
    id: "AC-040",
    at: "2026-07-26T17:40:00+08:00",
    actor: "Wang Lei",
    phase: "clarify",
    ref: "7d20ba8",
    message: {
      en: "Answered Q-014, Q-018, Q-022 in clarification session S-03",
      zh: "在澄清会议 S-03 中答复 Q-014、Q-018、Q-022",
    },
    files: [
      "sessions/S-03-materials-dept.md",
      "analysis/questions/Q-014.md",
      "analysis/questions/Q-018.md",
      "analysis/questions/Q-022.md",
    ],
  },
  {
    id: "AC-039",
    at: "2026-07-26T11:05:00+08:00",
    actor: "Codex",
    seat: "challenger",
    phase: "challenge",
    ref: "1e8c447",
    message: {
      en: "Round 3 challenge: 9 findings raised, 4 unproven inferences against PR-05 and PR-11",
      zh: "第 3 轮质证：提出 9 项发现，其中 4 项针对 PR-05、PR-11 的未证推论",
    },
    files: ["challenge/round-3/findings.md"],
  },
  {
    id: "AC-038",
    at: "2026-07-24T15:22:00+08:00",
    actor: "Claude Opus 5",
    seat: "analyst",
    phase: "understand",
    ref: "b90ff31",
    message: {
      en: "Reconstructed PR-12 change/return/claim flow from SRC-03 transcript",
      zh: "依据 SRC-03 访谈口水稿还原 PR-12 变更/退货/索赔流程",
    },
    files: ["analysis/scenarios/PR-12-change-return-claim.md"],
  },
  {
    id: "AC-037",
    at: "2026-07-23T10:48:00+08:00",
    actor: "Codex",
    seat: "extractor",
    phase: "ingest",
    ref: "5cc10de",
    message: {
      en: "Re-extracted SRC-01 slides 31-34; earlier pass lost two embedded flow diagrams",
      zh: "重新提取 SRC-01 第 31-34 页，前次提取遗漏两张嵌入流程图",
    },
    files: ["sources/SRC-01/pages/031.md", "sources/SRC-01/index.json"],
  },
  {
    id: "AC-036",
    at: "2026-07-22T14:30:00+08:00",
    actor: "Chen Yu",
    phase: "baseline",
    ref: "2a7e6b0",
    message: {
      en: "Marked spare-parts consignment procurement out of scope for phase 1",
      zh: "将备品备件寄售采购标记为一期范围外",
    },
    files: ["baseline/scope.md"],
  },
];
