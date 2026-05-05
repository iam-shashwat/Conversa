import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppStateProvider, useAppState } from "./context/AppState.jsx";
import PublicOnlyRoute from "./routes/PublicOnlyRoute.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

function HomeRedirect() {
  const { authUser } = useAppState();

  return <Navigate to={authUser ? "/chat" : "/login"} replace />;
}

function NotFoundRedirect() {
  const { authUser } = useAppState();

  return <Navigate to={authUser ? "/chat" : "/login"} replace />;
}

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          <Route path="/chat" element={<ChatPage />} />

          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
