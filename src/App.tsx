import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
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
import VaultPage from "./pages/VaultPage";
import UBIPage from "./pages/UBIPage";
import WagePayPage from "./pages/WagePayPage";
import SwapPage from "./pages/SwapPage";
import BankCardsPage from "./pages/BankCardsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mine" element={<MinePage />} />
            <Route path="/exchange" element={<ExchangePage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/invest" element={<InvestPage />} />
            <Route path="/real-estate" element={<RealEstatePage />} />
            <Route path="/sectors" element={<SectorsPage />} />
            <Route path="/etfs" element={<ETFsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/vault" element={<VaultPage />} />
            <Route path="/ubi" element={<UBIPage />} />
            <Route path="/wagepay" element={<WagePayPage />} />
            <Route path="/swap" element={<SwapPage />} />
            <Route path="/bank-cards" element={<BankCardsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
