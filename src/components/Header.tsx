
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, HelpCircle, LogOut, Settings, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <header className="h-14 border-b bg-white flex items-center px-4 sticky top-0 z-30">
      <div className="flex-1 flex items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold text-servicenow-blue">ResilienceAI</h1>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-servicenow-grey" />
        </Button>
        
        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-servicenow-grey" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 font-medium">Notifications</div>
            <DropdownMenuSeparator />
            <div className="py-2 px-4 text-sm">
              <div className="mb-4 border-l-4 border-servicenow-blue p-3 bg-gray-50">
                <div className="text-xs text-muted-foreground">5 minutes ago</div>
                <div className="font-medium">High CPU utilization predicted on prod-db-01</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Auto-remediation has been initiated
                </div>
              </div>
              
              <div className="border-l-4 border-gray-300 p-3 bg-gray-50">
                <div className="text-xs text-muted-foreground">2 hours ago</div>
                <div className="font-medium">Auto-remediation successful</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Service has been restored on prod-cache-01
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer justify-center font-medium text-center">
              <Link to="/notifications">View All</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <div className="h-8 w-8 rounded-full bg-servicenow-blue text-white grid place-items-center">
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-4 py-2">
                <p className="font-medium">{user.email}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm">
            <Link to="/auth">Sign In</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
