import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IncomeExpenseChart,
  CategoryPieChart,
  MonthlyTrendChart,
} from "../components/chart";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FooterNav from "../components/FooterNav";
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference, default to light
    const savedTheme = localStorage.getItem("data-theme");
    if (savedTheme) return savedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    // Update HTML data-theme attribute
    document.documentElement.setAttribute("data-theme", theme);
    // Save to localStorage
    localStorage.setItem("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme }; // <-- This was missing!
};
interface Transaction {
  ID: number;
  UserID: number;
  Title: string;
  Description: string;
  Amount: number;
  Type: string;
  Category: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Material Icons as SVG components
const AddIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
  </svg>
);

const AccountBalanceIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
  </svg>
);

const ReceiptIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
  </svg>
);

const CancelIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);


export default function Dash() {
  const { theme, toggleTheme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseType, setExpenseType] = useState("expense");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    type: "",
    category: "",
  });

  // Toggle dark mode
  // useEffect(() => {
  //   if (isDarkMode) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, [isDarkMode]);

  // fetch existing transactions
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5300/transactions/");
      const data = Array.isArray(res.data) ? res.data : [];
      setTransactions(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTx = {
        title: title,
        description: description,
        amount: parseFloat(amount),
        expense_type: expenseType,
        category: category,
      };

      await axios.post("http://localhost:5300/transactions/", newTx);
      await fetchTransactions();

      setTitle("");
      setDescription("");
      setAmount("");
      setExpenseType("expense");
      setCategory("");
      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.msg ??
          err.response?.data?.error ??
          "Something went wrong"

      );
    }
  };

  // Inline edit functions
  const handleDoubleClick = (transaction: Transaction) => {
    setEditingId(transaction.ID);
    setEditForm({
      title: transaction.Title,
      description: transaction.Description,
      type: transaction.Type,
      category: transaction.Category,
    });
  };

  const handleEditChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async (transactionId: number) => {
    try {
      const updateData = {
        tx_id: transactionId,
        title: editForm.title,
        description: editForm.description,
        amount: transactions.find((t) => t.ID === transactionId)?.Amount || 0,
        tx_type: editForm.type,
        category: editForm.category,
      };

      await axios.patch("http://localhost:5300/transactions/", updateData);
      await fetchTransactions();
      setEditingId(null);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.msg ?? "Failed to update transaction");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", description: "", type: "", category: "" });
  };

  const handleDelete = async (transactionId: number) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await axios.delete("http://localhost:5300/transactions/", {
        data: { transaction: transactionId },
      });
      await fetchTransactions();
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.msg ?? "Failed to delete transaction");
    }
  };

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.Type === "income")
    .reduce((sum, t) => sum + t.Amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.Type === "expense")
    .reduce((sum, t) => sum + t.Amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="md: pl-20 font-poppins min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-black transition-all duration-500">
      {/* Dark Mode Toggle - Fixed Position */}
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Sidebar />
      <FooterNav />
      <div className="fixed top-4 right-4 z-50">
        {/* <button
          onClick={toggleTheme}
          className="p-3 rounded-xl transition-all duration-300 shadow-lg bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-yellow-400 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-600 backdrop-blur-sm"
        >
          {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </button> */}
      </div>

      {/* Add margin-top for header space */}
      <div className="pt-20 sm:pt-24 md:pt-28">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <AccountBalanceIcon />
              <span>Finance Dashboard</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Track your income and expenses with style
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {/* Income Card */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl p-4 sm:p-6 border border-green-200 dark:border-green-800/50 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-green-600 dark:text-green-400 font-semibold text-xs sm:text-sm uppercase tracking-wide mb-1">
                    Total Income
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300 truncate">
                    ${totalIncome.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/50 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
                  <TrendingUpIcon />
                </div>
              </div>
            </div>

            {/* Expenses Card */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl p-4 sm:p-6 border border-red-200 dark:border-red-800/50 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-red-600 dark:text-red-400 font-semibold text-xs sm:text-sm uppercase tracking-wide mb-1">
                    Total Expenses
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-700 dark:text-red-300 truncate">
                    ${totalExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-100 dark:bg-red-900/50 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
                  <TrendingDownIcon />
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div
              className={`bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl p-4 sm:p-6 border hover:shadow-2xl transition-all duration-300 backdrop-blur-sm sm:col-span-2 lg:col-span-1 ${
                balance >= 0
                  ? "border-green-200 dark:border-green-800/50"
                  : "border-red-200 dark:border-red-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-xs sm:text-sm uppercase tracking-wide mb-1 ${
                      balance >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    Balance
                  </p>
                  <p
                    className={`text-2xl sm:text-3xl font-bold truncate ${
                      balance >= 0
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    ${balance.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-full flex-shrink-0 ml-2 ${
                    balance >= 0
                      ? "bg-green-100 dark:bg-green-900/50"
                      : "bg-red-100 dark:bg-red-900/50"
                  }`}
                >
                  <AccountBalanceIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <AnalyticsIcon />
              <span>Financial Analytics</span>
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              <IncomeExpenseChart transactions={transactions} />
              <CategoryPieChart transactions={transactions} />
            </div>
            <div className="mt-6 sm:mt-8">
              <MonthlyTrendChart transactions={transactions} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Add Transaction Form */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <AddIcon />
                <span className="truncate">Add New Transaction</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      placeholder="Enter transaction title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <input
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Type
                      </label>
                      <select
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                        value={expenseType}
                        onChange={(e) => setExpenseType(e.target.value)}
                      >
                        <option value="expense">💸 Expense</option>
                        <option value="income">💰 Income</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <input
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                        placeholder="e.g., Food, Transport, Salary"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <AddIcon />
                  <span>Add Transaction</span>
                </button>
              </form>

              {error && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 font-semibold text-sm">
                    ⚠️ {error}
                  </p>
                </div>
              )}
            </div>

            {/* Transactions List */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <ReceiptIcon />
                  <span>Recent Transactions</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal">
                  (Double-click to edit)
                </span>
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-300 font-semibold text-sm sm:text-base">
                    Loading transactions...
                  </span>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-4">📊</div>
                  <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-semibold">
                    No transactions yet
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm sm:text-base">
                    Add your first transaction to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto scrollbar">
                  {transactions.map((t, index) => (
                    <div
                      key={t.ID}
                      className={`bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 p-3 sm:p-4 rounded-xl border transition-all duration-200 ${
                        editingId === t.ID
                          ? "border-blue-400 dark:border-blue-500 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800"
                          : "border-gray-200 dark:border-gray-600 hover:shadow-lg"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {editingId === t.ID ? (
                        // Edit Mode
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) =>
                                handleEditChange("title", e.target.value)
                              }
                              className="flex-1 font-bold text-gray-800 dark:text-white text-base sm:text-lg bg-transparent border-b-2 border-blue-400 dark:border-blue-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
                              placeholder="Transaction title"
                            />
                            <div className="flex items-center gap-2 mt-2 sm:mt-0">
                              <select
                                value={editForm.type}
                                onChange={(e) =>
                                  handleEditChange("type", e.target.value)
                                }
                                className="px-2 py-1 rounded text-xs font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="income">💰 Income</option>
                                <option value="expense">💸 Expense</option>
                              </select>
                              <button
                                onClick={() => handleDelete(t.ID)}
                                className="px-2 py-1 bg-red-500 dark:bg-red-600 text-white text-xs rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          </div>

                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) =>
                              handleEditChange("description", e.target.value)
                            }
                            className="w-full text-gray-600 dark:text-gray-300 text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500"
                            placeholder="Transaction description"
                          />

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                            <input
                              type="text"
                              value={editForm.category}
                              onChange={(e) =>
                                handleEditChange("category", e.target.value)
                              }
                              className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Category"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                              📅 {new Date(t.CreatedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-3">
                            <button
                              onClick={() => handleSaveEdit(t.ID)}
                              className="px-3 sm:px-4 py-2 bg-green-500 dark:bg-green-600 text-white text-sm rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                            >
                              <SaveIcon />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 sm:px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
                            >
                              <CancelIcon />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Normal Mode
                        <div
                          className="cursor-pointer"
                          onDoubleClick={() => handleDoubleClick(t)}
                        >
                          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 gap-2">
                                <h3 className="font-bold text-gray-800 dark:text-white text-base sm:text-lg truncate">
                                  {t.Title}
                                </h3>
                                <span
                                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                                    t.Type === "income"
                                      ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                                      : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                                  }`}
                                >
                                  {t.Type === "income"
                                    ? "💰 Income"
                                    : "💸 Expense"}
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                {t.Description}
                              </p>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                  🏷️ {t.Category}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                  📅{" "}
                                  {new Date(t.CreatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="text-left lg:text-right w-full lg:w-auto">
                              <div
                                className={`text-xl sm:text-2xl font-bold mb-2 ${
                                  t.Type === "income"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {t.Type === "expense" ? "-" : "+"}$
                                {t.Amount.toLocaleString()}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(t.ID);
                                }}
                                className="px-2 sm:px-3 py-1 bg-red-500 dark:bg-red-600 text-white text-xs rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors flex items-center gap-1"
                              >
                                <DeleteIcon />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
