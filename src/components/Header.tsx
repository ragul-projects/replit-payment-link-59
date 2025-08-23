import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Shield, Menu, X, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function Header({ activeSection, onSectionChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          {/* Desktop Navigation */}
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
            
            <div className="w-px h-6 bg-border mx-2" />
            
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/login" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            </Button>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2">
            {/* Security Badge */}
            <div className="hidden sm:flex security-badge">
              <Lock className="h-3 w-3" />
              <span className="text-xs">Secure</span>
            </div>

            <ThemeToggle />
            <LanguageToggle />

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white/95 dark:bg-card/95 backdrop-blur-md">
                <div className="mt-6 space-y-4">
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
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/admin/login" className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </Button>
                  </div>

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