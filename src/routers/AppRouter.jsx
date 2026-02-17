import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "../guard/ProtectedRoute.jsx";

// ─── Lazy imports ───────────────────────────────────────────────────────────
const AppLayout      = lazy(() => import("../App.jsx"));
const Home           = lazy(() => import("../pages/dashboard/Home.jsx"));
const Login          = lazy(() => import("../pages/auth/Login.jsx"));
const HomeWork       = lazy(() => import("../pages/submissions/HomeWork.jsx"));
const MonkeyTypePage = lazy(() => import("../pages/dashboard/Monkey-type-page.jsx"));
const Rating         = lazy(() => import("../pages/dashboard/Rating.jsx"));
const Review         = lazy(() => import("../pages/submissions/Review.jsx"));
const Profile        = lazy(() => import("../pages/dashboard/Profile.jsx"));
const Error          = lazy(() => import("../pages/error/Error.jsx"));
const TeacherTasks   = lazy(() => import("../pages/dashboard/TeacherTasks.jsx"));
const Test           = lazy(() => import("../components/Test.jsx"));
const HistoryTest    = lazy(() => import("../pages/dashboard/HistoryTest.jsx"));

// ─── Global loading fallback ─────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
    <span className="loading loading-spinner text-primary" />
  </div>
);

// ─── Yagona Suspense wrapper — har bir routega alohida yozish shart emas ────
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

// ─── Router ──────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <AppLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { index: true,                          element: withSuspense(Home)           },
      { path: "homework",                     element: withSuspense(HomeWork)       },
      { path: "reviews",                      element: withSuspense(Review)         },
      { path: "typer",                        element: withSuspense(MonkeyTypePage) },
      { path: "rating",                       element: withSuspense(Rating)         },
      { path: "profile",                      element: withSuspense(Profile)        },
      { path: "tasks",                        element: withSuspense(TeacherTasks)   },
      { path: "student-exam/:examSession",    element: withSuspense(Test)           },
      { path: "historytask",                  element: withSuspense(HistoryTest)    },
    ],
  },
  { path: "/500",   element: withSuspense(Error) },
  { path: "/login", element: withSuspense(Login) },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;