import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FooterNav from "../components/FooterNav";

interface ProfileData {
  UserName: string;
  FirstName: string;
  LastName: string;
  Age: number;
  Email: string;
}

// Theme Hook
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("data-theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
};

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    UserName: "",
    FirstName: "",
    LastName: "",
  });
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5300/users/");
      setProfile(res.data);
      setForm({
        UserName: res.data.UserName,
        FirstName: res.data.FirstName,
        LastName: res.data.LastName,
      });
      setError("");
    } catch (err: any) {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.patch("http://localhost:5300/users/", {
        user_name: form.UserName,
        first_name: form.FirstName,
        last_name: form.LastName,
      });
      setSuccess("Profile updated successfully!");
      setEditMode(false);
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    try {
      await axios.delete("http://localhost:5300/users/");
      setProfile(null);
      setSuccess("Account deleted. We will miss you 😭");
      window.location.href = "/login";
    } catch {
      setError("Failed to delete account");
    }
  };

  const handleLogout = () => {
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  return (
    <div className="md:pl-20 font-sans min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-black transition-all duration-500">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Sidebar />
      <FooterNav />

      <div className="pt-20 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300 font-semibold">
                Loading profile...
              </span>
            </div>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : profile ? (
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md mx-auto border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
              {success && (
                <div className="mb-4 text-green-500 text-center font-medium">
                  {success}
                </div>
              )}

              {!editMode ? (
                <div className="flex flex-col items-center space-y-4">
                  {/* Avatar */}
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500 dark:border-blue-400">
                    <img
                      src={`https://ui-avatars.com/api/?name=${profile.UserName}&background=random&size=128`}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Username & Name */}
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      @{profile.UserName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {profile.FirstName} {profile.LastName}
                    </p>
                  </div>

              
       
       

                  {/* Stats */}
                  <div className="flex justify-center gap-8 text-center mt-2">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {profile.Age}
                      </span>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Age
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 w-full mt-4">
                    <button
                      className="bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </button>
                    <button
                      className="bg-gray-600 text-white py-2 rounded-full hover:bg-gray-700 transition"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                    <button
                      className="bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition"
                      onClick={handleDelete}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                  <div>
                    <label className="block font-semibold mb-1 text-gray-900 dark:text-white">
                      Username
                    </label>
                    <input
                      type="text"
                      value={form.UserName}
                      onChange={(e) =>
                        handleEditChange("UserName", e.target.value)
                      }
                      className="border px-3 py-2 rounded w-full dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-gray-900 dark:text-white">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={form.FirstName}
                      onChange={(e) =>
                        handleEditChange("FirstName", e.target.value)
                      }
                      className="border px-3 py-2 rounded w-full dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-gray-900 dark:text-white">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={form.LastName}
                      onChange={(e) =>
                        handleEditChange("LastName", e.target.value)
                      }
                      className="border px-3 py-2 rounded w-full dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>


                  <div className="flex flex-col gap-3 mt-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="bg-gray-600 text-white py-2 rounded-full hover:bg-gray-700 transition"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No profile data found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
