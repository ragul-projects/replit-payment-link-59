import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Lock, User, Eye, EyeOff, CreditCard, Coffee, Shield } from "lucide-react";

const DevLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSkipLogin = () => {
    // Just navigate to main app for development
    navigate("/");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For UI only - just navigate to main app
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-glow to-success opacity-20" />
      
      <div className="relative w-full max-w-md space-y-6">
        {/* Developer Badge */}
        <div className="text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            <Coffee className="h-3 w-3 mr-1" />
            Developer Mode
          </Badge>
        </div>

        {/* Login Card */}
        <Card className="card-payment">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto p-3 bg-gradient-to-r from-primary to-primary-glow rounded-xl w-fit">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                SecurePay UPI
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Developer Access Portal
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Quick Skip for Development */}
            <div className="space-y-3">
              <Button 
                onClick={handleSkipLogin}
                className="w-full button-payment"
                size="lg"
              >
                <Shield className="h-4 w-4 mr-2" />
                Skip to Dashboard (Dev Mode)
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Quick access for development and testing
              </p>
            </div>

            <Separator className="my-6" />

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="developer@securepay.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
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

              <Button type="submit" className="w-full button-success" size="lg">
                Sign In to Dashboard
              </Button>
            </form>

            {/* Additional Options */}
            <div className="text-center space-y-3">
              <Link 
                to="/" 
                className="text-sm text-primary hover:underline"
              >
                ← Back to Payment Portal
              </Link>
              
              <div className="text-xs text-muted-foreground">
                Development build • No real authentication required
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            UI Only • No Backend Integration
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevLogin;