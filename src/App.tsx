
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BooksForSale from "./pages/BooksForSale";
import SearchResults from "./pages/SearchResults";
import Collections from "./pages/Collections";
import BuyUsedBooks from "./pages/BuyUsedBooks";
import AdvancedSearch from "./pages/AdvancedSearch";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/books-for-sale" element={<BooksForSale />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/collections/:id" element={<Collections />} />
          <Route path="/buy-used-books" element={<BuyUsedBooks />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
