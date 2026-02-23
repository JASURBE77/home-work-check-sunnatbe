import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Trophy, ExternalLink, RefreshCw } from "lucide-react";

const Review = () => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => state.profile.data);

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubmissions = async () => {
    if (!token || !profile?._id) return;
    setLoading(true);
    try {
      const res = await api({
        url: `/submissions/${profile._id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(res.data.data || []);
    } catch (err) {
      console.error("Submissions fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [token, profile?._id]);

  const checkedSubmissions = submissions.filter(
    (s) =>
      s.submission.status === "CHECKED" ||
      s.submission.status === "AGAIN CHECKED" ||
      s.submission.status === "PENDING"
  );

  const stats = {
    total: checkedSubmissions.length,
    avgScore:
      checkedSubmissions.length > 0
        ? Math.round(
            checkedSubmissions.reduce((sum, s) => sum + (s.submission.score || 0), 0) /
              checkedSubmissions.length
          )
        : 0,
    totalScore: checkedSubmissions.reduce((sum, s) => sum + (s.submission.score || 0), 0),
  };

  const renderStars = (score) => {
    const filled = Math.min(Math.floor(score / 20), 5);
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={13}
            className={i < filled ? "fill-amber-400 text-amber-400" : "text-slate-200"}
          />
        ))}
      </div>
    );
  };

  const getScoreStyle = (score) => {
    if (score >= 90) return { text: "text-green-600", bg: "bg-green-50", border: "border-green-100" };
    if (score >= 70) return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" };
    return { text: "text-red-500", bg: "bg-red-50", border: "border-red-100" };
  };

  // ── LOADING ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5 space-y-4 animate-pulse">
        <div className="h-8 w-56 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-slate-200 rounded-2xl" />)}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 bg-slate-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // ── EMPTY ──
  if (checkedSubmissions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
            <CheckCircle2 size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm">
            {t("review.empty") || "Hali tekshirilgan topshiriqlar yo'q"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-5 space-y-5">

      {/* ── HEADER ── */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Bajarilgan topshiriqlar</h1>
        <p className="text-sm text-slate-400 mt-0.5">Tekshirilgan va baholangan barcha topshiriqlaringiz</p>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Jami */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={19} className="text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-400">Jami bajarilgan</p>
          </div>
        </div>

        {/* O'rtacha */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Star size={19} className="text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.avgScore}%</p>
            <p className="text-xs text-slate-400">O'rtacha ball</p>
          </div>
        </div>

        {/* Umumiy */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Trophy size={19} className="text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.totalScore}</p>
            <p className="text-xs text-slate-400">Umumiy ball</p>
          </div>
        </div>
      </div>

      {/* ── LIST ── */}
      <div className="space-y-3">
        {checkedSubmissions.map((item, idx) => {
          const sub = item.submission;
          const score = sub.score || 0;
          const scoreStyle = getScoreStyle(score);
          const isPending = sub.status === "PENDING";
          const repoName = sub.HwLink?.includes("github.com")
            ? sub.HwLink.split("/").slice(-1)[0]
            : sub.description || "Loyiha";

          return (
            <motion.div
              key={sub._id || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition-all duration-150"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPending ? "bg-amber-50" : "bg-green-50"}`}>
                  <CheckCircle2 size={18} className={isPending ? "text-amber-400" : "text-green-500"} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-semibold text-slate-800 truncate">{repoName}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(sub.date).toLocaleDateString("uz-UZ", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                        {sub.checkedDate && (
                          <span className="ml-2 text-slate-300">
                            · Tekshirildi: {new Date(sub.checkedDate).toLocaleDateString("uz-UZ", {
                              day: "numeric", month: "long",
                            })}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Score badge */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${scoreStyle.bg} ${scoreStyle.border} flex-shrink-0`}>
                      <span className={`text-xl font-bold ${scoreStyle.text}`}>{score}</span>
                      <span className={`text-xs ${scoreStyle.text} opacity-60`}>/100</span>
                    </div>
                  </div>

                  {/* Description */}
                  {sub.description && (
                    <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                      {sub.description}
                    </p>
                  )}

                  {/* Stars + status + link */}
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      {renderStars(score)}
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full
                        ${isPending
                          ? "bg-amber-50 text-amber-600"
                          : sub.status === "AGAIN CHECKED"
                          ? "bg-violet-50 text-violet-600"
                          : "bg-green-50 text-green-600"
                        }`}
                      >
                        {isPending ? "Kutilmoqda" : sub.status === "AGAIN CHECKED" ? "Qayta tekshirildi" : "Tekshirildi"}
                      </span>
                      {item.group && (
                        <span className="text-[11px] text-slate-400">{item.group.name}</span>
                      )}
                    </div>

                    <a
                      href={sub.HwLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[12px] text-blue-500 hover:text-blue-700 font-medium transition-colors"
                    >
                      <ExternalLink size={13} />
                      Ko'rish
                    </a>
                  </div>

                  {/* Teacher comment */}
                  {sub.teacherDescription && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        O'qituvchi izohi {sub.checkedBy && `· ${sub.checkedBy}`}
                      </p>
                      <p className="text-[13px] text-slate-600">{sub.teacherDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── REFRESH FAB ── */}
      <button
        onClick={fetchSubmissions}
        disabled={loading}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white w-12 h-12 rounded-full shadow-lg shadow-blue-500/25 flex items-center justify-center transition-all hover:scale-105 disabled:cursor-not-allowed z-50"
      >
        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
      </button>
    </div>
  );
};

export default Review;