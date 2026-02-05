import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

// Lazy import qilamiz
const App = lazy(() => import("../App.jsx"));
const Home = lazy(() => import("../pages/Home.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const HomeWork = lazy(() => import("../pages/HomeWork.jsx"));
const MonkeyTypePage = lazy(() => import("../pages/Monkey-type-page.jsx"));
const Rating = lazy(() => import("../pages/Rating.jsx"));
const Review = lazy(() => import("../pages/Review.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const Error = lazy(() => import("../pages/Error.jsx"));
const TeacherTasks = lazy(() => import("../pages/TeacherTasks.jsx"));
const Test = lazy(() => import("../components/Test.jsx"));
const HistoryTest = lazy(() => import("../pages/HistoryTest.jsx"));

const Loading = () => <span className="loading loading-spinner text-primary"></span>;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Loading />}><Home /></Suspense> },
      { path: "homework", element: <Suspense fallback={<Loading />}><HomeWork /></Suspense> },
      { path: "reviews", element: <Suspense fallback={<Loading />}><Review /></Suspense> },
      { path: "typer", element: <Suspense fallback={<Loading />}><MonkeyTypePage /></Suspense> },
      { path: "rating", element: <Suspense fallback={<Loading />}><Rating /></Suspense> },
      { path: "profile", element: <Suspense fallback={<Loading />}><Profile /></Suspense> },
      { path: "tasks", element: <Suspense fallback={<Loading />}><TeacherTasks /></Suspense> },
      { path: "/student-exam/:examSession", element: <Suspense fallback={<Loading />}><Test /></Suspense> },
      { path: "/historytask", element: <Suspense fallback={<Loading />}><HistoryTest /></Suspense> },
    ],
  },
  { path: "/500", element: <Suspense fallback={<Loading />}><Error /></Suspense> },
  { path: "/login", element: <Suspense fallback={<Loading />}><Login /></Suspense> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
