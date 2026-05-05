import { Navigate, Outlet } from "react-router-dom";

import { useAppState } from "../context/AppState.jsx";

export default function ProtectedRoute() {
  const { authUser } = useAppState();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
