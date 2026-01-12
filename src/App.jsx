import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "@/layouts/AppShell";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import CreateGoalPage from "./pages/CreateGoalPage";
import GoalListPage from "./pages/GoalListPage";
import GoalTodayPage from "./pages/GoalTodayPage";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <AppShell>
            <Navigate to="/goals" replace />
          </AppShell>
        }
      />

      <Route
        path="/create-goal"
        element={
          <AppShell>
            <CreateGoalPage />
          </AppShell>
        }
      />

      <Route
        path="/goals"
        element={
          <AppShell>
            <GoalListPage />
          </AppShell>
        }
      />

      <Route
        path="/goals/:goalId/today"
        element={
          <AppShell>
            <GoalTodayPage />
          </AppShell>
        }
      />

      <Route
        path="/goals/:goalId/calendar"
        element={
          <AppShell>
            <CalendarPage />
          </AppShell>
        }
      />

      <Route
        path="*"
        element={<div style={{ padding: 24 }}>No route matched</div>}
      />
    </Routes>
  );
}

export default App;
