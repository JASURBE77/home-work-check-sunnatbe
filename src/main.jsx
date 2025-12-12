import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import './i18n'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import HomeWork from "./pages/HomeWork.jsx";
import Games from "./pages/Games.jsx";
import MonkeyTypePage from "./pages/Monkey-type-page.jsx";
import Rating from "./pages/Rating.jsx";
import Review from "./pages/Review.jsx";
import Profile from "./pages/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,     // default => "/"
        element: <Home />,
      },
      {
        path: "/homework",
        element: <HomeWork />,
      },
      {
        path: "/games",
        element: <Games />,
      },
      {
        path: "/reviews",
        element: <Review />
      },
      {
        path: "/typer",
        element: <MonkeyTypePage />,
      },
      {
        path: "/rating",
        element: <Rating />
      },
      {
        path: "/profile",
        element: <Profile />
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
