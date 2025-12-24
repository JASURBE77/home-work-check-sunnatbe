import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../app/slice/authSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;

    if (Date.now() > exp) {
      dispatch(logout());
      return <Navigate to="/login" replace />;
    }
  } catch {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  return children;
}
