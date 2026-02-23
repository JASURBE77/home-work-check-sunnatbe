import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Link as LinkIcon,
  Loader2,
  FileText,
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
      const res = await api({ url: "/users/me", method: "GET" });
      setGroupId(res.data.group?._id);
    } catch (error) {
      console.error("getme error:", error);
    }
  };

  const fetchTasks = async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      const res = await api({ url: `/exam-session/group`, method: "GET" });
      setTasks(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
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

  useEffect(() => { getme(); }, []);
  useEffect(() => { fetchTasks(); }, [groupId]);

  // ── LOADING ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5">
        <div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // ── EMPTY ──
  if (tasks.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-400">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
          <AlertCircle size={24} className="text-slate-400" />
        </div>
        <p className="text-sm">Imtihonlar mavjud emas</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-5">

      {/* ── HEADER ── */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Imtihonlar</h1>
        <p className="text-sm text-slate-400 mt-0.5">{tasks.length} ta imtihon mavjud</p>
      </div>

      {/* ── GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => {
          const isFinished = task.studentExam?.status === "finished";
          const isPending = task.status === "pending";
          const isStarting = startingId === task._id;
          const isPractice = task.examId?.type === "practice";

          return (
            <div
              key={task._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-blue-200 hover:shadow-md transition-all duration-150"
            >
              <div className="space-y-3">
                {/* Title + type badge */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[14px] font-semibold text-slate-800 truncate flex-1">
                    {task.examId?.title || "Nomsiz imtihon"}
                  </h3>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0
                    ${isPractice ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"}`}>
                    {isPractice ? "Amaliyot" : "Test"}
                  </span>
                </div>

                {/* Description */}
                {task.examId?.description && (
                  <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed">
                    {task.examId.description}
                  </p>
                )}

                {/* Status + group */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-[11px] px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full">
                    {task.groupId?.groupName || "—"}
                  </span>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium
                    ${isFinished
                      ? "bg-green-50 text-green-600"
                      : isPending
                      ? "bg-amber-50 text-amber-600"
                      : "bg-blue-50 text-blue-600"
                    }`}>
                    {isFinished ? "Yakunlangan" : isPending ? "Kutilmoqda" : "Faol"}
                  </span>
                </div>

                {/* Practice extras */}
                {isPractice && (
                  <div className="space-y-3 pt-1">
                    {task.examId?.link && (
                      <a
                        href={task.examId.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[13px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        <ExternalLink size={13} />
                        Maketni ochish
                      </a>
                    )}

                    {task.examId?.requireds && (
                      <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Talablar</p>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[13px] text-slate-600 whitespace-pre-wrap max-h-28 overflow-auto">
                          {task.examId.requireds}
                        </div>
                      </div>
                    )}

                    {!isFinished ? (
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="GitHub / Vercel linki"
                          value={practiceLinks[task._id] || ""}
                          onChange={(e) =>
                            setPracticeLinks((prev) => ({ ...prev, [task._id]: e.target.value }))
                          }
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition"
                        />
                        <button
                          onClick={() => sendPracticeLink(task._id)}
                          disabled={isStarting || !practiceLinks[task._id]?.trim()}
                          className={`px-3 py-2 rounded-xl text-[13px] font-medium flex items-center gap-1.5 transition-all flex-shrink-0
                            ${isStarting || !practiceLinks[task._id]?.trim()
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        >
                          {isStarting
                            ? <Loader2 size={14} className="animate-spin" />
                            : <LinkIcon size={14} />
                          }
                          Yuborish
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 text-[13px] text-green-600 font-medium">
                        <CheckCircle2 size={15} />
                        Yuborilgan va tekshirilmoqda
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Test button */}
              {!isPractice && (
                <button
                  onClick={() =>
                    isFinished
                      ? viewResult(task._id)
                      : (setSelectedSession(task._id), setShowModal(true))
                  }
                  disabled={isStarting || isPending}
                  className={`mt-4 w-full py-2.5 rounded-xl text-[13.5px] font-semibold transition-all flex items-center justify-center gap-2
                    ${isFinished
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : isPending
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : isStarting
                      ? "bg-blue-400 text-white cursor-wait"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    }`}
                >
                  {isStarting && <Loader2 size={15} className="animate-spin" />}
                  {isStarting
                    ? "Boshlanmoqda..."
                    : isFinished
                    ? "Natijani ko'rish"
                    : isPending
                    ? "Boshlanishi kutilmoqda"
                    : "Imtihonni boshlash"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center mb-4 border border-amber-100">
              <AlertCircle size={20} className="text-amber-500" />
            </div>
            <h2 className="text-[15px] font-semibold text-slate-800 mb-2">Ogohlantirish</h2>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
              Imtihonni boshlaganingizdan so'ng sahifani tark etsangiz imtihon
              yakunlanadi va to'plangan ball hisoblanadi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13.5px] font-medium transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => startexam(selectedSession)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-semibold transition shadow-sm"
              >
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