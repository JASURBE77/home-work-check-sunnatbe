import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatBot from './components/ChatBot';
import { logout } from './app/slice/authSlice';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  React.useEffect(() => {
    if (!token) {
      return navigate("/login", { replace: true });
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
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
        <Outlet />
      </div>
      <ChatBot />
    </div>
  );
};

export default App;
