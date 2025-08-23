import { MessageCircle, Mail, Shield, Lock, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const openWhatsApp = () => {
    window.open("https://wa.me/+919876543210?text=Hi,%20I%20need%20help%20with%20UPI%20payments", "_blank");
  };

  const openEmail = () => {
    window.location.href = "mailto:support@securepay.com?subject=UPI%20Payment%20Support";
  };

  return (
    <footer className="bg-white/90 dark:bg-card/90 backdrop-blur-md border-t border-white/20 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-fintech-blue to-fintech-teal rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold hero-gradient">SecurePay UPI</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              India's most trusted UPI payment platform. Instant, secure, and reliable payment solutions for businesses and individuals.
            </p>
            <div className="flex items-center space-x-4">
              <div className="trust-indicator">
                <Lock className="h-3 w-3" />
                <span className="text-xs">SSL Secured</span>
              </div>
              <div className="trust-indicator">
                <CheckCircle className="h-3 w-3" />
                <span className="text-xs">RBI Approved</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support</h4>
            <div className="space-y-3">
              <Button 
                variant="ghost" 
                className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground"
                onClick={openWhatsApp}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Support
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground"
                onClick={openEmail}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
              <div className="text-sm text-muted-foreground">
                <p>Available 24/7</p>
                <p className="text-xs">Response time: &lt; 2 minutes</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Why Choose Us?</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-3 w-3 text-fintech-teal" />
                <span className="text-sm text-muted-foreground">Instant QR Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-3 w-3 text-fintech-blue" />
                <span className="text-sm text-muted-foreground">Bank-Grade Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-fintech-green" />
                <span className="text-sm text-muted-foreground">99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-3 w-3 text-success" />
                <span className="text-sm text-muted-foreground">Zero Transaction Fees</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 SecurePay UPI. All rights reserved. | 
            <span className="ml-1">Powered by UPI 2.0</span>
          </div>
          
          <div className="flex items-center space-x-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Refund Policy</a>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 pt-6 border-t border-muted/30">
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              🔒 Your payments are protected by 256-bit SSL encryption
            </p>
            <p className="text-xs text-muted-foreground">
              Regulated by Reserve Bank of India | Certified ISO 27001 Compliant
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}