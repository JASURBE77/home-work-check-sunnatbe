import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const TeacherTasks = () => {
  const [groupId, setGroupId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startingId, setStartingId] = useState(null);

  const navigate = useNavigate();

  // 🔹 teacher ma'lumotini olish
  const getme = async () => {
    try {
      const res = await api({ url: "/me", method: "GET" });
      setGroupId(res.data.group._id);
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
    }
  };

  // 🔹 finished exam natijasini ko‘rish (API dan natijani olib HistoryTest ga yuboradi)
const viewResult = async (sessionId) => {
  try {
    setStartingId(sessionId);
    const res = await api({
      url: `/student-exam/status`,
      method: "GET",
      params: { sessionId },
    });
    // state bilan HistoryTest ga uzatamiz
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

  // --- Skeleton Loader ---
  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6">
        <div className="h-10 w-72 bg-gray-300 rounded-md animate-pulse"></div>
        <div className="space-y-4 w-full max-w-3xl">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg bg-gray-100 animate-pulse h-32"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center space-y-6">
      <div className="w-full max-w-3xl flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700">Teacher Tasks</h2>
      </div>

      {tasks.length === 0 && !loading && (
        <p className="text-gray-500">Tasklar yo‘q</p>
      )}

      <div className="w-full max-w-3xl grid gap-4">
        {tasks.map((task) => {
          const isFinished = task.studentExam?.status === "finished";

          return (
            <div
              key={task._id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <h3 className="text-lg font-bold text-purple-700 mb-2">
                {task.examId?.title}
              </h3>
              <p>description {task.examId?.description}</p>

              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Group:</span>{" "}
                {task.groupId?.groupName}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Status:</span>{" "}
                {isFinished ? "finished" : task.status}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Start:</span>{" "}
                {new Date(task.startDate).toLocaleString()}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">End:</span>{" "}
                {new Date(task.endDate).toLocaleString()}
              </p>

              <button
                onClick={() =>
                  isFinished ? viewResult(task._id) : startexam(task._id)
                }
                disabled={startingId === task._id}
                className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2
                  ${
                    isFinished
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : startingId === task._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#FFB608] hover:bg-yellow-500 text-white"
                  }`}
              >
                {startingId === task._id ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Yuklanmoqda...
                  </>
                ) : isFinished ? (
                  "Yechilgan javoblarni ko‘rish"
                ) : (
                  "Imtihonni boshlash"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherTasks;
