import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  CheckCircle,
  Trophy,
  Calendar,
  Target,
  TrendingUp,
} from "lucide-react";
import api from "../utils/api";
import dayjs from "dayjs";

export default function Profile() {
  const { t } = useTranslation();
  const storedUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(storedUser || null);
  const [loading, setLoading] = useState(true);

  const completionPercentage =
    user?.totalLessons > 0
      ? Math.round((user.completedLessons / user.totalLessons) * 100)
      : 0;

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
  }, [storedUser]);

  // ---------- OLD SKELETON LOADER ----------
  if (loading) {
    return (
      <div className="p-4 space-y-6">
        {/* Profile Card Skeleton */}
        <div className="w-full max-w-4xl bg-gray-100 rounded-3xl p-6 space-y-4 shadow animate-pulse">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300" />
            <div className="flex-1 space-y-4 w-full">
              <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Progress Skeleton */}
        <div className="w-full max-w-4xl bg-gray-100 rounded-3xl p-6 space-y-4 shadow animate-pulse">
          <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="h-20 bg-gray-300 rounded-xl"></div>
            <div className="h-20 bg-gray-300 rounded-xl"></div>
          </div>
        </div>

        {/* Recent Submissions Skeleton */}
        <div className="w-full max-w-4xl bg-gray-100 rounded-3xl p-6 space-y-4 shadow animate-pulse">
          <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-300 rounded-xl w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-red-500">{t("profile.notFound")}</p>
    );
  }

  return (
    <div className="w-full bg-base-100 shadow-xl p-4 md:p-8">
      {/* ===== PROFILE CARD ===== */}
      <div className="card bg-base-100 shadow-xl rounded-3xl p-6 border border-base-300">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full flex items-center justify-center ring ring-primary ring-offset-2">
              <span className="text-5xl font-bold">
                {user.name?.[0]}
                {user.surname?.[0]}
              </span>
            </div>
            <div className="badge badge-primary absolute -bottom-2 -right-2">
              {user.level}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">
              {user.name} {user.surname}
            </h1>

            <p className="text-xl mt-1">
              {t("profile.role")}: {user.role}
            </p>

            <p className="text-xl">
              {t("profile.group")}: {user.group?.name || t("profile.noGroup")}
            </p>

            <div className="flex flex-wrap gap-4 mt-3 text-sm opacity-70">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {user.joinDate &&
                  `${t("profile.joined")}: ${dayjs(user.joinDate).format(
                    "DD.MM.YYYY"
                  )}`}
              </div>

              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-yellow-500" />
                {user.points || 0} {t("rating")}
              </div>
            </div>

            {/* STATS */}
            <div className="stats stats-vertical md:stats-horizontal mt-4 bg-base-200 rounded-xl">
              <div className="stat">
                <div className="stat-title">{t("profile.totalLessons")}</div>
                <div className="stat-value">{user.totalLessons}</div>
              </div>

              <div className="stat">
                <div className="stat-title">{t("profile.completedLessons")}</div>
                <div className="stat-value text-success">{user.completedLessons}</div>
              </div>

              <div className="stat">
                <div className="stat-title">{t("profile.pendingLessons")}</div>
                <div className="stat-value text-warning">{user.pendingLessons}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PROGRESS ===== */}
      <div className="card mt-6 bg-base-100 shadow-xl rounded-3xl p-6 ">
        <div className="flex items-center gap-3 mb-3">
          <Target className="text-primary" />
          <h2 className="text-2xl font-bold">{t("profile.progress")}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-success/20">
            <CheckCircle className="text-success mb-1" />
            <p className="font-semibold">{t("status.checked")}</p>
            <p className="text-2xl font-bold">{user.completedLessons}</p>
          </div>

          <div className="p-4 rounded-xl bg-warning/20">
            <BookOpen className="text-warning mb-1" />
            <p className="font-semibold">{t("status.pending")}</p>
            <p className="text-2xl font-bold">{user.pendingLessons}</p>
          </div>
        </div>
      </div>

      {/* ===== RECENT SUBMISSIONS ===== */}
      <div className="card mt-6 bg-base-100 shadow-xl rounded-3xl p-6 ">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-primary" />
          <h2 className="text-2xl font-bold">{t("profile.recentSubmissions")}</h2>
        </div>

        {user.recentSubmissions?.length > 0 ? (
          <div className="space-y-3">
            {user.recentSubmissions.map((s, i) => (
              <div
                key={i}
                className="p-4 rounded-xl shadow-md  flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{s.description || t("profile.noTitle")}</p>
                  <p className="text-sm opacity-60">{dayjs(s.date).format("DD.MM.YYYY")}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    s.status === "CHECKED"
                      ? "bg-success/20 text-success"
                      : "bg-warning/20 text-warning"
                  }`}
                >
                  {s.status === "CHECKED" ? t("status.checked") : t("status.pending")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">{t("profile.noSubmissions")}</p>
        )}
      </div>
    </div>
  );
}
