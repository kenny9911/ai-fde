import type { Source } from "@/lib/types";

/**
 * The evidence corpus. Note the deliberate imperfections — unreadable slides,
 * partial extractions, un-analysed pages. A source library that claims 100%
 * clean extraction is lying, and the completeness checker exists precisely to
 * surface what was missed.
 */
export const sources: Source[] = [
  {
    id: "SRC-01",
    kind: "deck",
    title: {
      en: "Materials Procurement Business Blueprint — Provincial Review",
      zh: "物资采购业务蓝图汇报（省公司评审版）",
    },
    provider: { en: "Materials Dept.", zh: "物资部" },
    receivedAt: "2026-06-16",
    repoPath: "sources/SRC-01/",
    status: "extracted",
    unreadablePages: [42],
    pages: [
      {
        index: 6,
        title: { en: "Procurement lifecycle overview", zh: "采购全流程总览" },
        extractedText:
          "全流程分九个环节：需求申报 → 需求归集 → 采购计划 → 采购方式确定 → 寻源（招标/谈判/单一来源）→ 合同签订 → 订单执行 → 收货验收 → 结算付款。各环节均需在省公司电子商务平台留痕。",
        entities: ["需求申报", "采购计划", "采购方式", "寻源", "合同", "订单", "验收", "结算"],
        analyzed: true,
      },
      {
        index: 11,
        title: { en: "Requisition granularity & consolidation", zh: "需求申报颗粒度与归集" },
        extractedText:
          "需求由生产技术部、基建部按物料编码申报，物资部按品类归集形成年度批次。零星采购单独走绿色通道。（本页未说明零星采购的金额阈值）",
        entities: ["物料编码", "品类归集", "年度批次", "零星采购"],
        analyzed: true,
        note: {
          en: "Threshold for 'sporadic procurement' is referenced but never stated anywhere in this deck.",
          zh: "本页提及“零星采购”阈值，但全篇未给出具体金额标准。",
        },
      },
      {
        index: 14,
        title: { en: "Sourcing method decision matrix", zh: "采购方式决策矩阵" },
        extractedText:
          "公开招标：单项 ≥ 400万元；邀请招标：200万–400万元；竞争性谈判：50万–200万元；询价：10万–50万元；单一来源：需专项审批，不设金额限制但需说明唯一性理由。",
        entities: ["公开招标", "邀请招标", "竞争性谈判", "询价", "单一来源"],
        analyzed: true,
      },
      {
        index: 23,
        title: { en: "Supplier qualification", zh: "供应商准入" },
        extractedText:
          "供应商须通过资格预审后进入合格供应商名录。名录按物料大类维护，有效期两年。不良行为记录触发暂停或清退。",
        entities: ["资格预审", "合格供应商名录", "物料大类", "不良行为"],
        analyzed: true,
      },
      {
        index: 31,
        title: { en: "Goods receipt & inspection", zh: "收货与质量验收" },
        extractedText:
          "到货后仓储保管员做收货登记，质检员在5个工作日内完成验收。验收合格生成验收报告，不合格进入退货或让步接收流程。",
        entities: ["收货登记", "质量验收", "验收报告", "退货", "让步接收"],
        analyzed: true,
      },
      {
        index: 34,
        title: { en: "Settlement & payment", zh: "结算与付款" },
        extractedText:
          "验收合格后供应商开票，财务做三单匹配（订单-收货单-发票），匹配通过进入付款审批。付款账期按合同约定，一般为验收后60天。",
        entities: ["开票", "三单匹配", "付款审批", "账期"],
        analyzed: true,
      },
      {
        index: 42,
        title: { en: "Exception handling (unreadable)", zh: "异常处理（无法识别）" },
        extractedText: "",
        entities: [],
        analyzed: false,
        note: {
          en: "Slide is a flattened image of a hand-drawn flowchart at 96dpi. OCR produced nothing usable. Flagged for consultant walkthrough.",
          zh: "本页为手绘流程图的低分辨率位图（96dpi），OCR 无有效输出。已标记需顾问口头讲解。",
        },
      },
      {
        index: 45,
        title: { en: "Contract change management", zh: "合同变更管理" },
        extractedText:
          "合同变更须签订补充协议，变更金额超原合同10%的需重新履行审批程序。（未说明变更是否影响已下达订单）",
        entities: ["补充协议", "变更审批", "10%阈值"],
        analyzed: false,
        note: {
          en: "Extracted but not yet consumed by the analyst pass — queued for round 4.",
          zh: "已提取但分析环节尚未消费，排入第 4 轮。",
        },
      },
    ],
  },
  {
    id: "SRC-02",
    kind: "deck",
    title: {
      en: "metaERP Procurement Domain — Standard Process Reference",
      zh: "metaERP 采购域标准流程说明",
    },
    provider: { en: "Implementation Partner", zh: "实施伙伴" },
    receivedAt: "2026-06-18",
    repoPath: "sources/SRC-02/",
    status: "extracted",
    unreadablePages: [],
    pages: [
      {
        index: 8,
        title: { en: "metaERP PR→PO object chain", zh: "metaERP 请购到订单对象链" },
        extractedText:
          "metaERP 采购域核心对象：PurchaseRequisition → SourcingRequest → PurchaseOrder → GoodsReceipt → SupplierInvoice → PaymentProposal。对象间通过 documentFlow 关联，支持逐级追溯。",
        entities: [
          "PurchaseRequisition",
          "SourcingRequest",
          "PurchaseOrder",
          "GoodsReceipt",
          "SupplierInvoice",
          "PaymentProposal",
        ],
        analyzed: true,
      },
      {
        index: 15,
        title: { en: "Tolerance configuration", zh: "容差配置" },
        extractedText:
          "三单匹配容差在 metaERP 中按公司代码（CompanyCode）配置，支持数量容差与金额容差，可设上下限。标准交付为集团统一配置。",
        entities: ["CompanyCode", "数量容差", "金额容差"],
        analyzed: true,
      },
      {
        index: 19,
        title: { en: "Tendering is not native", zh: "招标非标准能力" },
        extractedText:
          "metaERP 标准采购域不含招投标管理，SourcingRequest 仅支持询价（RFQ）。招投标须由外部电子商务平台承担，通过接口回写中标结果。",
        entities: ["SourcingRequest", "RFQ", "电子商务平台", "接口回写"],
        analyzed: true,
      },
      {
        index: 24,
        title: { en: "Supplier master & qualification", zh: "供应商主数据与资质" },
        extractedText:
          "metaERP 供应商主数据为全局唯一，资质（Qualification）作为扩展属性挂在供应商下，可按采购组织（PurchasingOrg）分配，但标准字段不支持按物料大类分段有效。",
        entities: ["供应商主数据", "Qualification", "PurchasingOrg"],
        analyzed: true,
      },
    ],
  },
  {
    id: "SRC-03",
    kind: "transcript",
    title: {
      en: "Materials Dept. procurement interview — raw transcript",
      zh: "物资部采购业务访谈口水稿",
    },
    provider: { en: "Materials Dept. / Procurement Section", zh: "物资部采购科" },
    receivedAt: "2026-06-24",
    repoPath: "sources/SRC-03/",
    status: "extracted",
    unreadablePages: [],
    pages: [
      {
        index: 1,
        title: { en: "00:00–14:00 requisition reality", zh: "00:00–14:00 需求申报实况" },
        extractedText:
          "……其实蓝图上写的是按物料编码报，但实际基建项目是按WBS报的，物料编码是我们物资部后面帮着补的。这个差异一直没在系统里体现……",
        entities: ["物料编码", "WBS", "基建项目"],
        analyzed: true,
      },
      {
        index: 2,
        title: { en: "14:00–28:00 tendering handoff", zh: "14:00–28:00 招标环节交接" },
        extractedText:
          "……招标是在电商平台做的，ERP里只能看到结果。中标之后我们手工把中标供应商和价格录回ERP，这一步经常滞后两三天……废标重招的时候，采购方式要不要重新审批，各省做法不一样……",
        entities: ["电商平台", "中标结果", "手工录入", "废标重招"],
        analyzed: true,
      },
      {
        index: 3,
        title: { en: "28:00–41:00 receipt & inspection", zh: "28:00–41:00 收货与验收" },
        extractedText:
          "……验收合格才算数，但收货单是到货当天就开的。中间这段如果质检不合格，收货单要冲销，冲销单据在系统里挺麻烦的……让步接收要分管领导签字，签完了还是走正常付款……",
        entities: ["验收", "收货单", "冲销", "让步接收"],
        analyzed: true,
      },
      {
        index: 4,
        title: { en: "41:00–55:00 payment friction", zh: "41:00–55:00 付款环节摩擦" },
        extractedText:
          "……账期是验收后60天，但实际上从验收到发票到付款申请，中间还有个预算科的复核，这个复核蓝图里没写……有预付款的合同，预付比例和保函到期怎么联动，我们现在是台账手工盯的……",
        entities: ["账期", "预算复核", "预付款", "保函", "手工台账"],
        analyzed: true,
      },
    ],
  },
  {
    id: "SRC-04",
    kind: "screenshot",
    title: {
      en: "Legacy ERP procurement screens",
      zh: "现行 ERP 采购模块页面截图",
    },
    provider: { en: "IT Dept.", zh: "信息化部" },
    receivedAt: "2026-06-20",
    repoPath: "sources/SRC-04/",
    status: "partial",
    unreadablePages: [17, 18, 19],
    pages: [
      {
        index: 3,
        title: { en: "Requisition entry screen", zh: "请购单录入界面" },
        extractedText:
          "字段：申请单号、申请部门、需求日期、物料编码、名称规格、数量、单位、预算科目、项目号、紧急标识、附件。",
        entities: ["申请单号", "预算科目", "项目号", "紧急标识"],
        analyzed: true,
      },
      {
        index: 9,
        title: { en: "Three-way match result", zh: "三单匹配结果界面" },
        extractedText:
          "显示订单数量/收货数量/发票数量三列对比，差异行标红。界面上有“容差范围内自动放行”勾选项，当前为灰置不可编辑。",
        entities: ["三单对比", "差异标红", "容差自动放行"],
        analyzed: true,
      },
      {
        index: 17,
        title: { en: "Payment approval (illegible)", zh: "付款审批（不可辨认）" },
        extractedText: "",
        entities: [],
        analyzed: false,
        note: {
          en: "Screenshot captured at 640px width; field labels unreadable. Re-capture requested from IT.",
          zh: "截图宽度仅 640px，字段标签无法辨认。已要求信息化部重新截取。",
        },
      },
    ],
  },
  {
    id: "SRC-05",
    kind: "document",
    title: {
      en: "Materials Procurement Management Measures (internal regulation)",
      zh: "物资采购管理办法（内部制度文件）",
    },
    provider: { en: "Discipline & Audit Dept.", zh: "监察审计部" },
    receivedAt: "2026-06-19",
    repoPath: "sources/SRC-05/",
    status: "extracted",
    unreadablePages: [],
    pages: [
      {
        index: 12,
        title: { en: "Authority matrix", zh: "审批权限矩阵" },
        extractedText:
          "第十八条 采购方式审批权限：500万元以下由物资部部门负责人审批；500万–2000万元由分管领导审批；2000万元以上报公司党委会审议。单一来源采购一律报分管领导，并抄送监察审计部。",
        entities: ["审批权限", "分管领导", "党委会", "单一来源", "监察审计"],
        analyzed: true,
      },
      {
        index: 21,
        title: { en: "Integrity & anti-corruption controls", zh: "廉洁与反腐控制" },
        extractedText:
          "第二十九条 评标专家从省公司专家库随机抽取，抽取过程全程录像；评标期间实行封闭管理。第三十条 采购全流程留痕，监察审计部可随时调阅。",
        entities: ["专家库", "随机抽取", "封闭管理", "全流程留痕"],
        analyzed: true,
      },
    ],
  },
  {
    id: "SRC-06",
    kind: "spreadsheet",
    title: {
      en: "2025 procurement categories & volume thresholds",
      zh: "2025年度采购品类与金额阈值表",
    },
    provider: { en: "Materials Dept.", zh: "物资部" },
    receivedAt: "2026-06-26",
    repoPath: "sources/SRC-06/",
    status: "extracted",
    unreadablePages: [],
    pages: [
      {
        index: 1,
        title: { en: "Category thresholds", zh: "品类阈值" },
        extractedText:
          "一次设备（变压器、开关柜）年度批次集采；二次设备按季度批次；线材电缆年度框架协议；零星辅材 10万元以下部门自行采购。",
        entities: ["一次设备", "二次设备", "线材电缆", "框架协议", "零星辅材"],
        analyzed: true,
      },
    ],
  },
];
