import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";

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

  useEffect(() => {
    const savedIndex = localStorage.getItem(`exam-${examSession}-currentIndex`);
    const savedPage = localStorage.getItem(`exam-${examSession}-page`);
    const savedAnswer = localStorage.getItem(
      `exam-${examSession}-selectedAnswer`
    );

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
    if (selectedAnswer)
      localStorage.setItem(
        `exam-${examSession}-selectedAnswer`,
        selectedAnswer
      );
    else localStorage.removeItem(`exam-${examSession}-selectedAnswer`);
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

      setQuestions(Array.isArray(res.data.data) ? res.data.data : []);
      setTotalPages(res.data.totalPages || 1);

      setSelectedAnswer(null);
      setQuestionChanging(false);
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || "Savollarni olishda xatolik"
      );
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
      setErrorMessage(
        err?.response?.data?.message || "Javob yuborishda xatolik"
      );
      setQuestionChanging(false);
    } finally {
      setActionLoading(false);
    }
  };

  const finishExam = async () => {
    if (isFinished || actionLoading) return;

    try {
      setActionLoading(true);
      setQuestionChanging(true);
      setErrorMessage("");

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

      setScore(finishRes.data.totalScore.toFixed(1) || 0);
      setIsFinished(true);

      localStorage.removeItem(`exam-${examSession}-currentIndex`);
      localStorage.removeItem(`exam-${examSession}-page`);
      localStorage.removeItem(`exam-${examSession}-selectedAnswer`);
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || "Imtihonni yakunlashda xatolik"
      );
      setQuestionChanging(false);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) finishExam();
    };

    window.addEventListener("beforeunload", finishExam);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", finishExam);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedAnswer, questions, currentIndex]);

  useEffect(() => {
    if (isFinished && score !== null) {
      const timer = setTimeout(() => navigate("/tasks"), 5000);
      return () => clearTimeout(timer);
    }
  }, [isFinished, score, navigate]);

  if (fetchLoading && questions.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-gray-500">Yuklanmoqda...</p>
      </div>
    );
  }

  if (!fetchLoading && questions.length === 0) {
    return (
      <div>
        <p className="text-gray-500 text-center">Savollar topilmadi</p>
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      {errorMessage && (
        <div className="w-full max-w-xl mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      {isFinished && score !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center w-80">
            <h2 className="text-xl font-bold mb-3">Imtihon yakunlandi!</h2>
            <p className="text-lg">
              Ball: <b>{score}</b>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              5 soniyadan so‘ng Imtihonlar sahifasiga qaytarilasiz. To'liq natijani Imtihonlar sahifasida ko'rishingiz mumkin
            </p>
          </div>
        </div>
      )}

      <div
        key={question._id}
        className="relative w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 space-y-4 transition-opacity duration-300">
        {(questionChanging || actionLoading) && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl z-10">
            <span className="text-gray-500">Kuting...</span>
          </div>
        )}

        <h2 className="text-[#1935CA] font-bold text-lg">
          {question.question}
        </h2>
        <p className="text-gray-500 text-sm">{question.description}</p>

        <div className="space-y-3">
          {question.answers.map((ans) => (
            <label
              key={ans._id}
              className={`flex items-center p-3 border rounded-lg transition
                ${
                  selectedAnswer === ans._id
                    ? "border-[#1935CA] bg-blue-50"
                    : "border-gray-100"
                }`}>
              <input
                type="radio"
                disabled={actionLoading || questionChanging || isFinished}
                checked={selectedAnswer === ans._id}
                onChange={() => setSelectedAnswer(ans._id)}
                className="mr-3 accent-[#1935CA]"
              />
              {ans.value}
            </label>
          ))}
        </div>

        <button
          onClick={isLastQuestion() ? finishExam : postAnswer}
          disabled={!selectedAnswer || actionLoading || questionChanging}
          className={`w-full py-2 rounded-lg font-semibold text-white
            ${
              selectedAnswer && !actionLoading && !questionChanging
                ? "bg-[#1935CA] cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}>
          {actionLoading || questionChanging
            ? "Kuting..."
            : isLastQuestion()
            ? "Yakunlash"
            : "Keyingi savol"}
        </button>
      </div>
    </div>
  );
};

export default ExamPage;
