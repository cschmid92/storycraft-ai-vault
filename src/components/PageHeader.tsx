
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconGradient?: string;
  showBackButton?: boolean;
  backTo?: string;
}

const PageHeader = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  iconGradient = "from-blue-600 to-indigo-600",
  showBackButton = true,
  backTo = "/"
}: PageHeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
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
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
