import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Trophy, User, Calendar, Target, CheckCircle2, Clock } from "lucide-react";
import api from "../../utils/api";
import dayjs from "dayjs";

export default function Profile() {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => state.profile.data);

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const ProfileFetch = async () => {
    if (!token || !profile?._id) return;
    try {
      const res = await api({
        url: `/submissions/${profile._id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      setSubmissions(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ProfileFetch();
  }, [token, profile]);

  const user = submissions.length > 0 ? submissions[0] : null;

  const stats = {
    total: submissions.length,
    completed: submissions.filter(
      (s) => s.submission?.status === "CHECKED" || s.submission?.status === "AGAIN CHECKED"
    ).length,
    pending: submissions.filter((s) => s.submission?.status === "PENDING").length,
    totalScore: submissions
      .filter((s) => s.submission?.status === "CHECKED" || s.submission?.status === "AGAIN CHECKED")
      .reduce((sum, s) => sum + (s.submission?.score || 0), 0),
  };

  const progressPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const courses = submissions.reduce((acc, item) => {
    if (item.group?.name) {
      const g = item.group.name;
      if (!acc[g]) acc[g] = { total: 0, completed: 0 };
      acc[g].total++;
      if (item.submission?.status === "CHECKED" || item.submission?.status === "AGAIN CHECKED") {
        acc[g].completed++;
      }
    }
    return acc;
  }, {});

  const courseProgress = Object.entries(courses)
    .map(([name, data]) => ({
      name,
      percentage: Math.round((data.completed / data.total) * 100),
    }))
    .slice(0, 3);

  const initials = `${profile?.name?.[0] || ""}${profile?.surname?.[0] || ""}`.toUpperCase();

  // ── LOADING ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5 space-y-4 animate-pulse">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-slate-200" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-48 bg-slate-200 rounded-lg" />
              <div className="h-4 w-32 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-5">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-slate-200 rounded-xl" />)}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-64 bg-slate-200 rounded-2xl" />
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  // ── NO DATA ──
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Profil topilmadi</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-5 space-y-4">

      {/* ── PROFILE HEADER ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-600 flex items-center justify-center border-4 border-blue-100">
              <span className="text-xl md:text-2xl font-bold text-white">{initials}</span>
            </div>
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {user.name} {user.surname}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <User size={12} /> Talaba
              </span>
              {user.group && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar size={12} /> {user.group.name}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                <Trophy size={12} />
                #{stats.completed > 0 ? Math.ceil(stats.completed / 2) : "?"} Reyting
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            <p className="text-xs text-slate-400 mt-0.5">Jami</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            <p className="text-xs text-green-500 mt-0.5">Bajarilgan</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            <p className="text-xs text-amber-500 mt-0.5">Kutilayotgan</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.totalScore}</p>
            <p className="text-xs text-blue-500 mt-0.5">Umumiy ball</p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-[14px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Mail size={15} className="text-slate-400" />
            Bog'lanish ma'lumotlari
          </h3>

          <div className="space-y-3">
            {[
              {
                icon: <User size={15} className="text-slate-400" />,
                label: "Ism familiya",
                value: `${user.name} ${user.surname}`,
              },
              {
                icon: <Mail size={15} className="text-slate-400" />,
                label: "User ID",
                value: user.userId,
                mono: true,
              },
              user.group && {
                icon: <MapPin size={15} className="text-slate-400" />,
                label: "Guruh",
                value: user.group.name,
              },
              {
                icon: <Calendar size={15} className="text-slate-400" />,
                label: "Oxirgi topshiriq",
                value: submissions[0]?.submission?.date
                  ? dayjs(submissions[0].submission.date).format("DD.MM.YYYY")
                  : "Ma'lumot yo'q",
              },
            ]
              .filter(Boolean)
              .map((row, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    {row.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-400">{row.label}</p>
                    <p className={`text-[13px] font-medium text-slate-800 truncate ${row.mono ? "font-mono text-[11px]" : ""}`}>
                      {row.value}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-[14px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Target size={15} className="text-blue-500" />
            O'qish progressi
          </h3>

          <div className="space-y-4">
            {courseProgress.length > 0 ? (
              courseProgress.map((course, idx) => {
                const pct = course.percentage;
                const barColor =
                  pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-blue-500" : "bg-amber-400";
                const textColor =
                  pct >= 80 ? "text-green-600" : pct >= 50 ? "text-blue-600" : "text-amber-500";

                return (
                  <div key={idx}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[13px] font-medium text-slate-700 truncate pr-3">
                        {course.name}
                      </span>
                      <span className={`text-[13px] font-bold ${textColor}`}>{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">Hali kurslar mavjud emas</p>
            )}

            {/* Overall */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex justify-between mb-1.5">
                <span className="text-[13px] font-semibold text-slate-700">Umumiy progress</span>
                <span className="text-[13px] font-bold text-violet-600">{progressPct}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full">
                <div
                  className="h-2 rounded-full bg-violet-500 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}