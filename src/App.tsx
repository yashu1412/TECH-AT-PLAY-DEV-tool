import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import JSONFormatter from "./pages/JSONFormatter";
import Base64Tools from "./pages/Base64Tools";
import URLEncoder from "./pages/URLEncoder";
import HashGenerator from "./pages/HashGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="dev-toolbox-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-bg animate-fade-in">
            <Navigation />
            <main className="animate-slide-in-up">
              <Routes>
                <Route path="/" element={<JSONFormatter />} />
                <Route path="/base64" element={<Base64Tools />} />
                <Route path="/url" element={<URLEncoder />} />
                <Route path="/hash" element={<HashGenerator />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
