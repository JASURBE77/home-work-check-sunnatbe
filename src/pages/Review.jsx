import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Download, ExternalLink, RefreshCw } from "lucide-react";

const Review = () => {
  const { t } = useTranslation();
  const storedUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(storedUser || null);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api({ url: "/me", method: "GET" });
      setUser(res.data);
    } catch (err) {
      console.error("User fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [storedUser]);

  const handleRefresh = () => {
    fetchSubmissions();
  };

  // Calculate statistics
  const stats = user?.recentSubmissions
    ? {
        total: user.recentSubmissions.length,
        avgScore: Math.round(
          user.recentSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) /
            user.recentSubmissions.length
        ),
        totalScore: user.recentSubmissions.reduce(
          (sum, s) => sum + (s.score || 0),
          0
        ),
      }
    : { total: 0, avgScore: 0, totalScore: 0 };

  const renderStars = (score) => {
    const maxStars = 5;
    const filledStars = Math.min(Math.floor(score / 20), maxStars);
    return (
      <div className="flex gap-0.5">
        {[...Array(maxStars)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < filledStars
                ? "fill-yellow-500 text-yellow-500"
                : "text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="h-12 w-64 bg-zinc-800 rounded-lg animate-pulse"></div>
          <div className="h-6 w-96 bg-zinc-800 rounded-lg animate-pulse"></div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-28 animate-pulse"
              ></div>
            ))}
          </div>

          {/* Cards skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-40 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user || !user.recentSubmissions || user.recentSubmissions.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-xl text-gray-400">
            {t("review.empty") || "Hali topshiriqlar yo'q"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Bajarilgan topshiriqlar
          </h1>
          <p className="text-gray-400 text-lg">
            Tekshirilgan va baholangan barcha topshiriqlaringiz
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {/* Total Submissions */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-400">Jami bajarilgan</p>
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.avgScore}%</p>
                <p className="text-sm text-gray-400">O'rtacha ball</p>
              </div>
            </div>
          </div>

          {/* Total Points */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.totalScore}</p>
                <p className="text-sm text-gray-400">Umumiy ball</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Submissions List */}
        <div className="space-y-4">
          {user.recentSubmissions.map((submission, idx) => (
            <motion.div
              key={submission._id || idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Section - Icon and Content */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-xl font-semibold mb-1 truncate">
                      {submission.HwLink.includes("github.com")
                        ? submission.HwLink.split("/").slice(-1)[0]
                        : "Loyiha"}
                    </h3>

                    {/* Date */}
                    <p className="text-sm text-gray-400 mb-3">
                      {new Date(
                        submission.date || submission.createdAt
                      ).toLocaleDateString("uz-UZ", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    {/* Comment */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-300">
                        <span className="font-medium">Izoh:</span>{" "}
                        {submission.description ||
                          t("review.no_description") ||
                          "Izoh yo'q"}
                      </p>
                    </div>

                    {/* Stars */}
                    <div>{renderStars(submission.score || 0)}</div>
                  </div>
                </div>

                {/* Right Section - Score and Link */}
                <div className="flex flex-col items-end gap-3">
                  {/* Score */}
                  <div className="text-right">
                    <p
                      className={`text-4xl font-bold ${getScoreColor(
                        submission.score || 0
                      )}`}
                    >
                      {submission.score || 0}
                    </p>
                    <p className="text-sm text-gray-400">/ 100</p>
                  </div>

                  {/* External Link */}
                  <a
                    href={submission.HwLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </a>
                </div>
              </div>

              {/* Teacher Feedback */}
              {submission.teacherDescription && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-sm text-gray-400 mb-1">
                    O'qituvchi izohi:
                  </p>
                  <p className="text-gray-300">{submission.teacherDescription}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Refresh Button (Fixed at bottom right) */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleRefresh}
          disabled={loading}
          className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white p-4 rounded-full shadow-2xl shadow-indigo-500/30 transition-all hover:scale-110 disabled:cursor-not-allowed z-50"
        >
          <RefreshCw
            className={`w-6 h-6 ${loading ? "animate-spin" : ""}`}
          />
        </motion.button>
      </div>
    </div>
  );
};

export default Review;