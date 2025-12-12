import React from "react";
import LanguageSelector from "../components/LanguageSelector";

export default function Login() {
  return (
    <div>
      <div className="flex items-center justify-around">
        <h1 className="font-bold text-3xl my-6">Login Page</h1>
        <div>
          <LanguageSelector />
        </div>
      </div>
         <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <form className="card w-full max-w-sm bg-base-100 shadow-xl p-6">
        
        <p className="text-xl font-semibold text-center mb-4">
          Sign in to your account
        </p>

        {/* Email */}
        <label className="form-control w-full mb-4">
          <input
            type="email"
            placeholder="Enter email"
            className="input input-bordered w-full"
          />
        </label>

        {/* Password */}
        <label className="form-control w-full mb-4">
          <input
            type="password"
            placeholder="Enter password"
            className="input input-bordered w-full"
          />
        </label>

        {/* Button */}
        <button className="btn btn-primary w-full uppercase tracking-wide mb-2">
          Sign in
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500">
          No account?{" "}
          <a className="link link-primary" href="#">
            Sign up
          </a>
        </p>
      </form>
    </div>
    </div>
  );
}
