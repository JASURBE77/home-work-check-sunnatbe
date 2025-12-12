import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, BookOpen, CheckCircle, Trophy, Calendar, Target, Award, TrendingUp } from 'lucide-react';

export default function Profile() {
  const { t } = useTranslation();

  const [profileData] = useState({
    name: 'Aziz Rahimov',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    totalLessons: 24,
    completedLessons: 18,
    pendingLessons: 6,
    streak: 12,
    points: 850,
    level: 'Intermediate',
    joinDate: '15 Sentabr 2024',
    recentSubmissions: [
      { id: 1, title: 'React Hooks', date: '10 Dekabr', status: 'completed' },
      { id: 2, title: 'Tailwind CSS', date: '8 Dekabr', status: 'completed' },
      { id: 3, title: 'API Integration', date: '5 Dekabr', status: 'completed' },
      { id: 4, title: 'State Management', date: '3 Dekabr', status: 'pending' }
    ]
  });

  const completionPercentage = Math.round((profileData.completedLessons / profileData.totalLessons) * 100);

  return (
    <div className="w-full bg-base-100 shadow-xl p-4 md:p-8 overflow-auto">
      <div className="space-y-6">
        {/* Header Card */}
        <div className="card bg-base-100 shadow-xl rounded-3xl p-6 md:p-8 border border-base-300 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="avatar">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={profileData.avatar} alt="Profile" />
                </div>
              </div>
              <div className="badge badge-primary absolute -bottom-2 -right-2 text-white font-bold">
                {profileData.level}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-2">
                {profileData.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-base-content/70 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{t('homework.joined') || `Qo'shildi: ${profileData.joinDate}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold">{profileData.points} {t('rating')}</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="stats stats-vertical md:stats-horizontal shadow bg-base-200 rounded-xl w-full">
                <div className="stat">
                  <div className="stat-title">{t('profile.totalLessons', 'Jami dars')}</div>
                  <div className="stat-value">{profileData.totalLessons}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">{t('profile.completedLessons', 'Topshirildi')}</div>
                  <div className="stat-value text-success">{profileData.completedLessons}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">{t('profile.pendingLessons', 'Kutilmoqda')}</div>
                  <div className="stat-value text-warning">{profileData.pendingLessons}</div>
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
                    <div className="text-2xl font-bold">{profileData.completedLessons} ta</div>
                  </div>
                  <div className="card bg-warning/20 border border-warning/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-warning mb-2">
                      <BookOpen className="w-5 h-5" />
                      <span className="font-semibold">{t('status_ok', 'Qolgan')}</span>
                    </div>
                    <div className="text-2xl font-bold">{profileData.pendingLessons} ta</div>
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

              <div className="space-y-3">
                {profileData.recentSubmissions.map((submission) => (
                  <div key={submission.id} className="card bg-base-100 border border-base-300 rounded-xl p-4 hover:bg-base-100 transition-all w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          submission.status === 'completed' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                        }`}>
                          {submission.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="text-base-content font-semibold">{submission.title}</div>
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
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Achievements */}
          <div className="space-y-6 w-full">
            {/* Streak Card */}
            <div className="card bg-primary text-primary-content rounded-3xl shadow-xl p-6 w-full">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6" />
                <h2 className="text-xl font-bold">{t('profile.streak', 'Ketma-ketlik')}</h2>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">🔥</div>
                <div className="text-4xl font-bold mb-1">{profileData.streak}</div>
                <div className="text-base-content/70 text-sm">{t('profile.days', 'kun ketma-ket')}</div>
              </div>
            </div>

            {/* Achievements Card */}
            <div className="card bg-base-100 shadow-xl rounded-3xl border border-base-300 p-6 w-full">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold text-base-content">{t('profile.achievements', 'Yutuqlar')}</h2>
              </div>

              <div className="space-y-3">
                <div className="card bg-success/20 border border-success/30 rounded-xl p-4 w-full">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-base-content font-semibold text-sm">{t('profile.first10', 'Birinchi 10 ta')}</div>
                  <div className="text-base-content/70 text-xs">{t('profile.first10Desc', '10 ta dars topshirish')}</div>
                </div>

                <div className="card bg-primary/20 border border-primary/30 rounded-xl p-4 w-full">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="text-base-content font-semibold text-sm">{t('profile.fastLearner', 'Tezkor o\'quvchi')}</div>
                  <div className="text-base-content/70 text-xs">{t('profile.fastLearnerDesc', '5 kun ketma-ket')}</div>
                </div>

                <div className="card bg-info/20 border border-info/30 rounded-xl p-4 w-full">
                  <div className="text-2xl mb-2">💎</div>
                  <div className="text-base-content font-semibold text-sm">{t('profile.perfection', 'Mukammallik')}</div>
                  <div className="text-base-content/70 text-xs">{t('profile.perfectionDesc', '75% bajarish')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
