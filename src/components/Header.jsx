import React, { useEffect, useState, useRef } from "react";
import { Menu, X, ChevronDown, User, Settings, LogOut, Bell } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import Logo from "../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile, clearProfile } from "../store/slice/Profilestore";

export default function Header({ onMenuClick, isSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.data);
  const loading = useSelector((state) => state.profile.loading);

  const checkoutUser = () => {
    dispatch(clearProfile());
    localStorage.removeItem("persist:auth");
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) dispatch(fetchProfile());
  }, [dispatch, user]);

  const initials = `${user?.name?.[0]?.toUpperCase() || ""}${user?.surname?.[0]?.toUpperCase() || ""}`;

  // ── LOADING SKELETON ──
  if (loading) {
    return (
      <header className="sticky top-3 z-50 mb-5 bg-white border border-slate-200 rounded-2xl px-[18px] py-[10px] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="h-9 w-40 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Dropdown animation */}
      <style>{`
        @keyframes ddOpen {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dd-open { animation: ddOpen 0.17s ease; }
      `}</style>

      <header className="sticky top-3 z-50 mb-5 bg-white border border-slate-200 rounded-2xl px-[18px] py-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_6px_24px_rgba(0,0,0,0.07)]">
        <div className="flex items-center justify-between">

          {/* ── LEFT ── */}
          <div className="flex items-center gap-2.5">
            {/* Hamburger — only mobile */}
            <button
              onClick={onMenuClick}
              aria-label="Menu"
              className="lg:hidden flex items-center justify-center w-[34px] h-[34px] rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors duration-150"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex-shrink-0 w-9 h-9 rounded-[10px] bg-blue-50 border border-blue-100 flex items-center justify-center">
                <img src={Logo} alt="Logo" className="w-[22px] h-[22px] object-contain" />
              </div>
              <div className="hidden sm:flex items-baseline gap-1">
                <span className="text-[17px] font-bold text-slate-900 tracking-tight">Student</span>
                <span className="text-[17px] font-bold text-blue-600 tracking-tight">Control</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex items-center gap-1">

            {/* Notification */}
            <button
              aria-label="Notifications"
              className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-[9px] text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors duration-150"
            >
              <Bell size={18} />
              <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-white" />
            </button>

            {/* Language selector */}
            <div className="hidden md:block px-1">
              <LanguageSelector />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-slate-200 mx-1.5" />

            {/* ── USER DROPDOWN ── */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-[5px] pr-2 py-[5px] rounded-[10px] hover:bg-slate-50 transition-colors duration-150"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0 w-[34px] h-[34px] rounded-full bg-blue-600 border-2 border-blue-100 flex items-center justify-center">
                  <span className="text-[12px] font-bold text-white tracking-[0.3px]">{initials}</span>
                  <span className="absolute -bottom-[1px] -right-[1px] w-[9px] h-[9px] bg-green-500 rounded-full border-2 border-white" />
                </div>

                {/* Name + role — desktop only */}
                <div className="hidden lg:flex flex-col items-start max-w-[120px]">
                  <span className="text-[13px] font-semibold text-slate-900 truncate max-w-[120px] leading-[1.3]">
                    {user?.name} {user?.surname}
                  </span>
                  <span className="text-[11px] font-medium text-blue-600 capitalize leading-[1.3]">
                    {user?.role}
                  </span>
                </div>

                {/* Chevron — desktop only */}
                <ChevronDown
                  size={15}
                  className="hidden lg:block text-slate-400 flex-shrink-0 transition-transform duration-200"
                  style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div className="dd-open absolute right-0 top-[calc(100%+8px)] w-[236px] bg-white border border-slate-200 rounded-2xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_16px_40px_rgba(0,0,0,0.1)] overflow-hidden z-[100]">

                  {/* Profile header */}
                  <div className="flex items-center gap-[11px] px-4 py-3.5 bg-slate-50">
                    <div className="flex-shrink-0 w-[38px] h-[38px] rounded-full bg-blue-600 flex items-center justify-center text-[13px] font-bold text-white">
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13.5px] font-semibold text-slate-900 truncate">{user?.name} {user?.surname}</span>
                      <span className="text-[11.5px] font-medium text-blue-600 capitalize mt-0.5">{user?.role}</span>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Menu items */}
                  <div className="py-1.5">
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-[9px] text-[13.5px] font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:pl-5 transition-all duration-150 group"
                    >
                      <User size={15} className="text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      Profil
                    </button>
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-[9px] text-[13.5px] font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:pl-5 transition-all duration-150 group"
                    >
                      <Settings size={15} className="text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      Sozlamalar
                    </button>

                    {/* Language — mobile only */}
                    <div className="md:hidden px-4 py-2 border-t border-slate-100 mt-1">
                      <LanguageSelector />
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Logout */}
                  <div className="py-1.5">
                    <button
                      onClick={checkoutUser}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-[9px] text-[13.5px] font-medium text-red-500 hover:bg-red-50 hover:pl-5 transition-all duration-150"
                    >
                      <LogOut size={15} className="flex-shrink-0" />
                      Chiqish
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}