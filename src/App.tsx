import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Mulai from "./pages/Mulai.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Profile from "./pages/Profile.tsx";
import Wizard from "./pages/Wizard.tsx";
import WizardInterior from "./pages/WizardInterior.tsx";
import WizardRAB from "./pages/WizardRAB.tsx";
import WizardIMB from "./pages/WizardIMB.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected — butuh login */}
            <Route path="/mulai" element={<RequireAuth><Mulai /></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

            {/* Wizard variants */}
            <Route path="/wizard" element={<RequireAuth><Wizard /></RequireAuth>} />
            <Route path="/wizard/arsitektur_baru" element={<RequireAuth><Wizard /></RequireAuth>} />
            <Route path="/wizard/interior_existing" element={<RequireAuth><WizardInterior /></RequireAuth>} />
            <Route path="/wizard/rab_boq" element={<RequireAuth><WizardRAB /></RequireAuth>} />
            <Route path="/wizard/imb" element={<RequireAuth><WizardIMB /></RequireAuth>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
