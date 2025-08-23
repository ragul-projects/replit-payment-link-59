import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SecurityManager } from "@/utils/security";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { state, login } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || (
        state.user?.role === 'admin' ? '/admin' : '/developer'
      );
      navigate(from, { replace: true });
    }
  }, [state.isAuthenticated, navigate, location, state.user?.role]);

  // Check account lockout status
  useEffect(() => {
    const checkLockout = () => {
      const locked = SecurityManager.isAccountLocked();
      setIsLocked(locked);
      
      if (locked) {
        const lockoutData = localStorage.getItem('account_lockout');
        if (lockoutData) {
          const { lockedUntil } = JSON.parse(lockoutData);
          setLockoutTime(Math.max(0, lockedUntil - Date.now()));
        }
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const attempts = SecurityManager.getLoginAttempts();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        variant: "destructive",
        title: "Account Locked",
        description: `Account is locked due to too many failed attempts. Try again in ${Math.ceil(lockoutTime / 60000)} minutes.`
      });
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${state.user?.name || 'User'}!`,
      });

      // Navigate based on user role
      const from = (location.state as any)?.from?.pathname || (
        state.user?.role === 'admin' ? '/admin' : '/developer'
      );
      navigate(from, { replace: true });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-muted-foreground mt-2">
            Secure access to admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border-0 bg-background/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              Sign In
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Enter your admin credentials to access the dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {isLocked && (
                <Alert variant="destructive">
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    Account locked due to multiple failed attempts. 
                    Please wait {Math.ceil(lockoutTime / 60000)} minutes before trying again.
                  </AlertDescription>
                </Alert>
              )}
              
              {attempts > 0 && attempts < 5 && !isLocked && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Failed login attempts: {attempts}/5. Account will be locked after 5 failed attempts.
                  </AlertDescription>
                </Alert>
              )}
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={isLoading || isLocked}
              >
                {isLoading ? "Signing In..." : isLocked ? "Account Locked" : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-dashed">
              <h4 className="text-sm font-medium text-center mb-2">Demo Credentials</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="text-center">
                  <p className="font-medium">Admin Access:</p>
                  <p>Email: admin@securepay.com</p>
                  <p>Password: AdminSecure123!</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">Developer Access:</p>
                  <p>Email: dev@securepay.com</p>
                  <p>Password: DevSecure123!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>© 2024 Admin Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;