<<<<<<< HEAD
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Code,
  LampDesk,
  Backpack,
  Gamepad2,
  ChartNoAxesColumn,
  Menu,
  X
} from "lucide-react";
import ThemeSwitcher from "./ThemeSwitches";

const Sidebar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 py-2 px-3 rounded-xl transition
     ${isActive ? "bg-primary text-white" : "hover:bg-neutral hover:text-white"}`;

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:block w-[280px] h-screen p-5 shadow-xl rounded-xl">
        <ul className="flex flex-col gap-4">
          <NavLink to="/" className={linkClass}><LampDesk /> {t("home")}</NavLink>
          <NavLink to="/homework" className={linkClass}><Backpack /> {t("homework-link")}</NavLink>
          <NavLink to="/typer" className={linkClass}><Gamepad2 /> {t("games")}</NavLink>
          <NavLink to="/reviews" className={linkClass}><Code /> {t("code")}</NavLink>
          <NavLink to="/rating" className={linkClass}><ChartNoAxesColumn /> {t("rating")}</NavLink>
        </ul>
      </div>

      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="p-2 bg-black text-white rounded-xl"
        >
          <Menu />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg- z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-[260px] bg-base-100 shadow-xl z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">Menu</h2>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <ul className="flex flex-col gap-4 p-4">
          <NavLink onClick={() => setOpen(false)} to="/" className={linkClass}><LampDesk /> {t("home")}</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/homework" className={linkClass}><Backpack /> {t("homework-link")}</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/typer" className={linkClass}><Gamepad2 /> {t("games")}</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/reviews" className={linkClass}><Code /> {t("code")}</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/rating" className={linkClass}><ChartNoAxesColumn /> {t("rating")}</NavLink>
          <ThemeSwitcher />
        </ul>
      </div>
    </>
=======

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Code, LampDesk, Backpack, Gamepad2, User, ChartNoAxesColumn } from "lucide-react";

const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="shadow-xl min-h-screen px-5 py-5 rounded-xl hidden md:block w-[300px] h-[650px]">
        <div>
          <div>
            <ul className="flex flex-col gap-5">
              <li>
                <Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to="/">
                  <LampDesk /> {t("home")}
                </Link>
              </li>

              <li>
                <Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to="/homework">
                  <Backpack /> {t("homework-link")}
                </Link>
              </li>

              <li>
                <Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to="/games">
                  <Gamepad2 /> {t("games")}
                </Link>
              </li>

              <li>
                <Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to="/reviews">
                  <Code /> {t("code")}
                </Link>
              </li>


              <li>
                <Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to="/rating">
                  <ChartNoAxesColumn /> {t("rating")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile version */}
     <div className="container">
       <div className="block md:hidden mb-10 relative bottom-0">
        <div className="dock dock-xl rounded-2xl">
          <button>
            <LampDesk />
            <Link to="/">{t("home")}</Link>
          </button>

          <button>
            <Backpack />
            <Link to="/homework">{t("homework-link")}</Link>
          </button>

          <button>
            <Gamepad2 />
            <Link to="/games">{t("games")}</Link>
          </button>

          <button>
            <ChartNoAxesColumn />
            <Link to="/rating">{t("rating")}</Link>
          </button>
        </div>
      </div>
     </div>
    </div>
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
  );
};

export default Sidebar;
