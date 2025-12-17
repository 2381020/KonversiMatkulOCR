import React from "react";
import { NavLink } from "react-router-dom";

interface BAASidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ===== ICONS ===== */
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m4 0h5a1 1 0 001-1V10"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h7"
    />
  </svg>
);

export const BAASidebar: React.FC<BAASidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    {
      to: "/baa/dashboard",
      label: "Dashboard",
      icon: <HomeIcon />,
    },
    {
      to: "/baa/dashboard",
      label: "Finalisasi Konversi",
      icon: <CheckIcon />,
    },
  ];

  return (
    <>
      {/* OVERLAY MOBILE */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-20 md:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-300
        md:static md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="h-16 flex items-center justify-between border-b border-slate-200 px-4">
          <div className="flex items-center gap-2 ml-0">
            <img
              src="https://unai.edu/wp-content/uploads/2023/09/Logo-Unai.png"
              alt="UNAI Logo"
              className="h-6 w-6 object-contain"
            />
            <span className="text-lg font-bold text-slate-800">
              Dashboard BAA
            </span>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-2 text-slate-500 hover:text-indigo-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* NAV */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
