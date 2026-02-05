import React from "react";
import {
  Home,
  BookOpen,
  CheckSquare,
  FileText,
  User,
  LogOut,
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
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0  z-40 w-72 bg-[#0A0A0A] 
          transform transition-transform duration-300 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col border-r border-gray-800
        `}
      >
        <div className="flex-1 py-6 px-3 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3.5 rounded-xl text-[15px] transition-all duration-200
                ${
                  isActive
                    ? "bg-[#1E3A8A] text-white font-medium"
                    : "text-gray-400 hover:bg-[#1E3A8A]/60 hover:text-white"
                }`
              }
              onClick={() => window.innerWidth < 1024 && onClose?.()}
            >
              <item.icon size={22} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-5 text-xs text-gray-600 mt-auto border-t border-gray-800">
          Version 1.0.0
        </div>
      </aside>
    </>
  );
}