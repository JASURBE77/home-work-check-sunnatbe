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
      {/* Greeting Card */}
      <motion.div
        variants={fadeIn}
        className="w-full bg-base-100 p-6 rounded-2xl shadow-xl text-center space-y-4"
      >
        <motion.h1 variants={fadeIn} className="font-bold text-3xl sm:text-2xl">
          {t("hello_jasur")}
        </motion.h1>
        <motion.p variants={fadeIn} className="text-lg opacity-70">
          {t("welcome_home_text", "Welcome back! Here’s your dashboard overview.")}
        </motion.p>
      </motion.div>

      {/* Quick Links / Features */}
      <motion.div
        variants={fadeIn}
        className="grid sm:grid-cols-3 gap-4 mt-6"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-base-100 p-4 rounded-xl shadow-md h-32 flex flex-col items-center justify-center"
        >
          <p className="font-bold text-lg">{t("feature_1", "Assignments")}</p>
          <p className="text-sm opacity-70">{t("feature_1_desc", "View & manage your homework")}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-base-100 p-4 rounded-xl shadow-md h-32 flex flex-col items-center justify-center"
        >
          <p className="font-bold text-lg">{t("feature_2", "Progress")}</p>
          <p className="text-sm opacity-70">{t("feature_2_desc", "Check your learning progress")}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-base-100 p-4 rounded-xl shadow-md h-32 flex flex-col items-center justify-center"
        >
          <p className="font-bold text-lg">{t("feature_3", "Resources")}</p>
          <p className="text-sm opacity-70">{t("feature_3_desc", "Access helpful study materials")}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
