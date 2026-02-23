import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

const HistoryTest = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { result: initialResult } = location.state || {};

  const [result, setResult] = useState(initialResult);
  const [loading, setLoading] = useState(!initialResult);

  useEffect(() => {
    if (result) setLoading(false);
  }, [result]);

  // ── LOADING ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 size={28} className="text-blue-500 animate-spin" />
        <p className="text-sm text-slate-400">{t("loading") || "Yuklanmoqda..."}</p>
      </div>
    );
  }

  // ── NO RESULT ──
  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
          <XCircle size={24} className="text-slate-400" />
        </div>
        <p className="text-sm text-slate-500">{t("history.no_result") || "Natija topilmadi"}</p>
      </div>
    );
  }

  const scorePercentage = Math.round((result.totalScore / result.maxScore) * 100);
  const isGood = scorePercentage >= 70;
  const displayScore =
    result.totalScore < 99
      ? result.totalScore.toFixed(1)
      : Math.ceil(result.maxScore);

  return (
    <div className="min-h-screen bg-slate-50 p-5 space-y-4">
      <div className="max-w-3xl mx-auto space-y-4">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {result.student?.name} {result.student?.surname}
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Imtihon natijasi</p>
          </div>
          <Link
            to="/tasks"
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <ArrowLeft size={15} />
            {t("history.back") || "Orqaga"}
          </Link>
        </div>

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Holati</p>
            <p className="text-[13px] font-semibold text-blue-600">{result.status || "Yakunlangan"}</p>
          </div>

          {/* Boshlangan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Boshlangan</p>
            <p className="text-[12px] font-medium text-slate-700">
              {result.startedAt
                ? new Date(result.startedAt).toLocaleString("uz-UZ")
                : "—"}
            </p>
          </div>

          {/* Tugatilgan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Tugatilgan</p>
            <p className="text-[12px] font-medium text-slate-700">
              {result.finishedAt
                ? new Date(result.finishedAt).toLocaleString("uz-UZ")
                : "—"}
            </p>
          </div>

          {/* Score */}
          <div className={`rounded-2xl p-4 shadow-sm text-center border ${isGood ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
            <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Ball</p>
            <p className={`text-2xl font-bold ${isGood ? "text-green-600" : "text-red-500"}`}>
              {displayScore}
              <span className="text-sm font-normal text-slate-400 ml-1">/ {Math.ceil(result.maxScore)}</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {scorePercentage}% · {isGood ? "Yaxshi" : "Yaxshilash kerak"}
            </p>
          </div>
        </div>

        {/* ── ANSWERS ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <CheckCircle2 size={16} className="text-blue-500" />
            <h3 className="text-[14px] font-semibold text-slate-800">
              {t("history.questions") || "Savollar va javoblar"}
            </h3>
            <span className="ml-auto text-xs text-slate-400">{result.answers?.length || 0} ta</span>
          </div>

          {result.answers?.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              {t("history.no_questions") || "Savollar mavjud emas"}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {result.answers.map((ans, index) => {
                const isCorrect = ans.score > 0;
                return (
                  <div
                    key={ans.questionId || index}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                  >
                    {/* Number */}
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold mt-0.5
                      ${isCorrect ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-500 border border-red-100"}`}>
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-[13.5px] font-medium text-slate-800 leading-snug">
                        {ans.questionText || "Savol matni mavjud emas"}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Your answer */}
                        <div className={`rounded-xl px-3 py-2 border ${isCorrect ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
                            Sizning javobingiz
                          </p>
                          <p className={`text-[13px] font-medium ${isCorrect ? "text-green-700" : "text-red-600"}`}>
                            {ans.selectedAnswer?.value || "—"}
                          </p>
                        </div>

                        {/* Correct answer */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
                            To'g'ri javob
                          </p>
                          <p className="text-[13px] font-medium text-slate-700">
                            {ans.correctAnswer?.value || "—"}
                          </p>
                        </div>
                      </div>

                      {/* Score badge */}
                      <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full
                        ${isCorrect ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-500 border border-red-100"}`}>
                        {isCorrect ? "+" : ""}{ans.score || 0} ball
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HistoryTest;