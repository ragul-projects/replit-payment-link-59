import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Search, CheckCircle, Clock, XCircle, RotateCcw, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { paymentService } from "@/services/paymentService";
import { PaymentData } from "@/types";

export function StatusChecker() {
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusResult, setStatusResult] = useState<PaymentData | null>(null);
  const [recentPayments, setRecentPayments] = useState<PaymentData[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const { toast } = useToast();

  const checkStatus = async () => {
    if (!orderId.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Order ID",
        description: "Please enter a valid order ID to check status"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const payment = await paymentService.getPaymentStatus(orderId.trim());
      setStatusResult(payment);
      
      toast({
        title: "Status Retrieved",
        description: `Payment status: ${payment.status.toUpperCase()}`
      });
      
    } catch (error) {
      console.error('Status check error:', error);
      setStatusResult(null);
      toast({
        variant: "destructive",
        title: "Payment Not Found",
        description: "No payment found with this Order ID. Please check and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentPayments = async () => {
    try {
      const payments = await paymentService.getAllPayments();
      setRecentPayments(payments.slice(0, 10)); // Show last 10 payments
      setShowRecent(true);
    } catch (error) {
      console.error('Failed to load recent payments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load recent payments"
      });
    }
  };

  const selectPayment = (payment: PaymentData) => {
    setOrderId(payment.orderId);
    setStatusResult(payment);
    setShowRecent(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="card-payment">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
          <Search className="h-6 w-6 text-accent-foreground" />
        </div>
        <CardTitle className="text-2xl">Payment Status Checker</CardTitle>
        <CardDescription>
          Track your payment status using Order ID or browse recent transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="orderIdCheck">Order ID</Label>
              <Input
                id="orderIdCheck"
                placeholder="Enter Order ID (e.g., UPI123456ABC)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && checkStatus()}
                className="font-mono"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={checkStatus}
                disabled={isLoading || !orderId.trim()}
                className="px-6"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={loadRecentPayments}
              className="text-sm"
              disabled={isLoading}
            >
              <History className="mr-2 h-4 w-4" />
              View Recent Payments
            </Button>
          </div>
        </div>

        {/* Recent Payments */}
        {showRecent && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">Recent Payments</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {recentPayments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent payments found
                  </p>
                ) : (
                  recentPayments.map((payment) => (
                    <div
                      key={payment.orderId}
                      onClick={() => selectPayment(payment)}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(payment.status)}
                        <div>
                          <p className="font-medium text-sm">{payment.orderId}</p>
                          <p className="text-xs text-muted-foreground">{payment.customerName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{payment.amount}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Status Result */}
        {statusResult && (
          <>
            <Separator />
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  {getStatusIcon(statusResult.status)}
                  <Badge variant={getStatusVariant(statusResult.status)} className="text-sm">
                    {statusResult.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="text-2xl font-bold text-foreground">
                    ₹{statusResult.amount.toFixed(2)}
                  </div>
                  
                  <div className="text-foreground font-medium">
                    {statusResult.customerName}
                  </div>
                  
                  {statusResult.email && (
                    <div className="text-sm text-muted-foreground">
                      {statusResult.email}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">Order ID</p>
                    <p className="font-mono">{statusResult.orderId}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Created</p>
                    <p>{formatDate(statusResult.createdAt)}</p>
                  </div>
                </div>

                {statusResult.status === 'pending' && (
                  <div className="flex items-center justify-center gap-2 text-sm text-warning">
                    <Clock className="h-4 w-4" />
                    <span>Payment is being processed...</span>
                  </div>
                )}

                {statusResult.status === 'success' && (
                  <div className="flex items-center justify-center gap-2 text-sm text-success">
                    <CheckCircle className="h-4 w-4" />
                    <span>Payment completed successfully!</span>
                  </div>
                )}

                {statusResult.status === 'failed' && (
                  <div className="flex items-center justify-center gap-2 text-sm text-destructive">
                    <XCircle className="h-4 w-4" />
                    <span>Payment failed. Please try again.</span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setStatusResult(null);
                  setOrderId("");
                }}
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Check Another Payment
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}