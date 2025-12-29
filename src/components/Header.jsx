import React, { useEffect, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../utils/api";
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

  if (loading || !user) {
    return (
      <span className="loading loading-spinner text-primary"></span>
    );
  }

  const checkout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <header className="mt-2 mb-5">
      <div className="navbar rounded-xl px-10 bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xs md:text-xl">EMIRHAN HUB</a>
        </div>

        <div className="flex gap-5 items-center">
          <LanguageSelector />

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle bg-primary"
            >
              <div className="w-10 flex items-center justify-center rounded-full">
                <span className="text-2xl text-base-100">
                  {user?.name?.[0]?.toUpperCase()}
                  {user?.surname?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile">
                  Profile <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <button onClick={checkout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
