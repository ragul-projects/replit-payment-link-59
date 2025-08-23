import { useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentForm } from "@/components/PaymentForm";
import { PaymentDisplay } from "@/components/PaymentDisplay";
import { StatusChecker } from "@/components/StatusChecker";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Zap, Shield, Users, TrendingUp, Clock, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EnhancedHeader } from "@/components/EnhancedHeader";
import { AuthRequired } from "@/components/AuthRequired";
import { PaymentFormSkeleton, PaymentDisplaySkeleton, StatusCheckerSkeleton } from "@/components/PaymentSkeletons";
import { LoadingOverlay } from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [paymentData, setPaymentData] = useState(null);
  const [activeSection, setActiveSection] = useState<'payment' | 'status'>('payment');
  const [isLoading, setIsLoading] = useState(false);
  const handleSectionChange = (section: string) => {
    if (section === 'payment' || section === 'status') {
      setActiveSection(section);
    }
  };

  const stats = [
    { label: "Payments Processed", value: "₹10M+", icon: TrendingUp },
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Success Rate", value: "99.9%", icon: Shield },
    { label: "Avg Response", value: "<2s", icon: Clock },
  ];

  const features = [
    {
      title: "Instant QR Generation",
      description: "Generate payment QR codes instantly with secure UPI links",
      icon: QrCode,
      color: "text-primary"
    },
    {
      title: "Real-time Tracking",
      description: "Track payment status in real-time with live notifications", 
      icon: Zap,
      color: "text-primary"
    },
    {
      title: "Bank-Grade Security",
      description: "256-bit SSL encryption with RBI compliance standards",
      icon: Shield,
      color: "text-success"
    }
  ];

  const renderMainContent = () => {
    // Protected content - requires authentication
    if (!state.isAuthenticated) {
      switch (activeSection) {
        case 'payment':
          return (
            <AuthRequired
              title="Sign in to Generate Payments"
              description="Create secure UPI QR codes and payment links with real-time tracking. Please sign in to access this feature."
            />
          );
        case 'status':
          return (
            <AuthRequired
              title="Sign in to Track Payments"
              description="Check real-time payment status and transaction history. Please sign in to access this feature."
            />
          );
        default:
          return null;
      }
    }

    // Authenticated content
    switch (activeSection) {
      case 'payment':
        return (
          <LoadingOverlay isLoading={isLoading} text="Processing payment...">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Suspense fallback={<PaymentFormSkeleton />}>
                  <PaymentForm onPaymentGenerated={setPaymentData} />
                </Suspense>
              </div>
              <div className="lg:sticky lg:top-24">
                {paymentData ? (
                  <Suspense fallback={<PaymentDisplaySkeleton />}>
                    <PaymentDisplay paymentData={paymentData} />
                  </Suspense>
                ) : (
                  <Card className="card-payment">
                    <CardContent className="p-8 h-full flex items-center justify-center min-h-[500px]">
                      <div className="text-center space-y-6 animate-fade-in">
                        <div className="mx-auto p-6 bg-primary/10 rounded-2xl w-fit">
                          <QrCode className="h-16 w-16 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-foreground">Payment Preview</h3>
                          <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                            Your generated QR code and payment details will appear here. 
                            Start by filling out the payment form.
                          </p>
                        </div>
                        <div className="flex justify-center">
                          <Badge variant="outline" className="text-primary border-primary/30">
                            Ready to Process
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </LoadingOverlay>
        );
      case 'status':
        return (
          <div className="max-w-2xl mx-auto">
            <Suspense fallback={<StatusCheckerSkeleton />}>
              <StatusChecker />
            </Suspense>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced Header */}
      <EnhancedHeader 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
      />

      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white animate-slide-up">
                Instant UPI Payments
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto animate-fade-in">
                Generate secure QR codes, process payments instantly, and track transactions in real-time with India's most trusted UPI platform.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-xl p-4 min-w-[140px] animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <stat.icon className="h-6 w-6 text-white mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose SecurePay?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology and banking-grade security for seamless payment experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="card-payment hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-3 rounded-xl bg-current/10 mb-4 ${feature.color}`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              {activeSection === 'payment' ? 'Generate Payment' : 'Track Payment Status'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {activeSection === 'payment' 
                ? 'Create instant UPI QR codes and secure payment links with real-time processing'
                : 'Check the real-time status of any payment using your order ID'
              }
            </p>
          </div>
        </div>

        {renderMainContent()}
      </main>

      {/* Simple Footer */}
      <footer className="bg-white/90 dark:bg-card/90 backdrop-blur-md border-t border-white/20 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary to-primary-glow rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-primary">SecurePay UPI</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              India's most trusted UPI payment platform. Instant, secure, and reliable payment solutions for businesses and individuals.
            </p>
            <div className="text-xs text-muted-foreground">
              © 2024 SecurePay UPI. All rights reserved. | Powered by UPI 2.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
