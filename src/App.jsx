import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { logout } from "./app/slice/authSlice";

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  React.useEffect(() => {
    if (!token) {
      return navigate("/login", { replace: true });
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      if (Date.now() > exp) {
        dispatch(logout());
        navigate("/login", { replace: true });
      }
    } catch {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate, token]);

  return (
    <div className="container h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(25, 53, 202, 0.7) rgba(220,220,220,0.3)", 
          }}
          className="flex-1 bg-white p-5 rounded-[20px] overflow-auto max-h-full ml-4 custom-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
