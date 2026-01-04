import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        {t("loading")}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        {t("history.no_result")}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-purple-700">
            {result.student?.name} {result.student?.surname}{" "}
            {t("history.exam_result")}
          </h2>

          <Link to="/tasks" className="btn bg-[#FFB608] text-white">
            {t("history.back")}
          </Link>
        </div>

        <p>
          <span className="font-semibold">{t("history.status")}:</span>{" "}
          {result.status}
        </p>

        <p>
          <span className="font-semibold">{t("history.started_at")}:</span>{" "}
          {result.startedAt
            ? new Date(result.startedAt).toLocaleString()
            : "-"}
        </p>

        <p>
          <span className="font-semibold">{t("history.finished_at")}:</span>{" "}
          {result.finishedAt
            ? new Date(result.finishedAt).toLocaleString()
            : "-"}
        </p>

        <p>
          <span className="font-semibold">{t("history.score")}:</span>{" "}
          {result.totalScore} / {result.maxScore}
        </p>

        <h3 className="text-xl font-semibold mt-4">
          {t("history.questions")}
        </h3>

        {result.answers.length === 0 ? (
          <p className="text-gray-500">
            {t("history.no_questions")}
          </p>
        ) : (
          <div className="space-y-3">
            {result.answers.map((ans, index) => (
              <div
                key={ans.questionId}
                className="p-3 border rounded-lg bg-gray-50 space-y-1"
              >
                <p>
                  <span className="font-semibold">
                    {index + 1}. {t("history.question")}:
                  </span>{" "}
                  {ans.questionText ||
                    ans.selectedAnswer?.value ||
                    t("history.no_question_text")}
                </p>

                <p>
                  <span className="font-semibold">
                    {t("history.your_answer")}:
                  </span>{" "}
                  {ans.selectedAnswer?.value ||
                    t("history.not_found")}
                </p>

                <p>
                  <span className="font-semibold">
                    {t("history.correct_answer")}:
                  </span>{" "}
                  {ans.correctAnswer?.value || "-"}
                </p>

                <p>
                  <span className="font-semibold">
                    {t("history.answer_score")}:
                  </span>{" "}
                  {ans.score || 0}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTest;
