import React, { useEffect, useRef, useState } from "react";
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

const WORDS = [
  "react", "javascript", "frontend", "daisyui", "tailwind", "component",
  "props", "state", "hook", "function", "variable", "network", "design",
  "responsive", "performance", "optimize", "animation", "framer", "motion",
  "keyboard", "challenge", "practice", "speed", "accuracy", "developer",
  "portfolio", "project", "testing", "deploy", "session", "random",
];

function randomWords(count = 50) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return arr;
}

export default function MonkeyTypePage() {
  const [wordPool, setWordPool] = useState(() => randomWords(120));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [duration, setDuration] = useState(60);
  const [finished, setFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedResult, setSavedResult] = useState(null);
  
  const inputRef = useRef(null);
  const progress = Math.min(100, Math.round((index / wordPool.length) * 100));

  // Leaderboard ni yuklash
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
<<<<<<< HEAD
      const res = await fetch("http://localhost:8080/top");
      const data = await res.json();
      setLeaderboard(data); // backend faqat array qaytaradi
=======
      const res = await fetch("http://localhost:8080/api/users/typing/leaderboard");
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.data);
      }
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
    } catch (err) {
      console.error("Leaderboard yuklashda xatolik:", err);
    }
  };

  // Timer
  useEffect(() => {
    let timer;
    if (started && timeLeft > 0) {
<<<<<<< HEAD
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
=======
      timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
    } else if (timeLeft === 0 && started) {
      finishSession();
    }
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  // WPM va accuracy hisoblash
  useEffect(() => {
    setWpm(Math.round((correctChars / 5) / ((duration - timeLeft || 1) / 60)));
    setAccuracy(totalTyped ? Math.max(0, Math.round((correctChars / totalTyped) * 100)) : 100);
  }, [correctChars, totalTyped, timeLeft, duration]);

  function startSession(seconds = 60) {
    setDuration(seconds);
    setTimeLeft(seconds);
    setStarted(true);
    setFinished(false);
    setIndex(0);
    setInput("");
    setCorrectChars(0);
    setTotalTyped(0);
    setCorrectWords(0);
    setWordPool(randomWords(120));
    setShowSuccessModal(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function finishSession() {
    setStarted(false);
    setFinished(true);
    setTimeout(() => inputRef.current?.blur(), 50);
<<<<<<< HEAD
    await saveResult(wpm);
  }

  const saveResult = async (finalWpm) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      const res = await fetch("http://localhost:8080/addtyping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          userId,
          wpm: finalWpm
        })
      });

      const data = await res.json();
      setSavedResult(data);
      setShowSuccessModal(true);
      fetchLeaderboard();
    } catch (err) {
      console.error("Typing saqlashda xatolik:", err);
=======
    
    // Natijani serverga yuborish
    await saveResult(wpm, accuracy);
  }

  const saveResult = async (finalWpm, finalAccuracy) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        console.log("Login qilmagan foydalanuvchi");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/users/typing/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          wp: finalWpm,
          accuracy: finalAccuracy 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSavedResult(data);
        setShowSuccessModal(true);
        // Leaderboard ni yangilash
        fetchLeaderboard();
      }
    } catch (error) {
      console.error("Natijani saqlashda xatolik:", error);
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
    }
  };

  function handleInputChange(e) {
    const value = e.target.value;

<<<<<<< HEAD
    if (!started && value.length > 0) startSession(duration);
=======
    if (!started && value.length > 0) {
      startSession(duration);
    }
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d

    if (value.endsWith(" ") || value.endsWith("\n")) {
      const typed = value.trim();
      const target = wordPool[index] || "";
      setTotalTyped((t) => t + typed.length + 1);
      
      let matchChars = 0;
      for (let i = 0; i < Math.min(typed.length, target.length); i++) {
        if (typed[i] === target[i]) matchChars++;
      }
      setCorrectChars((c) => c + matchChars);
      if (typed === target) setCorrectWords((w) => w + 1);

      setIndex((i) => i + 1);
      setInput("");
      return;
    }

    setInput(value);
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setStarted(false);
      setInput("");
      setTimeLeft(duration);
    }
  }

  const currentWord = wordPool[index] || "";

  function renderWord(word, typed) {
    const chars = word.split("");
    const typedChars = typed || "";
    return (
      <div className="flex flex-wrap gap-0.5 items-center">
        {chars.map((ch, i) => {
          const typedCh = typedChars[i];
          const isCorrect = typedCh === ch;
          const isTyped = typeof typedCh !== "undefined";
          const base = isTyped ? (isCorrect ? "text-success" : "text-error") : "text-base-content/60";
          return (
            <span
              key={i}
              className={`inline-block px-1 py-0.5 rounded-md font-mono ${base} bg-transparent`}
            >
              {ch}
            </span>
          );
        })}
      </div>
    );
  }

  // Chart uchun data
  const chartData = {
<<<<<<< HEAD
    labels: leaderboard.map((u) => u.name),
    datasets: [
      {
        label: "WPM",
        data: leaderboard.map((u) => u.wpm),
=======
    labels: leaderboard.map((u) => u.name + (u.surname ? ` ${u.surname}` : '')),
    datasets: [
      {
        label: "WPM",
        data: leaderboard.map((u) => u.wp),
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        pointRadius: 6,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        borderWidth: 3,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed.y} WPM`
        }
      },
    },
    scales: {
      x: { 
<<<<<<< HEAD
        ticks: { color: '#9ca3af', font: { size: 12, weight: '500' } },
=======
        ticks: { 
          color: '#9ca3af',
          font: { size: 12, weight: '500' } 
        },
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
        grid: { color: 'rgba(156, 163, 175, 0.1)' }
      },
      y: { 
        beginAtZero: true,
<<<<<<< HEAD
        ticks: { color: '#9ca3af', font: { size: 12, weight: '500' } },
=======
        ticks: { 
          color: '#9ca3af',
          font: { size: 12, weight: '500' } 
        },
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
        grid: { color: 'rgba(156, 163, 175, 0.1)' }
      },
    },
    animation: { duration: 1000, easing: "easeOutQuart" },
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 flex flex-col items-center">
      <div className="w-full max-w-5xl">
<<<<<<< HEAD
        {/* Header */}
        <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold">MonkeyType — Practice</h1>
            <div className="space-x-2">
              <button onClick={() => startSession(30)} className="btn btn-sm btn-outline">30s</button>
              <button onClick={() => startSession(60)} className="btn btn-sm btn-primary">60s</button>
              <button onClick={() => startSession(120)} className="btn btn-sm btn-ghost">120s</button>
=======
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold">MonkeyType — Practice</h1>
            <div className="space-x-2">
              <button
                onClick={() => startSession(30)}
                className="btn btn-sm btn-outline"
              >
                30s
              </button>
              <button
                onClick={() => startSession(60)}
                className="btn btn-sm btn-primary"
              >
                60s
              </button>
              <button
                onClick={() => startSession(120)}
                className="btn btn-sm btn-ghost"
              >
                120s
              </button>
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
            </div>
          </div>
        </motion.header>

<<<<<<< HEAD
        {/* Main */}
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white/5 p-6 rounded-2xl shadow-md">
            {/* Timer, WPM, Accuracy, Buttons */}
            <div className="flex sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <div><div className="text-sm opacity-70">Time</div><div className="text-2xl font-bold">{timeLeft}s</div></div>
              <div><div className="text-sm opacity-70">WPM</div><div className="text-2xl font-bold">{wpm}</div></div>
              <div><div className="text-sm opacity-70">Accuracy</div><div className="text-2xl font-bold">{accuracy}%</div></div>
              <div className="ml-auto">
                {!started && !finished ? (
                  <button onClick={() => startSession(duration)} className="btn btn-primary">Start</button>
                ) : started ? (
                  <button onClick={finishSession} className="btn btn-error">Stop</button>
                ) : (
                  <button onClick={() => startSession(duration)} className="btn btn-success">Restart</button>
=======
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left: main game */}
          <section className="lg:col-span-2 bg-white/5 p-6 rounded-2xl shadow-md">
            <div className="flex sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <div>
                <div className="text-sm opacity-70">Time</div>
                <div className="text-2xl font-bold">{timeLeft}s</div>
              </div>

              <div>
                <div className="text-sm opacity-70">WPM</div>
                <div className="text-2xl font-bold">{wpm}</div>
              </div>

              <div>
                <div className="text-sm opacity-70">Accuracy</div>
                <div className="text-2xl font-bold">{accuracy}%</div>
              </div>

              <div className="ml-auto">
                {!started && !finished ? (
                  <button
                    onClick={() => startSession(duration)}
                    className="btn btn-primary"
                  >
                    Start
                  </button>
                ) : started ? (
                  <button onClick={finishSession} className="btn btn-error">
                    Stop
                  </button>
                ) : (
                  <button onClick={() => startSession(duration)} className="btn btn-success">
                    Restart
                  </button>
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
                )}
              </div>
            </div>

<<<<<<< HEAD
            {/* Word Typing */}
            <div className="mb-4">
              <div className="text-sm opacity-60 mb-2">Type the highlighted word:</div>
              <div className="bg-base-100 p-4 rounded-lg min-h-[96px] flex flex-col justify-center">
                <div className="mb-2 flex flex-wrap gap-2 items-center">
                  {wordPool.slice(index, index + 10).map((w, i) => (
                    <motion.span
                      key={`${w}-${i}`}
                      initial={{ opacity: 0.6, scale: 0.98 }}
                      animate={{ opacity: 1, scale: i === 0 ? 1.02 : 1 }}
                      className={`px-3 py-1 rounded-md font-medium ${i === 0 ? "bg-primary text-primary-content" : "bg-base-100 text-base-content/70"}`}
                    >
                      {w}
                    </motion.span>
                  ))}
                </div>
                <div className="mt-2 text-lg sm:text-2xl font-mono">{renderWord(currentWord, input)}</div>
=======
            <div className="mb-4">
              <div className="text-sm opacity-60 mb-2">Type the highlighted word:</div>

              <div className="bg-base-100 p-4 rounded-lg min-h-[96px] flex flex-col justify-center">
                <div className="mb-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    {wordPool.slice(index, index + 10).map((w, i) => (
                      <motion.span
                        key={`${w}-${i}`}
                        initial={{ opacity: 0.6, scale: 0.98 }}
                        animate={{ opacity: 1, scale: i === 0 ? 1.02 : 1 }}
                        className={`px-3 py-1 rounded-md font-medium ${i === 0 ? "bg-primary text-primary-content" : "bg-base-100 text-base-content/70"}`}
                      >
                        {w}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-lg sm:text-2xl font-mono">
                    {renderWord(currentWord, input)}
                  </div>
                </div>

>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
                <input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Start typing..."
                  className="input input-bordered w-full mt-4 bg-transparent"
                  disabled={!started && finished}
                />
              </div>
            </div>

<<<<<<< HEAD
            {/* Progress */}
            <div className="mt-2">
              <div className="text-sm opacity-70 mb-1">Progress</div>
              <progress className="progress progress-primary w-full" value={progress} max="100"></progress>
            </div>
          </section>

          {/* Right Sidebar */}
=======
            <div className="mt-2">
              <div className="text-sm opacity-70 mb-1">Progress</div>
              <progress
                className="progress progress-primary w-full"
                value={progress}
                max="100"
              ></progress>
            </div>
          </section>

          {/* Right: stats & leaderboard */}
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
          <aside className="bg-white/5 p-4 rounded-2xl shadow-md">
            <div className="mb-4">
              <div className="text-sm opacity-60">Stats</div>
              <div className="flex flex-col gap-2 mt-2">
<<<<<<< HEAD
                <div className="flex justify-between"><span className="opacity-80">Typed chars</span><span className="font-medium">{totalTyped}</span></div>
                <div className="flex justify-between"><span className="opacity-80">Correct chars</span><span className="font-medium">{correctChars}</span></div>
                <div className="flex justify-between"><span className="opacity-80">Correct words</span><span className="font-medium">{correctWords}</span></div>
                <div className="flex justify-between"><span className="opacity-80">Session length</span><span className="font-medium">{duration}s</span></div>
=======
                <div className="flex justify-between">
                  <span className="opacity-80">Typed chars</span>
                  <span className="font-medium">{totalTyped}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Correct chars</span>
                  <span className="font-medium">{correctChars}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Correct words</span>
                  <span className="font-medium">{correctWords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Session length</span>
                  <span className="font-medium">{duration}s</span>
                </div>
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
              </div>
            </div>

            <div className="divider" />
<<<<<<< HEAD
            <div className="mb-4">
              <div className="text-sm opacity-60">Theme</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => document.documentElement.setAttribute("data-theme", "light")} className="btn btn-ghost btn-sm">Light</button>
                <button onClick={() => document.documentElement.setAttribute("data-theme", "dark")} className="btn btn-ghost btn-sm">Dark</button>
=======

            <div className="mb-4">
              <div className="text-sm opacity-60">Theme</div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => document.documentElement.setAttribute("data-theme", "light")}
                  className="btn btn-ghost btn-sm"
                >
                  Light
                </button>
                <button
                  onClick={() => document.documentElement.setAttribute("data-theme", "dark")}
                  className="btn btn-ghost btn-sm"
                >
                  Dark
                </button>
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
              </div>
            </div>

            <div className="divider" />
<<<<<<< HEAD
=======

>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
            <div>
              <div className="text-sm opacity-60">Quick tips</div>
              <ul className="list-disc pl-5 mt-2 text-sm opacity-80">
                <li>Use home row and avoid looking at keyboard</li>
                <li>Type whole word then press space</li>
                <li>Press Esc to reset current session</li>
              </ul>
            </div>
          </aside>
        </motion.main>

        {/* Leaderboard Chart */}
        {leaderboard.length > 0 && (
<<<<<<< HEAD
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 bg-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">🏆 Top WP Typers</h2>
=======
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-white/5 p-6 rounded-2xl shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">🏆 Top 5 WP Typers</h2>
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </motion.div>
        )}

        {/* Success Modal */}
        {showSuccessModal && savedResult && (
<<<<<<< HEAD
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowSuccessModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-base-200 p-8 rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <div className="text-6xl mb-4">{savedResult.message && savedResult.message.includes('rekord') ? '🎉' : '✅'}</div>
                <h3 className="text-2xl font-bold mb-2">{savedResult.message || 'Natija saqlandi'}</h3>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between"><span className="opacity-70">Your WPM:</span><span className="font-bold">{wpm}</span></div>
                  {savedResult.data?.bestWP && (<div className="flex justify-between"><span className="opacity-70">Best WPM:</span><span className="font-bold text-success">{savedResult.data.bestWP}</span></div>)}
                </div>
                <button onClick={() => setShowSuccessModal(false)} className="btn btn-primary mt-6 w-full">Continue</button>
=======
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-base-200 p-8 rounded-2xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {savedResult.message && savedResult.message.includes('rekord') ? '🎉' : '✅'}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {savedResult.message || 'Natija saqlandi'}
                </h3>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span className="opacity-70">Your WPM:</span>
                    <span className="font-bold">{wpm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Accuracy:</span>
                    <span className="font-bold">{accuracy}%</span>
                  </div>
                  {savedResult.data?.bestWP && (
                    <div className="flex justify-between">
                      <span className="opacity-70">Best WPM:</span>
                      <span className="font-bold text-success">{savedResult.data.bestWP}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="btn btn-primary mt-6 w-full"
                >
                  Continue
                </button>
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
              </div>
            </motion.div>
          </motion.div>
        )}

        <footer className="mt-6 text-center opacity-70 text-sm">
          Made with ❤️ · DaisyUI + Tailwind + Framer Motion
        </footer>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
