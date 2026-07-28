"use client";

import * as React from "react";
import type { Bilingual, Locale } from "./types";

/**
 * A deliberately tiny i18n layer. AI-FDE ships bilingual by construction —
 * every domain string in the seed is a `Bilingual`, so the locale switch is a
 * field selector, not a translation lookup. Only UI chrome needs a dictionary.
 */

const chrome = {
  en: {
    "app.name": "AI-FDE",
    "app.tagline": "AI Ontology Architect for ERP engagements",

    "nav.overview": "Overview",
    "nav.sources": "Sources",
    "nav.understanding": "Understanding",
    "nav.challenge": "Challenge",
    "nav.questions": "Questions",
    "nav.sessions": "Sessions",
    "nav.capabilities": "ERP Bindings",
    "nav.baseline": "Baseline",

    "phase.ingest": "Ingest",
    "phase.understand": "Understand",
    "phase.challenge": "Challenge",
    "phase.clarify": "Clarify",
    "phase.baseline": "Freeze",

    "seat.extractor": "Extractor",
    "seat.analyst": "Analyst",
    "seat.challenger": "Challenger",
    "seat.synthesizer": "Synthesizer",
    "seat.human": "Human",

    "common.round": "Round",
    "common.evidence": "Evidence",
    "common.confidence": "Confidence",
    "common.coverage": "Coverage",
    "common.citations": "Citations",
    "common.blocks": "Blocks",
    "common.status": "Status",
    "common.severity": "Severity",
    "common.repoPath": "Repo path",
    "common.none": "None",
    "common.viewAll": "View all",
    "common.back": "Back",
    "common.raisedBy": "Raised by",
    "common.answeredBy": "Answered by",
    "common.reviewedBy": "Reviewed by",
    "common.openQuestions": "Open questions",
    "common.findings": "Findings",
    "common.steps": "Steps",
    "common.roles": "Roles",
    "common.workItems": "Work items",
    "common.variants": "Variants",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    "common.empty": "Nothing here yet",

    "evidence.stated": "Stated",
    "evidence.inferred": "Inferred",
    "evidence.assumed": "Assumed",
    "evidence.contradicted": "Contradicted",

    "overview.title": "Engagement overview",
    "overview.pipeline": "The AI-FDE loop",
    "overview.activity": "Repository activity",
    "overview.attention": "Needs attention",

    "sources.title": "Source library",
    "sources.subtitle": "Every deck, screen, transcript and export as tracked files",
    "sources.pages": "pages",
    "sources.unreadable": "unreadable",
    "sources.unanalysed": "not yet analysed",
    "sources.completeness": "Completeness check",

    "understanding.title": "Business understanding",
    "understanding.subtitle": "Scenarios, workflows, roles and work items reconstructed from source",

    "challenge.title": "Independent challenge",
    "challenge.subtitle": "A second model, blind to the analyst's reasoning",
    "challenge.claim": "Analyst claim",
    "challenge.rebuttal": "Challenger argument",
    "challenge.revision": "Revision",
    "challenge.verdict": "Verdict",

    "questions.title": "Clarification questions",
    "questions.subtitle": "What the consultant must answer before the ontology can be built",
    "questions.why": "Why it matters",
    "questions.options": "Drafted options",
    "questions.answer": "Answer",
    "questions.changes": "Resulting changes",
    "questions.followUps": "Follow-ups",

    "sessions.title": "Clarification sessions",
    "sessions.subtitle": "Consultant answers, captured verbatim and written back to the repo",
    "sessions.agenda": "Agenda",
    "sessions.answered": "Answered",
    "sessions.spawned": "New questions raised",
    "sessions.transcript": "Transcript excerpts",
    "sessions.deltas": "What changed",
    "sessions.participants": "Participants",

    "capabilities.title": "ERP capability bindings",
    "capabilities.subtitle":
      "The abstraction layer between the ontology and the underlying metaERP",
    "capabilities.endpoint": "Bound endpoint",

    "baseline.title": "Baseline freeze",
    "baseline.subtitle": "Lock scope, judge quality, publish an immutable understanding",
    "baseline.gates": "Freeze gates",
    "baseline.scope": "Scope decisions",
    "baseline.signoff": "Sign-off",
    "baseline.readiness": "Readiness",
    "baseline.blocked": "Freeze blocked",
    "baseline.blockedNote":
      "Gates below are failing. Freezing now would ship known-unknowns into the ontology.",
  },
  zh: {
    "app.name": "AI-FDE",
    "app.tagline": "面向 ERP 项目的 AI 本体架构师",

    "nav.overview": "总览",
    "nav.sources": "来源材料",
    "nav.understanding": "业务理解",
    "nav.challenge": "交叉质证",
    "nav.questions": "澄清问题",
    "nav.sessions": "澄清会议",
    "nav.capabilities": "ERP 能力绑定",
    "nav.baseline": "理解基线",

    "phase.ingest": "提取",
    "phase.understand": "理解",
    "phase.challenge": "质证",
    "phase.clarify": "澄清",
    "phase.baseline": "冻结",

    "seat.extractor": "提取",
    "seat.analyst": "分析",
    "seat.challenger": "质证",
    "seat.synthesizer": "综合",
    "seat.human": "人工",

    "common.round": "轮次",
    "common.evidence": "证据等级",
    "common.confidence": "置信度",
    "common.coverage": "覆盖率",
    "common.citations": "来源引用",
    "common.blocks": "阻塞",
    "common.status": "状态",
    "common.severity": "严重度",
    "common.repoPath": "仓库路径",
    "common.none": "无",
    "common.viewAll": "查看全部",
    "common.back": "返回",
    "common.raisedBy": "提出",
    "common.answeredBy": "答复",
    "common.reviewedBy": "复核",
    "common.openQuestions": "未决问题",
    "common.findings": "质证发现",
    "common.steps": "流程步骤",
    "common.roles": "角色",
    "common.workItems": "工作项",
    "common.variants": "变体",
    "common.search": "搜索",
    "common.filter": "筛选",
    "common.all": "全部",
    "common.empty": "暂无内容",

    "evidence.stated": "明确记载",
    "evidence.inferred": "推断",
    "evidence.assumed": "假设",
    "evidence.contradicted": "存在矛盾",

    "overview.title": "项目总览",
    "overview.pipeline": "AI-FDE 分析闭环",
    "overview.activity": "仓库活动",
    "overview.attention": "需要关注",

    "sources.title": "来源材料库",
    "sources.subtitle": "PPT、页面截图、口水稿、系统导出——全部转为可追踪文件",
    "sources.pages": "页",
    "sources.unreadable": "无法识别",
    "sources.unanalysed": "尚未分析",
    "sources.completeness": "完整性检查",

    "understanding.title": "业务理解",
    "understanding.subtitle": "从来源材料还原的场景、工作流、角色与工作项",

    "challenge.title": "独立交叉质证",
    "challenge.subtitle": "不受分析结论影响的第二个模型",
    "challenge.claim": "分析结论",
    "challenge.rebuttal": "质证意见",
    "challenge.revision": "修订",
    "challenge.verdict": "裁定",

    "questions.title": "澄清问题清单",
    "questions.subtitle": "本体开工前必须由顾问答复的问题",
    "questions.why": "为何重要",
    "questions.options": "预拟选项",
    "questions.answer": "答复",
    "questions.changes": "由此产生的变更",
    "questions.followUps": "后续问题",

    "sessions.title": "澄清会议",
    "sessions.subtitle": "顾问答复原文留存并回写至仓库",
    "sessions.agenda": "议程",
    "sessions.answered": "已答复",
    "sessions.spawned": "新增问题",
    "sessions.transcript": "口水稿摘录",
    "sessions.deltas": "变更内容",
    "sessions.participants": "参会人",

    "capabilities.title": "ERP 能力绑定",
    "capabilities.subtitle": "本体与底层 metaERP 之间的抽象层",
    "capabilities.endpoint": "绑定接口",

    "baseline.title": "冻结理解基线",
    "baseline.subtitle": "控制范围、判断质量、发布不可变的业务理解",
    "baseline.gates": "冻结关卡",
    "baseline.scope": "范围决策",
    "baseline.signoff": "签署",
    "baseline.readiness": "就绪度",
    "baseline.blocked": "暂不可冻结",
    "baseline.blockedNote": "以下关卡未通过。此时冻结等于把已知的未知带进本体。",
  },
} as const;

export type ChromeKey = keyof (typeof chrome)["en"];

const LocaleContext = React.createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
}>({ locale: "en", setLocale: () => {} });

const STORAGE_KEY = "ai-fde-locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en");

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "zh") setLocaleState(stored);
  }, []);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l === "zh" ? "zh-CN" : "en";
  }, []);

  const value = React.useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return React.useContext(LocaleContext);
}

/** Chrome string lookup. */
export function useT() {
  const { locale } = useLocale();
  return React.useCallback(
    (key: ChromeKey) => chrome[locale][key] ?? key,
    [locale],
  );
}

/** Domain string selector — picks the right side of a Bilingual. */
export function useB() {
  const { locale } = useLocale();
  return React.useCallback((b: Bilingual | undefined) => (b ? b[locale] : ""), [
    locale,
  ]);
}
