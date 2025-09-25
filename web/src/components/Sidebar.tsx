import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navItems = [
    { to: "/", icon: "bi-house", label: "Home" },
    { to: "/hub", icon: "bi-database", label: "Hub" },
    { to: "/profile", icon: "bi-person-circle", label: "Profile" },
  ];

  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-screen ml-4 text-white py-4 flex-col items-center z-40">
      <div className="bg-white/10 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl h-full w-16 flex flex-col justify-between transition-colors duration-300">
        {/* Top Icon */}
        <div className="flex h-[3rem] w-full items-center justify-center pt-2">
          <h1 className="bi bi-incognito text-xl text-blue-600 dark:text-blue-400 drop-shadow-lg" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-y-6 pt-4">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group relative flex items-center justify-center w-full h-12 transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active bar */}
                  {isActive && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 dark:bg-blue-400 rounded-r transition-colors duration-300" />
                  )}

                  {/* Icon */}
                  <i
                    className={`bi ${icon} text-xl transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  />

                  {/* Tooltip label on hover */}
                  <span className="absolute left-14 opacity-0 group-hover:opacity-100 bg-black/70 dark:bg-gray-800/90 text-white dark:text-gray-200 text-xs px-2 py-1 rounded-md whitespace-nowrap transition-all duration-200 pointer-events-none z-50">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom (settings/info) */}
        <div className="flex flex-col items-center gap-y-6 py-6"></div>
      </div>
    </aside>
  );
}
