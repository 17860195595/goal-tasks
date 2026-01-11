import { Routes, Route, Navigate } from "react-router-dom";
import CreateGoalPage from "./pages/CreateGoalPage";
import CalendarPage from "./pages/CalendarPage";
import HomePage from "./pages/HomePage";
import GoalListPage from "./pages/GoalListPage";
import GoalTodayPage from "./pages/GoalTodayPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/create-goal" />} />
      <Route path="/create-goal" element={<CreateGoalPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/goals" element={<GoalListPage />} />
      <Route path="/goals/:goalId/today" element={<GoalTodayPage />} />
      <Route path="/goals/:goalId/calendar" element={<CalendarPage />} />
    </Routes>
  );
}

export default App;
