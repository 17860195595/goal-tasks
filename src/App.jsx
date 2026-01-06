import { Routes, Route, Navigate } from "react-router-dom";
import CreateGoalPage from "./pages/CreateGoalPage";
import TodayPage from "./pages/TodayPage";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/create-goal" />} />
      <Route path="/create-goal" element={<CreateGoalPage />} />
      <Route path="/today" element={<TodayPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
    </Routes>
  );
}

export default App;
