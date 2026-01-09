import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { useTranslation } from "react-i18next";

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

  if (loading) {
    return (
      <div className="px-4 mt-4 w-full space-y-6 animate-pulse">
        <div className="flex justify-end items-center">
          <div className="h-8 w-32 bg-gray-300 rounded"></div>
        </div>

        <div className="flex flex-wrap gap-6">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="max-w-xs w-full bg-gray-200 rounded-xl p-6 space-y-4">
              <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-4 w-full bg-gray-300 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
              <div className="h-3 w-1/3 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user || !user.recentSubmissions || user.recentSubmissions.length === 0) {
    return <p className="text-center mt-8">{t("review.empty")}</p>;
  }

  return (
    <div className="px-4 mt-4 w-full mb-30">
      <div className="flex justify-between items-center mb-10 ">
        <h2 className="text-4xl font-bold">Vazifalar</h2>
        <button
          className="btn bg-[#1935CA] rounded-xl text-white"
          onClick={handleRefresh}>
          {t("review.refresh")}
        </button>
      </div>

      <div className="flex flex-wrap gap-6">
        {user.recentSubmissions.map((e, idx) => (
          <div
            key={e._id || idx}
            className="max-w-xs bg-base-100 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="p-6">
              <p className="text-lg font-semibold break-all">{e.HwLink}</p>

              <p className="mt-2">
                {t("review.comment")}:{" "}
                {e.description || t("review.no_description")}
              </p>

              <p className="mt-1 text-sm opacity-60">
                {t("review.date")}:{" "}
                {new Date(e.date || e.createdAt).toLocaleDateString()}
              </p>

              <p className="mt-1 text-sm font-semibold">
                {t("review.status")}:{" "}
                <span
                  className={
                    e.status === "CHECKED" ? "text-success" : "text-warning"
                  }>
                  {e.status === "CHECKED"
                    ? t("status.checked")
                    : t("status.pending")}
                </span>
              </p>

              <p className="mt-2 font-semibold">
                {t("review.teacher_feedback")}:
              </p>
              <p className="text-sm">
                {e.teacherDescription || t("review.no_feedback")}
              </p>

              <p className="mt-1 text-sm font-semibold">
                {t("review.score")}: {e.score} ⭐
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;
