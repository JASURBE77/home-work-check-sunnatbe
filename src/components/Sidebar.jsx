import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Code, LampDesk, Backpack, CodeXml, Menu, X } from "lucide-react";
import IconClipboard from "./icons/line/IconClipboard";

const Sidebar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", icon: <LampDesk />, label: t("sidebar.links.home") },
    { to: "/homework", icon: <Backpack />, label: t("sidebar.links.homework") },
    { to: "/reviews", icon: <Code />, label: t("sidebar.links.code") },
    { to: "/tasks", icon: <IconClipboard />, label: t("sidebar.links.tasks") },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-400
     ${isActive ? "bg-[#1935CA] text-white" : "hover:bg-[#1935CA] hover:text-white"}`;

  return (
    <>
      <aside className="hidden md:flex flex-col h-screen w-[300px]">
        <nav className="flex-1 overflow-y-auto mt-4">
          <ul className="flex flex-col gap-4">
            {links.map(({ to, icon, label }) => (
              <NavLink key={to} to={to} className={linkClass}>
                {icon} {label}
              </NavLink>
            ))}
          </ul>
        </nav>

        <div className="mt-auto text-gray-500 text-sm space-y-1">
          <div>{t("sidebar.footer.version")}</div>
          <div>{t("sidebar.footer.authors")}</div>
        </div>
      </aside>

      <div className="md:hidden fixed top-4 left-4 z-999">
        <button
          onClick={() => setOpen(true)}
          className="px-2 py-1 bg-[#1935CA] text-white rounded-xl"
        >
          <Menu />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-[260px] z-99999 bg-base-100 shadow-xl z-50 transform transition-transform duration-300
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
