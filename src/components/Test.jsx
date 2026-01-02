import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";

const ExamPage = () => {
  const { examSession } = useParams(); 
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false); // 🔹 Imtihon tugaganini belgilash

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (examSession) {
      checkExamStatus();
      fetchQuestions(page);
    }
  }, [examSession, page]);

  // 🔹 Imtihon allaqachon tugagan yoki boshlanmaganligini tekshirish
  const checkExamStatus = async () => {
    try {
      const res = await api({
        url: `/student-exam/status/${examSession}`, // 🔹 backenddan status endpoint
        method: "GET",
      });

      // res.data.status: "started" | "finished" | "not_started"
      if (res.data.status === "finished") {
        setIsFinished(true);
      }
    } catch (err) {
      console.error("Imtihon statusini olishda xatolik", err);
    }
  };

  const fetchQuestions = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await api({
        url: `/question/exams/${examSession}/questions?page=${pageNumber}`,
        method: "GET",
      });

      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setQuestions(data);
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
    if (isFinished) return; // 🔹 tugagan bo‘lsa javob yuborilmaydi

    const question = questions[currentIndex];
    if (!question || !selectedAnswer) return;

    try {
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

      // Keyingi savol yoki keyingi page
      if (isLastQuestion()) return;
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else if (page + 1 < totalPages) {
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Javob yuborishda xatolik", err);
    }
  };

  const finishExam = async () => {
    if (isFinished) return;

    try {
      await api({
        url: "/student-exam/finish",
        method: "POST",
        data: { sessionId: examSession },
      });
      setIsFinished(true); // 🔹 tugatildi deb belgilash
      alert("✅ Imtihon yakunlandi!");
    } catch (err) {
      console.error("Imtihonni yakunlashda xatolik", err);
    }
  };

  const isLastQuestion = () => {
    return currentIndex === questions.length - 1 && page === totalPages - 1;
  };

  if (loading) return <p>Yuklanmoqda...</p>;
  if (questions.length === 0) return <p>Savollar topilmadi</p>;

  const question = questions[currentIndex];

  return (
    <div className="p-4 max-w-xl mx-auto">
      {isFinished && (
        <p className="mb-4 text-red-600 font-bold">
          ⚠️ Imtihon allaqachon tugatilgan
        </p>
      )}

      <h2 className="text-xl font-bold mb-4">
        Savol {currentIndex + 1} / {questions.length} (Page {page + 1} / {totalPages})
      </h2>

      <div className="border p-4 rounded">
        <h3 className="font-semibold">{question.question}</h3>
        <p className="text-sm text-gray-500 mb-3">{question.description}</p>

        {question.answers.map((ans) => (
          <label key={ans._id} className="block mb-2 cursor-pointer">
            <input
              type="radio"
              name="answer"
              value={ans._id}
              checked={selectedAnswer === ans._id}
              onChange={() => setSelectedAnswer(ans._id)}
              className="mr-2"
              disabled={isFinished} // 🔹 tugagan bo‘lsa radio ham disabled
            />
            {ans.value}
          </label>
        ))}

        <button
          onClick={isLastQuestion() ? finishExam : postAnswer}
          disabled={!selectedAnswer || isFinished} // 🔹 tugagan bo‘lsa button disabled
          className={`mt-4 px-4 py-2 rounded text-white ${
            !isFinished && selectedAnswer ? "bg-[#FFB608]" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLastQuestion() ? "Yakunlash" : "Keyingi savol"}
        </button>
      </div>
    </div>
  );
};

export default ExamPage;
