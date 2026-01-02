import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const TeacherTasks = () => {
  const [groupId, setGroupId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  // 🔹 teacher ma'lumotini olish
  const getme = async () => {
    try {
      const res = await api({
        url: "/me",
        method: "GET",
      });

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

      // ✅ backend: { count, data: [] }
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
      const res = await api({ url: "/student-exam/start", method: "POST", data: {sessionId: sessionId }  })
      const examSession  =res.data.content.examSession;
      console.log();
      

      navigate(`/student-exam/${examSession}`)
      

    } catch (error) {
      console.error('xatolik', error)
    }
  }

  useEffect(() => {
    getme();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [groupId]);

  return (
    <div>
      <h2>Teacher Tasks</h2>

      {loading && <p>Yuklanmoqda...</p>}

      {!loading && tasks.length === 0 && <p>Tasklar yo‘q</p>}

      {!loading &&
        tasks.map((task) => (
          <div
            key={task._id}
            style={{
              border: "1px solid #ccc",
              margin: 10,
              padding: 10,
              borderRadius: 6,
            }}
          >
            <h3>{task.examId?.title}</h3>

            <p>
              <b>Group:</b> {task.groupId?.groupName}
            </p>

            <p>
              <b>Status:</b> {task.status}
            </p>

            <p>
              <b>Start:</b>{" "}
              {new Date(task.startDate).toLocaleString()}
            </p>

            <p>
              <b>End:</b>{" "}
              {new Date(task.endDate).toLocaleString()}
            </p>

            <button onClick={() => startexam(task._id)}  className="btn text-white bg-[#FFB608]">imthonni boshlash</button>
          </div>
        ))}
    </div>
  );
};

export default TeacherTasks;
