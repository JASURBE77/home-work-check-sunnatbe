import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../app/slice/authSlice";
import api from "../utils/api";

export default function Login() {
  const [loginInput, setLoginInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

      // Agar server string ichida token yuborsa, qo‘shni qo‘shtirnoqni olib tashlaymiz
      const accessToken = data.accessToken?.replaceAll('"', '') || "";
      const refreshToken = data.refreshToken?.replaceAll('"', '') || "";

      // Redux-ga yuborish
      dispatch(
        loginSuccess({
          accessToken,
          refreshToken,
          user: data.user || { login: loginInput },
        })
      );

      // localStorage-ga ham to‘g‘ri saqlash
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      console.log("LOGIN RESPONSE:", data);

      navigate("/"); // login muvaffaqiyatli bo‘lsa homepage-ga yo‘naltirish
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Server bilan aloqa yo'q yoki CORS xatosi";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-around">
        <h1 className="font-bold text-3xl my-6">Login Page</h1>
        <LanguageSelector />
      </div>

      <div className="min-h-screen loginBG flex items-center bg-base-200 p-4">
        <div className="container_login">
          <form
            className="card w-full max-w-sm bg-base-100 shadow-xl p-6"
            onSubmit={handleLogin}
          >
            <p className="text-xl font-semibold text-center mb-4">
              Sign in to your account
            </p>

            <label className="form-control w-full mb-4">
              <input
                type="text"
                placeholder="Enter login"
                className="input input-bordered w-full"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                required
              />
            </label>

            <label className="form-control w-full mb-4">
              <input
                type="password"
                placeholder="Enter password"
                className="input input-bordered w-full"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </label>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <button
              type="submit"
              className="btn btn-primary w-full uppercase tracking-wide mb-2"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-sm text-center text-gray-500">
              No account?{" "}
              <Link to="/signup" className="link link-primary">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
