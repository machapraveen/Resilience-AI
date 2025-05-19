
import React from 'react';
import { Bell, Search, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  return (
    <header className="border-b border-border bg-background flex items-center justify-between p-3 h-16">
      <div className="flex items-center space-x-2 md:space-x-6">
        <div className="flex items-center">
          <span className="text-servicenow-blue font-bold text-xl md:text-2xl">Resilience</span>
          <span className="text-servicenow-blue font-bold">AI</span>
        </div>
        
        <div className="relative hidden md:block w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-8 h-9 focus-visible:ring-servicenow-blue" 
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="h-5 w-5" />
        </Button>
        <Avatar className="h-8 w-8 border">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-servicenow-blue text-white">SN</AvatarFallback>
        </Avatar>
        <span className="hidden md:inline-block text-sm font-medium">
          Admin User
        </span>
      </div>
    </header>
  );
};

export default Header;
