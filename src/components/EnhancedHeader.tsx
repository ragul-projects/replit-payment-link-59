import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Shield, Menu, X, Lock, Zap, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { useAuth } from "@/contexts/AuthContext";

interface EnhancedHeaderProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function EnhancedHeader({ activeSection, onSectionChange }: EnhancedHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state } = useAuth();

  const navItems = [
    { id: 'payment', label: 'Payments', icon: CreditCard },
    { id: 'status', label: 'Track Status', icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-card/95 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="p-2 bg-gradient-to-r from-fintech-blue to-fintech-teal rounded-xl group-hover:shadow-lg transition-all duration-300">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="absolute inset-0 p-2 bg-gradient-to-r from-fintech-blue to-fintech-teal rounded-xl opacity-0 group-hover:opacity-20 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold hero-gradient">
                SecurePay UPI
              </h1>
              <p className="text-xs text-muted-foreground">Instant • Secure • Reliable</p>
            </div>
          </Link>

          {/* Desktop Navigation - Only show if authenticated */}
          {state.isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  onClick={() => onSectionChange?.(item.id)}
                  className="flex items-center space-x-2 hover:bg-white/10 dark:hover:bg-white/5"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </nav>
          )}

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2">
            {/* Notifications - Only for authenticated users */}
            {state.isAuthenticated && (
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                >
                  2
                </Badge>
              </Button>
            )}

            {/* Security Badge */}
            <div className="hidden sm:flex security-badge">
              <Lock className="h-3 w-3" />
              <span className="text-xs">Secure</span>
            </div>

            <ThemeToggle />

            {/* User Profile or Login */}
            {state.isAuthenticated ? (
              <UserProfileDropdown />
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
                <Button size="sm" asChild className="button-payment">
                  <Link to="/admin/login">Sign In</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white/95 dark:bg-card/95 backdrop-blur-md">
                <div className="mt-6 space-y-4">
                  {/* Authenticated Mobile Menu */}
                  {state.isAuthenticated ? (
                    <>
                      <div className="space-y-2">
                        {navItems.map((item) => (
                          <Button
                            key={item.id}
                            variant={activeSection === item.id ? "default" : "ghost"}
                            onClick={() => {
                              onSectionChange?.(item.id);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full justify-start space-x-3 h-12"
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Button>
                        ))}
                      </div>

                      <div className="border-t pt-4">
                        <Button variant="outline" size="sm" className="w-full mb-2">
                          <Bell className="h-4 w-4 mr-2" />
                          Notifications
                          <Badge variant="destructive" className="ml-auto">2</Badge>
                        </Button>
                      </div>
                    </>
                  ) : (
                    /* Unauthenticated Mobile Menu */
                    <div className="space-y-2">
                      <Button asChild className="w-full button-payment">
                        <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                          <Shield className="h-4 w-4 mr-2" />
                          Sign In
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Create Account
                        </Link>
                      </Button>
                    </div>
                  )}

                  <div className="pt-4">
                    <div className="security-badge justify-center">
                      <Lock className="h-3 w-3" />
                      <span className="text-xs">256-bit SSL Encrypted</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}