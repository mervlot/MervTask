import { Routes, Route } from "react-router-dom";
import About from "./pages/About.tsx";
import Auth from "./security/Auth.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dash from "./pages/Dash.tsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import Transactions from "./pages/Transactions.tsx";
import Profile from "./pages/Profile.tsx";
export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Auth>
              <Dash />
            </Auth>
          }
        />
        <Route
          path="/hub"
          element={
            <Auth>
              <Transactions />
            </Auth>
          }
        />

        <Route
          path="/profile"
          element={
            <Auth>
              <Profile />
            </Auth>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}
