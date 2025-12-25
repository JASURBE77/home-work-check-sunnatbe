import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Trophy, CheckCircle, BookOpen } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Home() {
  const { t } = useTranslation();
  const storedUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(storedUser || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storedUser) return;

    setUser(storedUser);
    setLoading(false);
  }, [storedUser]);

  if (loading || !user)
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner text-primary w-10 h-10"></span>
      </div>
    );

  // Progresslar
  const lessonProgress = user.totalLessons
    ? Math.round((user.completedLessons / user.totalLessons) * 100)
    : 0;
  const qualityProgress = 4.6 / 5 * 100; // example static
  const overallProgress = (lessonProgress + qualityProgress) / 2;

  return (
    <motion.div initial="hidden" animate="show" className="px-4 mt-4 w-full">
      {/* Greeting / User Name */}
      <motion.h1 variants={fadeIn} className="font-bold text-3xl mb-4 text-center">
        {t("hello_user", { name: user.name }) /* e.g. "Hello, Jasur" */}
      </motion.h1>

      <motion.h2 variants={fadeIn} className="font-bold text-2xl mb-4 text-center">
        {t("dashboard", "Dashboard Overview")}
      </motion.h2>

      {/* Progress Bars */}
      <motion.div variants={fadeIn} className="grid sm:grid-cols-3 gap-4">
        {/* Lessons */}
        <div className="bg-base-100 rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold">{lessonProgress}%</div>
          <p className="text-sm opacity-70 mt-2">
            {t("lessons", "Lessons")}: {user.completedLessons} из {user.totalLessons}
          </p>
          <progress
            className="progress progress-primary w-full mt-2"
            value={lessonProgress}
            max="100"
          ></progress>
        </div>

        {/* Quality */}
        <div className="bg-base-100 rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-pink-500">{qualityProgress}%</div>
          <p className="text-sm opacity-70 mt-2">
            {t("quality", "Quality")}: 4.6 из 5.0
          </p>
          <progress
            className="progress progress-pink-500 w-full mt-2"
            value={qualityProgress}
            max="100"
          ></progress>
        </div>

        {/* Overall */}
        <div className="bg-base-100 rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-yellow-500">{overallProgress}%</div>
          <p className="text-sm opacity-70 mt-2">{t("overall_progress", "Overall Progress")}</p>
          <progress
            className="progress progress-warning w-full mt-2"
            value={overallProgress}
            max="100"
          ></progress>
        </div>
      </motion.div>

      {/* Recent submissions / top scores */}
      <motion.div variants={fadeIn} className="mt-6 grid sm:grid-cols-3 gap-4">
        {(user.recentSubmissions || []).slice(0, 3).map((sub, idx) => (
          <div
            key={idx}
            className="bg-base-100 p-4 rounded-xl shadow flex flex-col items-center"
          >
            <Trophy className="text-yellow-500 w-8 h-8 mb-2" />
            <p className="font-bold">{sub.description || t("no_title", "No title")}</p>
            <p className="text-sm opacity-70">
              {t("score", "Score")}: {sub.score || 0}
            </p>
            <span
              className={`px-2 py-1 mt-2 rounded text-xs font-semibold ${
                sub.status === "CHECKED" || sub.status === "completed"
                  ? "bg-success/20 text-success border border-success/30"
                  : "bg-warning/20 text-warning border border-warning/30"
              }`}
            >
              {sub.status === "CHECKED" || sub.status === "completed"
                ? t("checked", "✔ Checked")
                : t("pending", "⏳ Pending")}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
