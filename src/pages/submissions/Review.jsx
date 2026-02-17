import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Download, ExternalLink, RefreshCw } from "lucide-react";
import { fetchProfile } from "../../store/slice/Profilestore"; 

const Review = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => state.profile.data);


  const [submissions, setSubmissions] = useState([
  ]);

  const [loading, setLoading] = useState(false);


  const fetchSubmissions = async () => {
    if (!token || !profile?._id) return;

    setLoading(true);
    try {
      const userId = profile._id;

      const res = await api({
        url: `/submissions/${userId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(res.data.data || []);
    } catch (err) {
      console.error("Submissions fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [token, profile?._id]);

  const handleRefresh = () => {
    fetchSubmissions();
  };

  // ---------- Faqat tekshirilgan topshiriqlarni olish (PENDINGni ham qo‘shdik) ----------
  const checkedSubmissions = submissions.filter(s => 
    s.submission.status === "CHECKED" || 
    s.submission.status === "AGAIN CHECKED" ||
    s.submission.status === "PENDING"
  );

  const stats = checkedSubmissions.length > 0
    ? {
        total: checkedSubmissions.length,
        avgScore: Math.round(
          checkedSubmissions.reduce((sum, s) => sum + (s.submission.score || 0), 0) /
            checkedSubmissions.length
        ),
        totalScore: checkedSubmissions.reduce(
          (sum, s) => sum + (s.submission.score || 0),
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
            className={`w-4 h-4 ${i < filledStars ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}`}
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
          <div className="h-12 w-64 bg-zinc-800 rounded-lg animate-pulse"></div>
          <div className="h-6 w-96 bg-zinc-800 rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-28 animate-pulse"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-40 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (checkedSubmissions.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-xl text-gray-400">
            {t("review.empty") || "Hali tekshirilgan topshiriqlar yo'q"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Bajarilgan topshiriqlar</h1>
          <p className="text-gray-400 text-lg">Tekshirilgan va baholangan barcha topshiriqlaringiz</p>
        </motion.div>

        {/* Statistics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
          {checkedSubmissions.map((item, idx) => {
            const submission = item.submission;
            return (
              <motion.div key={submission._id || idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group">
                <div className="flex items-start justify-between gap-4 flex-wrap md:flex-nowrap">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold mb-1 truncate">
                        {submission.HwLink.includes("github.com")
                          ? submission.HwLink.split("/").slice(-1)[0]
                          : submission.description || "Loyiha"}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {new Date(submission.date).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}
                        {submission.checkedDate && (
                          <span className="ml-2">
                            • Tekshirildi: {new Date(submission.checkedDate).toLocaleDateString("uz-UZ", { day: "numeric", month: "long" })}
                          </span>
                        )}
                      </p>
                      <div className="mb-3">
                        <p className="text-sm text-gray-300">
                          <span className="font-medium">Izoh:</span> {submission.description || t("review.no_description") || "Izoh yo'q"}
                        </p>
                      </div>
                      {item.group && <p className="text-xs text-gray-500 mb-2">Guruh: {item.group.name}</p>}
                      <div>{renderStars(submission.score || 0)}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className={`text-4xl font-bold ${getScoreColor(submission.score || 0)}`}>{submission.score || 0}</p>
                      <p className="text-sm text-gray-400">/ 100</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${submission.status === "AGAIN CHECKED" ? "bg-purple-600/20 text-purple-400" : "bg-green-600/20 text-green-400"}`}>
                      {submission.status === "AGAIN CHECKED" ? "Qayta tekshirildi" : "Tekshirildi"}
                    </span>
                    <a href={submission.HwLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                    </a>
                  </div>
                </div>
                {submission.teacherDescription && (
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <p className="text-sm text-gray-400 mb-1">
                      O'qituvchi izohi {submission.checkedBy && `(${submission.checkedBy})`}:
                    </p>
                    <p className="text-gray-300">{submission.teacherDescription}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Refresh Button */}
        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} onClick={handleRefresh} disabled={loading} className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white p-4 rounded-full shadow-2xl shadow-indigo-500/30 transition-all hover:scale-110 disabled:cursor-not-allowed z-50">
          <RefreshCw className={`w-6 h-6 ${loading ? "animate-spin" : ""}`} />
        </motion.button>
      </div>
    </div>
  );
};

export default Review;
