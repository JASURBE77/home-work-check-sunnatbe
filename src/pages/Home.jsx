import React, { useEffect, useState } from "react";
import api from "../utils/api";

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (error) {
      console.error("ME error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Skeleton loader ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6  ">
        {/* Title skeleton */}
        <div className="h-10 w-72 bg-gray-300 rounded-md animate-pulse"></div>
        <div className="h-6 w-48 bg-gray-300 rounded-md animate-pulse"></div>

        {/* Card skeleton */}
        <div className="w-full max-w-4xl bg-gray-100 rounded-2xl p-6 space-y-4 shadow">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-full h-5 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
          ))}

          {/* Status badges skeleton */}
          <div className="flex justify-between mt-4 space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-1 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-center mt-10 text-red-500">Ma’lumot topilmadi</p>;

  // --- Progress hisoblash ---
  const totalLessons = data.totalLessons || 1;
  const completedLessons = data.completedLessons || 0;
  const lessonProgress = Math.round((completedLessons / totalLessons) * 100);

  const qualityScore = data.qualityScore != null ? data.qualityScore : 4.6;
  const overallProgress = Math.round((lessonProgress + (qualityScore / 5) * 100) / 2);

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-10 px-4 ">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-2">
          Salom, {data.name ?? "O‘quvchi"} 👋
        </h1>
        <p className="text-gray-700 text-lg md:text-xl">
          Sizning o‘quv dashboardingiz
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-4xl bg-gray-100 rounded-2xl p-6 shadow space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Umumiy progress</span>
            <span className="font-bold">{overallProgress}%</span>
          </div>
          <div className="w-full h-5 bg-gray-300 rounded-full overflow-hidden">
            <div
              style={{ width: `${overallProgress}%` }}
              className="h-full bg-blue-500 transition-all duration-500"
            />
          </div>
        </div>

        {/* Lessons Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">
              Darslar ({completedLessons} / {totalLessons})
            </span>
            <span className="font-bold text-red-500">{lessonProgress}%</span>
          </div>
          <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
            <div
              style={{ width: `${lessonProgress}%` }}
              className="h-full bg-red-500 transition-all duration-500"
            />
          </div>
        </div>

        {/* Quality Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">
              Vazifalar sifati ({qualityScore} / 5)
            </span>
            <span className="font-bold text-green-500">
              {Math.round((qualityScore / 5) * 100)}%
            </span>
          </div>
          <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
            <div
              style={{ width: `${(qualityScore / 5) * 100}%` }}
              className="h-full bg-green-500 transition-all duration-500"
            />
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex justify-between mt-4 text-center">
          <div className="flex-1 bg-red-300 rounded-lg py-3 mx-1 font-semibold">
            0-50% <br /> Kritično
          </div>
          <div className="flex-1 bg-yellow-300 rounded-lg py-3 mx-1 font-semibold">
            50-80% <br /> Normalno
          </div>
          <div className="flex-1 bg-green-300 rounded-lg py-3 mx-1 font-semibold">
            80-100% <br /> Otlichno
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
