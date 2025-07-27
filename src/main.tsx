import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { CollectionsProvider } from "./contexts/CollectionsContext";
import { BooksReadProvider } from "./contexts/BooksReadContext";
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <FavoritesProvider>
          <CollectionsProvider>
            <BooksReadProvider>
              <App />
              <Toaster />
            </BooksReadProvider>
          </CollectionsProvider>
        </FavoritesProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
