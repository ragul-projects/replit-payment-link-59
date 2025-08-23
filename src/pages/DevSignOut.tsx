import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, LogOut, CreditCard, Coffee, ArrowRight } from "lucide-react";

const DevSignOut = () => {
  const navigate = useNavigate();
  const [isSignedOut, setIsSignedOut] = useState(false);

  useEffect(() => {
    // Simulate sign out process
    const timer = setTimeout(() => {
      setIsSignedOut(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleGoToLogin = () => {
    navigate("/dev/login");
  };

  const handleGoToHome = () => {
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

        {/* Sign Out Card */}
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
                Developer Session
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isSignedOut ? (
              /* Signing Out State */
              <div className="text-center space-y-4">
                <div className="mx-auto p-4 bg-warning/10 rounded-full w-fit">
                  <LogOut className="h-8 w-8 text-warning animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Signing Out...
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Clearing session data and logging you out securely
                  </p>
                </div>
                <div className="loader w-8 h-8 mx-auto" />
              </div>
            ) : (
              /* Signed Out State */
              <div className="text-center space-y-6 animate-fade-in">
                <div className="mx-auto p-4 bg-success/10 rounded-full w-fit">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Successfully Signed Out
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your developer session has been ended. All data cleared.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleGoToLogin}
                    className="w-full button-payment"
                    size="lg"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign In Again
                  </Button>
                  
                  <Button 
                    onClick={handleGoToHome}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Go to Payment Portal
                  </Button>
                </div>

                {/* Quick Links */}
                <div className="pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-3">
                    Quick Actions
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      to="/dev/login"
                      className="text-xs text-primary hover:underline p-2 bg-muted/30 rounded-lg text-center"
                    >
                      Dev Login
                    </Link>
                    <Link 
                      to="/"
                      className="text-xs text-primary hover:underline p-2 bg-muted/30 rounded-lg text-center"
                    >
                      Main App
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg text-xs text-muted-foreground">
            <Check className="h-3 w-3" />
            Session cleared • UI demonstration only
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevSignOut;