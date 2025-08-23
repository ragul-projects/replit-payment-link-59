import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  CreditCard, 
  Bell, 
  ChevronDown,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function UserProfileDropdown() {
  const { state, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
      toast({
        title: "Logged out successfully",
        description: "You have been securely logged out of your account."
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was an error logging you out. Please try again."
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!state.isAuthenticated || !state.user) {
    return null;
  }

  const getRoleIcon = () => {
    switch (state.user.role) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'developer':
        return <Zap className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getRoleBadgeVariant = () => {
    switch (state.user.role) {
      case 'admin':
        return 'destructive';
      case 'developer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 px-3 hover:bg-white/10 dark:hover:bg-white/5">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs bg-gradient-to-r from-primary to-primary-glow text-white">
                {getInitials(state.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium leading-none">
                {state.user.name}
              </span>
              <span className="text-xs text-muted-foreground leading-none mt-0.5">
                {state.user.email}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 p-2" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-sm bg-gradient-to-r from-primary to-primary-glow text-white">
                {getInitials(state.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{state.user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{state.user.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant={getRoleBadgeVariant()} className="text-xs h-5 px-2">
                  {getRoleIcon()}
                  {state.user.role}
                </Badge>
                <Badge variant="outline" className="text-xs h-5 px-2">
                  {state.user.status}
                </Badge>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="p-2 cursor-pointer" asChild>
          <div className="flex items-center gap-3">
            <User className="h-4 w-4" />
            <span>View Profile</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="p-2 cursor-pointer" asChild>
          <div className="flex items-center gap-3">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="p-2 cursor-pointer" asChild>
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </div>
        </DropdownMenuItem>

        {state.user.role === 'admin' && (
          <DropdownMenuItem className="p-2 cursor-pointer" asChild>
            <Link to="/admin" className="flex items-center gap-3 w-full">
              <Shield className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}

        {state.user.role === 'developer' && (
          <DropdownMenuItem className="p-2 cursor-pointer" asChild>
            <Link to="/developer" className="flex items-center gap-3 w-full">
              <Zap className="h-4 w-4" />
              <span>Developer Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="p-2 cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-4 w-4" />
            <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}