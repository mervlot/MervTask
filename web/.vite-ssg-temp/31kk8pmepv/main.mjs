import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import ReactDOM from "react-dom/client";
import { useNavigate, NavLink, Routes, Route, BrowserRouter } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";
import axios from "axios";
function About() {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen items-center justify-center bg-green-600 text-white", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "About Mervlot 🌍" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Learn more about the Mervlot project."
        }
      )
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold", children: "About Page 🌍" })
  ] });
}
const Header = () => {
  return /* @__PURE__ */ jsx("div", { className: "grid w-full", children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "w-[80%] fixed top-10 left-1/2 -translate-x-1/2 \n        bg-black/10 backdrop-blur-sm border border-white/10 \n        rounded-xl px-4 py-2 flex justify-between items-center \n        shadow-md z-50",
      children: /* @__PURE__ */ jsx("h1", { className: "text-primary font-bold fredoka-bold", children: "Mervlot" })
    }
  ) });
};
axios.defaults.baseURL = "http://localhost:5300";
axios.defaults.withCredentials = true;
function Auth({ children }) {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function checkAuth() {
      let isValid = false;
      try {
        await axios.get("/auth/verifyaccess");
        isValid = true;
      } catch {
        try {
          const res = await axios.post("/auth/verifyrefresh");
          if (res.status === 200) {
            await axios.get("/auth/verifyaccess");
            isValid = true;
          }
        } catch {
          console.log("error");
        }
      }
      setValid(isValid);
      setLoading(false);
      if (!isValid) navigate("/login");
    }
    checkAuth();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "p-4", children: "Loading..." });
  }
  if (!valid) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
axios.defaults.baseURL = "http://localhost:5300";
axios.defaults.withCredentials = true;
const Login = () => {
  const [form, setForm] = useState({ user_name: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function checkExistingToken() {
      try {
        await axios.get("/auth/verifyaccess");
        navigate("/");
      } catch {
      }
    }
    checkExistingToken();
  }, [navigate]);
  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post("/auth/login", form, { withCredentials: true });
      navigate("/");
    } catch (err) {
      const error2 = err;
      setError(error2.response?.data.error ?? "Something went wrong");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative mx-auto w-[95%] max-w-[420px] p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 -z-10 overflow-hidden rounded-[22px]", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -top-20 -left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -bottom-24 -right-16 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] animate-pulse" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-[22px] overflow-hidden bg-gradient-to-br transition-all", children: /* @__PURE__ */ jsx("div", { className: "transition-all hover:scale-[0.98] hover:rounded-[20px]", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: submit,
        className: "flex flex-col gap-4 p-6 bg-white/20 dark:bg-[#171717]/30 backdrop-blur-lg rounded-[25px] shadow-lg border border-white/10 dark:border-gray-800/20 transition-colors",
        children: [
          /* @__PURE__ */ jsx("p", { className: "text-center my-8 text-black dark:text-white text-lg font-medium", children: "Login" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-full px-3 py-2 bg-white/10 dark:bg-gray-900/30 shadow-inner backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx(
              "i",
              {
                className: "bi bi-person-fill text-xl text-gray-500 dark:text-gray-300",
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400",
                placeholder: "User_name",
                autoComplete: "user_name",
                value: form.user_name,
                onChange: (e) => setForm((s) => ({ ...s, user_name: e.target.value })),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-full px-3 py-2 bg-white/10 dark:bg-gray-900/30 shadow-inner backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx(
              "i",
              {
                className: "bi bi-lock-fill text-xl text-gray-500 dark:text-gray-300",
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                className: "flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400",
                placeholder: "Password",
                autoComplete: "current-password",
                value: form.password,
                onChange: (e) => setForm((s) => ({ ...s, password: e.target.value })),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-center mt-10 gap-4", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "px-4 py-2 rounded-full text-white bg-[#252525]/80 hover:bg-black/90 transition",
                children: "Login"
              }
            ),
            /* @__PURE__ */ jsx(NavLink, { to: "/register", children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "px-6 py-2 rounded-full text-white bg-[#252525]/80 hover:bg-black/90 transition",
                children: "Sign Up"
              }
            ) })
          ] }),
          error && /* @__PURE__ */ jsx("div", { className: "text-red-500 mt-3 text-center", children: error })
        ]
      }
    ) }) })
  ] });
};
axios.defaults.baseURL = "http://localhost:5300";
axios.defaults.withCredentials = true;
const Register = () => {
  const [form, setForm] = useState({
    user_name: "",
    first_name: "",
    last_name: "",
    age: "",
    email: "",
    date_of_birth: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function checkExistingToken() {
      try {
        await axios.get("/auth/verifyaccess");
        navigate("/");
      } catch {
      }
    }
    checkExistingToken();
  }, [navigate]);
  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const payload = {
        user_name: form.user_name,
        first_name: form.first_name,
        last_name: form.last_name,
        age: Number(form.age),
        email: form.email,
        date_of_birth: form.date_of_birth,
        password: form.password
      };
      await axios.post("/auth/register", payload, { withCredentials: true });
      navigate("/");
    } catch (err) {
      const axiosErr = err;
      setError(
        axiosErr.response?.data?.error || axiosErr.response?.data?.msg || "Something went wrong"
      );
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "mx-auto w-[95%] max-w-[500px] p-6", children: /* @__PURE__ */ jsx("div", { className: "rounded-[22px] overflow-hidden bg-gradient-to-br transition-all", children: /* @__PURE__ */ jsx("div", { className: "transition-all hover:scale-[0.98] hover:rounded-[20px]", children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: submit,
      className: "flex flex-col gap-4 p-6 bg-white/20 dark:bg-[#171717]/30 backdrop-blur-lg rounded-[25px] shadow-lg border border-white/10 dark:border-gray-800/20 transition-colors",
      children: [
        /* @__PURE__ */ jsx("p", { className: "text-center my-8 text-black dark:text-white text-lg font-medium", children: "Sign Up" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "User Name",
            value: form.user_name,
            onChange: (e) => setForm((s) => ({ ...s, user_name: e.target.value })),
            className: "rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "First Name",
            value: form.first_name,
            onChange: (e) => setForm((s) => ({ ...s, first_name: e.target.value })),
            className: "rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Last Name",
            value: form.last_name,
            onChange: (e) => setForm((s) => ({ ...s, last_name: e.target.value })),
            className: "rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            placeholder: "Age",
            min: 0,
            max: 120,
            value: form.age,
            onChange: (e) => setForm((s) => ({
              ...s,
              age: e.target.value ? Number(e.target.value) : ""
            })),
            className: "rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            placeholder: "Date of Birth",
            value: form.date_of_birth,
            onChange: (e) => setForm((s) => ({ ...s, date_of_birth: e.target.value })),
            className: "rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            placeholder: "Email",
            value: form.email,
            onChange: (e) => setForm((s) => ({ ...s, email: e.target.value })),
            className: "rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            placeholder: "Password",
            value: form.password,
            onChange: (e) => setForm((s) => ({ ...s, password: e.target.value })),
            className: "rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            placeholder: "Confirm Password",
            value: form.confirmPassword,
            onChange: (e) => setForm((s) => ({ ...s, confirmPassword: e.target.value })),
            className: "rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200",
            required: true
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center mt-10 gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "px-6 py-2 rounded-full text-white bg-[#252525]/80 hover:bg-black/90 transition",
              children: "Register"
            }
          ),
          /* @__PURE__ */ jsx(NavLink, { to: "/login", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "px-4 py-2 rounded-full text-white bg-[#252525]/80 hover:bg-black/90 transition",
              children: "Login"
            }
          ) })
        ] }),
        error && /* @__PURE__ */ jsx("div", { className: "text-red-500 mt-3 text-center", children: error })
      ]
    }
  ) }) }) });
};
function Dash() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseType, setExpenseType] = useState("expense");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get("http://localhost:5300/transactions/").then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      setTransactions(data);
    }).catch((err) => {
      console.error(err);
      setError("Failed to fetch transactions");
    }).finally(() => setLoading(false));
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTx = {
        title,
        description,
        amount: parseFloat(amount),
        expense_type: expenseType,
        category
      };
      const res = await axios.post(
        "http://localhost:5300/transactions/",
        newTx
      );
      setTransactions((prev) => [...prev, res.data]);
      setTitle("");
      setDescription("");
      setAmount("");
      setExpenseType("expense");
      setCategory("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error ?? "Something went wrong");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold mb-4", children: "Dashboard" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-3 mb-6", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "border p-2 w-full",
          placeholder: "Title",
          value: title,
          onChange: (e) => setTitle(e.target.value),
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "border p-2 w-full",
          placeholder: "Description",
          value: description,
          onChange: (e) => setDescription(e.target.value),
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "border p-2 w-full",
          type: "number",
          placeholder: "Amount",
          value: amount,
          onChange: (e) => setAmount(e.target.value),
          required: true
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "border p-2 w-full",
          value: expenseType,
          onChange: (e) => setExpenseType(e.target.value),
          children: [
            /* @__PURE__ */ jsx("option", { value: "expense", children: "Expense" }),
            /* @__PURE__ */ jsx("option", { value: "income", children: "Income" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "border p-2 w-full",
          placeholder: "Category",
          value: category,
          onChange: (e) => setCategory(e.target.value),
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "bg-blue-600 text-white px-4 py-2 rounded",
          children: "Add Transaction"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "text-red-500 mb-4", children: error }),
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-2", children: "Transactions" }),
    loading ? /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Loading..." }) : transactions.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No transactions found." }) : /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: transactions.map((t) => /* @__PURE__ */ jsxs("li", { className: "border p-2 rounded", children: [
      /* @__PURE__ */ jsx("div", { className: "font-medium", children: t.title }),
      /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: t.description }),
      /* @__PURE__ */ jsxs("div", { children: [
        t.expense_type === "expense" ? "-" : "+",
        "$",
        t.amount,
        " (",
        t.category,
        ")"
      ] })
    ] }, t.id)) })
  ] });
}
function App() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/",
          element: /* @__PURE__ */ jsx(Auth, { children: /* @__PURE__ */ jsx(Dash, {}) })
        }
      ),
      /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(About, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(Login, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/register", element: /* @__PURE__ */ jsx(Register, {}) })
    ] })
  ] });
}
const createApp = () => /* @__PURE__ */ jsx(HelmetProvider, { children: /* @__PURE__ */ jsx(BrowserRouter, { children: /* @__PURE__ */ jsx(App, {}) }) });
if (typeof window !== "undefined") {
  ReactDOM.createRoot(document.getElementById("root")).render(
    /* @__PURE__ */ jsx(HelmetProvider, { children: /* @__PURE__ */ jsx(BrowserRouter, { children: /* @__PURE__ */ jsx(App, {}) }) })
  );
}
export {
  createApp
};
