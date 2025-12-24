import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import HomeWork from "../pages/HomeWork.jsx";
import Games from "../pages/Games.jsx";
import MonkeyTypePage from "../pages/Monkey-type-page.jsx";
import Rating from "../pages/Rating.jsx";
import Review from "../pages/Review.jsx";
import Profile from "../pages/Profile.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
  path: "/",
  element: (
    <ProtectedRoute>
      <App />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Home /> },
    { path: "homework", element: <HomeWork /> },
    { path: "games", element: <Games /> },
    { path: "reviews", element: <Review /> },
    { path: "typer", element: <MonkeyTypePage /> },
    { path: "rating", element: <Rating /> },
    { path: "profile", element: <Profile /> },
  ],
},
{
  path: "/login",
  element: <Login />,
},

]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
