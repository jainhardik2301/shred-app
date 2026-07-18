import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import AppLayout from "../layout/AppLayout";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Onboarding from "../pages/Onboarding/Onboarding";
import Dashboard from "../pages/Dashboard/Dashboard";
import Nutrition from "../pages/Nutrition/Nutrition";
import Habits from "../pages/Habits/Habits";
import Workout from "../pages/Workout/Workout";
import Progress from "../pages/Progress/Progress";
import Settings from "../pages/Settings/Settings";
import NotFound from "../pages/NotFound/NotFound";

import CoachDashboard from "../components/coach/CoachDashboard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* AUTHENTICATED ROUTES */}

        <Route
          element={<ProtectedRoute />}
        >

          {/* ONBOARDING */}
          <Route
            path="/onboarding"
            element={<Onboarding />}
          />


          {/* MAIN SHRED APP */}
          <Route
            element={<AppLayout />}
          >

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/nutrition"
              element={<Nutrition />}
            />

            <Route
              path="/habits"
              element={<Habits />}
            />

            <Route
              path="/workout"
              element={<Workout />}
            />

            <Route
              path="/progress"
              element={<Progress />}
            />

            <Route
              path="/coach"
              element={<CoachDashboard />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>

        </Route>


        {/* FALLBACK */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}