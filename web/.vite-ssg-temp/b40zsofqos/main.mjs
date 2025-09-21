import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import ReactDOM from "react-dom/client";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
function Home() {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen items-center justify-center bg-blue-600 text-white", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Welcome to Mervlot 🚀" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Mervlot homepage — explore the future."
        }
      )
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold", children: "Welcome to Mervlot 🚀" })
  ] });
}
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
function App() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("nav", { className: "flex gap-4 p-4 bg-gray-900 text-white", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-blue-400", children: "Home" }),
      /* @__PURE__ */ jsx(Link, { to: "/about", className: "hover:text-green-400", children: "About" })
    ] }),
    /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Home, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(About, {}) })
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
