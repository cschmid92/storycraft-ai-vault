
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BooksForSale from "./pages/BooksForSale";
import SearchResults from "./pages/SearchResults";
import Collections from "./pages/Collections";
import BuyUsedBooks from "./pages/BuyUsedBooks";
import AdvancedSearch from "./pages/AdvancedSearch";
import About from "./pages/About";
import UserProfile from "./pages/UserProfile";

const App = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/books-for-sale" element={<BooksForSale />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/collections/:id" element={<Collections />} />
    <Route path="/buy-used-books" element={<BuyUsedBooks />} />
    <Route path="/advanced-search" element={<AdvancedSearch />} />
    <Route path="/about" element={<About />} />
    <Route path="/profile" element={<UserProfile />} />
    <Route path="/user/:userId" element={<UserProfile />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
