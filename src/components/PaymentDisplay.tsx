import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QrCode, Smartphone, Copy, Check, Clock, CheckCircle, XCircle, RefreshCw, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaymentData } from "@/types";

interface PaymentDisplayProps {
  paymentData: PaymentData;
}

export function PaymentDisplay({ paymentData }: PaymentDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(paymentData.status);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate time left until expiration
    const updateTimer = () => {
      const now = new Date().getTime();
      const expires = new Date(paymentData.expiresAt).getTime();
      const remaining = Math.max(0, expires - now);
      setTimeLeft(remaining);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [paymentData.expiresAt]);

  useEffect(() => {
    // Listen for payment status updates
    const handleStatusUpdate = (event: CustomEvent) => {
      if (event.detail.orderId === paymentData.orderId) {
        setCurrentStatus(event.detail.status);
        
        if (event.detail.status === 'success') {
          toast({
            title: "Payment Successful! 🎉",
            description: `Payment of ₹${paymentData.amount} completed successfully`,
            duration: 5000,
          });
        } else if (event.detail.status === 'failed') {
          toast({
            variant: "destructive",
            title: "Payment Failed",
            description: "The payment could not be processed. Please try again.",
            duration: 5000,
          });
        }
      }
    };

    window.addEventListener('paymentStatusUpdate', handleStatusUpdate as EventListener);
    return () => window.removeEventListener('paymentStatusUpdate', handleStatusUpdate as EventListener);
  }, [paymentData.orderId, paymentData.amount, toast]);

  const copyUpiLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentData.upiLink);
      setCopied(true);
      toast({
        title: "Copied Successfully! 📋",
        description: "UPI payment link copied to clipboard"
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Failed to copy UPI link. Please try manually selecting the link."
      });
    }
  };

  const openUpiApp = () => {
    window.open(paymentData.upiLink, '_blank');
    toast({
      title: "Opening UPI App",
      description: "Redirecting to your preferred UPI application"
    });
  };

  const getStatusIcon = () => {
    switch (currentStatus) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusVariant = () => {
    switch (currentStatus) {
      case 'success':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatTimeLeft = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.max(0, (timeLeft / (15 * 60 * 1000)) * 100);

  return (
    <Card className="card-payment">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-success/10 rounded-full w-fit">
          <QrCode className="h-6 w-6 text-success" />
        </div>
        <CardTitle className="text-2xl">Payment Ready</CardTitle>
        <CardDescription>
          Scan QR code or use UPI link to complete payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Status */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            {getStatusIcon()}
            <Badge variant={getStatusVariant()} className="flex items-center gap-1">
              {currentStatus.toUpperCase()}
            </Badge>
          </div>
          
          {currentStatus === 'pending' && timeLeft > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-3 w-3" />
                <span>Expires in {formatTimeLeft(timeLeft)}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div className="text-center space-y-2 p-4 bg-muted/30 rounded-lg">
          <div className="text-3xl font-bold text-primary">
            ₹{paymentData.amount.toFixed(2)}
          </div>
          <div className="text-foreground font-medium">
            {paymentData.customerName}
          </div>
          {paymentData.email && (
            <div className="text-sm text-muted-foreground">
              {paymentData.email}
            </div>
          )}
          <Badge variant="outline" className="mt-2">
            Order ID: {paymentData.orderId}
          </Badge>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-xl border-2 border-border shadow-lg">
            <img
              src={`data:image/png;base64,${paymentData.qrCode}`}
              alt="UPI Payment QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={openUpiApp}
            className="w-full button-payment"
            size="lg"
            disabled={currentStatus !== 'pending'}
          >
            <Smartphone className="mr-2 h-4 w-4" />
            Pay with UPI App
            <ExternalLink className="ml-2 h-3 w-3" />
          </Button>
          
          <Button 
            onClick={copyUpiLink}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-success" />
                Copied Successfully!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy UPI Payment Link
              </>
            )}
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground space-y-2 border-t pt-4">
          <p className="font-medium">How to pay:</p>
          <div className="space-y-1">
            <p>1. Open any UPI app (GPay, PhonePe, Paytm, etc.)</p>
            <p>2. Scan the QR code or click "Pay with UPI App"</p>
            <p>3. Enter your UPI PIN to complete payment</p>
          </div>
          {currentStatus === 'pending' && (
            <p className="text-xs text-warning mt-3">
              ⏰ Payment will expire in {formatTimeLeft(timeLeft)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}