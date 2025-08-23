import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Download, Mail, Home, ExternalLink, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const orderId = searchParams.get("orderId") || "PAY123456789";
  const amount = searchParams.get("amount") || "1000.00";
  const customerName = searchParams.get("customerName") || "Customer";
  const paymentId = searchParams.get("paymentId") || "txn_" + Date.now();

  useEffect(() => {
    // Confetti effect on success
    const timer = setTimeout(() => {
      // This would trigger confetti animation in a real implementation
      console.log("🎉 Payment successful!");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const sharePayment = async () => {
    const shareData = {
      title: "Payment Successful!",
      text: `Payment of ₹${amount} completed successfully. Order ID: ${orderId}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareData.text + " " + shareData.url);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "Payment details copied successfully"
      });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const downloadInvoice = () => {
    // In a real implementation, this would download a PDF invoice
    toast({
      title: "Download Started",
      description: "Your invoice is being generated and will download shortly"
    });
  };

  const sendReceipt = () => {
    // In a real implementation, this would send email receipt
    toast({
      title: "Receipt Sent",
      description: "Payment receipt has been sent to your email address"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-scale-in">
        {/* Success Card */}
        <Card className="card-payment text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center animate-glow">
                  <CheckCircle className="h-12 w-12 text-success animate-scale-in" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto bg-success/20 rounded-full animate-ping" />
              </div>
            </div>
            <CardTitle className="text-2xl text-success">Payment Successful!</CardTitle>
            <CardDescription>
              Your payment has been processed successfully
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Payment Details */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold fintech-gradient mb-2">
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
                  <span className="text-sm text-muted-foreground">Payment ID</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {paymentId}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="status-success">
                    <CheckCircle className="h-3 w-3" />
                    COMPLETED
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Date & Time</span>
                  <span className="text-sm font-medium">
                    {new Date().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={downloadInvoice}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Invoice
                </Button>
                <Button 
                  onClick={sendReceipt}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Receipt
                </Button>
              </div>
              
              <Button 
                onClick={sharePayment}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Copy className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Share Payment Details
                  </>
                )}
              </Button>

              <Button asChild className="w-full button-payment">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Make Another Payment
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 space-y-3">
              <div className="trust-indicator justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Secure payment processed</span>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Payment processed securely via UPI • Transaction ID: {paymentId.slice(0, 12)}...
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Link */}
        <div className="text-center">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              Need help? Contact Support
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}