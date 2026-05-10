const roles = [
  {
    id: "cs",
    name: "客服人員",
    description: "確認客戶入口、AI 轉真人、報價、訂單建立與客訴初判流程。",
  },
  {
    id: "dispatch",
    name: "派工人員",
    description: "確認師傅媒合、搶單/指派、急件、改派、拒單與超時處理。",
  },
  {
    id: "locksmith",
    name: "現場師傅 / 鎖匠",
    description: "確認接單前資訊、現場異常、完工照片、料件與工時回報。",
  },
  {
    id: "brand",
    name: "品牌商",
    description: "確認保固、品牌資料、型號/BOM、價格與產品責任權限。",
  },
  {
    id: "accounting",
    name: "會計人員",
    description: "確認收款、退款、加價、代墊、師傅月結與品牌商月結。",
  },
  {
    id: "admin",
    name: "管理者",
    description: "統整所有角色回答，判斷文件缺口、衝突與正式開發前決策。",
  },
];

const questions = {
  cs: [
    ["現行流程", "客戶現在通常從哪些入口進來？LINE、電話、品牌商、官網或其他？", ["PRD", "SRS"]],
    ["AI 分診", "哪些問題可以由 AI 直接回答？哪些情況一定要轉真人客服？", ["ProblemCard", "HITL"]],
    ["報價", "客服現在如何產生報價？哪些價格可以固定，哪些只能人工判斷？", ["Pricing", "WorkOrder"]],
    ["客訴", "客訴現在如何建立、分類、追蹤與結案？", ["CRM", "Exception"]],
  ],
  dispatch: [
    ["派工規則", "現在派工主要依據什麼？地區、品牌能力、師傅熟悉度、評分、庫存或其他？", ["Dispatch", "RBAC"]],
    ["接單", "哪些案件可以讓師傅搶單？哪些案件一定要人工指派？", ["Dispatch", "WorkOrder"]],
    ["改派", "師傅拒單、超時未接、臨時取消時，現在怎麼改派？", ["Exception", "Dispatch"]],
    ["急件", "緊急案件如何判斷？需要多快回覆、多快派工、多快到場？", ["SLA", "Dispatch"]],
  ],
  locksmith: [
    ["接單資訊", "師傅接單前最需要看到哪些資訊？哪些資料不足就不應該派工？", ["ProblemCard", "WorkOrder"]],
    ["現場異常", "到現場後最常發生哪些狀況與原本描述不同？", ["Exception", "Pricing"]],
    ["完工回報", "完工後最少需要上傳哪些照片、材料、工時與客戶確認？", ["WorkOrder", "Evidence"]],
    ["料件", "常用智慧鎖安裝 BOM 與料件有哪些？由誰提供？缺料時怎麼辦？", ["Inventory", "BOM"]],
  ],
  brand: [
    ["品牌權限", "品牌商是否需要後台帳號？可以看到哪些案件與客戶資料？", ["RBAC", "Brand Portal"]],
    ["保固", "保固如何判斷？哪些情況是產品責任、施工責任或客戶使用問題？", ["Warranty", "CRM"]],
    ["資料更新", "品牌商是否可以更新產品手冊、BOM、價格、型號與保固規則？", ["Knowledge Base", "Inventory"]],
    ["客訴", "品牌商在哪些客訴或爭議案件中必須介入？", ["Complaint", "Dispute"]],
  ],
  accounting: [
    ["付款", "哪些案件需要事前付款？哪些可完工後付款？品牌商案件如何月結？", ["Accounting", "Payment"]],
    ["退款", "退款、部分退款、折讓與取消費由誰核准？金額門檻是什麼？", ["Refund", "Approval"]],
    ["師傅月結", "師傅月結單需要哪些欄位？客訴案件是否暫停付款？", ["Accounting", "Technician Settlement"]],
    ["代墊與材料", "師傅代墊材料費如何核銷？材料費如何跟品牌商或公司對帳？", ["Inventory", "Accounting"]],
  ],
  admin: [
    ["文件缺口", "目前 system documents 中，哪些流程你認為仍不能開始開發？", ["SRS", "Gap Analysis"]],
    ["決策權限", "哪些決策必須由管理者核准？例如高金額退款、保固爭議、加價。", ["RBAC", "Approval"]],
    ["衝突收斂", "客服、師傅、品牌商、會計意見不同時，最終由誰決定？", ["Governance", "Workflow"]],
    ["開發門檻", "正式開發前，哪些文件必須先被補完並簽核？", ["WBS", "Acceptance"]],
  ],
};

const followups = [
  {
    keyword: "加價",
    items: ["最常加價的原因是什麼？", "誰可以核准加價？", "客戶不同意時如何處理？", "加價是否影響師傅月結？"],
  },
  {
    keyword: "缺料",
    items: ["缺哪些料最常見？", "缺料時是否改期？", "料件由品牌商、公司或師傅提供？", "是否需要庫存警示？"],
  },
  {
    keyword: "客訴",
    items: ["客訴由誰初判？", "如何判斷產品、施工或客戶責任？", "客訴是否暫停付款？", "是否需要建立售後案件？"],
  },
  {
    keyword: "退款",
    items: ["退款由誰提出？", "誰可以核准？", "是否需要雙簽？", "部分退款如何計算？"],
  },
  {
    keyword: "品牌",
    items: ["品牌商需要看到哪些資料？", "是否可更新 BOM/價格/保固？", "品牌商與客服意見不同時誰決定？"],
  },
];

const docProgress = [
  ["PRD", 35],
  ["ProblemCard", 45],
  ["WorkOrder", 40],
  ["Exception Flow", 25],
  ["Accounting", 30],
  ["Inventory / BOM", 20],
  ["RBAC", 35],
];

const answers = {};
let activeRole = null;

function init() {
  renderRoles();
  renderProgress();
  renderInsights();
  document.getElementById("exportBtn").addEventListener("click", exportReport);
}

function renderRoles() {
  const roleList = document.getElementById("roleList");
  roleList.innerHTML = roles
    .map((role) => `<button class="role-btn" data-role="${role.id}">${role.name}</button>`)
    .join("");
  roleList.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => selectRole(btn.dataset.role));
  });
}

function selectRole(roleId) {
  activeRole = roleId;
  const role = roles.find((item) => item.id === roleId);
  document.querySelectorAll(".role-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.role === roleId);
  });
  document.getElementById("roleTitle").textContent = role.name;
  document.getElementById("roleDescription").textContent = role.description;
  renderQuestions();
}

function renderQuestions() {
  const panel = document.getElementById("questionPanel");
  panel.innerHTML = questions[activeRole]
    .map(([category, text, docs], index) => {
      const key = `${activeRole}-${index}`;
      const value = answers[key] || "";
      return `
        <article class="question-card">
          <h3>${category}</h3>
          <p>${text}</p>
          <div class="meta">${docs.map((doc) => `<span class="tag">${doc}</span>`).join("")}</div>
          <textarea data-key="${key}" placeholder="請輸入現行流程、痛點、例外情境或希望未來系統如何處理...">${value}</textarea>
          <div class="followup-target" id="followup-${key}"></div>
        </article>
      `;
    })
    .join("");

  panel.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("input", (event) => {
      answers[event.target.dataset.key] = event.target.value;
      renderFollowup(event.target.dataset.key, event.target.value);
      renderInsights();
    });
    renderFollowup(textarea.dataset.key, textarea.value);
  });
}

function renderFollowup(key, value) {
  const target = document.getElementById(`followup-${key}`);
  if (!target) return;
  const matched = followups.find((item) => value.includes(item.keyword));
  target.innerHTML = matched
    ? `<div class="followup-card"><strong>建議追問</strong><ul>${matched.items
        .map((item) => `<li>${item}</li>`)
        .join("")}</ul></div>`
    : "";
}

function renderProgress() {
  document.getElementById("docProgress").innerHTML = docProgress
    .map(
      ([label, pct]) => `
      <div class="progress-row">
        <div class="progress-label"><span>${label}</span><span>${pct}%</span></div>
        <div class="bar"><span style="width:${pct}%"></span></div>
      </div>
    `,
    )
    .join("");
}

function renderInsights() {
  const count = Object.values(answers).filter(Boolean).length;
  const insights = [
    "若同一題在客服與師傅答案不同，需列入「開發前待決策」。",
    "任何涉及加價、退款、保固、客訴的答案，都必須回填到 Exception Flow 與 Accounting Spec。",
    "BOM、庫存與材料責任若未確認，不建議開始正式派工模組開發。",
    `目前已填寫 ${count} 題，尚需完成跨角色比對後才能輸出正式文件補完報告。`,
  ];
  document.getElementById("insightList").innerHTML = insights
    .map((item) => `<div class="insight">${item}</div>`)
    .join("");
}

function exportReport() {
  const lines = ["# System Documents Update Report", ""];
  roles.forEach((role) => {
    lines.push(`## ${role.name}`);
    (questions[role.id] || []).forEach(([category, text, docs], index) => {
      const answer = answers[`${role.id}-${index}`] || "尚未填寫";
      lines.push(`### ${category}`);
      lines.push(`問題：${text}`);
      lines.push(`對應文件：${docs.join(", ")}`);
      lines.push(`回答：${answer}`);
      lines.push("");
    });
  });

  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "system-documents-update-report.md";
  a.click();
  URL.revokeObjectURL(url);
}

init();

