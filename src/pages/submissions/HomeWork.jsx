import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Send, Link as LinkIcon, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import api from "../../utils/api";

const INITIAL_FORM = {
  type: "github",
  link: "",
  comment: "",
};

// URL validation helper
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

export default function HouseDonationPage() {
  const { t } = useTranslation();
  const token = localStorage.getItem("accessToken")

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Link validation
    if (!formData.link.trim()) {
      newErrors.link = "Link kiritish majburiy";
    } else if (!isValidUrl(formData.link)) {
      newErrors.link = "Yaroqli URL kiriting";
    }

    // Comment validation
    if (!formData.comment.trim()) {
      newErrors.comment = "Izoh kiritish majburiy";
    } else if (formData.comment.length > 200) {
      newErrors.comment = "Izoh 200 belgidan oshmasligi kerak";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const postFetch = async () => {
    setLoading(true);
    setServerError("");

    try {
      const res = await api({
        url: "/submissions/postHomeWork",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          HwLink: formData.link.trim(),
          description: formData.comment.trim(),
        },
      });

      if (res.status === 201 || res.status === 200) {
        setSubmitted(true);
        setFormData(INITIAL_FORM);
        setErrors({});
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error(res.data?.message || "Xato yuz berdi");
      }
    } catch (err) {
      console.error("Submission error:", err);

      if (err.response) {
        setServerError(
          err.response.data?.message || `Server xatosi: ${err.response.status}`
        );
      } else if (err.request) {
        setServerError("Serverga ulanib bo'lmadi. Internetni tekshiring.");
      } else {
        setServerError(err.message || "Noma'lum xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }

      if (serverError) {
        setServerError("");
      }
    },
    [errors, serverError]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await postFetch();
    }
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/30"
          >
            <Upload className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Uy vazifasini yuborish
          </h1>
          <p className="text-gray-400 text-base">
            GitHub yoki Vercel orqali loyihangizni yuboring
          </p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800"
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-green-500">
                Muvaffaqiyatli yuborildi!
              </h2>
              <p className="text-gray-400">Uy vazifangiz ko'rib chiqiladi</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-300">
                  <Upload className="w-4 h-4" />
                  Topshiriq turi
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="github">Topshiriq turini tanlang</option>
                  <option value="github">GitHub</option>
                  <option value="vercel">Vercel</option>
                </select>
              </div>

              {/* Link Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-300">
                  <LinkIcon className="w-4 h-4" />
                  Loyiha havolasi
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                  className={`w-full bg-zinc-800 border ${
                    errors.link ? "border-red-500" : "border-zinc-700"
                  } rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors`}
                />
                <p className="text-xs text-gray-500 mt-2">
                  GitHub repository yoki Vercel deployment havolasini kiriting
                </p>
                {errors.link && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    {errors.link}
                  </p>
                )}
              </div>

              {/* Comment Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-300">
                  <MessageSquare className="w-4 h-4" />
                  Izoh ({formData.comment.length}/200)
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  maxLength={200}
                  rows={4}
                  placeholder="Loyiha haqida qisqacha izoh..."
                  className={`w-full bg-zinc-800 border ${
                    errors.comment ? "border-red-500" : "border-zinc-700"
                  } rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors resize-none`}
                />
                {errors.comment && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    {errors.comment}
                  </p>
                )}
              </div>

              {/* Server Error */}
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm"
                >
                  {serverError}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Yuborish
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Footer Tips */}
        <div className="mt-8 bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <h3 className="font-semibold mb-3 text-gray-200">Maslahatlar</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">•</span>
              <span>Repository public bo'lishi kerak</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">•</span>
              <span>README.md faylida loyiha haqida ma'lumot bo'lsin</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">•</span>
              <span>Kod toza va tushunarli bo'lishi muhim</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}