import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { NavLink, useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5300";
axios.defaults.withCredentials = true;

interface FormState {
  user_name: string;
  first_name: string;
  last_name: string;
  age: number | "";
  email: string;
  date_of_birth: string; // YYYY-MM-DD
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [form, setForm] = useState<FormState>({
    user_name: "",
    first_name: "",
    last_name: "",
    age: "",
    email: "",
    date_of_birth: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 🔒 redirect if already logged in
  useEffect(() => {
    async function checkExistingToken() {
      try {
        await axios.get("/auth/verifyaccess");
        navigate("/");
      } catch {
        // no valid token
      }
    }
    checkExistingToken();
  }, [navigate]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        password: form.password,
      };

      await axios.post("/auth/register", payload, { withCredentials: true });
      navigate("/");
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string; msg?: string }>;
      setError(
        axiosErr.response?.data?.error ||
          axiosErr.response?.data?.msg ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="mx-auto w-[95%] max-w-[500px] p-6">
      <div className="rounded-[22px] overflow-hidden bg-gradient-to-br transition-all">
        <div className="transition-all hover:scale-[0.98] hover:rounded-[20px]">
          <form
            onSubmit={submit}
            className="flex flex-col gap-4 p-6 bg-white/20 dark:bg-[#171717]/30 backdrop-blur-lg rounded-[25px] shadow-lg border border-white/10 dark:border-gray-800/20 transition-colors"
          >
            <p className="text-center my-8 text-black dark:text-white text-lg font-medium">
              Sign Up
            </p>

            {/* Username */}
            <input
              type="text"
              placeholder="User Name"
              value={form.user_name}
              onChange={(e) =>
                setForm((s) => ({ ...s, user_name: e.target.value }))
              }
              className="rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200"
              required
            />

            {/* First Name */}
            <input
              type="text"
              placeholder="First Name"
              value={form.first_name}
              onChange={(e) =>
                setForm((s) => ({ ...s, first_name: e.target.value }))
              }
              className="rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200"
              required
            />

            {/* Last Name */}
            <input
              type="text"
              placeholder="Last Name"
              value={form.last_name}
              onChange={(e) =>
                setForm((s) => ({ ...s, last_name: e.target.value }))
              }
              className="rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200"
              required
            />

            {/* Age */}
            <input
              type="number"
              placeholder="Age"
              min={0}
              max={120}
              value={form.age}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  age: e.target.value ? Number(e.target.value) : "",
                }))
              }
              className="rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200"
              required
            />

            {/* Date of Birth */}
            <input
              type="date"
              placeholder="Date of Birth"
              value={form.date_of_birth}
              onChange={(e) =>
                setForm((s) => ({ ...s, date_of_birth: e.target.value }))
              }
              className="rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200"
              required
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm((s) => ({ ...s, email: e.target.value }))
              }
              className="rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200"
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm((s) => ({ ...s, password: e.target.value }))
              }
              className="rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200"
              required
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((s) => ({ ...s, confirmPassword: e.target.value }))
              }
              className="rounded p-2 bg-white/10 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200"
              required
            />

            {/* Buttons */}
            <div className="flex justify-center mt-10 gap-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-full text-white bg-[#252525]/80 hover:bg-black/90 transition"
              >
                Register
              </button>

              <NavLink to="/login">
                <button
                  type="button"
                  className="px-4 py-2 rounded-full text-white bg-[#252525]/80 hover:bg-black/90 transition"
                >
                  Login
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

export default Register;


