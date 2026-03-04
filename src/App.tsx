import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import MinePage from "./pages/MinePage";
import ExchangePage from "./pages/ExchangePage";
import MarketPage from "./pages/MarketPage";
import ProfilePage from "./pages/ProfilePage";
import InvestPage from "./pages/InvestPage";
import RealEstatePage from "./pages/RealEstatePage";
import SectorsPage from "./pages/SectorsPage";
import ETFsPage from "./pages/ETFsPage";
import TasksPage from "./pages/TasksPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="dark">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mine" element={<MinePage />} />
            <Route path="/exchange" element={<ExchangePage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/invest" element={<InvestPage />} />
            <Route path="/real-estate" element={<RealEstatePage />} />
            <Route path="/sectors" element={<SectorsPage />} />
            <Route path="/etfs" element={<ETFsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
