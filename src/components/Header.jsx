import React, { useState } from "react";
import { FiGlobe } from "react-icons/fi";
import LanguageSelector from "./LanguageSelector";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import ThemeSwitcher from "./ThemeSwitches";
import { loadLanguages } from "i18next";
=======
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d

const Header = () => {
  const [lang, setLang] = useState("uz");

<<<<<<< HEAD
  const checkout = () => {
    localStorage.removeItem("persist:auth");

  }

=======
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
  return (
    <header className="mt-2 mb-5">
      <div>
        <div className="navbar rounded-xl px-10 bg-base-100 shadow-sm">
          <div className="flex-1">
            <a className="btn btn-ghost text-xs md:text-xl">SUNNATBEE HUB</a>
          </div>
<<<<<<< HEAD
          

          <div className="flex gap-5 items-center">

            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>
         <LanguageSelector />

         
=======

          <div className="flex gap-5 items-center">

            {/* 🌐 LANGUAGE SELECTOR */}
         <LanguageSelector />

            {/* 🛒 CART */}
         
            {/* 👤 USER AVATAR */}
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
              <Link to={'/profile'} >
                    Profile
                    <span className="badge">New</span>
              </Link>
                </li>
<<<<<<< HEAD
                <li><button onClick={checkout}>Logout</button></li>
=======
                <li><a>Settings</a></li>
                <li><a>Logout</a></li>
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
              </ul>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
