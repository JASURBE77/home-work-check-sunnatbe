import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Code, LampDesk, Backpack, Gamepad2, Menu, X, CodeXml } from "lucide-react";

const Sidebar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", icon: <LampDesk />, label: t("home") },
    { to: "/homework", icon: <Backpack />, label: t("homework-link") },
    { to: "/reviews", icon: <Code />, label: t("code") },
    { to: "/tasks", icon: <CodeXml />, label: t("tasks") },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 py-2 px-3 rounded-xl transition text-black
    ${isActive ? "bg-[#FFB608] text-white" : "hover:bg-neutral hover:text-white"}`;

  return (
    <>
      <aside className="hidden md:block h-screen  text-white p-5 shadow-xl w-[400px]">
        <nav>
          <ul className="flex flex-col gap-4">
            {links.map(({ to, icon, label }) => (
              <NavLink key={to} to={to} className={linkClass}>
                {icon} {label}
              </NavLink>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ================= MOBILE TOGGLE BUTTON ================= */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="p-2 bg-black text-white rounded-xl"
        >
          <Menu />
        </button>
      </div>

      {/* ================= MOBILE BACKDROP ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-base-100 shadow-xl z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">Menu</h2>
          <button onClick={() => setOpen(false)} className="p-1">
            <X />
          </button>
        </div>

        <nav className="p-4">
          <ul className="flex flex-col gap-4">
            {links.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {icon} {label}
              </NavLink>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
