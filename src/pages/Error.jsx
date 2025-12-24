// src/pages/Error500.jsx
import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function Error() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
        <AlertCircle className="mx-auto w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-6xl font-bold text-red-500 mb-2">500</h1>
        <p className="text-gray-700 text-lg mb-6">
          Server xatoligi yuz berdi. Iltimos, keyinroq qayta urinib ko‘ring.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}
