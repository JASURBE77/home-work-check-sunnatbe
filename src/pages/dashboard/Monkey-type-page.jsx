import React, { useEffect, useState } from "react";

const WORDS = [
  "react", "javascript", "frontend", "tailwind", "component",
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

// Keyboard Component
const Keyboard = ({ pressedKey }) => {
  const keyMap = {
    'Escape': 'esc',
    'Backspace': 'delete',
    'Tab': 'tab',
    'CapsLock': 'caps lock',
    'Enter': 'return',
    'Shift': 'shift',
    ' ': 'space',
  };

  const isKeyPressed = (keyLabel) => {
    if (!pressedKey) return false;
    const normalizedPressed = keyMap[pressedKey] || pressedKey.toLowerCase();
    const normalizedLabel = keyLabel.toLowerCase();
    
    if (normalizedLabel === 'space' && pressedKey === ' ') return true;
    if (normalizedLabel === 'shift' && pressedKey === 'Shift') return true;
    
    return normalizedPressed === normalizedLabel;
  };

  const KeyButton = ({ children, className = "", special = false }) => (
    <div className={`
      ${special ? 'bg-gray-200' : 'bg-white'} 
      border border-gray-300 rounded-lg shadow-sm
      min-w-[35px] text-center px-2 py-2
      text-xs font-medium text-gray-700
      transition-all duration-75
      ${isKeyPressed(children) ? 'bg-blue-400 text-white scale-95 shadow-inner' : 'hover:bg-gray-50'}
      ${className}
    `}>
      {children}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 p-5 rounded-2xl shadow-lg w-full max-w-[600px] mx-auto select-none">
      {/* Row 1: Function Keys */}
      <div className="flex gap-1 mb-1">
        <KeyButton special>esc</KeyButton>
        {['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].map(k => (
          <KeyButton key={k} special>{k}</KeyButton>
        ))}
        <KeyButton special className="ml-3">⏏</KeyButton>
      </div>

      {/* Row 2: Numbers */}
      <div className="flex gap-1 mb-1">
        {['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].map(k => (
          <KeyButton key={k}>{k}</KeyButton>
        ))}
        <KeyButton special className="px-5">delete</KeyButton>
      </div>

      {/* Row 3: QWERTY */}
      <div className="flex gap-1 mb-1">
        <KeyButton special className="px-4">tab</KeyButton>
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'].map(k => (
          <KeyButton key={k}>{k}</KeyButton>
        ))}
        <KeyButton className="px-3">\</KeyButton>
      </div>

      {/* Row 4: ASDF */}
      <div className="flex gap-1 mb-1">
        <KeyButton special className="px-3">caps lock</KeyButton>
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"].map(k => (
          <KeyButton key={k}>{k}</KeyButton>
        ))}
        <KeyButton special className="flex-1">return</KeyButton>
      </div>

      {/* Row 5: ZXCV */}
      <div className="flex gap-1 mb-1">
        <KeyButton special className="px-8">shift</KeyButton>
        {['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'].map(k => (
          <KeyButton key={k}>{k}</KeyButton>
        ))}
        <KeyButton special className="flex-1">shift</KeyButton>
      </div>

      {/* Row 6: Bottom */}
      <div className="flex gap-1">
        <KeyButton special>fn</KeyButton>
        <KeyButton special>ctrl</KeyButton>
        <KeyButton special>⌥</KeyButton>
        <KeyButton special>⌘</KeyButton>
        <KeyButton className="flex-[5]">space</KeyButton>
        <KeyButton special>⌘</KeyButton>
        <KeyButton special>⌥</KeyButton>
        <KeyButton special>◀</KeyButton>
        <KeyButton special>▼</KeyButton>
        <KeyButton special>▲</KeyButton>
        <KeyButton special>▶</KeyButton>
      </div>
    </div>
  );
};

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
  const [pressedKey, setPressedKey] = useState(null);

  const progress = Math.min(100, Math.round((index / wordPool.length) * 100));

  // Timer
  useEffect(() => {
    let timer;
    if (started && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
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
  }

  function finishSession() {
    setStarted(false);
    setFinished(true);
  }

  // Fizik klaviatura event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      setPressedKey(e.key);

      // Agar hali boshlanmagan bo'lsa va biror harf bosilgan bo'lsa, start qil
      if (!started && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        startSession(duration);
      }

      // Escape - reset
      if (e.key === "Escape") {
        setStarted(false);
        setInput("");
        setTimeLeft(duration);
        setFinished(false);
        return;
      }

      if (!started) return;

      // Backspace
      if (e.key === "Backspace") {
        e.preventDefault();
        setInput((prev) => prev.slice(0, -1));
      } 
      // Space yoki Enter - so'zni tasdiqlash
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const typed = input.trim();
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
      } 
      // Oddiy belgilar
      else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setInput((prev) => prev + e.key);
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [input, started, duration, index, wordPool]);

  const currentWord = wordPool[index] || "";

  function renderWord(word, typed) {
    const chars = word.split("");
    const typedChars = typed || "";
    return (
      <div className="flex flex-wrap gap-0.5 items-center justify-center">
        {chars.map((ch, i) => {
          const typedCh = typedChars[i];
          const isCorrect = typedCh === ch;
          const isTyped = typeof typedCh !== "undefined";
          const color = isTyped ? (isCorrect ? "text-green-500" : "text-red-500") : "text-gray-500";
          return (
            <span key={i} className={`inline-block px-1 py-0.5 rounded font-mono text-2xl ${color}`}>
              {ch}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex flex-col items-center text-white">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              MonkeyType Practice
            </h1>
            <div className="space-x-2">
              <button onClick={() => startSession(30)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition">30s</button>
              <button onClick={() => startSession(60)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition">60s</button>
              <button onClick={() => startSession(120)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition">120s</button>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl mb-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Time</div>
              <div className="text-3xl font-bold text-blue-400">{timeLeft}s</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">WPM</div>
              <div className="text-3xl font-bold text-green-400">{wpm}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Accuracy</div>
              <div className="text-3xl font-bold text-purple-400">{accuracy}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Words</div>
              <div className="text-3xl font-bold text-yellow-400">{correctWords}</div>
            </div>
          </div>
        </div>

        {/* Typing Area */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl mb-6">
          <div className="text-sm text-gray-400 mb-4 text-center">
            {!started && !finished ? "Start typing to begin..." : started ? "Type the highlighted word:" : "Session finished!"}
          </div>
          
          <div className="bg-gray-900/50 p-6 rounded-xl min-h-[180px] flex flex-col justify-center mb-4">
            {/* Next words preview */}
            <div className="mb-6 flex flex-wrap gap-3 justify-center">
              {wordPool.slice(index, index + 8).map((w, i) => (
                <span
                  key={`${w}-${i}`}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    i === 0 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105" 
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {w}
                </span>
              ))}
            </div>

            {/* Current word being typed */}
            <div className="mt-2 mb-4">
              {renderWord(currentWord, input)}
            </div>

            {/* Visual input representation */}
            <div className="text-center">
              <div className="inline-block px-6 py-3 bg-gray-800 border-2 border-gray-600 rounded-lg min-w-[300px]">
                <span className="text-xl font-mono text-white">{input || "_"}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-2 text-sm text-gray-400 flex justify-between">
            <span>Progress: {progress}%</span>
            <span>Typed: {totalTyped} chars</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Keyboard */}
        <Keyboard pressedKey={pressedKey} />

        <footer className="mt-8 text-center text-gray-500 text-sm">
          Press any key to start · ESC to reset · Space to confirm word
        </footer>
      </div>
    </div>
  );
}