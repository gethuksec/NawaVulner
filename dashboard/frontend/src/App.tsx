import { Navigate, Route, Routes } from "react-router-dom";
import { ChallengeDetailPage } from "./pages/ChallengeDetailPage";
import { DashboardPage } from "./pages/DashboardPage";
import { StatsPage } from "./pages/StatsPage";
import { SubmissionsPage } from "./pages/SubmissionsPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/submissions" element={<SubmissionsPage />} />
      <Route path="/challenges/:slug" element={<ChallengeDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
