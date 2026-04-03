# 💰 FinFlow – Finance Dashboard

## 🚀 Overview

FinFlow is a lightweight, browser-based finance dashboard that helps users track income, expenses, and financial insights through an interactive UI.

The application is built using **HTML, CSS, and JavaScript**, focusing on clean design, modular structure, and real-time data visualization.

---

## ✨ Features

### 📊 Dashboard

* Displays key financial metrics:

  * Total Balance
  * Total Income
  * Total Expenses
  * Profit / Loss status
* Bar chart visualization (Income vs Expense)
* Pie chart visualization (Category-wise spending distribution)
* Insights:

  * Highest spending category

---

### 💳 Transactions Management

* Add transactions (Admin only)
* Delete transactions (Admin only)
* View transactions in tabular format
* Search transactions by category
* Filter by:

  * Income
  * Expense
* Role-based access control (Admin / User)

---

### 🧠 State Management

* Centralized state handled using JavaScript object
* Data persistence using **localStorage**
* Automatic synchronization across pages

---

### 🎨 UI / UX

* Sidebar-based navigation
* Clean and modern layout
* Responsive design (works across screen sizes)
* Color-coded financial indicators

---

## 🛠️ Tech Stack

* HTML5
* CSS3
* JavaScript 
* Browser LocalStorage (for persistence)

---

## 📁 Project Structure

finance-dashboard/
├── index.html        # Dashboard page
├── transactions.html # Transactions page
├── style.css         # Styling
├── script.js         # Logic & state management

---

## ⚙️ How to Run

1. Download or clone the repository
2. Open `index.html` in your browser
3. Navigate between Dashboard and Transactions pages

No installation or setup required.

---

## 🔐 Role-Based Access

| Role  | Permissions               |
| ----- | ------------------------- |
| User  | View only                 |
| Admin | Add & delete transactions |

Switch roles using the dropdown on the Transactions page.

---

## 📊 Design Decisions

* **Two-page architecture**
  Separated Dashboard and Transactions for better scalability and UX.

* **LocalStorage instead of backend**
  Simulates persistent storage without requiring server setup.



---

## ⚠️ Limitations

* No backend or database
* No authentication system
* Basic validation only

---

## 🚀 Future Improvements

* Backend integration (Node.js / Java Spring Boot)
* User authentication & authorization
* Real-time data sync
* Advanced analytics (monthly trends, forecasting)
* Export data (CSV / PDF)

---

## 📌 Conclusion

This project demonstrates:

* Frontend engineering fundamentals
* State management without frameworks
* Data visualization
* Clean UI/UX design
* Structured problem-solving approach

---

