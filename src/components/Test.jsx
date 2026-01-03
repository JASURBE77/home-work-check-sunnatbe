import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";

const ExamPage = () => {
  const { examSession } = useParams(); 
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (examSession) {
      checkExamStatus();
      fetchQuestions(page);
    }
  }, [examSession, page]);

  const checkExamStatus = async () => {
    try {
      const res = await api({ url: `/student-exam/status/${examSession}`, method: "GET" });
      if (res.data.status === "finished") setIsFinished(true);
    } catch (err) {
      console.error("Imtihon statusini olishda xatolik", err);
    }
  };

  const fetchQuestions = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await api({ url: `/question/exams/${examSession}/questions?page=${pageNumber}`, method: "GET" });
      setQuestions(Array.isArray(res.data.data) ? res.data.data : []);
      setCurrentIndex(0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Savollarni olishda xatolik", err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const postAnswer = async () => {
    if (isFinished || !selectedAnswer) return;

    const question = questions[currentIndex];
    if (!question) return;

    try {
      setLoading(true);
      await api({
        url: "/student-exam/answer",
        method: "POST",
        data: { sessionId: examSession, questionId: question._id, selectedAnswerId: selectedAnswer },
      });

      setSelectedAnswer(null);

      // Keyingi savol yoki keyingi page
      if (isLastQuestion()) return;
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else if (page + 1 < totalPages) {
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Javob yuborishda xatolik", err);
    } finally {
      setLoading(false);
    }
  };

  const finishExam = async () => {
    if (isFinished) return;

    try {
      setLoading(true);
      await api({ url: "/student-exam/finish", method: "POST", data: { sessionId: examSession } });
      setIsFinished(true);
      alert("✅ Imtihon yakunlandi!");
    } catch (err) {
      console.error("Imtihonni yakunlashda xatolik", err);
    } finally {
      setLoading(false);
    }
  };

  const isLastQuestion = () => currentIndex === questions.length - 1 && page === totalPages - 1;

  if (loading && questions.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Yuklanmoqda...</p>
      </div>
    );

  if (questions.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Savollar topilmadi</p>
      </div>
    );

  const question = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      {isFinished && (
        <div className="mb-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold">
          ⚠️ Imtihon allaqachon tugatilgan
        </div>
      )}

      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <div className="flex justify-between mb-2 text-gray-500 text-sm">
          <span>Savol {currentIndex + 1} / {questions.length}</span>
          <span>Page {page + 1} / {totalPages}</span>
        </div>

        <h2 className="text-purple-700 font-bold text-lg mb-2">{question.question}</h2>
        <p className="text-gray-500 text-sm mb-4">{question.description}</p>

        <div className="space-y-3">
          {question.answers.map((ans) => (
            <label
              key={ans._id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition
                ${selectedAnswer === ans._id ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-300"}
              `}
            >
              <input
                type="radio"
                name={`answer-${currentIndex}`}
                value={ans._id}
                checked={selectedAnswer === ans._id}
                onChange={() => setSelectedAnswer(ans._id)}
                className="mr-3 accent-purple-600"
                disabled={isFinished || loading}
              />
              <span className="text-gray-700">{ans.value}</span>
            </label>
          ))}
        </div>

        <button
          onClick={isLastQuestion() ? finishExam : postAnswer}
          disabled={!selectedAnswer || isFinished || loading}
          className={`w-full mt-4 py-2 rounded-lg font-semibold text-white transition
            ${!isFinished && selectedAnswer && !loading ? "bg-[#FFB608] hover:bg-yellow-500" : "bg-gray-400 cursor-not-allowed"}
          `}
        >
          {loading ? "Kuting..." : isLastQuestion() ? "Yakunlash" : "Keyingi savol"}
        </button>
      </div>
    </div>
  );
};

export default ExamPage;
