import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";

const TeacherTasks = () => {
  const [groupId, setGroupId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startingId, setStartingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [practiceLinks, setPracticeLinks] = useState({});

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

  const sendPracticeLink = async (taskId) => {
    const link = practiceLinks[taskId];
    if (!link) return;
    try {
      setStartingId(taskId);
      await api({
        url: "/exam-session/practice/submit",
        method: "POST",
        data: { sessionId: taskId, link },
      });
      await fetchTasks();
      setPracticeLinks((prev) => ({ ...prev, [taskId]: "" }));
    } catch (err) {
      console.error("Link yuborishda xatolik:", err);
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
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Imtihonlar
          </h2>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className=" rounded-2xl p-6 border border-gray-800 animate-pulse space-y-4"
              >
                <div className="h-8 w-3/4 bg-gray-800 rounded-xl"></div>
                <div className="h-4 w-full bg-gray-800 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-800 rounded"></div>
                <div className="h-12 w-full bg-gray-800 rounded-xl mt-6"></div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <AlertCircle size={64} className="mb-4 opacity-50" />
            <p className="text-xl">Imtihonlar mavjud emas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              const isFinished = task.studentExam?.status === "finished";
              const isPending = task.status === "pending";
              const isStarting = startingId === task._id;
              const isPractice = task.examId?.type === "practice";

              return (
                <div
                  key={task._id}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800 p-6 flex flex-col justify-between hover:border-blue-600/50 hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white truncate">
                      {task.examId?.title || "Nomsiz imtihon"}
                    </h3>

                    {task.examId?.description && (
                      <p className="text-gray-400 text-sm line-clamp-3">
                        {task.examId.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300">
                        Guruh: {task.groupId?.groupName || "—"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full ${
                          isFinished
                            ? "bg-green-900/50 text-green-400"
                            : isPending
                            ? "bg-amber-900/50 text-amber-400"
                            : "bg-blue-900/50 text-blue-400"
                        }`}
                      >
                        {isFinished
                          ? "Yakunlangan"
                          : isPending
                          ? "Kutilmoqda"
                          : "Faol"}
                      </span>
                      <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300">
                        {isPractice ? "Amaliyot" : "Test"}
                      </span>
                    </div>

                    {isPractice && (
                      <>
                        {task.examId?.link && (
                          <a
                            href={task.examId.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink size={16} />
                            Maketni ochish
                          </a>
                        )}

                        {task.examId?.requireds && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-400 mb-1">
                              Talablar:
                            </p>
                            <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm text-gray-300 whitespace-pre-wrap max-h-32 overflow-auto">
                              {task.examId.requireds}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 space-y-3">
                          {!isFinished ? (
                            <>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="GitHub / Vercel linkini kiriting"
                                  value={practiceLinks[task._id] || ""}
                                  onChange={(e) =>
                                    setPracticeLinks((prev) => ({
                                      ...prev,
                                      [task._id]: e.target.value,
                                    }))
                                  }
                                  className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                />
                                <button
                                  onClick={() => sendPracticeLink(task._id)}
                                  disabled={
                                    isStarting || !practiceLinks[task._id]?.trim()
                                  }
                                  className={`px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
                                    isStarting || !practiceLinks[task._id]?.trim()
                                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                      : "bg-blue-600 hover:bg-blue-700 text-white"
                                  }`}
                                >
                                  {isStarting ? (
                                    <>
                                      <Loader2 size={16} className="animate-spin" />
                                      Yuborilmoqda...
                                    </>
                                  ) : (
                                    <>
                                      <LinkIcon size={16} />
                                      Yuborish
                                    </>
                                  )}
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="bg-green-900/30 border border-green-800 rounded-lg px-4 py-3 text-center text-green-400 font-medium">
                              Yuborilgan va tekshirilmoqda
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Test / Imtihon tugmasi */}
                  {!isPractice && (
                    <button
                      onClick={() =>
                        isFinished
                          ? viewResult(task._id)
                          : (setSelectedSession(task._id), setShowModal(true))
                      }
                      disabled={isStarting || isPending}
                      className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        isFinished
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : isPending
                          ? "bg-amber-900/50 text-amber-300 cursor-not-allowed"
                          : isStarting
                          ? "bg-blue-800 text-white cursor-wait"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/30"
                      }`}
                    >
                      {isStarting && <Loader2 size={18} className="animate-spin" />}
                      {isStarting
                        ? "Boshlanmoqda..."
                        : isFinished
                        ? "Natijani ko‘rish"
                        : isPending
                        ? "Boshlanishi kutilmoqda"
                        : "Imtihonni boshlash"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal – dark theme */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">Ogohlantirish</h2>
              <p className="text-gray-300 mb-8">
                Imtihonni boshlaganingizdan so‘ng sahifani tark etsangiz imtihon
                yakunlanadi va to‘plangan ball hisoblanadi.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={() => startexam(selectedSession)}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-lg shadow-blue-900/30"
                >
                  Boshlash
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherTasks;