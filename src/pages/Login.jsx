import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../app/slice/authSlice";
import api from "../utils/api";
import { useTranslation } from "react-i18next"; // i18n hook

export default function Login() {
  const [loginInput, setLoginInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(); // i18n

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api({
        url: "/login",
        method: "POST",
        open: true,
        data: { login: loginInput, password: passwordInput },
      });

      const data = res.data;

      dispatch(
        loginSuccess({
          token: data.accessToken,
          refreshToken: data.refreshToken,
          accessToken: data.accessToken,
          user: data.user || { login: loginInput },
        })
      );

      localStorage.setItem("accessToken", data.accessToken);
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || t("login_server_error");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center bg-[#FFB608] justify-around">
      <div className="flex items-center gap-2">
          <img className="w-16" src="/logo.png" alt="" />
        <h1 className="font-bold text-xl hidden md:block md:text-3xl  text-white">
          {t("student_controller")}
        </h1>
      </div>
        <LanguageSelector />
      </div>

      <div className="min-h-screen loginBG flex items-center bg-base-200 p-4">
        <div className="container_login">
          <form
            className="card w-full max-w-sm bg-base-100 shadow-xl p-6"
            onSubmit={handleLogin}
          >
            <p className="text-xl font-semibold text-[#FFB608] text-center mb-4">
              {t("login_title")}
            </p>

            <label className="form-control w-full mb-4">
              <span className="text-[#FFB608]">login</span>
              <input
                type="text"
                placeholder={t("login_placeholder")}
                className="input border border-[#FFB608] w-full outline-none"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                required
              />
            </label>

            <label className="form-control w-full mb-4">
              <span className="text-[#FFB608]">password</span>
              <input
                type="password"
                placeholder={t("password_placeholder")}
                className="input border border-[#FFB608] outline-none w-full"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </label>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn bg-[#FFB608] text-white w-full uppercase tracking-wide mb-2"
            >
              {loading ? (
                <>
                  <span className="loading-spinner loading text-white"></span>
                </>
              ) : (
                t("login_button")
              )}
            </button>

          
          </form>
        </div>
      </div>
    </div>
  );
}
