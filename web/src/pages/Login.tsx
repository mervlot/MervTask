import { type FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { NavLink, useNavigate } from "react-router-dom";
axios.defaults.baseURL = "http://localhost:5300";
axios.defaults.withCredentials = true; // allow cookies to be sent/received
const Login = () => {
  const [form, setForm] = useState({ user_name: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkExistingToken() {
      try {
        await axios.get("/auth/verifyaccess"); // throws if no valid token
        navigate("/"); // already logged in
      } catch {
        // no valid token → stay here
      }
    }
    checkExistingToken();
  }, [navigate]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post("/auth/login", form, { withCredentials: true });
      navigate("/"); // login success → go home
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data.error ?? "Something went wrong");
    }
  };
  return (
    <div className="relative mx-auto w-[95%] max-w-[420px] p-6">
      {/* Aurora background */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-[22px]">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-16 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Card container */}
      <div className="rounded-[22px] overflow-hidden bg-gradient-to-br transition-all">
        <div className="transition-all hover:scale-[0.98] hover:rounded-[20px]">
          <form
            onSubmit={submit}
            className="flex flex-col gap-4 p-6 bg-white/20 dark:bg-[#171717]/30 backdrop-blur-lg rounded-[25px] shadow-lg border border-white/10 dark:border-gray-800/20 transition-colors"
          >
            <p className="text-center my-8 text-black dark:text-white text-lg font-medium">
              Login
            </p>

            {/* Username input */}
            <div className="flex items-center gap-3 rounded-full px-3 py-2 bg-white/10 dark:bg-gray-900/30 shadow-inner backdrop-blur-sm">
              <i
                className="bi bi-person-fill text-xl text-gray-500 dark:text-gray-300"
                aria-hidden="true"
              />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                placeholder="User_name"
                autoComplete="user_name"
                value={form.user_name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, user_name: e.target.value }))
                }
                required
              />
            </div>

            {/* Password input */}
            <div className="flex items-center gap-3 rounded-full px-3 py-2 bg-white/10 dark:bg-gray-900/30 shadow-inner backdrop-blur-sm">
              <i
                className="bi bi-lock-fill text-xl text-gray-500 dark:text-gray-300"
                aria-hidden="true"
              />
              <input
                type="password"
                className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                placeholder="Password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) =>
                  setForm((s) => ({ ...s, password: e.target.value }))
                }
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-center mt-10 gap-4">
              <button
                type="submit"
                className="px-4 py-2 rounded-full text-white bg-[#252525]/80 hover:bg-black/90 transition"
              >
                Login
              </button>

              <NavLink to="/register">
                <button
                  type="button"
                  className="px-6 py-2 rounded-full text-white bg-[#252525]/80 hover:bg-black/90 transition"
                >
                  Sign Up
                </button>
              </NavLink>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-500 mt-3 text-center">{error}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
