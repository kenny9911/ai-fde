import type { ClarificationSession } from "@/lib/types";

/**
 * Clarification sessions with human ERP consultants. The transcript excerpts
 * are the "口水稿" preserved verbatim and bound to the question they answer —
 * so an answer can always be traced back to what was actually said in the room,
 * not just to the tidy summary someone wrote afterwards.
 */
export const sessions: ClarificationSession[] = [
  {
    id: "S-01",
    code: "S-01",
    title: { en: "Kickoff — procurement scope walkthrough", zh: "启动会——采购范围走查" },
    date: "2026-06-28",
    durationMinutes: 90,
    status: "written-up",
    round: 1,
    repoPath: "sessions/S-01-kickoff.md",
    participants: [
      { name: "Wang Lei", role: { en: "Lead ERP Consultant", zh: "ERP主顾问" }, org: { en: "Implementation Partner", zh: "实施伙伴" } },
      { name: "Zhang Min", role: { en: "Procurement Section Head", zh: "采购科科长" }, org: { en: "Materials Dept.", zh: "物资部" } },
    ],
    agendaQuestionIds: ["Q-001", "Q-002"],
    answeredQuestionIds: [],
    spawnedQuestionIds: ["Q-007"],
    transcriptExcerpts: [
      {
        speaker: "Zhang Min",
        at: "00:22:10",
        text: {
          en: "Don't start from the blueprint. The blueprint is what we told the group we do. Start from what the procurement officers actually click.",
          zh: "别从蓝图开始。蓝图是我们报给集团的说法。你要从采购员实际点的东西开始看。",
        },
      },
    ],
    deltas: [
      {
        kind: "added",
        target: { en: "Source SRC-04 (legacy screens)", zh: "来源 SRC-04（现行系统截图）" },
        detail: { en: "Requested after Zhang Min insisted the screens differ from the blueprint.", zh: "张敏坚持界面与蓝图不一致后追加索取。" },
      },
    ],
  },
  {
    id: "S-02",
    code: "S-02",
    title: { en: "metaERP fit-gap on sourcing & supplier", zh: "寻源与供应商 metaERP 适配差距会" },
    date: "2026-07-14",
    durationMinutes: 120,
    status: "written-up",
    round: 2,
    repoPath: "sessions/S-02-fit-gap.md",
    participants: [
      { name: "Wang Lei", role: { en: "Lead ERP Consultant", zh: "ERP主顾问" }, org: { en: "Implementation Partner", zh: "实施伙伴" } },
      { name: "Chen Yu", role: { en: "Lead FDE", zh: "主任FDE" }, org: { en: "allmeta", zh: "allmeta" } },
      { name: "Liu Gang", role: { en: "Supplier Manager", zh: "供应商管理员" }, org: { en: "Materials Dept.", zh: "物资部" } },
    ],
    agendaQuestionIds: ["Q-011", "Q-014"],
    answeredQuestionIds: [],
    spawnedQuestionIds: ["Q-024", "Q-026"],
    transcriptExcerpts: [
      {
        speaker: "Liu Gang",
        at: "00:41:35",
        text: {
          en: "A supplier qualified for cable is absolutely not qualified for switchgear. If the system makes them globally valid, we will keep a spreadsheet next to it, and you will have solved nothing.",
          zh: "线缆合格的供应商，绝对不等于开关柜合格。系统要是搞成全局有效，我们照样在旁边挂个表，等于没解决。",
        },
        answersQuestionId: "Q-011",
      },
    ],
    deltas: [
      {
        kind: "changed",
        target: { en: "PR-04 step 2 evidence grade", zh: "PR-04 第2步证据等级" },
        detail: { en: "Downgraded to contradicted; the business will not accept global qualification.", zh: "下调为“矛盾”；业务不接受全局资质。" },
      },
    ],
  },
  {
    id: "S-03",
    code: "S-03",
    title: { en: "Materials Dept. clarification — round 3", zh: "物资部澄清会——第3轮" },
    date: "2026-07-26",
    durationMinutes: 150,
    status: "written-up",
    round: 3,
    repoPath: "sessions/S-03-materials-dept.md",
    participants: [
      { name: "Wang Lei", role: { en: "Lead ERP Consultant", zh: "ERP主顾问" }, org: { en: "Implementation Partner", zh: "实施伙伴" } },
      { name: "Chen Yu", role: { en: "Lead FDE", zh: "主任FDE" }, org: { en: "allmeta", zh: "allmeta" } },
      { name: "Zhang Min", role: { en: "Procurement Section Head", zh: "采购科科长" }, org: { en: "Materials Dept.", zh: "物资部" } },
      { name: "Sun Ping", role: { en: "AP Accountant", zh: "应付会计" }, org: { en: "Finance Dept.", zh: "财务部" } },
    ],
    agendaQuestionIds: ["Q-001", "Q-002", "Q-014", "Q-018", "Q-022"],
    answeredQuestionIds: ["Q-001", "Q-002", "Q-014", "Q-018", "Q-022"],
    spawnedQuestionIds: ["Q-031", "Q-033", "Q-016"],
    transcriptExcerpts: [
      {
        speaker: "Zhang Min",
        at: "00:18:04",
        text: {
          en: "Both exist, that's the honest answer. Capital construction raises by WBS because at that point the material code doesn't exist yet. We complete it before consolidation.",
          zh: "两种都有，这是实话。基建按WBS报，是因为那时候物料编码还没有。我们在归集前补上。",
        },
        answersQuestionId: "Q-001",
      },
      {
        speaker: "Sun Ping",
        at: "01:12:47",
        text: {
          en: "Please stop reversing goods receipts. Every reversal breaks my reconciliation. Give me a return document and I will never ask for anything else.",
          zh: "别再冲销收货单了。每冲销一次我的对账就断一次。给我一张退货单，我再没别的要求。",
        },
        answersQuestionId: "Q-018",
      },
      {
        speaker: "Zhang Min",
        at: "01:31:20",
        text: {
          en: "If we deduct on a concession, that's a contract change, we sign a supplement. It never goes through as a match difference — audit would take our heads off.",
          zh: "让步接收要是减价，那就是合同变更，签补充协议。绝不会走匹配差异——那样审计要摘我们的帽子。",
        },
        answersQuestionId: "Q-022",
      },
    ],
    deltas: [
      {
        kind: "changed",
        target: { en: "Goods_Receipt mutability", zh: "收货单可变性" },
        detail: { en: "Modelled as immutable; returns become compensating documents.", zh: "建模为不可变；退货改为补偿单据。" },
      },
      {
        kind: "added",
        target: { en: "Dependency PR-09 → PR-12", zh: "依赖边 PR-09 → PR-12" },
        detail: { en: "Concession with price deduction routes through contract change.", zh: "让步减价经由合同变更处理。" },
      },
      {
        kind: "confirmed",
        target: { en: "Award write-back automation in scope", zh: "中标回写自动化纳入范围" },
        detail: { en: "Phase 1 includes the inbound integration event.", zh: "一期包含入站集成事件。" },
      },
    ],
  },
  {
    id: "S-04",
    code: "S-04",
    title: { en: "Finance & settlement clarification — round 4", zh: "财务与结算澄清会——第4轮" },
    date: "2026-08-04",
    durationMinutes: 120,
    status: "scheduled",
    round: 4,
    repoPath: "sessions/S-04-finance.md",
    participants: [
      { name: "Wang Lei", role: { en: "Lead ERP Consultant", zh: "ERP主顾问" }, org: { en: "Implementation Partner", zh: "实施伙伴" } },
      { name: "Sun Ping", role: { en: "AP Accountant", zh: "应付会计" }, org: { en: "Finance Dept.", zh: "财务部" } },
      { name: "Hu Wei", role: { en: "Budget Controller", zh: "预算专责" }, org: { en: "Finance Dept.", zh: "财务部" } },
    ],
    agendaQuestionIds: ["Q-026", "Q-028", "Q-029", "Q-024"],
    answeredQuestionIds: [],
    spawnedQuestionIds: [],
    transcriptExcerpts: [],
    deltas: [],
  },
];
