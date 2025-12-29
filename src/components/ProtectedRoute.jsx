import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../app/slice/authSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

  // 🔒 token yo‘q bo‘lsa
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  try {
    // JWT decode
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    const exp = payload.exp * 1000;

    // ⏰ token eskirgan bo‘lsa
    if (Date.now() > exp) {
      dispatch(logout());
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    // buzilgan token
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  return children;
}
