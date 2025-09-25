// components/FooterNav.tsx
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", icon: "bi-house", label: "Home" },
  { to: "/hub", icon: "bi-database", label: "Hub" },
  { to: "/profile", icon: "bi-person-circle", label: "Profile" },
];

export default function FooterNav() {
  return (
    <div className="fixed md:hidden bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-50">
      <nav className="flex justify-between items-center bg-white/70 dark:bg-gray-900/60 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/10">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 py-1 px-3 rounded-md transition-colors ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-300"
                  : "text-gray-600 dark:text-gray-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <i
                  className={`bi ${icon} text-xl ${isActive ? "scale-110" : ""}`}
                  aria-hidden
                />
                <span className="sr-only">{label}</span>

                <span
                  className={`absolute -top-10 transition-opacity text-xs px-2 py-1 rounded-md bg-black/70 text-white/90 opacity-0 pointer-events-none ${
                    "" /* tooltip appears on hover via group in earlier approach; keeping minimal */
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
