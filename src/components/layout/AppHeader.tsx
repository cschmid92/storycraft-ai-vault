
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AccountModal from '../AccountModal';
import MessengerModal from '../MessengerModal';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showMobileMenu?: boolean;
  onMobileMenuClick?: () => void;
}

const AppHeader = ({ 
  title = "Bacondo", 
  subtitle = "Your Digital Library",
  showMobileMenu = false,
  onMobileMenuClick
}: AppHeaderProps) => {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isMessengerModalOpen, setIsMessengerModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 w-full flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              {/* Mobile sidebar trigger */}
              {showMobileMenu && (
                <SidebarTrigger className="md:hidden" />
              )}
              <Link to="/" className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">{title}</h1>
                  <p className="text-xs text-slate-600 hidden sm:block">{subtitle}</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                size="sm"
                className="bg-white/60 border-slate-300 text-slate-700 hover:bg-slate-100"
                onClick={() => setIsMessengerModalOpen(true)}
              >
                <MessageSquare className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Messages</span>
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="bg-white/60 border-slate-300 text-slate-700 hover:bg-slate-100"
                onClick={() => setIsAccountModalOpen(true)}
              >
                <User className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Account</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />

      <MessengerModal 
        isOpen={isMessengerModalOpen}
        onClose={() => setIsMessengerModalOpen(false)}
      />
    </>
  );
};

export default AppHeader;
