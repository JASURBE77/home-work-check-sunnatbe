import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const ExamPage = () => {
  const { examSession } = useParams();
  const navigate = useNavigate();

  // Lazy init — localStorage dan to'g'ridan-to'g'ri o'qiydi, restore effect kerak emas
  const [currentIndex, setCurrentIndex] = useState(() => {
    const s = localStorage.getItem(`exam-${examSession}-currentIndex`);
    return s ? Number(s) : 0;
  });
  const [page, setPage] = useState(() => {
    const s = localStorage.getItem(`exam-${examSession}-page`);
    return s ? Number(s) : 0;
  });
  const [selectedAnswer, setSelectedAnswer] = useState(
    () => localStorage.getItem(`exam-${examSession}-selectedAnswer`) || null
  );

  const [questions, setQuestions] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [score, setScore] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Birinchi render-da setCurrentIndex(0) ishlamasligi uchun
  const isFirstPageRender = useRef(true);

  // localStorage ga saqlash
  useEffect(() => {
    localStorage.setItem(`exam-${examSession}-currentIndex`, currentIndex);
  }, [currentIndex, examSession]);

  useEffect(() => {
    localStorage.setItem(`exam-${examSession}-page`, page);
    if (isFirstPageRender.current) {
      isFirstPageRender.current = false;
      return; // mount-da currentIndex ni 0 ga reset qilmaymiz
    }
    setCurrentIndex(0);
    setSelectedAnswer(null);
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
      setErrorMessage("");
      await api({
        url: "/student-exam/answer",
        method: "POST",
        data: { sessionId: examSession, questionId: question._id, selectedAnswerId: selectedAnswer },
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
    }
  };

  const finishExam = async () => {
    if (isFinished || actionLoading) return;
    try {
      setActionLoading(true);
      setErrorMessage("");
      if (selectedAnswer) {
        const question = questions[currentIndex];
        await api({
          url: "/student-exam/answer",
          method: "POST",
          data: { sessionId: examSession, questionId: question._id, selectedAnswerId: selectedAnswer },
        });
      }
      const finishRes = await api({
        url: "/student-exam/finish",
        method: "POST",
        data: { sessionId: examSession },
      });
      setScore(finishRes.data.totalScore?.toFixed(1) ?? "0");
      setIsFinished(true);
      localStorage.removeItem(`exam-${examSession}-currentIndex`);
      localStorage.removeItem(`exam-${examSession}-page`);
      localStorage.removeItem(`exam-${examSession}-selectedAnswer`);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Imtihonni yakunlashda xatolik");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isFinished) finishExam();
    };
    const handleBeforeUnload = (e) => {
      if (!isFinished) { e.preventDefault(); finishExam(); }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isFinished, selectedAnswer, questions, currentIndex, examSession]);

  useEffect(() => {
    if (isFinished && score !== null) {
      const timer = setTimeout(() => navigate("/tasks"), 5000);
      return () => clearTimeout(timer);
    }
  }, [isFinished, score, navigate]);

  // ── LOADING ──
  if (fetchLoading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="text-blue-500 animate-spin" />
        <p className="text-sm text-slate-400">Savollar yuklanmoqda...</p>
      </div>
    );
  }

  // ── EMPTY ──
  if (questions.length === 0 && !fetchLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
          <AlertCircle size={24} className="text-slate-400" />
        </div>
        <p className="text-sm text-slate-500">Savollar topilmadi</p>
      </div>
    );
  }

  const question = questions[currentIndex];
  const progressPct = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const isBusy = actionLoading || fetchLoading;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 flex items-start justify-center">
      <div className="w-full max-w-2xl space-y-4">

        {/* ── ERROR ── */}
        {errorMessage && (
          <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[13px]">
            <AlertCircle size={16} className="flex-shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* ── FINISH MODAL ── */}
        {isFinished && score !== null && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
              <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">Imtihon yakunlandi!</h2>
              <div className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 mb-4">
                <p className="text-xs text-slate-400 mb-1">Natija</p>
                <p className="text-4xl font-bold text-blue-600">{score}</p>
                <p className="text-xs text-slate-400 mt-1">ball</p>
              </div>
              <p className="text-xs text-slate-400">
                5 soniyadan so'ng Imtihonlar sahifasiga qaytarilasiz...
              </p>
            </div>
          </div>
        )}

        {/* ── QUESTION CARD ── */}
        <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-7">

          {/* Overlay loader */}
          {isBusy && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-10 gap-2">
              <Loader2 size={28} className="text-blue-500 animate-spin" />
              <p className="text-sm text-slate-400">Kuting...</p>
            </div>
          )}

          {/* Progress info */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-[12px] font-medium text-slate-400">
              Savol {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-[12px] font-medium text-slate-400">
              Sahifa {page + 1} / {totalPages}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full mb-6">
            <div
              className="h-1.5 bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Question text */}
          <h2 className="text-[16px] md:text-[18px] font-semibold text-slate-800 leading-snug mb-2">
            {question?.question || "Savol yuklanmoqda..."}
          </h2>

          {question?.description && (
            <p
              className="text-[13px] text-slate-500 mb-5"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />
          )}

          {/* Answers */}
          <div className="space-y-2.5 mt-5 mb-6">
            {question?.answers?.map((ans) => {
              const isSelected = selectedAnswer === ans._id;
              return (
                <button
                  key={ans._id}
                  type="button"
                  disabled={isBusy || isFinished}
                  onClick={() => setSelectedAnswer(ans._id)}
                  className={`w-full flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all duration-150 text-left
                    ${isSelected
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                    } disabled:cursor-not-allowed`}
                >
                  {/* Custom radio */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className={`text-[14px] leading-snug ${isSelected ? "text-blue-700 font-medium" : "text-slate-700"}`}>
                    {ans.value}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Submit button */}
          <button
            onClick={isLastQuestion() ? finishExam : postAnswer}
            disabled={!selectedAnswer || isBusy || isFinished}
            className={`w-full py-3 rounded-xl text-[14px] font-semibold transition-all flex items-center justify-center gap-2
              ${selectedAnswer && !isBusy && !isFinished
                ? isLastQuestion()
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
          >
            {isBusy ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Kuting...
              </>
            ) : isLastQuestion() ? (
              <>
                <CheckCircle2 size={16} />
                Imtihonni yakunlash
              </>
            ) : (
              "Keyingi savol →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
