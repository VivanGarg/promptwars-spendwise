
import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  ChartNoAxesCombined,
  Settings,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Utensils,
  Car,
  ShoppingBag,
  House,
  HeartPulse,
  GraduationCap,
  Zap,
  Coffee,
  X,
  Trash2,
  CalendarDays,
  ChevronDown,
  Bell,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

const initialTransactions = [
  { id: 1, title: "Grocery shopping", category: "Food", date: "Nov 11, 2026", amount: 2450, type: "expense", icon: ShoppingBag },
  { id: 2, title: "Monthly stipend", category: "Income", date: "Nov 10, 2026", amount: 12000, type: "income", icon: Wallet },
  { id: 3, title: "Uber ride", category: "Transport", date: "Nov 10, 2026", amount: 350, type: "expense", icon: Car },
  { id: 4, title: "Netflix subscription", category: "Entertainment", date: "Nov 09, 2026", amount: 649, type: "expense", icon: Coffee },
  { id: 5, title: "Hostel fees", category: "Housing", date: "Nov 08, 2026", amount: 4500, type: "expense", icon: House },
  { id: 6, title: "Freelance project", category: "Income", date: "Nov 07, 2026", amount: 5000, type: "income", icon: Wallet },
];

const chartData = [
  { day: "Mon", income: 1200, expenses: 700 },
  { day: "Tue", income: 1800, expenses: 1100 },
  { day: "Wed", income: 1400, expenses: 900 },
  { day: "Thu", income: 2400, expenses: 1500 },
  { day: "Fri", income: 1900, expenses: 1200 },
  { day: "Sat", income: 2800, expenses: 1800 },
  { day: "Sun", income: 2200, expenses: 1300 },
];

const budgets = [
  { name: "Food & Dining", spent: 4200, limit: 6000, color: "#a78bfa", icon: Utensils },
  { name: "Transport", spent: 1800, limit: 3000, color: "#38bdf8", icon: Car },
  { name: "Shopping", spent: 3200, limit: 5000, color: "#fb923c", icon: ShoppingBag },
  { name: "Health", spent: 900, limit: 2000, color: "#34d399", icon: HeartPulse },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function App() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "Food",
    amount: "",
    type: "expense",
  });

  const totals = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const filteredTransactions = transactions.filter((item) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Income" && item.type === "income") ||
      (activeFilter === "Expenses" && item.type === "expense");

    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const addTransaction = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0) {
      return;
    }

    const iconMap = {
      Food: Utensils,
      Transport: Car,
      Shopping: ShoppingBag,
      Housing: House,
      Health: HeartPulse,
      Education: GraduationCap,
      Entertainment: Coffee,
      Income: Wallet,
      Other: MoreHorizontal,
    };

    const newTransaction = {
      id: Date.now(),
      title: form.title.trim(),
      category: form.type === "income" ? "Income" : form.category,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      amount: Number(form.amount),
      type: form.type,
      icon: form.type === "income" ? Wallet : iconMap[form.category],
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setForm({ title: "", category: "Food", amount: "", type: "expense" });
    setShowModal(false);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  const navItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Transactions", icon: ArrowLeftRight },
    { name: "Budgets", icon: Wallet },
    { name: "Analytics", icon: ChartNoAxesCombined },
  ];

  return (
    <div className="app-shell">
      {mobileMenu && (
        <div className="mobile-overlay" onClick={() => setMobileMenu(false)} />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Wallet size={21} /></div>
          <span>spend<span className="brand-accent">wise</span></span>
          <button className="mobile-close" onClick={() => setMobileMenu(false)}><X size={19} /></button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${activeNav === name ? "active" : ""}`}
              onClick={() => {
                setActiveNav(name);
                setMobileMenu(false);
              }}
            >
              <Icon size={19} />
              <span>{name}</span>
              {name === "Transactions" && <span className="nav-count">{transactions.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-spark">✦</div>
            <h4>Make every rupee count.</h4>
            <p>You're building better money habits. Keep it up!</p>
            <div className="upgrade-progress"><span /></div>
            <small>Monthly goal · 68%</small>
          </div>
          <button className="nav-item settings-link" onClick={() => setActiveNav("Settings")}>
            <Settings size={19} /><span>Settings</span>
          </button>
          <div className="profile">
            <div className="avatar">VG</div>
            <div className="profile-info"><strong>My Account</strong><span>Personal workspace</span></div>
            <MoreHorizontal size={20} className="profile-more" />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setMobileMenu(true)}><LayoutDashboard size={20} /></button>
            <div>
              <div className="breadcrumb">Workspace <span>/</span> {activeNav}</div>
              <h1>{activeNav === "Overview" ? "Financial overview" : activeNav}</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="date-chip"><CalendarDays size={16} /> November 2026 <ChevronDown size={14} /></div>
            <button className="icon-button notification-btn"><Bell size={19} /><i /></button>
            <button className="add-button" onClick={() => setShowModal(true)}><Plus size={18} /> Add transaction</button>
          </div>
        </header>

        {activeNav === "Settings" ? (
          <section className="empty-section"><Settings size={32} /><h2>Settings</h2><p>Your preferences will live here soon.</p></section>
        ) : activeNav === "Budgets" ? (
          <section className="page-section">
            <div className="section-heading"><div><h2>Your budgets</h2><p>Keep your spending on track this month.</p></div></div>
            <div className="budget-grid">
              {budgets.map((budget) => {
                const Icon = budget.icon;
                return <BudgetCard key={budget.name} budget={budget} Icon={Icon} />;
              })}
            </div>
          </section>
        ) : activeNav === "Analytics" ? (
          <section className="page-section">
            <div className="section-heading"><div><h2>Spending analytics</h2><p>A closer look at your money habits.</p></div></div>
            <ChartCard />
          </section>
        ) : (
          <>
            <section className="welcome-row">
              <div><h2>Good evening, Vivan <span>✦</span></h2><p>Here's what's happening with your money today.</p></div>
              <div className="live-indicator"><span /> Live overview</div>
            </section>

            <section className="stats-grid">
              <StatCard title="Total balance" value={formatCurrency(totals.balance)} change="Your available balance" icon={Wallet} tone="purple" />
              <StatCard title="Total income" value={formatCurrency(totals.income)} change="Money coming in" icon={ArrowDownRight} tone="green" />
              <StatCard title="Total expenses" value={formatCurrency(totals.expenses)} change="Money going out" icon={ArrowUpRight} tone="orange" />
            </section>

            <section className="content-grid">
              <ChartCard />
              <div className="side-stack">
                <div className="panel savings-panel">
                  <div className="panel-heading"><div><span className="eyebrow">SAVINGS GOAL</span><h3>New laptop</h3></div><MoreHorizontal size={19} /></div>
                  <div className="savings-amount">{formatCurrency(42000)} <span>of {formatCurrency(60000)}</span></div>
                  <div className="savings-track"><span /></div>
                  <div className="savings-footer"><span>70% completed</span><span>₹18,000 to go</span></div>
                  <div className="goal-note">✦ You're doing great! Keep saving consistently.</div>
                </div>

                <div className="panel quick-panel">
                  <div className="panel-heading"><div><span className="eyebrow">QUICK INSIGHT</span><h3>Your spending habits</h3></div><span className="insight-icon">✦</span></div>
                  <p>You've spent <strong>{formatCurrency(totals.expenses)}</strong> so far. Keep an eye on your budgets to stay on track this month.</p>
                  <button className="text-link" onClick={() => setActiveNav("Budgets")}>View budgets <ArrowUpRight size={15} /></button>
                </div>
              </div>
            </section>

            <section className="bottom-grid">
              <div className="panel transactions-panel">
                <div className="panel-heading transaction-heading">
                  <div><span className="eyebrow">YOUR ACTIVITY</span><h3>Recent transactions</h3></div>
                  <button className="view-all" onClick={() => setActiveNav("Transactions")}>View all <ArrowUpRight size={15} /></button>
                </div>
                <TransactionList
                  transactions={activeNav === "Transactions" ? filteredTransactions : filteredTransactions.slice(0, 5)}
                  onDelete={deleteTransaction}
                />
              </div>

              <div className="panel budgets-panel">
                <div className="panel-heading"><div><span className="eyebrow">MONTHLY LIMITS</span><h3>Budget overview</h3></div><button className="dots-button" onClick={() => setActiveNav("Budgets")}><MoreHorizontal size={20} /></button></div>
                <div className="budget-list">
                  {budgets.map((budget) => {
                    const Icon = budget.icon;
                    return <BudgetCard key={budget.name} budget={budget} Icon={Icon} compact />;
                  })}
                </div>
                <button className="budget-link" onClick={() => setActiveNav("Budgets")}>Manage budgets <ArrowUpRight size={15} /></button>
              </div>
            </section>
          </>
        )}
      </main>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <form className="transaction-modal" onClick={(e) => e.stopPropagation()} onSubmit={addTransaction}>
            <div className="modal-heading"><div><span className="eyebrow">NEW ENTRY</span><h2>Add transaction</h2></div><button type="button" className="icon-button" onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <label>Transaction name<input autoFocus placeholder="e.g. Coffee with friends" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
            <label>Amount (₹)<input type="number" min="1" placeholder="Enter amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></label>
            <label>Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="expense">Expense</option><option value="income">Income</option></select></label>
            {form.type === "expense" && <label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Food</option><option>Transport</option><option>Shopping</option><option>Housing</option><option>Health</option><option>Education</option><option>Entertainment</option><option>Other</option></select></label>}
            <button className="add-button modal-submit" type="submit"><Plus size={18} /> Save transaction</button>
          </form>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, tone }) {
  return (
    <div className="stat-card">
      <div className="stat-top"><span>{title}</span><div className={`stat-icon ${tone}`}><Icon size={19} /></div></div>
      <div className="stat-value">{value}</div>
      <div className="stat-change">{change}</div>
    </div>
  );
}

function ChartCard() {
  return (
    <div className="panel chart-panel">
      <div className="panel-heading"><div><span className="eyebrow">CASH FLOW</span><h3>Income vs expenses</h3></div><button className="period-select">This week <ChevronDown size={14} /></button></div>
      <div className="chart-legend"><span><i className="legend-income" /> Income</span><span><i className="legend-expense" /> Expenses</span></div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9b87f5" stopOpacity={0.25} /><stop offset="95%" stopColor="#9b87f5" stopOpacity={0} /></linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38bdf8" stopOpacity={0.16} /><stop offset="95%" stopColor="#38bdf8" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid stroke="#252b3d" strokeDasharray="4 5" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#777f96", fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#777f96", fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip contentStyle={{ background: "#171c2b", border: "1px solid #30364b", borderRadius: 12, color: "#fff" }} formatter={(value) => formatCurrency(value)} />
            <Area type="monotone" dataKey="income" stroke="#a78bfa" strokeWidth={2.5} fill="url(#incomeFill)" />
            <Area type="monotone" dataKey="expenses" stroke="#38bdf8" strokeWidth={2.5} fill="url(#expenseFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TransactionList({ transactions, onDelete }) {
  if (!transactions.length) return <div className="no-transactions">No transactions found. Try another search or add one!</div>;

  return (
    <div className="transaction-list">
      {transactions.map((item) => {
        const Icon = item.icon || Wallet;
        return (
          <div className="transaction-row" key={item.id}>
            <div className={`transaction-icon ${item.type}`}><Icon size={18} /></div>
            <div className="transaction-details"><strong>{item.title}</strong><span>{item.category} · {item.date}</span></div>
            <div className={`transaction-amount ${item.type}`}>{item.type === "income" ? "+" : "-"}{formatCurrency(item.amount)}</div>
            <button className="delete-transaction" title="Delete transaction" onClick={() => onDelete(item.id)}><Trash2 size={15} /></button>
          </div>
        );
      })}
    </div>
  );
}

function BudgetCard({ budget, Icon, compact = false }) {
  const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
  return (
    <div className={`budget-item ${compact ? "compact" : ""}`}>
      <div className="budget-item-top">
        <div className="budget-name"><span className="budget-icon" style={{ color: budget.color, background: `${budget.color}18` }}><Icon size={17} /></span><strong>{budget.name}</strong></div>
        <span className="budget-percent">{Math.round(percentage)}%</span>
      </div>
      <div className="budget-track"><span style={{ width: `${percentage}%`, background: budget.color }} /></div>
      <div className="budget-numbers"><strong>{formatCurrency(budget.spent)}</strong><span>of {formatCurrency(budget.limit)}</span></div>
    </div>
  );
}

export default App;
