import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import HomeWork from "../pages/HomeWork.jsx";
<<<<<<< HEAD
=======
import Games from "../pages/Games.jsx";
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
import MonkeyTypePage from "../pages/Monkey-type-page.jsx";
import Rating from "../pages/Rating.jsx";
import Review from "../pages/Review.jsx";
import Profile from "../pages/Profile.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
<<<<<<< HEAD
import Error from "../pages/Error.jsx";
=======
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d

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
<<<<<<< HEAD

=======
    { path: "games", element: <Games /> },
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
    { path: "reviews", element: <Review /> },
    { path: "typer", element: <MonkeyTypePage /> },
    { path: "rating", element: <Rating /> },
    { path: "profile", element: <Profile /> },
  ],
},
<<<<<<< HEAD
{path: "/500", element: <Error />},
=======
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
{
  path: "/login",
  element: <Login />,
},

]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
