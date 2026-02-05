import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  Trophy,
  User,
  Calendar,
  Target,
} from "lucide-react";

import api from "../utils/api";
import dayjs from "dayjs";

export default function Profile() {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth.token);

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!token) return;

    try {
      const res = await api({ 
        url: "/submissions", 
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(res.data.data || []);
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  // Ma'lumotlarni hisoblash
  const user = submissions.length > 0 ? submissions[0] : null;
  
  const stats = {
    total: submissions.length,
    completed: submissions.filter(s => 
      s.submission.status === "CHECKED" || s.submission.status === "AGAIN CHECKED"
    ).length,
    pending: submissions.filter(s => s.submission.status === "PENDING").length,
    totalScore: submissions
      .filter(s => s.submission.status === "CHECKED" || s.submission.status === "AGAIN CHECKED")
      .reduce((sum, s) => sum + (s.submission.score || 0), 0)
  };

  // Progress hisobi (har bir kurs uchun)
  const courses = submissions.reduce((acc, item) => {
    if (item.group && item.group.name) {
      const groupName = item.group.name;
      if (!acc[groupName]) {
        acc[groupName] = { total: 0, completed: 0 };
      }
      acc[groupName].total++;
      if (item.submission.status === "CHECKED" || item.submission.status === "AGAIN CHECKED") {
        acc[groupName].completed++;
      }
    }
    return acc;
  }, {});

  const courseProgress = Object.entries(courses).map(([name, data]) => ({
    name,
    percentage: Math.round((data.completed / data.total) * 100)
  })).slice(0, 3); // Faqat 3 ta kursni ko'rsatish

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 space-y-8 animate-pulse">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800 p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-40 rounded-full bg-gray-700" />
            <div className="flex-1 space-y-4">
              <div className="h-10 w-3/4 bg-gray-700 rounded-xl" />
              <div className="h-6 w-1/2 bg-gray-700 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-28 bg-gray-700 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <div className="h-8 w-1/2 bg-gray-700 rounded mb-6" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-800 rounded-xl mb-4" />
            ))}
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <div className="h-8 w-1/2 bg-gray-700 rounded mb-6" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-800 rounded-xl mb-4" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-red-400 text-xl">Profil topilmadi</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ===== PROFILE HEADER CARD ===== */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800 p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Avatar va info */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center ring-4 ring-blue-500/30 ring-offset-4 ring-offset-gray-900">
                  <span className="text-5xl md:text-6xl font-bold text-white">
                    {user.name?.[0] || 'U'}
                    {user.surname?.[0] || 'S'}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900" />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {user.name} {user.surname}
                </h1>
                <p className="text-gray-400 text-lg mt-1">
                  @{user.userId?.slice(-8) || "username"}
                </p>

                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    Talaba
                  </div>
                  {user.group && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Guruh: {user.group.name}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Trophy size={16} />
                    #{stats.completed > 0 ? Math.ceil(stats.completed / 2) : "?"} Reyting
                  </div>
                </div>
              </div>
            </div>

            {/* Edit button */}
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-all shadow-lg shadow-blue-900/30">
              <Edit size={18} />
              Tahrirlash
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-1">{stats.total}</p>
              <p className="text-gray-400">Jami topshiriqlar</p>
            </div>

            <div className="bg-gradient-to-br from-green-950 to-green-900 border border-green-800/50 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-1">{stats.completed}</p>
              <p className="text-green-300">Bajarilgan</p>
            </div>

            <div className="bg-gradient-to-br from-amber-950 to-amber-900 border border-amber-800/50 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-1">{stats.pending}</p>
              <p className="text-amber-300">Kutilayotgan</p>
            </div>

            <div className="bg-gradient-to-br from-blue-950 to-blue-900 border border-blue-800/50 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-1">{stats.totalScore}</p>
              <p className="text-blue-300">Umumiy ball</p>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Mail className="text-gray-400" size={24} />
              Bog'lanish ma'lumotlari
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-950 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Username</p>
                  <p className="font-medium">{user.name} {user.surname}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-950 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">User ID</p>
                  <p className="font-medium text-xs break-all">{user.userId}</p>
                </div>
              </div>

              {user.group && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-950 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-gray-400" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Guruh</p>
                    <p className="font-medium">{user.group.name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-950 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Oxirgi topshiriq</p>
                  <p className="font-medium">
                    {submissions[0]?.submission?.date 
                      ? dayjs(submissions[0].submission.date).format("DD.MM.YYYY")
                      : "Ma'lumot yo'q"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* O'qish progressi */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Target className="text-blue-500" size={24} />
              O'qish progressi
            </h3>

            <div className="space-y-6">
              {courseProgress.length > 0 ? (
                courseProgress.map((course, idx) => {
                  const color = 
                    course.percentage >= 80 ? "green" :
                    course.percentage >= 50 ? "blue" : "amber";
                  
                  return (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium truncate pr-4">{course.name}</span>
                        <span className={`text-${color}-400 font-bold`}>
                          {course.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-3">
                        <div 
                          className={`bg-${color}-500 h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${course.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-400 py-8">
                  Hali kurslar mavjud emas
                </div>
              )}

              {/* Umumiy progress */}
              <div className="pt-4 border-t border-gray-800">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Umumiy progress</span>
                  <span className="text-purple-400 font-bold">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div 
                    className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}