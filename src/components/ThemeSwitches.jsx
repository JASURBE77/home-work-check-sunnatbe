import React, { useState, useEffect } from "react";

<<<<<<< HEAD
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
=======
export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("cyberpunk");

  const themeNames = [
    "light", "dark", "cupcake", "bumblebee", "emerald", 
    "corporate", "synthwave", "retro", "cyberpunk",
    "valentine", "halloween", "garden", "forest"
  ];

  // Tanlangan theme ni document ga qo‘llash
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="p-4">
      <label className="block mb-2 font-semibold">Select Theme</label>
      <select
        className="select select-bordered w-full max-w-xs"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        {themeNames.map((t) => (
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
<<<<<<< HEAD
=======

      <div className="mt-4 p-4 border rounded-lg bg-base-100 text-base-content">
        <h1 className="text-xl font-bold">Current theme: {theme}</h1>
        <p>This block changes according to the selected theme.</p>
      </div>
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
    </div>
  );
}
