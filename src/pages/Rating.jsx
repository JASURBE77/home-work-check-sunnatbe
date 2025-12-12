import React from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// Dummy user data
const users = [
  { name: "Jasur", wp: 9100 },
  { name: "Yahyo", wp: 500 },
  { name: "Oybe", wp: 850 },
  { name: "sardor", wp: 759 },
  { name: "aziz", wp: 820 },
];

// Sort users by wp descending
const sortedUsers = [...users].sort((a, b) => b.wp - a.wp);

// Extract labels and data
const labels = sortedUsers.map((user) => user.name);
const dataValues = sortedUsers.map((user) => user.wp);

const Rating = () => {
  // Get current theme colors from CSS variables
  const rootStyles = getComputedStyle(document.documentElement);

  const gridColor = "rgba(255,255,255,0.1)";

  const data = {
    labels,
    datasets: [
      {
        label: "WP Count",
        data: dataValues,
        pointRadius: 5,
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        ticks: { font: { weight: "500" } },
        grid: { color: gridColor },
      },
      y: {
        beginAtZero: true,
        ticks: { font: { weight: "500" } },
        grid: { color: gridColor },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-3xl mx-auto mt-10 p-6 rounded-xl shadow-lg "
      style={{ height: "400px" }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        📊 Top 5 WP typerlari
      </h2>
      <div className="w-full h-full">
        <Line data={data} options={options} />
      </div>
    </motion.div>
  );
};

export default Rating;
