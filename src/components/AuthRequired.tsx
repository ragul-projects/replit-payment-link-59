import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, CreditCard, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthRequiredProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  showSignup?: boolean;
}

export function AuthRequired({ 
  children, 
  title = "Authentication Required",
  description = "You need to be logged in to access this feature.",
  showSignup = true
}: AuthRequiredProps) {
  const { state } = useAuth();

  if (state.isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Card className="card-payment">
      <CardContent className="p-8 text-center space-y-6">
        <div className="mx-auto p-6 bg-primary/10 rounded-2xl w-fit">
          <Lock className="h-16 w-16 text-primary" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="button-payment">
            <Link to="/admin/login" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          
          {showSignup && (
            <Button variant="outline" asChild>
              <Link to="/signup" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Create Account
              </Link>
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground pt-4 border-t">
          <p>🔒 Secure authentication • 256-bit SSL encryption</p>
        </div>
      </CardContent>
    </Card>
  );
}