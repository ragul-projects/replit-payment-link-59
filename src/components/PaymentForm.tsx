import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, IndianRupee, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { paymentService } from "@/services/paymentService";
import { PaymentData, CreatePaymentRequest } from "@/types";
import { validatePaymentRequest, SecurityManager } from "@/utils/security";

interface PaymentFormProps {
  onPaymentGenerated: (data: PaymentData) => void;
}

export function PaymentForm({ onPaymentGenerated }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    amount: "",
    customerPhone: "",
    description: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    // Sanitize inputs
    const sanitizedData = {
      customerName: SecurityManager.sanitizeInput(formData.customerName),
      email: SecurityManager.sanitizeInput(formData.email),
      amount: formData.amount,
      customerPhone: SecurityManager.sanitizeInput(formData.customerPhone),
      description: SecurityManager.sanitizeInput(formData.description)
    };

    const validation = validatePaymentRequest(sanitizedData);
    
    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach(error => {
        // Map errors to form fields
        if (error.includes('Name')) newErrors.customerName = error;
        if (error.includes('email')) newErrors.email = error;
        if (error.includes('Amount') || error.includes('amount')) newErrors.amount = error;
        if (error.includes('mobile') || error.includes('phone')) newErrors.customerPhone = error;
      });
      setErrors(newErrors);
    }

    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const request: CreatePaymentRequest = {
        customerName: formData.customerName.trim(),
        email: formData.email.trim() || undefined,
        amount: parseFloat(formData.amount),
        customerPhone: formData.customerPhone.trim() || undefined,
        description: formData.description.trim() || undefined
      };

      const paymentData = await paymentService.createPayment(request);
      onPaymentGenerated(paymentData);
      
      toast({
        title: "Payment Generated Successfully",
        description: `QR code created for ₹${paymentData.amount} - Order ID: ${paymentData.orderId}`
      });

      // Clear form after successful generation
      setFormData({ 
        customerName: "", 
        email: "", 
        amount: "", 
        customerPhone: "", 
        description: "" 
      });
      setErrors({});
      
    } catch (error) {
      console.error('Payment generation error:', error);
      toast({
        variant: "destructive",
        title: "Payment Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate payment. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="card-payment">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Generate Payment</CardTitle>
        <CardDescription>
          Create instant UPI payment with QR code and secure payment link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              placeholder="Enter customer full name"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              disabled={isLoading}
              className={errors.customerName ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.customerName && (
              <p className="text-sm text-destructive">{errors.customerName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="customer@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isLoading}
              className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Email will be used for payment confirmation
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount *</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                min="1"
                max="100000"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                disabled={isLoading}
                className={`pl-10 ${errors.amount ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Minimum: ₹1 • Maximum: ₹1,00,000
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full button-payment"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Payment...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Generate UPI Payment
              </>
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>🔒 Secure payment processing with UPI</p>
            <p>✓ Instant QR code generation • ✓ Real-time status tracking</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}