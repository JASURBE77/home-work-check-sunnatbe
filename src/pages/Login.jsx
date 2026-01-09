import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../app/slice/authSlice";
import api from "../utils/api";
import { useTranslation } from "react-i18next";
import LoginImg from "../assets/LoginImg.svg";
import Logo from "../assets/logo.png";
import Text from "../assets/text.svg";

export default function Login() {
  const [loginInput, setLoginInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <div className="flex h-screen w-full">
        <div className="w-1/2 relative">
          <img
            className="h-screen w-full object-cover"
            src={LoginImg}
            alt="login"
          />

          <img
            src={Text}
            alt="text"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className="w-1/2 flex items-center justify-center relative bg-[#F7F9FC]">
          <div className="absolute top-0 right-0">
            <img className="w-35 h-35 object-contain" src={Logo} alt="logo" />
          </div>

          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-[#1935CA] font-bold text-3xl mb-2">
              Tizimga kirish
            </h2>
            <p className="text-[#1935CA] text-sm mb-6">
              Login va parolingiz bilan tizimga kiring
            </p>

            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              <label className="flex flex-col gap-2">
                <span className="text-[#696F79] font-semibold text-sm">
                  {t("login_placeholder")}
                </span>
                <input
                  type="text"
                  placeholder={t("login_placeholder")}
                  className="
            px-5 py-3 rounded-lg shadow-sm
            border border-transparent
            outline-none
            placeholder-[#1935CA]
            focus:border-[#1935CA]
            focus:ring-2 focus:ring-[#1935CA]/30
            transition
          "
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  required
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[#696F79] font-semibold text-sm">
                  {t("password_placeholder")}
                </span>
                <input
                  type="password"
                  placeholder={t("password_placeholder")}
                  className="
            px-5 py-3 rounded-lg shadow-sm
            border border-transparent
            outline-none
            placeholder-[#1935CA]
            focus:border-[#1935CA]
            focus:ring-2 focus:ring-[#1935CA]/30
            transition
          "
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
              </label>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="
          bg-[#1935CA]
          text-white
          py-4 rounded-xl
          font-semibold
          uppercase tracking-wide
          transition
          hover:opacity-90
          disabled:opacity-60
          disabled:cursor-not-allowed
          flex items-center justify-center
        ">
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  t("login_button")
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
