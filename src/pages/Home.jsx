import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  CheckCircle2,
  Clock,
  Trophy,
  ArrowUpRight,
  GitBranch,
  AlertCircle,
} from "lucide-react";
import api from "../utils/api";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth.token);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api({
        url: "/me",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Dashboard API error:", err);
      setError(t("dashboard.fetch_error") || "Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Backenddan kelgan real ma'lumotlar
  const completed = user?.completedLessons || 0;
  const pending = user?.pendingLessons || 0;
  const totalPoints = 0; // backendda hali yo'q
  const ranking = "?";   // backendda hali yo'q
  const recentSubmissions = user?.recentSubmissions || [];
  const pendingAssignments = []; // backendda hali yo'q

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 space-y-8 animate-pulse">
        <div className="h-12 w-80 bg-gray-700 rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 text-center text-red-400 py-20">
        {error}
        <button
          onClick={fetchData}
          className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-white"
        >
          Qayta urinib ko'rish
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 text-center text-gray-400 py-20">
        Foydalanuvchi ma'lumotlari topilmadi
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 space-y-8">
      {/* Salomlashuv */}
      <div>
        <h1 className="text-4xl font-bold mb-1">
          Salom, {user.name || user.login || "Talaba"}!
        </h1>
        <p className="text-gray-400 text-lg">
          Bugungi kunning vazifalarini ko'rib chiqing
        </p>
      </div>

      {/* Stats kartalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bajarilgan */}
        <div className="bg-gradient-to-br from-green-950 to-green-900 rounded-2xl p-6 border border-green-800/50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-green-300 font-medium">Bajarilgan</p>
              <p className="text-4xl font-bold mt-1">{completed}</p>
            </div>
            <div className="bg-green-600/30 p-3 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <p className="text-green-400 text-sm">+0% o'tgan haftaga nisbatan</p>
        </div>

        {/* Kutilayotgan */}
        <div className="bg-gradient-to-br from-amber-950 to-amber-900 rounded-2xl p-6 border border-amber-800/50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-amber-300 font-medium">Kutilayotgan</p>
              <p className="text-4xl font-bold mt-1">{pending}</p>
            </div>
            <div className="bg-amber-600/30 p-3 rounded-xl">
              <Clock className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <p className="text-amber-400 text-sm">+0% o'tgan haftaga nisbatan</p>
        </div>

        {/* Umumiy ball */}
        <div className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-2xl p-6 border border-blue-800/50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-300 font-medium">Umumiy ball</p>
              <p className="text-4xl font-bold mt-1">{totalPoints}</p>
            </div>
            <div className="bg-blue-600/30 p-3 rounded-xl">
              <Trophy className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <p className="text-blue-400 text-sm">+0% o'tgan haftaga nisbatan</p>
        </div>

        {/* Reyting */}
        <div className="bg-gradient-to-br from-purple-950 to-purple-900 rounded-2xl p-6 border border-purple-800/50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-purple-300 font-medium">Reyting</p>
              <p className="text-4xl font-bold mt-1">#{ranking}</p>
            </div>
            <div className="bg-purple-600/30 p-3 rounded-xl">
              <ArrowUpRight className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <p className="text-purple-400 text-sm">O'tgan haftaga nisbatan</p>
        </div>
      </div>

      {/* Yangi topshiriq, Progress, Muddat yaqin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Yangi topshiriq */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Yangi topshiriq</h3>
          <p className="text-gray-400">
            Hozircha yangi topshiriq mavjud emas
          </p>
        </div>

        {/* Progress */}
        <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 rounded-2xl p-6 border border-emerald-800/50">
          <h3 className="text-xl font-bold mb-4">Progress</h3>
          <p className="text-gray-300 mb-3">
            Oylik maqsadingizning 0% bajarildi
          </p>
          <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
            <div className="bg-emerald-500 h-3 rounded-full" style={{ width: "0%" }} />
          </div>
          <p className="text-sm text-gray-400">Umumiy: 0%</p>
        </div>

        {/* Muddat yaqin */}
        <div className="bg-gradient-to-br from-amber-950 to-amber-900 rounded-2xl p-6 border border-amber-800/50">
          <h3 className="text-xl font-bold mb-4">Muddat yaqin</h3>
          <p className="text-gray-300 mb-2">
            {pending} ta topshiriq yaqin orada tugaydi
          </p>
          <button className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Barchasini ko'rish
          </button>
        </div>
      </div>

      {/* So'nggi topshiriqlar */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6">So'nggi topshiriqlar</h2>
        <div className="space-y-4">
          {recentSubmissions.length > 0 ? (
            recentSubmissions.map((sub, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  sub.status === "PENDING"
                    ? "bg-amber-950/50 border-amber-800"
                    : "bg-green-950/50 border-green-800"
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {sub.status === "PENDING" ? (
                    <Clock className="w-10 h-10 text-amber-400 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-10 h-10 text-green-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {sub.description || "Topshiriq"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(sub.date).toLocaleDateString("uz-UZ", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-green-400">
                    {sub.score > 0 ? `${sub.score} ball` : "—"}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      sub.status === "PENDING" ? "text-amber-400" : "text-green-400"
                    }`}
                  >
                    {sub.status === "PENDING" ? "Kutilmoqda" : "Bajarildi"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              Hozircha hech qanday topshiriq topshirilmagan
            </div>
          )}
        </div>
      </div>

      {/* Windows activation */}
      <div className="bg-gray-900/50 rounded-xl p-4 text-sm text-gray-400 border border-gray-800 mt-6">
        <p className="font-medium text-gray-300">Активация Windows</p>
        <p>
          Чтобы активировать Windows, перейдите в раздел "Параметры".
        </p>
      </div>
    </div>
  );
}