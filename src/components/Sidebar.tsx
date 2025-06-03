
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  AlertCircle, 
  FileStack, 
  History, 
  MessageCircle,
  ShieldAlert,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive 
        ? "bg-servicenow-blue text-white" 
        : "text-servicenow-grey hover:bg-gray-100"
    )}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="border-r border-border bg-white w-60 p-3 hidden md:block h-full relative">
      <div className="space-y-1 mt-2">
        <NavItem 
          to="/" 
          icon={<LayoutDashboard className="h-4 w-4" />} 
          label="Dashboard" 
        />
        <NavItem 
          to="/control-center" 
          icon={<Brain className="h-4 w-4" />} 
          label="Control Center" 
        />
        <NavItem 
          to="/servers" 
          icon={<Server className="h-4 w-4" />} 
          label="Servers" 
        />
        <NavItem 
          to="/incidents" 
          icon={<AlertCircle className="h-4 w-4" />} 
          label="Incidents" 
        />
        <NavItem 
          to="/changes" 
          icon={<FileStack className="h-4 w-4" />} 
          label="Changes" 
        />
        <NavItem 
          to="/audit" 
          icon={<History className="h-4 w-4" />} 
          label="Audit Logs" 
        />
        <NavItem 
          to="/risk" 
          icon={<ShieldAlert className="h-4 w-4" />} 
          label="Risk Assessment" 
        />
        <NavItem 
          to="/chat" 
          icon={<MessageCircle className="h-4 w-4" />} 
          label="Virtual Agent" 
        />
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className="bg-servicenow-lightgrey rounded-md p-3 text-xs">
          <div className="font-medium mb-1">ResilienceAI</div>
          <div className="text-muted-foreground">v1.0.0</div>
          <div className="text-muted-foreground">x_YourCompany_resilience_ai</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
