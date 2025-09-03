import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./components/auth/LoginPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ErrorsPage } from "./components/errors/ErrorsPage";
import { GitHubStatsPage } from "./components/github/GitHubStatsPage";
import { OpsOverviewPage } from "./components/ops/OpsOverviewPage";
import { GStracciniPage } from "./components/bot/GStracciniPage";
import { SportsAgendaPage } from "./components/sports/SportsAgendaPage";
import { VagasAggregatorPage } from "./components/vagas/VagasAggregatorPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/errors" element={<ErrorsPage />} />
      <Route path="/github-stats" element={<GitHubStatsPage />} />
      <Route path="/ops-overview" element={<OpsOverviewPage />} />
      <Route path="/gstraccini-bot" element={<GStracciniPage />} />
      <Route path="/sports-agenda" element={<SportsAgendaPage />} />
      <Route path="/vagas-aggregator" element={<VagasAggregatorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
