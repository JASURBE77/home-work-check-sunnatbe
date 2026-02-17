import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout } from "../store/slice/authSlice";

export default function ProtectedRoute({ children }) {
  const token = useSelector(state =>  state.auth.token)
  const dispatch = useDispatch();

  // Token yo'q bo‘lsa
  if (!token) return <Navigate to="/login" replace />;

  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));

    // Token muddati tugagan bo‘lsa
    if (Date.now() >= exp * 1000) {
      dispatch(logout());
      return <Navigate to="/login" replace />;
    }
  } catch {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  return children;
}
