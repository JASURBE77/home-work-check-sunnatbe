import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Send, Link as LinkIcon, MessageSquare, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { sendHomework, resetSendState } from "../../store/slice/submissionsSlice";

const INITIAL_FORM = { type: "github", link: "", comment: "" };

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
  const dispatch = useDispatch();

  const { sendLoading, sendError, sendSuccess } = useSelector((state) => state.submissions);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  // sendSuccess bo'lganda formni tozalash va 5 soniyadan so'ng reset
  useEffect(() => {
    if (sendSuccess) {
      setFormData(INITIAL_FORM);
      setErrors({});
      const timer = setTimeout(() => dispatch(resetSendState()), 5000);
      return () => clearTimeout(timer);
    }
  }, [sendSuccess, dispatch]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.link.trim()) {
      newErrors.link = "Link kiritish majburiy";
    } else if (!isValidUrl(formData.link)) {
      newErrors.link = "Yaroqli URL kiriting";
    }
    if (!formData.comment.trim()) {
      newErrors.comment = "Izoh kiritish majburiy";
    } else if (formData.comment.length > 200) {
      newErrors.comment = "Izoh 200 belgidan oshmasligi kerak";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [errors]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(sendHomework({ link: formData.link, comment: formData.comment }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center p-5 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        {/* ── HEADER ── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <Upload size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Uy vazifasini yuborish
            </h1>
          </div>
          <p className="text-sm text-slate-400 ml-[52px]">
            GitHub yoki Vercel orqali loyihangizni yuboring
          </p>
        </div>

        {/* ── MAIN CARD ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {sendSuccess ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 px-6 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4 border border-green-100">
                <CheckCircle size={28} className="text-green-500" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Muvaffaqiyatli yuborildi!
              </h2>
              <p className="text-sm text-slate-400">Uy vazifangiz ko'rib chiqiladi</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Type */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <Upload size={13} />
                  Topshiriq turi
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer"
                >
                  <option value="github">GitHub</option>
                  <option value="vercel">Vercel</option>
                </select>
              </div>

              {/* Link */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <LinkIcon size={13} />
                  Loyiha havolasi
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 transition-all
                    ${errors.link
                      ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                />
                {errors.link ? (
                  <p className="text-red-500 text-xs mt-1.5">{errors.link}</p>
                ) : (
                  <p className="text-xs text-slate-400 mt-1.5">
                    GitHub repository yoki Vercel deployment havolasini kiriting
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare size={13} />
                    Izoh
                  </span>
                  <span className={`normal-case font-normal tracking-normal ${formData.comment.length > 180 ? "text-red-400" : "text-slate-400"}`}>
                    {formData.comment.length}/200
                  </span>
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  maxLength={200}
                  rows={4}
                  placeholder="Loyiha haqida qisqacha izoh..."
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 transition-all resize-none
                    ${errors.comment
                      ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                />
                {errors.comment && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.comment}</p>
                )}
              </div>

              {/* Server error */}
              {sendError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm"
                >
                  {sendError}
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={sendLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {sendLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Yuborish
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* ── TIPS ── */}
        <div className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-[13px] font-semibold text-slate-700 mb-3">💡 Maslahatlar</h3>
          <ul className="space-y-2">
            {[
              "Repository public bo'lishi kerak",
              "README.md faylida loyiha haqida ma'lumot bo'lsin",
              "Kod toza va tushunarli bo'lishi muhim",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}