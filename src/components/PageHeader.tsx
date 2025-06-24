
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LucideIcon, User, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconGradient?: string;
  showBackButton?: boolean;
  backTo?: string;
  onMenuClick?: () => void;
  onAccountClick?: () => void;
  showMobileMenu?: boolean;
}

const PageHeader = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  iconGradient = "from-blue-600 to-indigo-600",
  showBackButton = true,
  backTo = "/",
  onMenuClick,
  onAccountClick,
  showMobileMenu = false
}: PageHeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            {showMobileMenu && onMenuClick && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={onMenuClick}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            {showBackButton && (
              <Link to={backTo}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            )}
            <div className={`p-2 bg-gradient-to-r ${iconGradient} rounded-xl`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{title}</h1>
              {subtitle && (
                <p className="text-xs text-slate-600">{subtitle}</p>
              )}
            </div>
          </div>
          {onAccountClick && (
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                size="sm"
                className="bg-white/60 border-slate-300 text-slate-700 hover:bg-slate-100"
                onClick={onAccountClick}
              >
                <User className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Account</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
