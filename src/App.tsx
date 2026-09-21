import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RootNav from "./components/shell/RootNav";
import DashboardRoute from "./routes/DashboardRoute";
import NewInvestigationRoute from "./routes/NewInvestigationRoute";
import ThreatIntelRoute from "./routes/ThreatIntelRoute";
import SentinelTraceRoute from "./routes/SentinelTraceRoute";

export default function App() {
  return (
    <BrowserRouter>
      <RootNav />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/investigate/new" element={<NewInvestigationRoute />} />
        <Route path="/investigate/threat-intel" element={<ThreatIntelRoute />} />
        <Route path="/investigate/detail" element={<SentinelTraceRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
