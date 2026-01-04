import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TeacherTasks = () => {
  const { t } = useTranslation();
  const [groupId, setGroupId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startingId, setStartingId] = useState(null); // Loading spinner uchun
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const navigate = useNavigate();

  // 🔹 teacher ma'lumotini olish
  const getme = async () => {
    try {
      const res = await api({ url: "/me", method: "GET" });
      setGroupId(res.data.group?._id);
    } catch (error) {
      console.error("getme error:", error);
    }
  };

  // 🔹 group bo‘yicha exam sessionlar
  const fetchTasks = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      const res = await api({
        url: `/exam-session/group/${groupId}`,
        method: "GET",
      });
      setTasks(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("fetchTasks error:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 examni boshlash
  const startexam = async (sessionId) => {
    try {
      setStartingId(sessionId); // Loading spinner ochiladi
      const res = await api({
        url: "/student-exam/start",
        method: "POST",
        data: { sessionId },
      });
      const examSession = res.data.content.examSession;
      navigate(`/student-exam/${examSession}`);
    } catch (error) {
      console.error("xatolik", error);
    } finally {
      setStartingId(null); // Loading spinner yopiladi
      setShowModal(false);
    }
  };

  // 🔹 finished exam natijasini ko‘rish
  const viewResult = async (sessionId) => {
    try {
      setStartingId(sessionId); // Loading spinner
      const res = await api({
        url: `/student-exam/status`,
        method: "GET",
        params: { sessionId },
      });
      navigate("/historytask", { state: { result: res.data } });
    } catch (err) {
      console.error("Natijani olishda xatolik", err);
    } finally {
      setStartingId(null);
    }
  };

  useEffect(() => {
    getme();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [groupId]);

  // --- Modalni ochish
  const handleStartClick = (sessionId) => {
    setSelectedSession(sessionId);
    setShowModal(true);
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6">
        <div className="h-10 w-72 bg-gray-300 rounded-md animate-pulse"></div>
        <div className="space-y-4 w-full max-w-3xl">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg bg-gray-100 animate-pulse h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center space-y-6">
      <div className="w-full max-w-3xl flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700">
          {t("teacherTasks.title")}
        </h2>
      </div>

      {tasks.length === 0 && !loading && <p className="text-gray-500">{t("teacherTasks.empty")}</p>}

      <div className="w-full max-w-3xl grid gap-4">
        {tasks.map((task) => {
          const isFinished = task.studentExam?.status === "finished";
          const isDisabled = startingId === task._id || task.status === "pending";

          return (
            <div key={task._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <h3 className="text-lg font-bold text-purple-700 mb-2">{task.examId?.title}</h3>
              <p>{t("teacherTasks.description")}: {task.examId?.description}</p>
              <p className="text-gray-600 mb-1"><span className="font-semibold">{t("teacherTasks.group")}:</span> {task.groupId?.groupName}</p>
              <p className="text-gray-600 mb-1"><span className="font-semibold">{t("teacherTasks.status")}:</span> {isFinished ? t("teacherTasks.finished") : task.status}</p>
              <p className="text-gray-600 mb-1"><span className="font-semibold">{t("teacherTasks.start")}:</span> {new Date(task.startDate).toLocaleString()}</p>
              <p className="text-gray-600 mb-4"><span className="font-semibold">{t("teacherTasks.end")}:</span> {new Date(task.endDate).toLocaleString()}</p>

              <button
                onClick={() => isFinished ? viewResult(task._id) : handleStartClick(task._id)}
                disabled={isDisabled}
                className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2
                  ${isFinished
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : isDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#FFB608] hover:bg-yellow-500 text-white"
                  }`}
              >
                {startingId === task._id ? (
                  <>
                    {/* Loading spinner */}
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t("loading")}
                  </>
                ) : isFinished ? (
                  t("teacherTasks.view_result")
                ) : (
                  t("teacherTasks.start_exam")
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-100 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center space-y-4">
            <p className="text-gray-700 text-base">
              Xurmatli o'quvchi. Imtihonni boshlaganingizdan so'ng uni tark etsangiz imtihondan yiqilasiz! Brauzeringizda yangi oyna ochishga urinsangiz yoki platformamizni tark etsangiz, imtihon tugatiladi va o'sha paytgacha to'plangan ballingiz hisoblanadi! Boshlashga rozimisiz?
            </p>
            <div className="flex justify-around mt-4 gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => startexam(selectedSession)}
                className="px-6 py-2 rounded-lg bg-[#FFB608] hover:bg-yellow-500 text-white flex items-center justify-center gap-2"
              >
                {startingId === selectedSession && (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Boshlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherTasks;
