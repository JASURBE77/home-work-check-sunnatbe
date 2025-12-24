import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Redux'dan user
  const { user } = useSelector((state) => state.auth);

  console.log("USER:", user);

  const getMyReviews = async (id) => {
  

    try {
      const res = await api({
        url: `/submissions/${id}`,
        method: "GET",
      });
      setReviews(res.data);
    } catch (err) {
      console.error("User fetch error:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getMyReviews();
  }, [user]);

  if (loading) return <p className="text-center mt-8">Yuklanmoqda...</p>;
  if (reviews.length === 0)
    return <p className="text-center mt-8">Hech qanday topshiriq yo'q</p>;

  
  return (
    <div className="mb-30 grid md:grid-cols-2 gap-6">
      {reviews.map((e) => (
        <div
          key={e._id}
          className="max-w-xs overflow-hidden bg-base-100 border border-base-100 rounded-xl shadow-md transform transition-all duration-500 hover:shadow-lg hover:scale-105 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-base-100 to-base opacity-0 transition-opacity duration-500 group-hover:opacity-30 blur-md" />
          <div className="p-6 relative z-10">
            <p className="text-xl font-semibold">{e.HwLink}</p>
            <p className="mt-2">{e.description || "Hech qanday tavsif yo'q"}</p>
            <p className="mt-1 text-sm text-gray-500">Sana: {e.date}</p>

            <p className="mt-1 text-sm font-semibold">
              Status:{" "}
              <span
                className={
                  e.status === "CHECKED"
                    ? "text-green-500"
                    : "text-yellow-500"
                }
              >
                {e.status}
              </span>
            </p>

            {e.status === "CHECKED" && (
              <>
                <p className="mt-2 font-semibold">Teacher Feedback:</p>
                <p className="text-sm">
                  {e.teacherDescription || "Izoh berilmagan"}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Rating: {e.rating || 0} ⭐
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Review;
