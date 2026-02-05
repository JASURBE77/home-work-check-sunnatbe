import React, { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import LanguageSelector from "./LanguageSelector"; // o'zingizda bor deb faraz qildim
import Logo from "../assets/logo.png";   // agar logo kerak bo'lsa
import api from "../utils/api";
import { useSelector } from "react-redux";

export default function Header({ onMenuClick, isSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
 const storedUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(storedUser || null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api({ url: "/me", method: "GET" });
      setUser(res.data);
    } catch (err) {
      console.error("User fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkoutUser = () => {
    localStorage.removeItem("persist:auth")
    window.location.href = "/login"
  }

  useEffect(() => {
    fetchProfile();
  }, []);


  return (
    <header className="border border-gray-800 sticky bg-[#0A0A0A] top-10 z-999 px-5 py-4 rounded-2xl mb-5">
      <div className="flex items-center justify-between">
        {/* Chap taraf — logo + hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-blue-700/80 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          <div className="flex  items-center gap-3">
         <img src={Logo} className="w-12" alt="" />
            <h1 className="text-2xl font-bold  text-white">Student Control</h1>
          </div>
        </div>

        {/* O'ng taraf — til + user dropdown */}
        <div className="flex items-center gap-5">

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="w-11 h-11 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold text-white">
                {user.name?.[0]}
                {user.surname?.[0]}
              </div>

              <div className="hidden sm:flex flex-col items-start">
                <span className="font-semibold leading-tight">
                  {user.name} {user.surname}
                </span>
                <span className="text-xs text-blue-200">{user.role}</span>
              </div>

              <ChevronDown size={18} className="hidden sm:block text-gray-300" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-[#1F2937] rounded-xl shadow-2xl py-2 z-50 border border-gray-700 text-sm">
                <div className="px-5 py-3 border-b border-gray-700">
                  <div className="font-semibold">{user.name} {user.surname}</div>
                  <div className="text-gray-400">{user.role}</div>
                </div>

                <button className="w-full text-left px-5 py-3 hover:bg-gray-700/80 flex items-center gap-3">
                  Profil
                </button>

                <button className="w-full text-left px-5 py-3 hover:bg-gray-700/80 flex items-center gap-3">
                  Sozlamalar
                </button>

                <button onClick={checkoutUser} className="w-full text-left px-5 py-3 text-red-400 hover:bg-gray-700/80 flex items-center gap-3">
                  Chiqish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}