import { Navigate, Outlet } from "react-router-dom";

import { useAppState } from "../context/AppState.jsx";

export default function PublicOnlyRoute() {
  const { authUser } = useAppState();

  if (authUser) {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
}
