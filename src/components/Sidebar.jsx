import React from "react";
import {
  Home,
  BookOpen,
  CheckSquare,
  FileText,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Bosh sahifa", icon: Home, path: "/" },
  { name: "Uy vazifasi", icon: BookOpen, path: "/homework" },
  { name: "Bajarilganlar", icon: CheckSquare, path: "/reviews" },
  { name: "Imthonlar", icon: FileText, path: "/tasks" },
  { name: "Profil", icon: User, path: "/profile" },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 z-40 w-64
          bg-white border-r border-slate-200
          rounded-lg
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
          shadow-[4px_0_24px_rgba(0,0,0,0.06)] lg:shadow-none
        `}
      >
    
        <div className="h-[68px] flex items-center px-5 border-b border-slate-100 lg:hidden">
          <div className="flex items-baseline gap-1">
            <span className="text-[17px] font-bold text-slate-900 tracking-tight">Student</span>
            <span className="text-[17px] font-bold text-blue-600 tracking-tight">Control</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => window.innerWidth < 1024 && onClose?.()}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`  
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-colors duration-150
                    ${isActive
                      ? "bg-white/20"
                      : "bg-slate-100 group-hover:bg-slate-200"
                    }`}
                  >
                    <item.icon
                      size={17}
                      className={isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"}
                    />
                  </span>
                  <span className="text-blue-600">{item.name}</span>

                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center gap-2 px-3.5 py-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[11.5px] text-slate-400 font-medium">Version 1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}