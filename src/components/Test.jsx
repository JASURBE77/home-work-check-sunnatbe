import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const ExamPage = () => {
  const { examSession } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [questionChanging, setQuestionChanging] = useState(false);

  const [isFinished, setIsFinished] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [score, setScore] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  // LocalStorage bilan sinxronizatsiya
  useEffect(() => {
    const savedIndex = localStorage.getItem(`exam-${examSession}-currentIndex`);
    const savedPage = localStorage.getItem(`exam-${examSession}-page`);
    const savedAnswer = localStorage.getItem(`exam-${examSession}-selectedAnswer`);

    if (savedIndex) setCurrentIndex(Number(savedIndex));
    if (savedPage) setPage(Number(savedPage));
    if (savedAnswer) setSelectedAnswer(savedAnswer);
  }, [examSession]);

  useEffect(() => {
    localStorage.setItem(`exam-${examSession}-currentIndex`, currentIndex);
  }, [currentIndex, examSession]);

  useEffect(() => {
    localStorage.setItem(`exam-${examSession}-page`, page);
    setCurrentIndex(0);
  }, [page, examSession]);

  useEffect(() => {
    if (selectedAnswer) {
      localStorage.setItem(`exam-${examSession}-selectedAnswer`, selectedAnswer);
    } else {
      localStorage.removeItem(`exam-${examSession}-selectedAnswer`);
    }
  }, [selectedAnswer, examSession]);

  useEffect(() => {
    if (examSession) fetchQuestions(page);
  }, [examSession, page]);

  const fetchQuestions = async (pageNumber) => {
    try {
      setFetchLoading(true);
      setErrorMessage("");

      const res = await api({
        url: `/question/exams/${examSession}/questions?page=${pageNumber}`,
        method: "GET",
      });

      const data = res.data.data || [];
      setQuestions(Array.isArray(data) ? data : []);
      setTotalPages(res.data.totalPages || 1);

      setSelectedAnswer(null);
      setQuestionChanging(false);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Savollarni olishda xatolik");
      setQuestions([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const isLastQuestion = () =>
    questions.length > 0 &&
    currentIndex === questions.length - 1 &&
    page === totalPages - 1;

  const postAnswer = async () => {
    if (!selectedAnswer || isFinished || actionLoading) return;

    const question = questions[currentIndex];
    if (!question) return;

    try {
      setActionLoading(true);
      setQuestionChanging(true);
      setErrorMessage("");

      await api({
        url: "/student-exam/answer",
        method: "POST",
        data: {
          sessionId: examSession,
          questionId: question._id,
          selectedAnswerId: selectedAnswer,
        },
      });

      setSelectedAnswer(null);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else if (page + 1 < totalPages) {
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Javob yuborishda xatolik");
    } finally {
      setActionLoading(false);
      setQuestionChanging(false);
    }
  };

  const finishExam = async () => {
    if (isFinished || actionLoading) return;

    try {
      setActionLoading(true);
      setQuestionChanging(true);
      setErrorMessage("");

      // Oxirgi savolga javob yuborish
      if (selectedAnswer) {
        const question = questions[currentIndex];
        await api({
          url: "/student-exam/answer",
          method: "POST",
          data: {
            sessionId: examSession,
            questionId: question._id,
            selectedAnswerId: selectedAnswer,
          },
        });
      }

      const finishRes = await api({
        url: "/student-exam/finish",
        method: "POST",
        data: { sessionId: examSession },
      });

      setScore(finishRes.data.totalScore?.toFixed(1) || "0");
      setIsFinished(true);

      // LocalStorage tozalash
      localStorage.removeItem(`exam-${examSession}-currentIndex`);
      localStorage.removeItem(`exam-${examSession}-page`);
      localStorage.removeItem(`exam-${examSession}-selectedAnswer`);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Imtihonni yakunlashda xatolik");
    } finally {
      setActionLoading(false);
      setQuestionChanging(false);
    }
  };

  // Sahifa yopilganda / tab o'zgarganda imtihonni yakunlash
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isFinished) finishExam();
    };

    const handleBeforeUnload = (e) => {
      if (!isFinished) {
        e.preventDefault();
        finishExam();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isFinished, selectedAnswer, questions, currentIndex, examSession]);

  // Yakunlangandan keyin avto-redirect
  useEffect(() => {
    if (isFinished && score !== null) {
      const timer = setTimeout(() => navigate("/tasks"), 5000);
      return () => clearTimeout(timer);
    }
  }, [isFinished, score, navigate]);

  // Loading skeleton
  if (fetchLoading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Savollar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0 && !fetchLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-70" />
          <p className="text-xl">Savollar topilmadi</p>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-800 rounded-xl text-red-300 flex items-center gap-3">
            <AlertCircle size={20} />
            {errorMessage}
          </div>
        )}

        {/* Yakunlash modal */}
        {isFinished && score !== null && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Imtihon yakunlandi!</h2>
              <p className="text-4xl font-bold text-green-400 mb-2">
                Ball: {score}
              </p>
              <p className="text-gray-400 mt-4">
                5 soniyadan so‘ng Imtihonlar sahifasiga qaytarilasiz...
              </p>
            </div>
          </div>
        )}

        {/* Savol kartasi */}
        <div
          key={question?._id}
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl"
        >
          {/* Overlay loader */}
          {(questionChanging || actionLoading || fetchLoading) && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-300">Kuting...</p>
              </div>
            </div>
          )}

          {/* Savol matni */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {question?.question || "Savol yuklanmoqda..."}
          </h2>

          {question?.description && (
            <p className="text-gray-400 mb-8 text-lg">{question.description}</p>
          )}

          {/* Javob variantlari */}
          <div className="space-y-4 mb-8">
            {question?.answers?.map((ans) => (
              <label
                key={ans._id}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200
                  ${
                    selectedAnswer === ans._id
                      ? "border-blue-500 bg-blue-950/40"
                      : "border-gray-700 hover:border-gray-500 bg-gray-900/50"
                  }`}
              >
                <input
                  type="radio"
                  name="answer"
                  disabled={actionLoading || questionChanging || isFinished}
                  checked={selectedAnswer === ans._id}
                  onChange={() => setSelectedAnswer(ans._id)}
                  className="w-5 h-5 accent-blue-500 mr-4 flex-shrink-0"
                />
                <span className="text-lg text-gray-200">{ans.value}</span>
              </label>
            ))}
          </div>

          {/* Tugma */}
          <button
            onClick={isLastQuestion() ? finishExam : postAnswer}
            disabled={!selectedAnswer || actionLoading || questionChanging || isFinished}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3
              ${
                selectedAnswer && !actionLoading && !questionChanging && !isFinished
                  ? "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg shadow-blue-900/30"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
          >
            {actionLoading || questionChanging ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Kuting...
              </>
            ) : isLastQuestion() ? (
              "Imtihonni yakunlash"
            ) : (
              "Keyingi savol"
            )}
          </button>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Savol {currentIndex + 1} / {questions.length}</span>
              <span>Sahifa {page + 1} / {totalPages}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;