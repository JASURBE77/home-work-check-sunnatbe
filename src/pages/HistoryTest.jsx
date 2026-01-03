import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const HistoryTest = () => {
  const location = useLocation();
  const { result: initialResult } = location.state || {}; // TeacherTasks dan keladi

  const [result, setResult] = useState(initialResult);
  const [loading, setLoading] = useState(!initialResult); // agar result bor bo'lsa loadingni ko'rsatmaymiz

  // Agar sessionId bilan API dan olish kerak bo‘lsa, uni alohida useEffect bilan qilamiz
  // ammo TeacherTasks dan result kelayotgan bo‘lsa, bunga hojat yo‘q
  useEffect(() => {
    if (result) setLoading(false);
  }, [result]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Yuklanmoqda...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Natija topilmadi
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 space-y-4">
       <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-purple-700">
          {result.student?.name} {result.student?.surname} imtihon natijasi
        </h2>
        <button className="btn bg-[#FFB608] text-white"><Link to={'/tasks'}>Ortga qaytish</Link></button>
       </div>
        <p>
          <span className="font-semibold">Status:</span> {result.status}
        </p>
        <p>
          <span className="font-semibold">Boshlangan vaqti:</span>{" "}
          {result.startedAt ? new Date(result.startedAt).toLocaleString() : "-"}
        </p>
        <p>
          <span className="font-semibold">Tugagan vaqti:</span>{" "}
          {result.finishedAt ? new Date(result.finishedAt).toLocaleString() : "-"}
        </p>
        <p>
          <span className="font-semibold">Ball:</span> {result.totalScore} / {result.maxScore}
        </p>

        <h3 className="text-xl font-semibold mt-4">Savollar va javoblar:</h3>
        {result.answers.length === 0 ? (
          <p className="text-gray-500">Savollar mavjud emas</p>
        ) : (
          <div className="space-y-3">
            {result.answers.map((ans, index) => (
              <div
                key={ans.questionId}
                className="p-3 border rounded-lg bg-gray-50 space-y-1"
              >
                <p>
                  <span className="font-semibold">{index + 1}. Savol:</span>{" "}
                  {ans.questionText || ans.selectedAnswer?.value || "Savol matni mavjud emas"}
                </p>
                <p>
                  <span className="font-semibold">Sizning javobingiz:</span>{" "}
                  {ans.selectedAnswer?.value || "Topilmadi"}
                </p>
                <p>
                  <span className="font-semibold">To‘g‘ri javob:</span>{" "}
                  {ans.correctAnswer?.value || "-"}
                </p>
                <p>
                  <span className="font-semibold">Ball:</span> {ans.score || 0}
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
