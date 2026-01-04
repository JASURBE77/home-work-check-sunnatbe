import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BookOpen,
  CheckCircle,
  Trophy
} from "lucide-react";
import api from "../utils/api";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth.token);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 📊 Jami ball
  const totalPoints = user?.recentSubmissions
    ? user.recentSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0)
    : 0;

  const fetchData = async () => {
    setLoading(true);
    try {
      const resUser = await api({
        url: "/me",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(resUser.data);
    } catch (err) {
      console.error("Dashboard API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // 🔄 Loader
// 🔄 Loader
if (loading) {
  return (
    <div className="min-h-screen  p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-10 w-72 bg-gray-300 rounded"></div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-3"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-6 w-16 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>

      {/* Section title */}
      <div className="h-7 w-56 bg-gray-300 rounded"></div>

      {/* Recent submissions skeleton */}
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-4 space-y-3"
          >
            <div className="flex justify-between">
              <div className="h-4 w-40 bg-gray-300 rounded"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
            <div className="h-3 w-28 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}


  if (!user) {
    return (
      <p className="text-center mt-10 text-red-500">
        {t("dashboard.user_not_found")}
      </p>
    );
  }

  return (
    <div className="min-h-screen  p-6 space-y-8">
      {/* 👋 Header */}
      <h1 className="text-4xl font-bold">
        {t("dashboard.hello")}, {user.name} 👋
      </h1>

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center">
          <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
          <span className="text-lg font-semibold">
            {t("profile.completedLessons")}
          </span>
          <span className="text-2xl font-bold">
            {user.completedLessons} {t("dashboard.items")}
          </span>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center">
          <BookOpen className="w-8 h-8 text-yellow-500 mb-2" />
          <span className="text-lg font-semibold">
            {t("profile.pendingLessons")}
          </span>
          <span className="text-2xl font-bold">
            {user.pendingLessons} {t("dashboard.items")}
          </span>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center">
          <Trophy className="w-8 h-8 text-purple-500 mb-2" />
          <span className="text-lg font-semibold">
            {t("dashboard.total_points")}
          </span>
          <span className="text-2xl font-bold">{totalPoints}</span>
        </div>
      </div>

      {/* 📝 So‘nggi topshiriqlar */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          {t("profile.recentSubmissions")}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {user.recentSubmissions?.map((sub, idx) => (
            <div
              key={idx}
              className="bg-white shadow-xl rounded-xl p-4 flex flex-col gap-2"
            >
              <div className="flex justify-between">
                <span className="font-semibold">{sub.description}</span>
                <span
                  className={`text-sm font-semibold ${
                    sub.status === "CHECKED"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {sub.status === "CHECKED"
                    ? t("status.checked")
                    : t("status.pending")}
                </span>
              </div>

              <span className="text-sm text-gray-500">
                {new Date(sub.date).toLocaleDateString()}
              </span>

              {sub.score !== undefined && (
                <span className="font-bold text-green-600">
                  {t("dashboard.score")}: {sub.score} ⭐
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
