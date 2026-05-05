import { createContext, useContext, useEffect, useState } from "react";

import {
  AUTH_STORAGE_KEY,
  THEME_STORAGE_KEY,
  getInitialTheme,
  getStoredUser,
} from "../lib/app.js";

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [authUser, setAuthUser] = useState(getStoredUser);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const signIn = ({ name, email }) => {
    const nextUser = {
      name,
      email,
    };

    setAuthUser(nextUser);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
  };

  const signOut = () => {
    setAuthUser(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AppStateContext.Provider
      value={{
        theme,
        toggleTheme,
        authUser,
        signIn,
        signOut,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const value = useContext(AppStateContext);

  if (!value) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return value;
}
