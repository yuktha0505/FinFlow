let state = {
  transactions: JSON.parse(localStorage.getItem("data")) || [],
  role: "user",
  filter: "all",
  search: "",
  editId: null
};

// SAVE
function save() {
  localStorage.setItem("data", JSON.stringify(state.transactions));
}

// ADD BUTTON
const addBtn = document.getElementById("addBtn");
if (addBtn) {
  addBtn.onclick = () => {
    if (state.role !== "admin") return alert("Admin only");
    document.getElementById("modal").classList.remove("hidden");
  };
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
const search = document.getElementById("search");
if (search) {
  search.oninput = (e) => {
    state.search = e.target.value.toLowerCase();
    render();
  };
}

// SAVE TXN
function saveTransaction() {
  const category = document.getElementById("category").value;
  const amount = +document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  if (!category || !amount) return alert("Fill all");

  state.transactions.push({
    id: Date.now(),
    category,
    amount,
    type,
    date: new Date().toLocaleDateString()
  });

  save();
  render();
  document.getElementById("modal").classList.add("hidden");
}

// DELETE
function deleteTxn(id) {
  state.transactions = state.transactions.filter(t => t.id !== id);
  save();
  render();
}

// TABLE
function renderTable() {
  const body = document.getElementById("tableBody");
  if (!body) return;

  let data = state.transactions;

  if (state.filter !== "all") {
    data = data.filter(t => t.type === state.filter);
  }

  if (state.search) {
    data = data.filter(t =>
      t.category.toLowerCase().includes(state.search)
    );
  }

  body.innerHTML = "";

  if (data.length === 0) {
    body.innerHTML = "<tr><td colspan='5'>No Data</td></tr>";
    return;
  }

  data.forEach(t => {
    body.innerHTML += `
      <tr>
        <td>${t.date}</td>
        <td>${t.category}</td>
        <td>${t.type}</td>
        <td>${t.amount}</td>
        <td>
          ${state.role === "admin"
            ? `<button onclick="deleteTxn(${t.id})">Delete</button>`
            : ""}
        </td>
      </tr>
    `;
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

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = balance;

  const status = balance >= 0 ? "Profit" : "Loss";
  const statusEl = document.getElementById("status");

  statusEl.innerText = status;
  statusEl.style.color = balance >= 0 ? "green" : "red";

  renderInsights();
  renderChart(income, expense);
}

// INSIGHTS
function renderInsights() {
  const el = document.getElementById("insightText");
  if (!el) return;

  const expenses = state.transactions.filter(t => t.type === "expense");

  if (expenses.length === 0) {
    el.innerText = "No insights";
    return;
  }

  const map = {};
  expenses.forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });

  const top = Object.keys(map).reduce((a, b) =>
    map[a] > map[b] ? a : b
  );

  el.innerText = `Top spending category: ${top}`;
}

// CHART
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
        data: [income, expense]
      }]
    }
  });
}

// MAIN
function render() {
  renderTable();
  renderDashboard();
}

render();