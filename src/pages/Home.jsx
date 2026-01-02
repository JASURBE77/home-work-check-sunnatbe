import React, { useEffect, useState } from "react";
import api from "../utils/api";

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Persisted token olish
  const persistedAuth = localStorage.getItem("persist:auth");
  let token = null;
  if (persistedAuth) {
    try {
      const parsedAuth = JSON.parse(persistedAuth);
      token = parsedAuth?.accessToken ? JSON.parse(parsedAuth.accessToken) : null;
    } catch (err) {
      console.warn("Token parsing error:", err);
      token = null;
    }
  }

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await api({
        url: "/me",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (error) {
      console.error("ME error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );

  if (!data) return <p className="text-center mt-10 text-red-500">Ma’lumot topilmadi</p>;

  // Progress hisoblash
  const totalLessons = data.totalLessons || 1; // 0 bo‘lsa 1 qilib oldik
  const completedLessons = data.completedLessons || 0;
  const lessonProgress = Math.round((completedLessons / totalLessons) * 100);

  const qualityScore = data.qualityScore != null ? data.qualityScore : 4.6; // 0-5
  const overallProgress = Math.round((lessonProgress + (qualityScore / 5) * 100) / 2);

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-10 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-2">
          Salom, {data.name ?? "O‘quvchi"} 👋
        </h1>
        <p className="text-gray-300 text-lg md:text-xl">
          Sizning o‘quv dashboardingiz
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-4xl bg-gray-800 rounded-3xl p-8 shadow-2xl space-y-8">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-white font-semibold">Umumiy progress</span>
            <span className="text-white font-bold">{overallProgress}%</span>
          </div>
          <div className="w-full h-5 bg-gray-700 rounded-full overflow-hidden">
            <div
              style={{ width: `${overallProgress}%` }}
              className="h-full bg-blue-500 transition-all duration-500"
            />
          </div>
        </div>

        {/* Lessons Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-white font-semibold">
              Darslar ({completedLessons} / {totalLessons})
            </span>
            <span className="text-red-400 font-bold">{lessonProgress}%</span>
          </div>
          <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              style={{ width: `${lessonProgress}%` }}
              className="h-full bg-red-500 transition-all duration-500"
            />
          </div>
        </div>

        {/* Quality Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-white font-semibold">
              Vazifalar sifati ({qualityScore} / 5)
            </span>
            <span className="text-green-400 font-bold">
              {Math.round((qualityScore / 5) * 100)}%
            </span>
          </div>
          <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              style={{ width: `${(qualityScore / 5) * 100}%` }}
              className="h-full bg-green-500 transition-all duration-500"
            />
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex justify-between mt-6 text-center">
          <div className="flex-1 bg-red-700 rounded-lg py-4 mx-2 font-semibold">
            0-50% <br /> Kritično
          </div>
          <div className="flex-1 bg-yellow-700 rounded-lg py-4 mx-2 font-semibold">
            50-80% <br /> Normalno
          </div>
          <div className="flex-1 bg-green-700 rounded-lg py-4 mx-2 font-semibold">
            80-100% <br /> Otlichno
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
