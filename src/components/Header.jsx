import React, { useEffect, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../utils/api";
import Logo from "../assets/logo.png"
import { logout } from "../app/slice/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const storedUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(storedUser || null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api({ url: "/me", method: "GET" });
      setUser(res.data);
    } catch (err) {
      console.error("User fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!storedUser) {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [storedUser]);

  const checkout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <header className="z-999 w-full">
      <div className="navbar flex items-center justify-end md:justify-between">
        <div className="hidden md:flex justify-start items-center">
          <img src={Logo} alt="logo" className="w-20 h-20" />
          <h2 className="text-2xl text-black font-bold">Student Control</h2>
        </div>

        <div className="flex gap-5 items-center">
          <LanguageSelector />

          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle bg-gray-800">
                  <div className="w-10 flex items-center justify-center rounded-full">
                    <span className="text-xl text-white">
                      {user?.name?.[0]?.toUpperCase()}
                      {user?.surname?.[0]?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                  <li className="text-xl font-semibold">
                    <Link to="/profile">Hisobingiz</Link>
                  </li>
                  <li className="text-xl font-semibold">
                    <button onClick={checkout}>Chiqish</button>
                  </li>
                </ul>
              </div>
              <span className="text-black text-[19px]">
                {user?.name} {user?.surname}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
