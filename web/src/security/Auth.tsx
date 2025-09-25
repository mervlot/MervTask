import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = "http://localhost:5300";
axios.defaults.withCredentials = true; // allow cookies to be sent/received

export default function Auth({ children }: { children: ReactNode }) {
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
        // try refresh
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
  }, []); // ✅ only run once

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!valid) {
    return null; // already redirected
  }

  return <>{children}</>;
}
