import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Code, LampDesk, Backpack, CodeXml, Menu, X } from "lucide-react";

const Sidebar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // ---------- Sidebar links ----------
  const links = [
    { to: "/", icon: <LampDesk />, label: t("sidebar.links.home") },
    { to: "/homework", icon: <Backpack />, label: t("sidebar.links.homework") },
    { to: "/reviews", icon: <Code />, label: t("sidebar.links.code") },
    { to: "/tasks", icon: <CodeXml />, label: t("sidebar.links.tasks") },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 py-2 px-3 rounded-xl transition-all
     ${isActive ? "bg-[#FFB608] text-white" : "hover:bg-neutral hover:text-white"}`;

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col h-screen p-5 shadow-xl w-[400px] bg-base-100">
        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-4">
            {links.map(({ to, icon, label }) => (
              <NavLink key={to} to={to} className={linkClass}>
                {icon} {label}
              </NavLink>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="mt-auto text-gray-500 text-sm space-y-1">
          <div>{t("sidebar.footer.version")}</div>
          <div>{t("sidebar.footer.authors")}</div>
        </div>
      </aside>

      {/* ================= MOBILE TOGGLE BUTTON ================= */}
      <div className="md:hidden fixed top-4 left-4 z-[999]">
        <button
          onClick={() => setOpen(true)}
          className="p-2 bg-[#FFB608] text-white rounded-xl"
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
          <h2 className="font-bold text-lg">{t("sidebar.menu")}</h2>
          <button onClick={() => setOpen(false)} className="p-1">
            <X />
          </button>
        </div>

        <nav className="flex flex-col justify-between h-full p-4">
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

          {/* Footer for mobile */}
          <div className="mt-auto text-gray-500 text-sm space-y-1">
            <div>{t("sidebar.footer.version")}</div>
            <div>{t("sidebar.footer.authors")}</div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
