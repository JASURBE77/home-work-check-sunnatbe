import React, { useState, useEffect } from "react";

const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "cyberpunk"
  );

  // theme ni html ga qo‘llash
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="p-4 max-w-sm">

      <select
        className="select select-bordered w-full"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        {THEMES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
