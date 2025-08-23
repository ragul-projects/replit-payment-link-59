import { useSearchParams, Link } from "react-router-dom";
import { XCircle, RefreshCw, Home, MessageCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get("orderId") || "PAY123456789";
  const amount = searchParams.get("amount") || "1000.00";
  const customerName = searchParams.get("customerName") || "Customer";
  const errorCode = searchParams.get("errorCode") || "PAYMENT_DECLINED";
  const errorMessage = searchParams.get("errorMessage") || "Payment was declined by your bank";

  const getErrorDetails = (code: string) => {
    const errors: Record<string, { title: string; description: string; action: string }> = {
      PAYMENT_DECLINED: {
        title: "Payment Declined",
        description: "Your bank declined the transaction. Please check your account balance or try a different payment method.",
        action: "Try using a different UPI app or contact your bank"
      },
      INSUFFICIENT_FUNDS: {
        title: "Insufficient Balance",
        description: "Your account doesn't have enough balance to complete this transaction.",
        action: "Add money to your account and try again"
      },
      NETWORK_ERROR: {
        title: "Network Issue",
        description: "There was a connectivity issue during payment processing.",
        action: "Check your internet connection and retry"
      },
      TIMEOUT: {
        title: "Payment Timeout",
        description: "The payment took too long to process and timed out.",
        action: "Please try again with a stable internet connection"
      },
      INVALID_UPI: {
        title: "Invalid UPI Details",
        description: "The UPI information provided was incorrect or invalid.",
        action: "Verify and re-enter your UPI details"
      },
      DEFAULT: {
        title: "Payment Failed",
        description: "Something went wrong while processing your payment.",
        action: "Please try again or contact support"
      }
    };
    
    return errors[code] || errors.DEFAULT;
  };

  const errorDetails = getErrorDetails(errorCode);

  const retryPayment = () => {
    // Navigate back to payment form with pre-filled data
    const params = new URLSearchParams({
      customerName,
      amount,
      retry: "true"
    });
    window.location.href = `/?${params.toString()}`;
  };

  const contactSupport = () => {
    // In a real implementation, this could open WhatsApp, email, or support chat
    const message = encodeURIComponent(
      `Hi, I need help with a failed payment. Order ID: ${orderId}, Amount: ₹${amount}, Error: ${errorMessage}`
    );
    window.open(`https://wa.me/+919876543210?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-scale-in">
        {/* Failure Card */}
        <Card className="card-payment text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4">
              <div className="w-20 h-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <XCircle className="h-12 w-12 text-destructive animate-scale-in" />
              </div>
            </div>
            <CardTitle className="text-2xl text-destructive">Payment Failed</CardTitle>
            <CardDescription>
              {errorDetails.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Alert */}
            <Alert className="border-destructive/20 bg-destructive/5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-left">
                <strong>{errorDetails.title}</strong><br />
                {errorDetails.action}
              </AlertDescription>
            </Alert>

            {/* Payment Details */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-muted-foreground mb-2">
                  ₹{parseFloat(amount).toFixed(2)}
                </div>
                <div className="text-lg font-medium text-foreground">
                  {customerName}
                </div>
              </div>

              <div className="space-y-3 p-4 bg-muted/30 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Order ID</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {orderId}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Error Code</span>
                  <Badge variant="destructive" className="font-mono text-xs">
                    {errorCode}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="status-failed">
                    <XCircle className="h-3 w-3" />
                    FAILED
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Attempted At</span>
                  <span className="text-sm font-medium">
                    {new Date().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={retryPayment}
                className="w-full button-payment"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Payment
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={contactSupport}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Support
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </Button>
              </div>
            </div>

            {/* Help Section */}
            <div className="pt-4 space-y-3">
              <div className="text-sm text-muted-foreground">
                <strong>Common solutions:</strong>
              </div>
              <ul className="text-xs text-muted-foreground text-left space-y-1">
                <li>• Check your internet connection</li>
                <li>• Ensure sufficient account balance</li>
                <li>• Try a different UPI app</li>
                <li>• Verify UPI PIN is correct</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Support Link */}
        <div className="text-center">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              Still need help? Contact Technical Support
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}