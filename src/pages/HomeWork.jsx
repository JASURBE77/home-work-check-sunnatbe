import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Send, Github, Globe, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HouseDonationPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ githubLink: '', vercelLink: '', comment: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.githubLink.trim()) newErrors.githubLink = t('homework.errors.githubRequired');
    else if (!formData.githubLink.includes('github.com')) newErrors.githubLink = t('homework.errors.githubInvalid');

    if (!formData.vercelLink.trim()) newErrors.vercelLink = t('homework.errors.vercelRequired');
    else if (!formData.vercelLink.includes('vercel.app') && !formData.vercelLink.includes('vercel.com'))
      newErrors.vercelLink = t('homework.errors.vercelInvalid');

    if (!formData.comment.trim()) newErrors.comment = t('homework.errors.commentRequired');
    else if (formData.comment.length > 50) newErrors.comment = t('homework.errors.commentMax');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      console.log('Jonatilgan ma\'lumotlar:', formData);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ githubLink: '', vercelLink: '', comment: '' });
      }, 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-screen bg-base-100 rounded-2xl flex items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-4 shadow-lg">
            <Home className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-2">{t('homework.title')}</h1>
          <p className="text-primary-content text-lg">{t('homework.description')}</p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="card bg-base-100 shadow-xl rounded-3xl p-6 md:p-8 border border-base-300 w-full"
        >
          {submitted ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success rounded-full mb-4">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-base-content mb-2">{t('homework.messages.success')}</h2>
              <p className="text-primary-content">{t('homework.messages.successDetail')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 w-full flex flex-col justify-center">
              {/* GitHub Link */}
              <div>
                <label className="flex items-center gap-2 text-base-content font-semibold mb-2">
                  <Github className="w-5 h-5" /> 
                  <Globe />
                </label>
                <input
                  type="text"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                  className="input input-bordered w-full bg-base-100 border-base-300 text-base-content placeholder:text-base-content/50 focus:ring-primary"
                />
                {errors.githubLink && <p className="text-error text-sm mt-1">{errors.githubLink}</p>}
              </div>

  

              {/* Comment */}
              <div>
                <label className="flex items-center gap-2 text-base-content font-semibold mb-2">
                  <MessageSquare className="w-5 h-5" /> {t('homework.labels.comment')} ({formData.comment.length}/50)
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  maxLength={50}
                  placeholder={t('homework.labels.comment')}
                  rows={3}
                  className="textarea textarea-bordered w-full bg-base-100 border-base-300 text-base-content placeholder:text-base-content/50 focus:ring-primary resize-none"
                />
                {errors.comment && <p className="text-error text-sm mt-1">{errors.comment}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full gap-2 justify-center mt-auto"
              >
                <Send className="w-5 h-5" /> {t('homework.buttons.submit')}
              </button>
            </form>
          )}
        </motion.div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-base-content/70 text-sm">
          {t('homework.messages.footer')}
        </div>
      </div>
    </motion.div>
  );
}
