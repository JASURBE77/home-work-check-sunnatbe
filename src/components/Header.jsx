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
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <header className="border border-gray-800 sticky bg-[#0A0A0A] top-10 z-50 px-5 py-4 rounded-2xl mb-5">
        <div className="flex items-center justify-between">
          <div className="h-10 w-40 bg-gray-800 animate-pulse rounded-lg"></div>
          <div className="h-10 w-10 bg-gray-800 animate-pulse rounded-full"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="border border-gray-800/50 sticky bg-gradient-to-r from-[#0A0A0A] via-[#0D0D0D] to-[#0A0A0A] top-10 z-50 px-5 py-3.5 rounded-2xl mb-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between">
        {/* Chap taraf — hamburger + logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2.5 hover:bg-blue-600/20 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Menu"
          >
            {isSidebarOpen ? (
              <X size={24} className="text-gray-300" />
            ) : (
              <Menu size={24} className="text-gray-300" />
            )}
          </button>

          <div className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src={Logo}
                className="w-11 h-11 object-contain transition-transform duration-300 group-hover:scale-110"
                alt="Logo"
              />
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent hidden sm:block">
              Student Control
            </h1>
          </div>
        </div>

        {/* O'ng taraf */}
        <div className="flex items-center gap-3 lg:gap-5">
          <button
            className="relative p-2.5 hover:bg-gray-800/80 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 hidden sm:block"
            aria-label="Notifications"
          >
            <Bell size={22} className="text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <div className="hidden md:block">
            <LanguageSelector />
          </div>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-800/40 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <div className="relative">
                <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-base lg:text-lg font-bold text-white shadow-lg">
                  {user?.name?.[0]?.toUpperCase()}
                  {user?.surname?.[0]?.toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A0A0A]"></div>
              </div>

              <div className="hidden lg:flex flex-col items-start max-w-[150px]">
                <span className="font-semibold text-sm leading-tight text-white truncate w-full">
                  {user?.name} {user?.surname}
                </span>
                <span className="text-xs text-blue-300/80 capitalize">
                  {user?.role}
                </span>
              </div>

              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform duration-300 hidden lg:block ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl shadow-2xl py-2 z-[100] border border-gray-700/50 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User info header */}
                <div className="px-5 py-4 border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
                      {user?.name?.[0]?.toUpperCase()}
                      {user?.surname?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">
                        {user?.name} {user?.surname}
                      </div>
                      <div className="text-sm text-gray-400 capitalize">
                        {user?.role}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    className="w-full text-left px-5 py-3 hover:bg-gray-700/50 flex items-center gap-3 text-gray-200 transition-all duration-200 group"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={18} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Profil</span>
                  </button>

                  <button
                    className="w-full text-left px-5 py-3 hover:bg-gray-700/50 flex items-center gap-3 text-gray-200 transition-all duration-200 group"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings size={18} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Sozlamalar</span>
                  </button>

                  <div className="px-5 py-3 md:hidden border-t border-gray-700/50 mt-2 pt-4">
                    <LanguageSelector />
                  </div>

                  <div className="border-t border-gray-700/50 mt-2 pt-2">
                    <button
                      onClick={checkoutUser}
                      className="w-full text-left px-5 py-3 text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-all duration-200 group"
                    >
                      <LogOut size={18} className="group-hover:text-red-300 transition-colors" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Chiqish</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}