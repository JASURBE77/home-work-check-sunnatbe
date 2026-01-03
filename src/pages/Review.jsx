import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";

const Review = () => {
  const storedUser = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(storedUser || null);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
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
    window.location.reload();
  };

  // --- SKELETON LOADER ---
  if (loading) {
    return (
      <div className="px-4 mt-4 w-full space-y-6">
        <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
        <div className="flex flex-wrap gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="max-w-xs w-full bg-gray-200 rounded-xl p-6 animate-pulse space-y-4">
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

  if (!user || !user.recentSubmissions || user.recentSubmissions.length === 0)
    return <p className="text-center mt-8">Hech qanday topshiriq yo‘q</p>;

  return (
    <div className="px-4 mt-4 w-full mb-30">
      <button
        className="mb-10 btn btn-primary"
        onClick={handleRefresh}
      >
        Yangilash
      </button>

      <div className="flex flex-wrap gap-6">
        {user.recentSubmissions.map((e, idx) => (
          <div
            key={e._id || idx}
            className="max-w-xs bg-base-100 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="p-6">
              <p className="text-lg font-semibold break-all">{e.HwLink}</p>

              <p className="mt-2">
                komentariya: {e.description || "Hech qanday tavsif yo‘q"}
              </p>

              <p className="mt-1 text-sm opacity-60">
                Sana: {new Date(e.date || e.createdAt).toLocaleDateString()}
              </p>

              <p className="mt-1 text-sm font-semibold">
                Status:{" "}
                <span
                  className={
                    e.status === "CHECKED" ? "text-success" : "text-warning"
                  }
                >
                  {e.status}
                </span>
              </p>

              <p className="mt-2 font-semibold">Teacher Feedback:</p>
              <p className="text-sm">{e.teacherDescription || "Izoh berilmagan"}</p>

              <p className="mt-1 text-sm font-semibold">Ball: {e.score} ⭐</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;
  