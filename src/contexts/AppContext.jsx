import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [appData, setAppData] = useState({
    profile: null,
    goals: null,
    today: null,
    history: null,
  });

  return (
    <AppContext.Provider
      value={{
        appData,
        setAppData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}