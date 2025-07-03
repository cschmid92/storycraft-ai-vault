import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useBooks } from '../hooks/useBooks';
import { useBooksForSale } from '../hooks/useBooksForSale';
import { useCollections } from '../hooks/useCollections';
import { toast } from "@/hooks/use-toast";

const ResetDataButton = () => {
  const { resetToMockData: resetBooks } = useBooks();
  const { resetToMockData: resetBooksForSale } = useBooksForSale();
  const { collections } = useCollections();

  const handleResetData = () => {
    try {
      // Reset all data to mock state
      resetBooks();
      resetBooksForSale();
      
      // Clear collections localStorage (will reload default collections)
      localStorage.removeItem('bacondo-collections');
      
      toast({
        title: "Data Reset",
        description: "All data has been reset to initial mock state.",
      });
      
      // Refresh the page to ensure all components reload with fresh data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Could not reset data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleResetData}
      className="bg-white/60 border-slate-300 text-slate-700 hover:bg-slate-100"
      title="Reset all data to initial state"
    >
      <RotateCcw className="h-4 w-4 sm:mr-2" />
      <span className="hidden sm:inline">Reset Data</span>
    </Button>
  );
};

export default ResetDataButton;