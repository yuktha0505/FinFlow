let state = {
  transactions: JSON.parse(localStorage.getItem("data")) || [],
  role: "user",
  filter: "all",
  search: "",
};

// SAVE
function save() {
  localStorage.setItem("data", JSON.stringify(state.transactions));
}

// MODAL OPEN / CLOSE
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

const addBtn = document.getElementById("addBtn");
if (addBtn) {
  addBtn.onclick = () => {
    if (state.role !== "admin") return alert("Switch to Admin role to add transactions.");
    // set today's date as default
    document.getElementById("txnDate").value = new Date().toISOString().slice(0, 10);
    document.getElementById("modal").classList.remove("hidden");
  };
}

// Close modal on overlay click
const modal = document.getElementById("modal");
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

// ROLE
const roleSelect = document.getElementById("roleSelect");
if (roleSelect) {
  roleSelect.onchange = (e) => {
    state.role = e.target.value;
    render();
  };
}

// FILTER
const filterType = document.getElementById("filterType");
if (filterType) {
  filterType.onchange = (e) => {
    state.filter = e.target.value;
    render();
  };
}

// SEARCH
const searchEl = document.getElementById("search");
if (searchEl) {
  searchEl.oninput = (e) => {
    state.search = e.target.value.toLowerCase();
    render();
  };
}

// SAVE TXN
function saveTransaction() {
  const category = document.getElementById("category").value.trim();
  const amount   = +document.getElementById("amount").value;
  const type     = document.getElementById("type").value;
  const dateVal  = document.getElementById("txnDate").value;

  if (!category || !amount || !dateVal) return alert("Please fill all fields.");

  // format date nicely
  const date = new Date(dateVal).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });

  state.transactions.push({ id: Date.now(), category, amount, type, date });
  save();
  render();
  closeModal();

  // reset fields
  document.getElementById("category").value = "";
  document.getElementById("amount").value   = "";
}

// DELETE
function deleteTxn(id) {
  if (!confirm("Delete this transaction?")) return;
  state.transactions = state.transactions.filter(t => t.id !== id);
  save();
  render();
}

// TABLE
function renderTable() {
  const body = document.getElementById("tableBody");
  if (!body) return;

  let data = [...state.transactions];
  if (state.filter !== "all") data = data.filter(t => t.type === state.filter);
  if (state.search) data = data.filter(t => t.category.toLowerCase().includes(state.search));

  body.innerHTML = "";

  if (data.length === 0) {
    body.innerHTML = `<tr class="empty-row"><td colspan="5">📭 No transactions found</td></tr>`;
    return;
  }

  data.forEach(t => {
    body.innerHTML += `
      <tr>
        <td>${t.date}</td>
        <td>${t.category}</td>
        <td><span class="badge badge-${t.type}">${t.type}</span></td>
        <td>₹${t.amount.toLocaleString("en-IN")}</td>
        <td>
          ${state.role === "admin"
            ? `<button onclick="deleteTxn(${t.id})">Delete</button>`
            : "—"}
        </td>
      </tr>`;
  });
}

// DASHBOARD
function renderDashboard() {
  const incomeEl = document.getElementById("income");
  if (!incomeEl) return;

  let income = 0, expense = 0;
  state.transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  const balance = income - expense;

  document.getElementById("income").innerText  = income.toLocaleString("en-IN");
  document.getElementById("expense").innerText = expense.toLocaleString("en-IN");
  document.getElementById("balance").innerText = balance.toLocaleString("en-IN");

  const statusEl = document.getElementById("status");
  statusEl.innerText = balance >= 0 ? "Profit" : "Loss";
  statusEl.style.color = balance >= 0 ? "#16a34a" : "#dc2626";

  renderInsights();
  renderChart(income, expense);
  renderPieChart();
}

// INSIGHTS
function renderInsights() {
  const el = document.getElementById("insightText");
  if (!el) return;

  const txns    = state.transactions;
  const income  = txns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = txns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const expenses = txns.filter(t => t.type === "expense");

  if (txns.length === 0) {
    el.innerHTML = `<div class="insight-item">📊 Add transactions to see insights.</div>`;
    return;
  }

  // category map
  const map = {};
  expenses.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });

  const topCat = expenses.length
    ? Object.keys(map).reduce((a, b) => map[a] > map[b] ? a : b)
    : null;

  const savings = income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0;
  const txnCount = txns.length;

  let html = "";
  if (topCat)      html += `<div class="insight-item">🏆 Top spending category: <strong>${topCat}</strong> — ₹${map[topCat].toLocaleString("en-IN")}</div>`;
  if (income > 0)  html += `<div class="insight-item">💰 Savings rate: <strong>${savings}%</strong> of total income</div>`;
  if (expense > 0) html += `<div class="insight-item">📉 Total spent: <strong>₹${expense.toLocaleString("en-IN")}</strong> across ${expenses.length} expense(s)</div>`;
                   html += `<div class="insight-item">📋 Total transactions recorded: <strong>${txnCount}</strong></div>`;
  if (income < expense) html += `<div class="insight-item">⚠️ Expenses exceed income by ₹${(expense - income).toLocaleString("en-IN")} — review your spending.</div>`;

  el.innerHTML = html;
}

// BAR CHART
let chart;
function renderChart(income, expense) {
  const ctx = document.getElementById("chart");
  if (!ctx) return;
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        label: "Amount (₹)",
        data: [income, expense],
        backgroundColor: ["#bbf7d0", "#fecaca"],
        borderColor: ["#16a34a", "#dc2626"],
        borderWidth: 1.5,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          ticks: { callback: v => "₹" + v.toLocaleString("en-IN") },
          grid: { color: "#f1f5f9" }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

// PIE CHART
let pieChart;
function renderPieChart() {
  const ctx = document.getElementById("pieChart");
  if (!ctx) return;

  const map = {};
  state.transactions
    .filter(t => t.type === "expense")
    .forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });

  const labels = Object.keys(map);
  const values = Object.values(map);

  if (pieChart) pieChart.destroy();

  if (labels.length === 0) {
    const c = ctx.getContext("2d");
    c.clearRect(0, 0, ctx.width, ctx.height);
    c.fillStyle = "#94a3b8";
    c.font = "14px Segoe UI";
    c.textAlign = "center";
    c.fillText("No expense data yet", ctx.width / 2, ctx.height / 2);
    return;
  }

  const colors = ["#6366f1","#f59e0b","#10b981","#ef4444","#3b82f6","#ec4899","#14b8a6","#f97316","#8b5cf6","#06b6d4"];

  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: "#fff"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom", labels: { font: { size: 12 }, padding: 12 } },
        tooltip: { callbacks: { label: c => ` ${c.label}: ₹${c.parsed.toLocaleString("en-IN")}` } }
      }
    }
  });
}

// RENDER ALL
function render() {
  renderTable();
  renderDashboard();
}

render();
