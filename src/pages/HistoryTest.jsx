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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">{t("loading") || "Yuklanmoqda..."}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <XCircle className="w-16 h-16 mx-auto mb-4 opacity-70" />
          <p className="text-xl">{t("history.no_result") || "Natija topilmadi"}</p>
        </div>
      </div>
    );
  }

  const scorePercentage = Math.round((result.totalScore / result.maxScore) * 100);
  const isGoodScore = scorePercentage >= 70;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {result.student?.name} {result.student?.surname} — {t("history.exam_result")}
          </h1>

          <Link
            to="/tasks"
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-medium transition-all border border-gray-700 shadow-lg"
          >
            <ArrowLeft size={18} />
            {t("history.back") || "Orqaga"}
          </Link>
        </div>

        {/* Asosiy natija kartasi */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-950/50 border border-gray-700 rounded-xl p-5 text-center">
              <p className="text-gray-400 text-sm mb-1">{t("history.status") || "Holati"}</p>
              <p className="text-xl font-bold text-blue-400">{result.status || "Yakunlangan"}</p>
            </div>

            <div className="bg-gray-950/50 border border-gray-700 rounded-xl p-5 text-center">
              <p className="text-gray-400 text-sm mb-1">{t("history.started_at") || "Boshlangan vaqti"}</p>
              <p className="text-lg font-medium">
                {result.startedAt
                  ? new Date(result.startedAt).toLocaleString("uz-UZ")
                  : "—"}
              </p>
            </div>

            <div className="bg-gray-950/50 border border-gray-700 rounded-xl p-5 text-center">
              <p className="text-gray-400 text-sm mb-1">{t("history.finished_at") || "Tugatilgan vaqti"}</p>
              <p className="text-lg font-medium">
                {result.finishedAt
                  ? new Date(result.finishedAt).toLocaleString("uz-UZ")
                  : "—"}
              </p>
            </div>

            <div className="bg-gray-950/50 border border-gray-700 rounded-xl p-5 text-center">
              <p className="text-gray-400 text-sm mb-1">{t("history.score") || "Ball"}</p>
              <div className="flex flex-col items-center">
                <p className={`text-3xl font-bold ${isGoodScore ? "text-green-400" : "text-red-400"}`}>
                  {result.totalScore < 99
                    ? result.totalScore.toFixed(1)
                    : Math.ceil(result.maxScore)}{" "}
                  <span className="text-xl text-gray-500">/</span>{" "}
                  <span className="text-xl text-gray-500">{Math.ceil(result.maxScore)}</span>
                </p>
                <p className="text-sm mt-1 text-gray-400">
                  {scorePercentage}% {isGoodScore ? "(Yaxshi)" : "(Yaxshilash kerak)"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Savollar bo'limi */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 md:p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle2 className="text-blue-500" size={28} />
            {t("history.questions") || "Savollar va javoblar"}
          </h3>

          {result.answers?.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">{t("history.no_questions") || "Savollar mavjud emas"}</p>
            </div>
          ) : (
            <div className="space-y-5">
              {result.answers.map((ans, index) => (
                <div
                  key={ans.questionId || index}
                  className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold text-gray-300">
                      {index + 1}
                    </div>

                    <div className="flex-1 space-y-3">
                      <p className="text-lg font-medium text-white">
                        {ans.questionText || t("history.no_question_text") || "Savol matni mavjud emas"}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">{t("history.your_answer") || "Sizning javobingiz"}:</p>
                          <p className="font-medium text-gray-200">
                            {ans.selectedAnswer?.value || t("history.not_found") || "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400 mb-1">{t("history.correct_answer") || "To'g'ri javob"}:</p>
                          <p className="font-medium text-green-400">
                            {ans.correctAnswer?.value || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm">
                          <span className="text-gray-400">{t("history.answer_score") || "Ball"}:</span>{" "}
                          <span className={`font-bold ${ans.score > 0 ? "text-green-400" : "text-red-400"}`}>
                            {ans.score || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryTest;