import { NavLink } from "react-router-dom";
import { motion } from "motion/react"; // fixed import (was motion/react)

export default function Sidebar() {
  const navItems = [
    { to: "", icon: "bi-house", label: "Home" },
    { to: "about", icon: "bi-info-circle", label: "About" },
    { to: "contact", icon: "bi-chat", label: "Contact" },
    { to: "projects", icon: "bi-code", label: "Projects" },
    { to: "resume", icon: "bi-briefcase", label: "Resume" },
  ];

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="hidden md:flex h-screen ml-4 text-white py-4 flex-col items-center"
    >
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl h-full w-16 flex flex-col justify-between">
        
        {/* Top Icon */}
        <div className="flex h-[3rem] w-full items-center justify-center pt-2">
          <h1 className="bi bi-incognito text-xl text-primary drop-shadow-lg" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-y-6 pt-4">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={"/" + to}
              to={"/" + to}
              className={
                `group relative flex items-center justify-center w-full h-12 transition-colors`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active bar */}
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r"
                    />
                  )}

                  {/* Icon */}
                  <i                                     
                  className={
                ` bi ${icon} text-xl  ${
                  isActive ? "text-primary" : "text-gray-300 hover:text-primary"
                }`} 
                // className={``} 
                />

                  {/* Tooltip label on hover */}
                  <span className="absolute left-14 opacity-0 group-hover:opacity-100 bg-black/70 text-xs px-2 py-1 rounded-md whitespace-nowrap">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom (settings/info) */}
        <div className="flex flex-col items-center gap-y-6 py-6">
        </div>
      </div>
    </motion.aside>
  );
}
