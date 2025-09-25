// src/pages/AdvancedTransactions.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import Masonry from "react-masonry-css";
const dailyQuotes = [
  "Believe you can and you're halfway there.",
];
// Define breakpoints for responsive columns
const masonryBreakpoints = {
  default: 3, // 3 columns on large screens
  1024: 2, // 2 columns on medium screens
  640: 1, // 1 column on small screens
};

import type { AxiosInstance } from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FooterNav from "../components/FooterNav";

/* ---------------------- Types ---------------------- */
interface Transaction {
  ID: number;
  UserID: number;
  Title: string;
  Description: string;
  Amount: number;
  Type: "income" | "expense" | string;
  Category: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface SummaryTotals {
  totalIncome: number;
  totalExpenses: number;
  transactionsCount?: number;
}

interface MonthlySummaryItem {
  month: string; // e.g. "2024-01"
  income: number;
  expense: number;
}

interface CategorySummaryItem {
  category: string;
  amount: number;
}

/* ---------------------- Axios + helpers ---------------------- */

// central axios instance
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:5300",
  timeout: 12_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// simple in-memory cache with TTL (ms)
const cache = new Map<string, { ts: number; data: any }>();
const cacheTTL = 30_000; // 30s

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry<T>(
  fn: (signal?: AbortSignal) => Promise<T>,
  attempts = 3,
  baseDelay = 300
): Promise<T> {
  let lastErr: any = null;
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController();
    try {
      // allow the caller to pass signal if needed — we'll call fn with controller.signal
      const p = fn(controller.signal);
      // if caller uses own signal it should ignore provided one; but we give it anyway
      const result = await p;
      return result;
    } catch (err: any) {
      lastErr = err;
      // If it's an axios Cancel / Abort, rethrow immediately
      if (err?.name === "CanceledError" || err?.message === "canceled")
        throw err;
      // exponential backoff with jitter
      const delay =
        baseDelay * Math.pow(2, i) + Math.floor(Math.random() * baseDelay);
      await sleep(delay);
    }
  }
  throw lastErr;
}

/* Try cache first */
async function cachedGet<T>(
  key: string,
  getter: (signal?: AbortSignal) => Promise<T>
) {
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && now - cached.ts < cacheTTL) return cached.data as T;

  const data = await fetchWithRetry(getter, 3, 300);
  cache.set(key, { ts: Date.now(), data });
  return data;
}

/* ---------------------- Page Component ---------------------- */

export default function AdvancedTransactions() {
  // Theme hook kept simple — your actual Header toggles document attribute already
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("data-theme") as "light" | "dark") ||
      (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("data-theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [errorTx, setErrorTx] = useState("");

  const [summary, setSummary] = useState<SummaryTotals | null>(null);
  const [monthly, setMonthly] = useState<MonthlySummaryItem[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>(
    {}
  );

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ---------------------- Fetchers ---------------------- */

  const fetchTransactions = useCallback(async (signal?: AbortSignal) => {
    // GET /transactions/
    const res = await api.get<Transaction[]>("/transactions/", { signal });
    return res.data;
  }, []);

  const fetchSummaryTotals = useCallback(async (signal?: AbortSignal) => {
    // GET /summary/
    const res = await api.get<any>("/summary/", { signal });
    // normalize possible shapes: either { totalIncome, totalExpenses } or { income: x, expense: y }
    const d = res.data || {};
    return {
      totalIncome: d.totalIncome ?? d.income ?? d.total_income ?? 0,
      totalExpenses: d.totalExpenses ?? d.expense ?? d.total_expenses ?? 0,
      transactionsCount: d.transactionsCount ?? d.count ?? undefined,
    } as SummaryTotals;
  }, []);

  const fetchMonthlySummary = useCallback(async (signal?: AbortSignal) => {
    // GET /summary/monthly
    const res = await api.get<MonthlySummaryItem[]>("/summary/monthly", {
      signal,
    });
    return res.data;
  }, []);

  const fetchCategorySummary = useCallback(async (signal?: AbortSignal) => {
    // GET /summary/category
    const res = await api.get<CategorySummaryItem[]>("/summary/category", {
      signal,
    });
    return res.data;
  }, []);

  // orchestrator that loads all data reliably
  const loadAll = useCallback(async () => {
    setLoadingTx(true);
    setErrorTx("");
    const controller = new AbortController();
    try {
      // parallel fetch with short-circuit fallbacks
      const [txsRes, summaryRes, monthlyRes, categoryRes] = await Promise.all([
        cachedGet("/transactions", (sig) => fetchTransactions(sig)),
        cachedGet("/summary", (sig) => fetchSummaryTotals(sig)).catch(
          () => null
        ),
        cachedGet("/summary/monthly", (sig) => fetchMonthlySummary(sig)).catch(
          () => []
        ),
        cachedGet("/summary/category", (sig) =>
          fetchCategorySummary(sig)
        ).catch(() => []),
      ]);

      if (!mountedRef.current) return;

      // transactions always used as fallback or primary
      setTransactions(Array.isArray(txsRes) ? txsRes : []);

      // summary: fallback to compute from txs if null
      if (summaryRes) {
        setSummary(summaryRes);
      } else {
        const totalIncome = txsRes
          .filter((t: Transaction) => t.Type === "income")
          .reduce((s: number, t: Transaction) => s + t.Amount, 0);
        const totalExpenses = txsRes
          .filter((t: Transaction) => t.Type === "expense")
          .reduce((s: number, t: Transaction) => s + t.Amount, 0);
        setSummary({
          totalIncome,
          totalExpenses,
          transactionsCount: txsRes.length,
        });
      }

      // monthly: if empty fallback to compute simple monthly buckets from transactions
      if (Array.isArray(monthlyRes) && monthlyRes.length > 0) {
        setMonthly(monthlyRes);
      } else {
        // compute month (YYYY-MM) buckets
        const map = new Map<string, { income: number; expense: number }>();
        (txsRes as Transaction[]).forEach((t) => {
          const m = new Date(t.CreatedAt).toISOString().slice(0, 7);
          const cur = map.get(m) ?? { income: 0, expense: 0 };
          if (t.Type === "income") cur.income += t.Amount;
          else cur.expense += t.Amount;
          map.set(m, cur);
        });
        const arr = Array.from(map.entries())
          .sort(([a], [b]) => (a < b ? -1 : 1))
          .map(([month, v]) => ({
            month,
            income: v.income,
            expense: v.expense,
          }));
        setMonthly(arr);
      }

      // category: if available use it, otherwise compute
      if (Array.isArray(categoryRes) && categoryRes.length > 0) {
        const obj: Record<string, number> = {};
        categoryRes.forEach((c) => (obj[c.category] = c.amount));
        setCategoryStats(obj);
      } else {
        const obj: Record<string, number> = {};
        (txsRes as Transaction[]).forEach((t) => {
          obj[t.Category] = (obj[t.Category] || 0) + t.Amount;
        });
        setCategoryStats(obj);
      }
    } catch (err: any) {
      if (!mountedRef.current) return;
      console.error("loadAll error:", err);
      setErrorTx(err?.message || "Failed to load transactions");
    } finally {
      if (mountedRef.current) setLoadingTx(false);
    }
    return () => controller.abort();
  }, [
    fetchCategorySummary,
    fetchMonthlySummary,
    fetchSummaryTotals,
    fetchTransactions,
  ]);

  useEffect(() => {
    loadAll();
    // refresh every 45s to keep things up-to-date (if the user stays on the page)
    const interval = setInterval(() => {
      // invalidate cache and re-load
      cache.clear();
      loadAll();
    }, 45_000);
    return () => {
      clearInterval(interval);
    };
  }, [loadAll]);

  /* ---------------------- Filters & derived values ---------------------- */

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.Category))),
    [transactions]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter((tx) => {
      const matchesSearch =
        !q ||
        tx.Title.toLowerCase().includes(q) ||
        tx.Description.toLowerCase().includes(q) ||
        tx.Category.toLowerCase().includes(q);
      const matchesType = filterType ? tx.Type === filterType : true;
      const matchesCategory = filterCategory
        ? tx.Category === filterCategory
        : true;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, search, filterType, filterCategory]);

  const totalIncome = useMemo(
    () =>
      filtered
        .filter((t) => t.Type === "income")
        .reduce((s, t) => s + t.Amount, 0),
    [filtered]
  );
  const totalExpenses = useMemo(
    () =>
      filtered
        .filter((t) => t.Type === "expense")
        .reduce((s, t) => s + t.Amount, 0),
    [filtered]
  );
  const balance = totalIncome - totalExpenses;

  /* Pie colors */
  const PIE_COLORS = [
    "#6366f1",
    "#06b6d4",
    "#f97316",
    "#ef4444",
    "#10b981",
    "#a78bfa",
  ];

  /* ---------------------- Render ---------------------- */

  return (
    <div className="md:pl-20 font-sans min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-black transition-all duration-500">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Sidebar />
      <FooterNav />

      <div className="pt-20 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4 inline-flex items-center justify-center gap-3">
              <span className="inline-flex w-6 h-6 bg-blue-600 rounded text-white items-center justify-center">
                📊
              </span>
              Transaction Analysis
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Advanced financial insights and reliable real-time querying
            </p>
          </div>

          {/* Controls */}
          <div className="mb-8 bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search title, description, category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition"
                />
              </div>
              <div className="flex flex-wrap md:flex-nowrap gap-2 items-center justify-end">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white"
                >
                  <option value="">All types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white"
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="rounded-xl border border-gray-300 dark:border-gray-600 overflow-hidden flex">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-2 ${viewMode === "table" ? "bg-blue-600 text-white" : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"}`}
                  >
                    Table
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards + Charts */}
          <div className="mb-8">
            <Masonry
              breakpointCols={masonryBreakpoints}
              className="flex gap-6"
              columnClassName="flex flex-col gap-6"
            >
              {/* Summary Cards */}
              {/* Income Card */}
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl p-5 border border-green-200 dark:border-green-800/50">
                <p className="text-xs font-semibold text-green-600 uppercase mb-2">
                  Total Income
                </p>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
                  ${totalIncome.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  From {filtered.filter((t) => t.Type === "income").length}{" "}
                  transactions
                </p>
              </div>

              {/* Expenses Card */}
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl p-5 border border-red-200 dark:border-red-800/50">
                <p className="text-xs font-semibold text-red-600 uppercase mb-2">
                  Total Expenses
                </p>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300 mb-1">
                  ${totalExpenses.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  From {filtered.filter((t) => t.Type === "expense").length}{" "}
                  transactions
                </p>
              </div>

              {/* Balance Card */}
              <div
                className={`bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl p-5 border ${
                  balance >= 0
                    ? "border-blue-200 dark:border-blue-800/50"
                    : "border-orange-200 dark:border-orange-800/50"
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase mb-2 ${
                    balance >= 0 ? "text-blue-600" : "text-orange-600"
                  }`}
                >
                  Balance
                </p>
                <div className="text-2xl font-bold">
                  {balance >= 0 ? "$" : "-$"}
                  {Math.abs(balance).toLocaleString()}
                </div>
              </div>

              {/* Transactions Card */}
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl p-5 border border-purple-200 dark:border-purple-800/50">
                <p className="text-xs font-semibold text-purple-600 uppercase mb-2">
                  Transactions
                </p>
                <div className="text-2xl font-bold">{filtered.length}</div>
              </div>

              {/* Charts */}
              {/* Monthly Chart */}
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700/50">
                <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">
                  Monthly (Income vs Expense)
                </h4>
                <div className="w-full" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#EF4444"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Pie Chart */}
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700/50">
                <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">
                  By Category
                </h4>
                <div className="w-full" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(categoryStats).map(
                          ([name, value]) => ({
                            name,
                            value,
                          })
                        )}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label
                      >
                        {Object.keys(categoryStats).map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Daily Quotes */}
              {dailyQuotes.map((quote, index) => (
                <div
                  key={index}
                  className="bg-yellow-50 dark:bg-yellow-900/40 rounded-2xl shadow-lg p-5 border border-yellow-200 dark:border-yellow-800/50"
                >
                  <p className="text-sm italic text-yellow-800 dark:text-yellow-200">
                    "{quote}"
                  </p>
                </div>
              ))}
            </Masonry>
          </div>
          {/* Transactions Table/Grid */}
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                All Transactions ({filtered.length})
              </h3>
            </div>
            {loadingTx ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <span className="text-gray-600 dark:text-gray-300 font-semibold">
                  Loading transactions...
                </span>
              </div>
            ) : errorTx ? (
              <div className="p-8 text-center">
                <p className="text-red-600 dark:text-red-400 text-lg font-semibold">
                  {errorTx}
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="text-6xl sm:text-8xl mb-6">📊</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-semibold mb-2">
                  No transactions found
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm sm:text-base">
                  Try adjusting your search filters or add some transactions!
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((tx) => (
                    <div
                      key={tx.ID}
                      className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base truncate mb-1">
                            {tx.Title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-2">
                            {tx.Description}
                          </p>
                        </div>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0 ${tx.Type === "income" ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"}`}
                        >
                          {tx.Type === "income" ? "💰" : "💸"}
                        </span>
                      </div>
                      <div className="flex justify-between mb-3">
                        <div
                          className={`text-lg sm:text-xl font-bold ${tx.Type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {tx.Type === "expense" ? "-" : "+"}$
                          {tx.Amount.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          🏷️ {tx.Category}
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          📅 {new Date(tx.CreatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800/70">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800/30 divide-y divide-gray-200 dark:divide-gray-700">
                    {filtered.map((tx) => (
                      <tr
                        key={tx.ID}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {tx.Title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {tx.Description}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div
                            className={`text-sm font-bold ${tx.Type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                          >
                            {tx.Type === "expense" ? "-" : "+"}$
                            {tx.Amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${tx.Type === "income" ? "bg-green-100 dark:bg-green-900/50 text-green-800" : "bg-red-100 dark:bg-red-900/50 text-red-800"}`}
                          >
                            {tx.Type === "income" ? "💰 Income" : "💸 Expense"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                            {tx.Category}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(tx.CreatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Summary */}
          {filtered.length > 0 && (
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700/50">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-semibold">{filtered.length}</span>{" "}
                transactions
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total value:{" "}
                <span className="font-semibold">
                  {(totalIncome + totalExpenses).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
