<<<<<<< HEAD
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatBot from "./components/ChatBot";
import { logout } from "./app/slice/authSlice";
=======
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatBot from './components/ChatBot';
import { logout } from './app/slice/authSlice';
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
<<<<<<< HEAD
  const token = useSelector((state) => state.auth.token);
=======
  const token = useSelector(state => state.auth.token);
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d

  React.useEffect(() => {
    if (!token) {
      return navigate("/login", { replace: true });
    }

    try {
<<<<<<< HEAD
      const payload = JSON.parse(atob(token.split(".")[1]));
=======
      const payload = JSON.parse(atob(token.split('.')[1]));
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
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
    <div className="container">
      <Header />
      <div className="flex gap-10">
        <Sidebar />
<<<<<<< HEAD
        <div className="max-h-screen overflow-auto w-full!">
          <Outlet />
        </div>
=======
        <Outlet />
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
      </div>
      <ChatBot />
    </div>
  );
};

export default App;
