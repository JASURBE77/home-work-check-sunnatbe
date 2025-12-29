import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Trophy, CheckCircle, BookOpen, TrendingUp, Award, Target, Clock, Star, Zap, Flame, Sparkles, Medal, Gift } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } },
};

const bounceIn = {
  hidden: { opacity: 0, scale: 0 },
  show: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      type: "spring", 
      stiffness: 200,
      damping: 10 
    } 
  },
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity }
          }}
          className="relative"
        >
          <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full"></div>
          <Sparkles className="w-10 h-10 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      </div>
    );

  // Progress calculations
  const lessonProgress = user.totalLessons
    ? Math.round((user.completedLessons / user.totalLessons) * 100)
    : 0;
  
  const completedCount = (user.recentSubmissions || []).filter(
    sub => sub.status === "CHECKED" || sub.status === "completed"
  ).length;
  const totalSubmissions = user.recentSubmissions?.length || 0;
  const qualityProgress = totalSubmissions > 0 
    ? Math.round((completedCount / totalSubmissions) * 100)
    : 0;
  
  const overallProgress = Math.round((lessonProgress + qualityProgress) / 2);

  // Fun emojis based on progress
  const getProgressEmoji = (progress) => {
    if (progress >= 90) return "🌟";
    if (progress >= 70) return "🚀";
    if (progress >= 50) return "💪";
    if (progress >= 30) return "📚";
    return "🌱";
  };

  const getEncouragement = () => {
    if (overallProgress >= 90) return t("amazing_work", "Amazing work, superstar! 🎉");
    if (overallProgress >= 70) return t("doing_great", "You're doing great! Keep it up! 🌟");
    if (overallProgress >= 50) return t("good_progress", "Good progress! You're on fire! 🔥");
    return t("keep_going", "Keep going! Every step counts! 💪");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 pb-10">
      {/* Fun Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-90"></div>
        
        {/* Floating shapes */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"
        ></motion.div>
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-xl"
        ></motion.div>

        <div className="relative px-4 py-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <div className="text-8xl mb-4">👋</div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-black text-white mb-3 drop-shadow-lg"
          >
            {t("hello", "Hello")}, {user.name}!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-white/90 font-semibold"
          >
            {getEncouragement()}
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        {/* Main Progress Cards with Fun Design */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Lessons Card */}
          <motion.div
            variants={bounceIn}
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"
            ></motion.div>
            
            <div className="relative z-10">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex justify-center mb-4"
              >
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <BookOpen className="w-12 h-12" />
                </div>
              </motion.div>
              
              <div className="text-6xl font-black mb-2">{lessonProgress}%</div>
              <div className="text-3xl mb-3">{getProgressEmoji(lessonProgress)}</div>
              <p className="font-bold text-xl mb-2">{t("lessons", "Darslar")}</p>
              <p className="text-white/80 text-lg mb-4">
                {user.completedLessons} / {user.totalLessons} {t("completed", "bajarildi")}
              </p>
              
              <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${lessonProgress}%` }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full shadow-lg"
                />
              </div>
            </div>
          </motion.div>

          {/* Quality Card */}
          <motion.div
            variants={bounceIn}
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="bg-gradient-to-br from-pink-500 to-rose-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden"
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full"
            ></motion.div>
            
            <div className="relative z-10">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex justify-center mb-4"
              >
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <Target className="w-12 h-12" />
                </div>
              </motion.div>
              
              <div className="text-6xl font-black mb-2">{qualityProgress}%</div>
              <div className="text-3xl mb-3">{getProgressEmoji(qualityProgress)}</div>
              <p className="font-bold text-xl mb-2">{t("homeworks", "Vazifalar")}</p>
              <p className="text-white/80 text-lg mb-4">
                {completedCount} / {totalSubmissions} {t("checked", "tekshirildi")}
              </p>
              
              <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${qualityProgress}%` }}
                  transition={{ duration: 1.5, delay: 0.7 }}
                  className="h-full bg-gradient-to-r from-green-300 to-emerald-500 rounded-full shadow-lg"
                />
              </div>
            </div>
          </motion.div>

          {/* Overall Card */}
          <motion.div
            variants={bounceIn}
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="bg-gradient-to-br from-blue-500 to-indigo-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden"
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            ></motion.div>
            
            <div className="relative z-10">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex justify-center mb-4"
              >
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <Trophy className="w-12 h-12" />
                </div>
              </motion.div>
              
              <div className="text-6xl font-black mb-2">{overallProgress}%</div>
              <div className="text-3xl mb-3">{getProgressEmoji(overallProgress)}</div>
              <p className="font-bold text-xl mb-2">{t("total_score", "Umumiy ball")}</p>
              <p className="text-white/80 text-lg mb-4">
                {t("overall_progress", "Umumiy natijangiz")}
              </p>
              
              <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1.5, delay: 0.9 }}
                  className="h-full bg-gradient-to-r from-orange-300 to-red-500 rounded-full shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Submissions */}
        {user.recentSubmissions && user.recentSubmissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gift className="w-10 h-10 text-purple-600" />
              </motion.div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("recent_work", "Oxirgi Ishlarim")} ✨
              </h2>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {user.recentSubmissions.slice(0, 6).map((sub, idx) => {
                const isCompleted = sub.status === "CHECKED" || sub.status === "completed";
                const colors = [
                  'from-violet-400 to-violet-600',
                  'from-fuchsia-400 to-fuchsia-600',
                  'from-cyan-400 to-cyan-600',
                  'from-amber-400 to-amber-600',
                  'from-emerald-400 to-emerald-600',
                  'from-rose-400 to-rose-600'
                ];
                
                return (
                  <motion.div
                    key={idx}
                    variants={bounceIn}
                    whileHover={{ y: -10, rotate: idx % 2 === 0 ? 2 : -2 }}
                    className={`bg-gradient-to-br ${colors[idx % colors.length]} rounded-3xl shadow-xl p-6 text-white relative overflow-hidden`}
                  >
                    {/* Decorative circles */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full"></div>
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                          className="bg-white/30 p-3 rounded-2xl backdrop-blur-sm"
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-8 h-8" />
                          ) : (
                            <Clock className="w-8 h-8" />
                          )}
                        </motion.div>
                        
                        {sub.score !== undefined && sub.score !== null && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
                            className="flex items-center gap-2 bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm"
                          >
                            <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                            <span className="font-black text-2xl">{sub.score}</span>
                          </motion.div>
                        )}
                      </div>

                      <h3 className="font-black text-2xl mb-4 line-clamp-2 drop-shadow-lg">
                        {sub.description || t("homework", "Uyga Vazifa")} {idx + 1}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${
                          isCompleted
                            ? "bg-green-400/40 border-2 border-green-300"
                            : "bg-yellow-400/40 border-2 border-yellow-300"
                        }`}>
                          {isCompleted ? (
                            <span className="flex items-center gap-2">
                              ✅ {t("done", "Tayyor")}
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              ⏳ {t("waiting", "Kutilmoqda")}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {/* Fun Empty State */}
        {(!user.recentSubmissions || user.recentSubmissions.length === 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl shadow-xl p-16 text-center relative overflow-hidden"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-10 left-1/4 text-6xl"
            >
              ⭐
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-10 right-1/4 text-6xl"
            >
              🚀
            </motion.div>
            
            <div className="text-8xl mb-6">📚</div>
            <h3 className="text-4xl font-black mb-4 text-purple-800">
              {t("ready_to_start", "Boshlashga tayyormisiz?")}
            </h3>
            <p className="text-2xl text-purple-600 font-semibold">
              {t("first_homework", "Birinchi vazifangizni bajaring va natijalaringizni ko'ring!")} 🌟
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}