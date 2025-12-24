import React, { useEffect, useState } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Rating = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8080/top");
        const data = await res.json();

        const sorted = [...data].sort((a, b) => b.wpm - a.wpm);

        setUsers(sorted.slice(0, 5));
      } catch (err) {
        console.error("Fetch users error:", err);
      }
    };

    fetchUsers();
  }, []);

  const labels = users.map((u) => u.name);
  const dataValues = users.map((u) => u.wpm);

  const data = {
    labels,
    datasets: [
      {
        label: "WPM",
        data: dataValues,
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} WPM`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.1)" },
        ticks: { font: { weight: "500" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.1)" },
        ticks: { font: { weight: "500" } },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto mt-10 p-6 rounded-xl shadow-lg"
      style={{ height: "400px" }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        🏆 Top 5 WPM Typers
      </h2>

      {users.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p className="text-center opacity-60">Maʼlumot topilmadi</p>
      )}
    </motion.div>
  );
};

export default Rating;
