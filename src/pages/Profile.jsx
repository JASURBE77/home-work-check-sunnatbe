import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  Trophy,
  User,
  Calendar,
  Target,
} from "lucide-react";

import api from "../utils/api";
import dayjs from "dayjs";

export default function Profile() {
  const { t } = useTranslation();
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

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 space-y-8 animate-pulse">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800 p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-40 rounded-full bg-gray-700" />
            <div className="flex-1 space-y-4">
              <div className="h-10 w-3/4 bg-gray-700 rounded-xl" />
              <div className="h-6 w-1/2 bg-gray-700 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-28 bg-gray-700 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <div className="h-8 w-1/2 bg-gray-700 rounded mb-6" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-800 rounded-xl mb-4" />
            ))}
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <div className="h-8 w-1/2 bg-gray-700 rounded mb-6" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-800 rounded-xl mb-4" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-red-400 text-xl">Profil topilmadi</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ===== PROFILE HEADER CARD ===== */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800 p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Avatar va info */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center ring-4 ring-blue-500/30 ring-offset-4 ring-offset-gray-900">
                  <span className="text-5xl md:text-6xl font-bold text-white">
                    {user.name?.[0]}
                    {user.surname?.[0]}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900" />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {user.name} {user.surname}
                </h1>
                <p className="text-gray-400 text-lg mt-1">@{user.login || "username"}</p>

                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    Talaba
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Qo'shilgan: {dayjs(user.joinDate).format("DD.MM.YYYY")}
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Trophy size={16} />
                    #{user.ranking || 5} Reyting
                  </div>
                </div>
              </div>
            </div>

            {/* Edit button */}
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-all shadow-lg shadow-blue-900/30">
              <Edit size={18} />
              Tahriirlash
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-1">24</p>
              <p className="text-gray-400">Jami darslar</p>
            </div>

            <div className="bg-gradient-to-br from-green-950 to-green-900 border border-green-800/50 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-1">12</p>
              <p className="text-green-300">Bajarilgan</p>
            </div>

            <div className="bg-gradient-to-br from-amber-950 to-amber-900 border border-amber-800/50 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-1">3</p>
              <p className="text-amber-300">Kutilayotgan</p>
            </div>

            <div className="bg-gradient-to-br from-blue-950 to-blue-900 border border-blue-800/50 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-1">856</p>
              <p className="text-blue-300">Umumiy ball</p>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Mail className="text-gray-400" size={24} />
              Bog'lanish ma'lumotlari
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-950 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="font-medium">jasur@example.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-950 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Telefon</p>
                  <p className="font-medium">+998 90 123 45 67</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-950 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Manzil</p>
                  <p className="font-medium">Toshkent, O'zbekiston</p>
                </div>
              </div>
            </div>
          </div>

          {/* O'qish progressi */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Target className="text-blue-500" size={24} />
              O'qish progressi
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">React asoslari</span>
                  <span className="text-green-400 font-bold">100%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Next.js</span>
                  <span className="text-blue-400 font-bold">75%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: "75%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">TypeScript</span>
                  <span className="text-amber-400 font-bold">50%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div className="bg-amber-500 h-3 rounded-full" style={{ width: "50%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}