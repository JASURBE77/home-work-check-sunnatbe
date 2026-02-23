import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircle2, Clock, Trophy, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SubmissionsGet } from "../../store/slice/submissionsSlice";

export default function Dashboard() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile.data);
  const profileLoading = useSelector((state) => state.profile.loading);
  const { data: submissions, loading, error } = useSelector((state) => state.submissions);

  useEffect(() => {
    if (profile?._id) {
      dispatch(SubmissionsGet());
    }
  }, [dispatch, profile]);

  const completed = submissions.filter(
    (s) => s.submission.status === "CHECKED" || s.submission.status === "AGAIN CHECKED"
  ).length;

  const pending = submissions.filter((s) => s.submission.status === "PENDING").length;

  const totalPoints = submissions
    .filter((s) => s.submission.status === "CHECKED" || s.submission.status === "AGAIN CHECKED")
    .reduce((sum, s) => sum + (s.submission.score || 0), 0);

  const progressPct =
    submissions.length > 0 ? Math.round((completed / submissions.length) * 100) : 0;

  const recentSubmissions = submissions.slice(0, 5).map((s) => ({
    description: s.submission.description,
    date: s.submission.date,
    score: s.submission.score,
    status: s.submission.status,
  }));

  const userName = profile?.name || "Talaba";

  // ── LOADING ──
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 space-y-6 animate-pulse">
        <div className="h-10 w-72 bg-slate-200 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  // ── ERROR ──
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 text-slate-600">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={() => dispatch(SubmissionsGet())}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Qayta urinib ko'rish
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white rounded-xl border border-gray-50 p-5 space-y-5">

      {/* ── GREETING ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Salom, <span className="text-blue-600">{userName}!</span>
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Bugungi kunning vazifalarini ko'rib chiqing
        </p>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bajarilgan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bajarilgan</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{completed}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={20} className="text-green-500" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Jami tekshirilgan topshiriqlar</p>
          <div className="mt-3 h-1 w-full bg-slate-100 rounded-full">
            <div
              className="h-1 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Kutilayotgan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kutilayotgan</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{pending}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Clock size={20} className="text-amber-500" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Tekshirilmagan topshiriqlar</p>
          <div className="mt-3 h-1 w-full bg-slate-100 rounded-full">
            <div
              className="h-1 bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${submissions.length > 0 ? (pending / submissions.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Umumiy ball */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Umumiy ball</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{totalPoints}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Trophy size={20} className="text-blue-500" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Barcha topshiriqlardan</p>
          <div className="mt-3 h-1 w-full bg-slate-100 rounded-full">
            <div className="h-1 bg-blue-500 rounded-full w-full" />
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{progressPct}%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
              <ArrowUpRight size={20} className="text-violet-500" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            {completed} / {submissions.length} topshiriq bajarildi
          </p>
          <div className="mt-3 h-1 w-full bg-slate-100 rounded-full">
            <div
              className="h-1 bg-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── RECENT SUBMISSIONS ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-[15px] font-semibold text-slate-800">So'nggi topshiriqlar</h2>
          <span className="text-xs text-slate-400">{submissions.length} ta jami</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
          {recentSubmissions.length > 0 ? (
            recentSubmissions.map((sub, idx) => {
              const isPending = sub.status === "PENDING";
              const statusLabel =
                sub.status === "PENDING"
                  ? "Kutilmoqda"
                  : sub.status === "CHECKED"
                  ? "Tekshirildi"
                  : sub.status === "AGAIN CHECKED"
                  ? "Qayta tekshirildi"
                  : "Bajarildi";

              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors duration-100"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isPending ? "bg-amber-50" : "bg-green-50"}`}>
                    {isPending ? (
                      <Clock size={17} className="text-amber-500" />
                    ) : (
                      <CheckCircle2 size={17} className="text-green-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-medium text-slate-800 truncate">
                      {sub.description || "Topshiriq"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(sub.date).toLocaleDateString("uz-UZ", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-[13px] font-semibold text-slate-800">
                      {sub.score > 0 ? `${sub.score} ball` : "—"}
                    </p>
                    <span className={`inline-block mt-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full
                      ${isPending ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              Hozircha hech qanday topshiriq topshirilmagan
            </div>
          )}
        </div>
      </div>
    </div>
  );
}