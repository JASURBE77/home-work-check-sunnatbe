import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Home, Send, Github, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import api from '../utils/api';

const INITIAL_FORM = {
  link: '',
  comment: '',
};

export default function HouseDonationPage() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');


  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.link.trim()) {
      newErrors.link = 'Link kiritish majburiy';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = t('homework.errors.commentRequired');
    } else if (formData.comment.length > 50) {
      newErrors.comment = t('homework.errors.commentMax');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  // --------------------
  // API
  // --------------------
  // Tokenni store'dan olish
const token = useSelector((state) => state.auth.token);  // Redux'dan tokenni olish

const postFetch = async () => {
  setLoading(true);
  setServerError('');

  try {
    const res = await api({
      url: '/postHomeWork',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        HwLink: formData.link,       // ⚡ backendga mos
        description: formData.comment,
      },
    });

    // axios ishlatsa:
    if (res.status !== 201) {
      throw new Error(res.data?.message || 'Xato yuz berdi');
    }

    setSubmitted(true);
    setFormData(INITIAL_FORM);
    setTimeout(() => setSubmitted(false), 3000);
  } catch (err) {
    console.error(err);
    setServerError(err.message || 'Server bilan ulanishda xatolik yuz berdi');
  } finally {
    setLoading(false);
  }
};

  // --------------------
  // Handlers
  // --------------------
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await postFetch();
    }
  };

  // --------------------
  // UI
  // --------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-auto bg-base-100 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFB608] rounded-2xl mb-4 shadow-lg">
            <Home className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {t('homework.title')}
          </h1>
          <p className="text-base-content/70 text-lg">
            {t('homework.description')}
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="card bg-base-100 shadow-xl rounded-3xl p-6 md:p-8 "
        >
          {submitted ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success rounded-full mb-4">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {t('homework.messages.success')}
              </h2>
              <p className="text-base-content/70">
                {t('homework.messages.successDetail')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Link */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2">
                  <Github className="w-5 h-5" />
                  Link
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="input input-bordered w-full"
                />
                {errors.link && (
                  <p className="text-error text-sm mt-1">
                    {errors.link}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2">
                  <MessageSquare className="w-5 h-5" />
                  {t('homework.labels.comment')} ({formData.comment.length}/50)
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  maxLength={50}
                  rows={3}
                  className="textarea textarea-bordered w-full resize-none"
                />
                {errors.comment && (
                  <p className="text-error text-sm mt-1">
                    {errors.comment}
                  </p>
                )}
              </div>

              {serverError && (
                <p className="text-error text-sm text-center">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn bg-[#FFB608] text-white w-full gap-2 disabled:opacity-60"
              >
                {loading ? 'Yuborilmoqda...' : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('homework.buttons.submit')}
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        <p className="mt-6 text-center text-sm text-base-content/60">
          {t('homework.messages.footer')}
        </p>
      </div>
    </motion.div>
  );
}
