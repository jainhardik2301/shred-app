import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App";

import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";

import ErrorBoundary from "./components/common/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <ErrorBoundary>

      <AuthProvider>

        <AppProvider>

          <App />

        </AppProvider>

      </AuthProvider>

    </ErrorBoundary>

  </StrictMode>
);