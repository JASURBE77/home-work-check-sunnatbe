import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const TeacherTasks = () => {
  const [groupId, setGroupId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startingId, setStartingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const navigate = useNavigate();

  const getme = async () => {
    try {
      const res = await api({ url: "/me", method: "GET" });
      setGroupId(res.data.group?._id);
    } catch (error) {
      console.error("getme error:", error);
    }
  };

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

  const startexam = async (sessionId) => {
    try {
      setStartingId(sessionId);
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
      setStartingId(null);
      setShowModal(false);
    }
  };

  const viewResult = async (sessionId) => {
    try {
      setStartingId(sessionId);
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

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-6">
      <header className="mb-6">
        <h2 className="text-3xl font-bold">Imtihonlar</h2>
      </header>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow animate-pulse space-y-4">
              <div className="h-6 w-2/3 bg-gray-300 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-300 rounded-lg mt-4" />
            </div>
          ))}
        </div>
      )}

      {!loading &&
        !groupId &&
        tasks.length === 0 && (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500 text-lg">Ma'lumotlaringiz yuklanmoqda...</p>
            </div>
          )}

      {!loading && groupId && tasks.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500 text-lg">Imtihonlar yo‘q</p>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => {
            const isFinished = task.studentExam?.status === "finished";
            const isDisabled =
              startingId === task._id || task.status === "pending";

            return (
              <article
                key={task._id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{task.examId?.title}</h3>

                  <p className="text-gray-600">{task.examId?.description}</p>

                  <p>
                    <b>Guruh:</b> {task.groupId?.groupName}
                  </p>

                  <p>
                    <b>Status:</b> {isFinished ? "Yakunlangan" : task.status}
                  </p>

                  <p>
                    <b>Boshlanish:</b>{" "}
                    {new Date(task.startDate).toLocaleString()}
                  </p>

                  <p>
                    <b>Tugash:</b> {new Date(task.endDate).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() =>
                    isFinished
                      ? viewResult(task._id)
                      : (setSelectedSession(task._id), setShowModal(true))
                  }
                  disabled={isDisabled}
                  className={`mt-4 w-full py-2 rounded-lg font-semibold transition
                    ${
                      isFinished
                        ? "bg-green-500 cursor-pointer text-white"
                        : isDisabled
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-[#1935CA] text-white cursor-pointer"
                    }`}>
                  {startingId === task._id
                    ? "Yuklanmoqda..."
                    : isFinished
                    ? "Natijani ko‘rish"
                    : task.status === "pending"
                    ? "Boshlanishi kutilmoqda"
                    : "Imtihonni boshlash"}
                </button>
              </article>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
          <div className="bg-white rounded-xl p-6 w-96 space-y-4 text-center">
            <h2 className="text-lg font-semibold">Ogohlantirish</h2>

            <p className="text-sm text-gray-600">
              Imtihonni boshlaganingizdan so‘ng sahifani tark etsangiz imtihon
              yakunlanadi va to‘plangan ball hisoblanadi.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full cursor-pointer py-2 rounded-lg bg-red-500 text-white">
                Bekor qilish
              </button>

              <button
                onClick={() => startexam(selectedSession)}
                className="w-full cursor-pointer py-2 rounded-lg bg-[#1935CA] text-white">
                Boshlash
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TeacherTasks;
