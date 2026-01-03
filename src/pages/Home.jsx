import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { User, BookOpen, CheckCircle, Trophy, Calendar, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import api from "../utils/api";

export default function Dashboard() {
  const token = useSelector((state) => state.auth.token); // Redux token
  const [user, setUser] = useState(null);
  const [exams, setExams] = useState([]);
  const [teacherTasks, setTeacherTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const completionPercentage = user?.totalLessons
    ? Math.round((user.completedLessons / user.totalLessons) * 100)
    : 0;
    // Umumiy ballni hisoblash
const totalPoints = user?.recentSubmissions
  ? user.recentSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0)
  : 0;


  // API fetch
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1️⃣ User profile
      const resUser = await api({
        url: "/me",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(resUser.data);

      // 2️⃣ Exams
      const resExams = await api({
        url: "/student-exam/my-exams",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(Array.isArray(resExams.data) ? resExams.data : []);

      // 3️⃣ Teacher tasks (group bo'yicha)
      const groupId = resUser.data.group?._id;
      if (groupId) {
        const resTasks = await api({
          url: `/exam-session/group/${groupId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeacherTasks(Array.isArray(resTasks.data.data) ? resTasks.data.data : []);
      }
    } catch (err) {
      console.error("Dashboard API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // --- Skeleton Loader ---
  if (loading) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <div className="h-8 w-64 bg-gray-300 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) return <p className="text-center mt-10 text-red-500">User topilmadi</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Salom, {user.name} 👋</h1>
        <div className="flex items-center gap-4">
          <Calendar className="w-6 h-6 text-gray-600" />
          <span>{user.joinDate}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center">
          <CheckCircle className="w-8 h-8 text-green-500 mb-2"/>
          <span className="text-lg font-semibold">Topshirildi</span>
          <span className="text-2xl font-bold">{user.completedLessons} ta</span>
        </div>
        <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center">
          <BookOpen className="w-8 h-8 text-yellow-500 mb-2"/>
          <span className="text-lg font-semibold">Qolgan</span>
          <span className="text-2xl font-bold">{user.pendingLessons} ta</span>
        </div>
       <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center">
  <Trophy className="w-8 h-8 text-purple-500 mb-2"/>
  <span className="text-lg font-semibold"> Jami Ball</span>
  <span className="text-2xl font-bold">{totalPoints}</span>
</div>

      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">So‘nggi topshiriqlar</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {user.recentSubmissions?.map((sub, idx) => (
            <div key={idx} className="bg-white shadow-xl rounded-xl p-4 flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="font-semibold">{sub.description}</span>
                <span className={`text-sm font-semibold ${sub.status === "CHECKED" ? "text-green-500" : "text-yellow-500"}`}>
                  {sub.status === "completed" ? "Topshirildi" : "Jarayonda"}
                </span>
              </div>
              <span className="text-sm text-gray-500">{new Date(sub.date).toLocaleDateString()}</span>
              {sub.score && <span className="font-bold text-green-600">Ball: {sub.score} ⭐</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
