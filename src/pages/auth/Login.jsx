import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slice/authSlice";
import { useNavigate } from "react-router-dom";
import LoginImg from "../../assets/LoginImg.svg";
import Logo from "../../assets/logo.png";
import Text from "../../assets/text.svg";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const resultAction = await dispatch(
      loginUser({ login: data.login, password: data.password })
    );

    if (loginUser.fulfilled.match(resultAction)) {
      localStorage.setItem("accessToken", resultAction.payload.accessToken);
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#e7ecf3]">
      <div className="hidden md:block  w-1/2 relative">
        <img className="h-screen w-full object-cover" src={LoginImg} alt="login" />
        <img
          src={Text}
          alt="text"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="w-full px-4 md:px-0 md:w-1/2 flex items-center justify-center relative ">
        <div className="absolute top-0 right-0">
          <img className="w-25 h-25 md:w-35 md:h-35 object-contain" src={Logo} alt="logo" />
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-[#1935CA] font-bold text-3xl mb-2">Tizimga kirish</h2>
          <p className="text-[#1935CA] text-sm mb-6">Login va parolingiz bilan tizimga kiring</p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <label className="flex flex-col gap-2">
              <span className="text-[#696F79] font-semibold text-sm">Login</span>
              <input
                type="text"
                placeholder="Login"
                className="px-5 py-3 rounded-lg shadow-sm border border-transparent outline-none placeholder-[#1935CA] focus:border-[#1935CA] focus:ring-2 focus:ring-[#1935CA]/30 transition"
                {...register("login", { required: "Login kiriting" })}
              />
              {errors.login && <p className="text-red-500 text-sm">{errors.login.message}</p>}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[#696F79] font-semibold text-sm">Password</span>
              <input
                type="password"
                placeholder="Password"
                className="px-5 py-3 rounded-lg shadow-sm border border-transparent outline-none placeholder-[#1935CA] focus:border-[#1935CA] focus:ring-2 focus:ring-[#1935CA]/30 transition"
                {...register("password", {
                  required: "Parol kiriting",
                  minLength: { value: 6, message: "Kamida 6 ta belgidan iborat bo‘lishi kerak" },
                })}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </label>

            {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1935CA] text-white py-4 rounded-xl font-semibold uppercase tracking-wide transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
