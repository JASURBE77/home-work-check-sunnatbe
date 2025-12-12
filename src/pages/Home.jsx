import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Home() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial="hidden"
      animate="show"
      className="px-4 mt-4 w-full mb-30"
    >
      <motion.div
        variants={fadeIn}
        className="w-full bg-base-100 p-6 rounded-2xl shadow-xl space-y-7"
      >
        <motion.h1 variants={fadeIn} className="font-bold text-3xl mb-3">
          {t("hello_jasur")}
        </motion.h1>

        <motion.h2 variants={fadeIn} className="text-2xl font-bold">
          {t("progress_title")}
        </motion.h2>

        <motion.div variants={fadeIn} className="space-y-5 mt-4">
          <div className="bg-base-100 p-4 rounded-xl shadow-inner">
            <p className="font-semibold mb-2">{t("homework_progress")}</p>
            <progress
              className="progress progress-error w-full h-4"
              value="86"
              max="100"
            ></progress>
          </div>

          <div className="bg-base-100 p-4 rounded-xl shadow-inner">
            <p className="font-semibold mb-2">{t("quality_progress")}</p>
            <progress
              className="progress progress-success w-full h-4"
              value="88.3"
              max="100"
            ></progress>
          </div>

          <div className="bg-base-100 p-4 rounded-xl shadow-inner">
            <div className="flex justify-between mb-2">
              <p className="font-semibold">{t("overall_progress")}</p>
              <span className="font-bold text-warning">52.2%</span>
            </div>
            <progress
              className="progress progress-warning w-full h-4"
              value="52.2"
              max="100"
            ></progress>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="grid sm:grid-cols-3 gap-4 mt-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-base-100 p-4 rounded-xl shadow-md flex flex-col items-center"
          >
            <div className="badge badge-error badge-lg mb-2"></div>
            <p className="font-bold">0-50%</p>
            <p className="text-sm opacity-70">{t("status_bad")}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-base-100 p-4 rounded-xl shadow-md flex flex-col items-center"
          >
            <div className="badge badge-warning badge-lg mb-2"></div>
            <p className="font-bold">50-80%</p>
            <p className="text-sm opacity-70">{t("status_ok")}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-base-100 p-4 rounded-xl shadow-md flex flex-col items-center"
          >
            <div className="badge badge-success badge-lg mb-2"></div>
            <p className="font-bold">80-100%</p>
            <p className="text-sm opacity-70">{t("status_good")}</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
