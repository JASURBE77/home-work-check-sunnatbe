import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";

const ExamPage = () => {
  const { examSession } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [fetchLoading, setFetchLoading] = useState(false);   // savollar uchun
  const [actionLoading, setActionLoading] = useState(false); // javob/finish uchun

  const [isFinished, setIsFinished] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [score, setScore] = useState(null); // jami ball

  // 🔹 localStorage dan yuklash
  useEffect(() => {
    const savedIndex = localStorage.getItem(`exam-${examSession}-currentIndex`);
    const savedPage = localStorage.getItem(`exam-${examSession}-page`);
    const savedAnswer = localStorage.getItem(`exam-${examSession}-selectedAnswer`);

    if (savedIndex) setCurrentIndex(Number(savedIndex));
    if (savedPage) setPage(Number(savedPage));
    if (savedAnswer) setSelectedAnswer(savedAnswer);
  }, [examSession]);

  // 🔹 state o‘zgarganda saqlash
  useEffect(() => {
    localStorage.setItem(`exam-${examSession}-currentIndex`, currentIndex);
  }, [currentIndex, examSession]);

  useEffect(() => {
    localStorage.setItem(`exam-${examSession}-page`, page);
    setCurrentIndex(0); // har safar page o'zgarganda index 0 ga
  }, [page, examSession]);

  useEffect(() => {
    if (selectedAnswer)
      localStorage.setItem(`exam-${examSession}-selectedAnswer`, selectedAnswer);
    else
      localStorage.removeItem(`exam-${examSession}-selectedAnswer`);
  }, [selectedAnswer, examSession]);

  // 🔹 savollarni olish
  useEffect(() => {
    if (examSession) {
      fetchQuestions(page);
    }
  }, [examSession, page]);

  const fetchQuestions = async (pageNumber) => {
    try {
      setFetchLoading(true);
      const res = await api({
        url: `/question/exams/${examSession}/questions?page=${pageNumber}`,
        method: "GET",
      });

      setQuestions(Array.isArray(res.data.data) ? res.data.data : []);
      setTotalPages(res.data.totalPages || 1);

      if (!localStorage.getItem(`exam-${examSession}-currentIndex`)) {
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error("Savollarni olishda xatolik", err);
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
      console.error("Javob yuborishda xatolik", err);
    } finally {
      setActionLoading(false);
    }
  };

  // 🔹 oxirgi savolni yuborish va yakunlash
  const finishExam = async () => {
    if (isFinished || actionLoading) return;

    try {
      setActionLoading(true);

      // oxirgi javobni yuborish
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

      // imtihonni yakunlash
      const finishRes = await api({
        url: "/student-exam/finish",
        method: "POST",
        data: { sessionId: examSession },
      });

      setScore(finishRes.data.totalScore || 0);
      setIsFinished(true);

      // 🔹 localStorage tozalash
      localStorage.removeItem(`exam-${examSession}-currentIndex`);
      localStorage.removeItem(`exam-${examSession}-page`);
      localStorage.removeItem(`exam-${examSession}-selectedAnswer`);
    } catch (err) {
      console.error("Imtihonni finish qilishda xatolik", err);
    } finally {
      setActionLoading(false);
    }
  };

  // 🔹 Browser tab close / vkladka o‘zgarsa examni finish qilish
  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      await finishExam();
      e.preventDefault();
      e.returnValue = "";
    };

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        await finishExam();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedAnswer, questions, currentIndex]);

  // 🔹 modaldan keyin navigate qilish
  useEffect(() => {
    if (isFinished && score !== null) {
      const timer = setTimeout(() => {
        navigate("/tasks");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isFinished, score, navigate]);

  if (fetchLoading && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Yuklanmoqda...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Savollar topilmadi</p>
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      {/* ✅ Modal */}
      {isFinished && score !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-4">Imtihon yakunlandi!</h2>
            <p className="text-gray-700 text-lg">Sizning ballingiz: <span className="font-bold">{score}</span></p>
            <p className="text-sm text-gray-500 mt-2">3 soniyadan so‘ng vazifalar sahifasiga qaytasiz...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <div className="flex justify-between text-[16px] text-gray-500">
          <span>
            Savol {page + 1}/{totalPages}
          </span>
        </div>

        <h2 className="text-purple-700 font-bold text-lg">{question.question}</h2>
        <p className="text-gray-500 text-sm">{question.description}</p>

        <div className="space-y-3">
          {question.answers.map((ans) => (
            <label
              key={ans._id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition
                ${selectedAnswer === ans._id ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-300"}`}
            >
              <input
                type="radio"
                checked={selectedAnswer === ans._id}
                onChange={() => setSelectedAnswer(ans._id)}
                className="mr-3 accent-purple-600"
                disabled={actionLoading || isFinished}
              />
              <span>{ans.value}</span>
            </label>
          ))}
        </div>

        <button
          onClick={isLastQuestion() ? finishExam : postAnswer}
          disabled={!selectedAnswer || actionLoading || isFinished}
          className={`w-full py-2 rounded-lg font-semibold text-white transition
            ${selectedAnswer && !actionLoading && !isFinished ? "bg-[#FFB608] hover:bg-yellow-500" : "bg-gray-400 cursor-not-allowed"}`}
        >
          {actionLoading ? "Kuting..." : isLastQuestion() ? "Yakunlash" : "Keyingi savol"}
        </button>
      </div>
    </div>
  );
};

export default ExamPage;
