
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ServersPage from "./pages/ServersPage";
import ServerDetailPage from "./pages/ServerDetailPage";
import IncidentsPage from "./pages/IncidentsPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import ChangesPage from "./pages/ChangesPage";
import ChangeDetailPage from "./pages/ChangeDetailPage";
import AuditPage from "./pages/AuditPage";
import RiskPage from "./pages/RiskPage";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import NotificationsPage from "./pages/NotificationsPage";
<<<<<<< HEAD
import ResilienceAIControlCenter from "./components/enhanced/ResilienceAIControlCenter";
import Layout from "./components/Layout";
=======
>>>>>>> 8077c72c36c33a99364d5ae1a5e71a27407a8fb9
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
<<<<<<< HEAD
            <Route path="/control-center" element={<ProtectedRoute><Layout><ResilienceAIControlCenter /></Layout></ProtectedRoute>} />
=======
>>>>>>> 8077c72c36c33a99364d5ae1a5e71a27407a8fb9
            <Route path="/servers" element={<ProtectedRoute><ServersPage /></ProtectedRoute>} />
            <Route path="/servers/:serverId" element={<ProtectedRoute><ServerDetailPage /></ProtectedRoute>} />
            <Route path="/incidents" element={<ProtectedRoute><IncidentsPage /></ProtectedRoute>} />
            <Route path="/incidents/:incidentId" element={<ProtectedRoute><IncidentDetailPage /></ProtectedRoute>} />
            <Route path="/changes" element={<ProtectedRoute><ChangesPage /></ProtectedRoute>} />
            <Route path="/changes/:changeId" element={<ProtectedRoute><ChangeDetailPage /></ProtectedRoute>} />
            <Route path="/audit" element={<ProtectedRoute><AuditPage /></ProtectedRoute>} />
            <Route path="/risk" element={<ProtectedRoute><RiskPage /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
