import { Routes, Route, Navigate } from "react-router-dom";
import CreateGoalPage from "./pages/CreateGoalPage";
import TodayPage from "./pages/TodayPage";
import CalendarPage from "./pages/CalendarPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppShell from "@/layouts/AppShell";
function App() {
  return (
    <Routes>
      {/* 登录和注册页面不使用 AppShell */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* 其他页面使用 AppShell */}
      <Route path="/" element={<AppShell><Navigate to="/today" /></AppShell>} />
      <Route path="/create-goal" element={<AppShell><CreateGoalPage /></AppShell>} />
      <Route path="/today" element={<AppShell><TodayPage /></AppShell>} />
      <Route path="/calendar" element={<AppShell><CalendarPage /></AppShell>} />
    </Routes>
  );
}

export default App;
