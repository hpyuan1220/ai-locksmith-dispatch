const roles = [
  ["cs", "客服人員", "確認客戶入口、AI 轉真人、報價、訂單建立與客訴初判流程。"],
  ["dispatch", "派工人員", "確認師傅媒合、搶單/指派、急件、改派、拒單與超時處理。"],
  ["locksmith", "現場師傅 / 鎖匠", "確認接單前資訊、現場異常、完工照片、料件與工時回報。"],
  ["brand", "品牌商", "確認保固、品牌資料、型號/BOM、價格與產品責任權限。"],
  ["accounting", "會計人員", "確認收款、退款、加價、代墊、師傅月結與品牌商月結。"],
  ["admin", "管理者", "統整所有角色回答，判斷文件缺口、衝突與正式開發前決策。"],
];

const questions = {
  cs: [
    q("現行流程", "客戶現在通常從哪些入口進來？LINE、電話、品牌商、官網或其他？", ["PRD", "SRS"]),
    q("AI 分診", "哪些問題可以由 AI 直接回答？哪些情況一定要轉真人客服？", ["ProblemCard", "HITL"]),
    q("報價", "客服現在如何產生報價？哪些價格可以固定，哪些只能人工判斷？", ["Pricing", "WorkOrder"]),
    q("訂單成立", "客戶確認報價後，現在怎麼建立訂單？是否需要事前收款？", ["WorkOrder", "Payment"]),
    q("客訴", "客訴現在如何建立、分類、追蹤與結案？", ["CRM", "Exception"]),
  ],
  dispatch: [
    q("派工規則", "現在派工主要依據什麼？地區、品牌能力、師傅熟悉度、評分、庫存或其他？", ["Dispatch", "RBAC"]),
    q("搶單 / 指派", "哪些案件可以讓師傅搶單？哪些案件一定要人工指派？", ["Dispatch", "WorkOrder"]),
    q("拒單與改派", "師傅拒單、超時未接、臨時取消時，現在怎麼改派？", ["Exception", "Dispatch"]),
    q("急件", "緊急案件如何判斷？需要多快回覆、多快派工、多快到場？", ["SLA", "Dispatch"]),
    q("派工錯誤", "派錯師傅、派錯地區、派錯品牌能力時，現在如何補救？", ["Dispatch Log", "Exception"]),
  ],
  locksmith: [
    q("接單資訊", "師傅接單前最需要看到哪些資訊？哪些資料不足就不應該派工？", ["ProblemCard", "WorkOrder"]),
    q("現場異常", "到現場後最常發生哪些狀況與原本描述不同？", ["Exception", "Pricing"]),
    q("加價", "哪些情況會需要現場加價？誰核准？客戶不同意時怎麼處理？", ["Pricing", "Approval"]),
    q("完工回報", "完工後最少需要上傳哪些照片、材料、工時與客戶確認？", ["WorkOrder", "Evidence"]),
    q("料件", "常用智慧鎖安裝 BOM 與料件有哪些？由誰提供？缺料時怎麼辦？", ["Inventory", "BOM"]),
  ],
  brand: [
    q("品牌權限", "品牌商是否需要後台帳號？可以看到哪些案件與客戶資料？", ["RBAC", "Brand Portal"]),
    q("保固", "保固如何判斷？哪些情況是產品責任、施工責任或客戶使用問題？", ["Warranty", "CRM"]),
    q("資料更新", "品牌商是否可以更新產品手冊、BOM、價格、型號與保固規則？", ["Knowledge Base", "Inventory"]),
    q("客訴介入", "品牌商在哪些客訴或爭議案件中必須介入？", ["Complaint", "Dispute"]),
    q("月結", "品牌商案件是單筆結還是月結？需要哪些對帳欄位？", ["Accounting", "Settlement"]),
  ],
  accounting: [
    q("付款", "哪些案件需要事前付款？哪些可完工後付款？品牌商案件如何月結？", ["Accounting", "Payment"]),
    q("退款", "退款、部分退款、折讓與取消費由誰核准？金額門檻是什麼？", ["Refund", "Approval"]),
    q("師傅月結", "師傅月結單需要哪些欄位？客訴案件是否暫停付款？", ["Accounting", "Technician Settlement"]),
    q("代墊與材料", "師傅代墊材料費如何核銷？材料費如何跟品牌商或公司對帳？", ["Inventory", "Accounting"]),
    q("發票與稅務", "發票由誰開？平台、品牌商、師傅、客戶之間如何認列？", ["Accounting", "Invoice"]),
  ],
  admin: [
    q("文件缺口", "目前 system documents 中，哪些流程你認為仍不能開始開發？", ["SRS", "Gap Analysis"]),
    q("決策權限", "哪些決策必須由管理者核准？例如高金額退款、保固爭議、加價。", ["RBAC", "Approval"]),
    q("衝突收斂", "客服、師傅、品牌商、會計意見不同時，最終由誰決定？", ["Governance", "Workflow"]),
    q("開發門檻", "正式開發前，哪些文件必須先被補完並簽核？", ["WBS", "Acceptance"]),
    q("優先順序", "第一階段最重要要確認哪三個流程？為什麼？", ["PRD", "Roadmap"]),
  ],
};

const followups = [
  ["加價", ["最常加價的原因是什麼？", "誰可以核准加價？", "客戶不同意時如何處理？", "加價是否影響師傅月結？"]],
  ["缺料", ["缺哪些料最常見？", "缺料時是否改期？", "料件由品牌商、公司或師傅提供？", "是否需要庫存警示？"]],
  ["客訴", ["客訴由誰初判？", "如何判斷產品、施工或客戶責任？", "客訴是否暫停付款？", "是否需要建立售後案件？"]],
  ["退款", ["退款由誰提出？", "誰可以核准？", "是否需要雙簽？", "部分退款如何計算？"]],
  ["品牌", ["品牌商需要看到哪些資料？", "是否可更新 BOM/價格/保固？", "品牌商與客服意見不同時誰決定？"]],
  ["照片", ["照片要拍哪些角度？", "照片是否作為爭議證據？", "照片是否要給客戶/品牌商看？"]],
  ["月結", ["月結週期是每月幾號？", "需要哪些欄位？", "客訴或退款是否扣款？"]],
];

const docProgress = [
  ["PRD", 35],
  ["SRS", 30],
  ["ProblemCard", 45],
  ["WorkOrder", 40],
  ["Exception Flow", 25],
  ["Pricing", 30],
  ["Accounting", 30],
  ["Inventory / BOM", 20],
  ["RBAC", 35],
  ["Communication", 25],
];

const docTags = ["PRD", "SRS", "ProblemCard", "WorkOrder", "Dispatch", "Pricing", "Exception", "Accounting", "Inventory", "BOM", "RBAC", "Communication"];

let activeRole = null;
let answers = JSON.parse(localStorage.getItem("aiLocksmithAnswers") || "{}");

function q(category, text, docs) {
  return { category, text, docs };
}

function init() {
  renderRoles();
  renderProgress();
  renderMappings();
  renderInsights();
  bindActions();
}

function bindActions() {
  document.getElementById("saveBtn").addEventListener("click", saveAnswers);
  document.getElementById("exportBtn").addEventListener("click", showReport);
  document.getElementById("closeDialog").addEventListener("click", () => document.getElementById("reportDialog").close());
  document.getElementById("copyReport").addEventListener("click", copyReport);
  document.getElementById("downloadReport").addEventListener("click", downloadReport);
}

function renderRoles() {
  document.getElementById("roleList").innerHTML = roles
    .map(([id, name]) => `<button class="role-btn" data-role="${id}">${name}</button>`)
    .join("");
  document.querySelectorAll(".role-btn").forEach((btn) => btn.addEventListener("click", () => selectRole(btn.dataset.role)));
}

function selectRole(roleId) {
  activeRole = roleId;
  const [, name, description] = roles.find(([id]) => id === roleId);
  document.querySelectorAll(".role-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.role === roleId));
  document.getElementById("roleTitle").textContent = name;
  document.getElementById("roleDescription").textContent = description;
  renderQuestions();
}

function renderQuestions() {
  const list = questions[activeRole] || [];
  document.getElementById("questionPanel").innerHTML = list
    .map((item, index) => {
      const key = `${activeRole}-${index}`;
      const value = answers[key] || "";
      return `
        <article class="question-card">
          <h3>${item.category}</h3>
          <p>${item.text}</p>
          <div class="meta">${item.docs.map((doc) => `<span class="tag">${doc}</span>`).join("")}</div>
          <textarea data-key="${key}" placeholder="請寫現在怎麼做、最常遇到的問題、希望未來系統怎麼處理...">${value}</textarea>
          <div class="followup-target" id="followup-${key}"></div>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll("textarea[data-key]").forEach((textarea) => {
    textarea.addEventListener("input", (event) => {
      answers[event.target.dataset.key] = event.target.value;
      saveAnswers(false);
      renderFollowup(event.target.dataset.key, event.target.value);
      renderInsights();
      renderProgress();
    });
    renderFollowup(textarea.dataset.key, textarea.value);
  });
}

function renderFollowup(key, value) {
  const target = document.getElementById(`followup-${key}`);
  if (!target) return;
  const matches = followups.filter(([keyword]) => value.includes(keyword));
  target.innerHTML = matches
    .map(
      ([, items]) => `
      <div class="followup-card">
        <strong>建議追問</strong>
        <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
    `,
    )
    .join("");
}

function renderProgress() {
  const total = Object.values(questions).flat().length;
  const filled = Object.values(answers).filter((value) => value && value.trim()).length;
  const base = Math.round((filled / total) * 100);
  document.getElementById("docProgress").innerHTML = docProgress
    .map(([label, pct]) => {
      const adjusted = Math.min(100, pct + Math.round(base * 0.35));
      return `
        <div class="progress-row">
          <div class="progress-label"><span>${label}</span><span>${adjusted}%</span></div>
          <div class="bar"><span style="width:${adjusted}%"></span></div>
        </div>
      `;
    })
    .join("");
}

function renderMappings() {
  document.getElementById("mappingList").innerHTML = docTags.map((tag) => `<span>${tag}</span>`).join("");
}

function renderInsights() {
  const filled = Object.values(answers).filter((value) => value && value.trim()).length;
  const total = Object.values(questions).flat().length;
  const insights = [
    `目前已填寫 ${filled} / ${total} 題。`,
    "客服與師傅答案不同時，需列入「開發前待決策」。",
    "涉及加價、退款、保固、客訴的答案，必須回填 Exception Flow 與 Accounting Spec。",
    "BOM、庫存與材料責任若未確認，不建議開始正式派工模組開發。",
  ];
  document.getElementById("insightList").innerHTML = insights.map((item) => `<div class="insight">${item}</div>`).join("");
}

function saveAnswers(showAlert = true) {
  localStorage.setItem("aiLocksmithAnswers", JSON.stringify(answers));
  if (showAlert) alert("已儲存到這台裝置的瀏覽器。");
}

function buildReport() {
  const lines = [
    "# AI Locksmith Dispatch - System Documents Update Report",
    "",
    `產出時間：${new Date().toLocaleString("zh-TW")}`,
    "",
    "## 報告目的",
    "本報告彙整客服、派工、現場師傅、品牌商、會計與管理者的回答，用來協助 AI specialist 更新正式開發前的 system documents。",
    "",
  ];

  roles.forEach(([roleId, name]) => {
    lines.push(`## ${name}`);
    (questions[roleId] || []).forEach((item, index) => {
      const answer = answers[`${roleId}-${index}`] || "尚未填寫";
      lines.push(`### ${item.category}`);
      lines.push(`問題：${item.text}`);
      lines.push(`對應文件：${item.docs.join(", ")}`);
      lines.push(`回答：${answer}`);
      lines.push("");
    });
  });

  lines.push("## AI Specialist 開發前提醒");
  lines.push("- 請先依本報告更新 PRD / SRS / ProblemCard / WorkOrder / Exception Flow。");
  lines.push("- 請確認加價、退款、保固、客訴、缺料、改派、月結規則後再開發正式派工系統。");
  lines.push("- 若不同角色答案衝突，請先由管理者決策，不要直接寫入系統邏輯。");

  return lines.join("\n");
}

function showReport() {
  const report = buildReport();
  document.getElementById("reportOutput").value = report;
  document.getElementById("reportDialog").showModal();
}

async function copyReport() {
  await navigator.clipboard.writeText(document.getElementById("reportOutput").value);
  alert("已複製報告文字。");
}

function downloadReport() {
  const blob = new Blob([document.getElementById("reportOutput").value], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ai-locksmith-system-documents-update-report.md";
  a.click();
  URL.revokeObjectURL(url);
}

init();
