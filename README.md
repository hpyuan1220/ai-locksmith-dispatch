# AI Locksmith Dispatch - System Document Completion Web App

這個 Web App 是正式開發「智慧鎖 AI 客服與派工平台」前使用的 **System Document Completion Tool**。

它不是正式派工平台，也不是產品 MVP。它的目的，是讓客服、派工人員、現場師傅、品牌商、會計與管理者回答關鍵問題，協助 AI specialist 在正式開發前補完整套 system documents。

## 使用目的

此工具用來收集：

- 現行工作流程
- 現場痛點
- AI 客服需要追問的問題
- ProblemCard 必填欄位
- 派工與接單規則
- 現場異常與加價流程
- 付款、退款、月結邏輯
- BOM、料件與庫存規則
- 客訴與售後處理
- 聊天群組與角色權限

## 為什麼要先做這個 Web App

目前正式系統文件中已有 PRD、SRS、WBS、Module Breakdown、ProblemCard、Dispatch、Accounting、Exception Flow 等初步內容，但許多規則仍屬於設計假設。

在正式 project development 開始前，需要透過這個 Web App 收集現場人員回覆，將真實流程轉成可開發、可驗收、可追蹤的 system documents。

## 本機預覽

Irene 本機目前預覽網址：

[http://127.0.0.1:8123/index.html](http://127.0.0.1:8123/index.html)

注意：`127.0.0.1` 是本機網址，只有 Irene 自己的電腦可以開啟。若要分享給 AI specialist，請使用 GitHub Pages 或其他正式網址部署。

## 檔案

- `index.html`：Web App 主頁
- `styles.css`：版面樣式
- `script.js`：角色問題、追問邏輯與匯出功能

## 給 AI Specialist 的重點

正式開發派工平台前，請先使用此工具確認現場流程，並根據填寫結果更新：

- PRD
- SRS
- ProblemCard Schema
- WorkOrder Lifecycle
- Dispatch Spec
- Pricing Spec
- Exception Flow Design
- Accounting Spec
- Inventory / BOM Spec
- RBAC / Permission Matrix
- Communication / Chat Spec
