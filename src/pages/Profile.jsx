import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { User, BookOpen, CheckCircle, Trophy, Calendar, Target, Award, TrendingUp } from 'lucide-react';
import api from "../utils/api";
export default function Profile() {
  const { t } = useTranslation();

   const storedUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(storedUser ||null);
  const [loading, setLoading] = useState(true);

  const completionPercentage = user.totalLessons > 0
    ? Math.round((user.completedLessons / user.totalLessons) * 100)
    : 0;

  const fetchProfile = async () => {
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
    fetchProfile()
  }, [storedUser]);

  if (loading) return<span className="loading  loading-spinner text-primary"></span>

  
  return (
    <div className="w-full bg-base-100 shadow-xl p-4 md:p-8 overflow-auto">
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="card bg-base-100 shadow-xl rounded-3xl p-6 md:p-8 border border-base-300 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="">
                <div className="w-32 h-32 flex items-center justify-center md:w-40 md:h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <span className='text-black text-5xl'>{user.name[0].toUpperCase()}{user.surname[0].toUpperCase()}</span>
                </div>
              </div>
              <div className="badge badge-primary absolute -bottom-2 -right-2 text-white font-bold">
                {user.level}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-2">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-base-content/70 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{t('homework.joined') || `Qo'shildi: ${user.joinDate}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold">{user.points || 0} {t('rating')}</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="stats stats-vertical md:stats-horizontal shadow bg-base-200 rounded-xl w-full">
                <div className="stat">
                  <div className="stat-title">{t('profile.totalLessons', 'Jami dars')}</div>
                  <div className="stat-value">{user.totalLessons}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">{t('profile.completedLessons', 'Topshirildi')}</div>
                  <div className="stat-value text-success">{user.completedLessons}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">{t('profile.pendingLessons', 'Kutilmoqda')}</div>
                  <div className="stat-value text-warning">{user.pendingLessons}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress + Recent Submissions */}
        <div className="grid md:grid-cols-3 gap-6 w-full">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Progress Card */}
            <div className="card bg-base-100 shadow-xl rounded-3xl border border-base-300 p-6 w-full">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-base-content">{t('progress_title')}</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">{t('overall_progress')}</span>
                  <span className="text-base-content font-bold text-lg">{completionPercentage}%</span>
                </div>
                <progress className="progress progress-primary w-full" value={completionPercentage} max="100"></progress>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="card bg-success/20 border border-success/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-success mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">{t('status_good', 'Bajarildi')}</span>
                    </div>
                    <div className="text-2xl font-bold">{user.completedLessons} ta</div>
                  </div>
                  <div className="card bg-warning/20 border border-warning/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-warning mb-2">
                      <BookOpen className="w-5 h-5" />
                      <span className="font-semibold">{t('status_ok', 'Qolgan')}</span>
                    </div>
                    <div className="text-2xl font-bold">{user.pendingLessons} ta</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="card bg-base-100 shadow-xl rounded-3xl border border-base-300 p-6 w-full">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-base-content">{t('profile.recentSubmissions', 'So\'nggi topshiriqlar')}</h2>
              </div>

              <div className="space-y-3 overflow-x-auto">
                {user.recentSubmissions && user.recentSubmissions.length > 0 ? (
                  user.recentSubmissions.map((submission, idx) => (
                    <div key={submission.id || idx} className="card bg-base-100 border border-base-300 rounded-xl p-4 hover:bg-base-100 transition-all w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            submission.status === 'completed' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                          }`}>
                            {submission.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="text-base-content font-semibold">{submission.description || "No title"}</div>
                            <div className="text-base-content/70 text-sm">{submission.date}</div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          submission.status === 'completed' ? 'bg-success/20 text-success border border-success/30' : 'bg-warning/20 text-warning border border-warning/30'
                        }`}>
                          {submission.status === 'completed' ? t('status_good', 'Topshirildi') : t('status_ok', 'Jarayonda')}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Hech qanday topshiriq yo'q</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
