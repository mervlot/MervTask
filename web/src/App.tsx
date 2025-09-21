import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";

export default function App() {
  return (
    <>
      <nav className="flex gap-4 p-4 bg-gray-900 text-white">
        <Link to="/" className="hover:text-blue-400">
          Home
        </Link>
        <Link to="/about" className="hover:text-green-400">
          About
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}
