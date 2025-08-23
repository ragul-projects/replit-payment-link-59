import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { SecurityManager } from "@/utils/security";
import { paymentService } from "@/services/paymentService";
import { PaymentData } from "@/types";
import { 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut, 
  Shield,
  TrendingUp,
  Activity,
  DollarSign,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Database,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { state, logout } = useAuth();
  const { canManageUsers, canManagePayments } = usePermissions();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [auditLogs, setAuditLogs] = useState(SecurityManager.getAuditLogs());

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const paymentData = await paymentService.getAllPayments();
        setPayments(paymentData);
      } catch (error) {
        console.error('Failed to load payments:', error);
      }
    };

    loadPayments();
    
    // Refresh data periodically
    const interval = setInterval(() => {
      loadPayments();
      setAuditLogs(SecurityManager.getAuditLogs());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  // Calculate stats from real data
  const totalRevenue = payments.reduce((sum, payment) => 
    payment.status === 'success' ? sum + payment.amount : sum, 0
  );
  const successfulPayments = payments.filter(p => p.status === 'success').length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const todaysPayments = payments.filter(p => 
    new Date(p.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: "+12%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Successful Payments",
      value: successfulPayments.toString(),
      change: "+8%",
      icon: CheckCircle,
      color: "text-success"
    },
    {
      title: "Pending Payments",
      value: pendingPayments.toString(),
      change: pendingPayments > 0 ? "Active" : "None",
      icon: CreditCard,
      color: "text-warning"
    },
    {
      title: "Today's Payments",
      value: todaysPayments.toString(),
      change: "+5%",
      icon: Activity,
      color: "text-blue-600"
    }
  ];

  const recentUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active", date: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Pending", date: "2024-01-14" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Active", date: "2024-01-13" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", status: "Inactive", date: "2024-01-12" },
  ];

  const recentTransactions = [
    { id: "TXN001", amount: "$249.99", user: "John Doe", status: "Completed", date: "2024-01-15" },
    { id: "TXN002", amount: "$89.50", user: "Jane Smith", status: "Processing", date: "2024-01-15" },
    { id: "TXN003", amount: "$156.75", user: "Bob Johnson", status: "Completed", date: "2024-01-14" },
    { id: "TXN004", amount: "$320.00", user: "Alice Brown", status: "Failed", date: "2024-01-14" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-primary to-primary-glow rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {state.user?.name}
                </p>
              </div>
            </div>
            
            <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Payments</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Audit Logs</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-lg bg-background/60 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {stat.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full bg-muted/50 ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Payments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.orderId} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{payment.orderId}</p>
                          <p className="text-sm text-muted-foreground">{payment.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{payment.amount}</p>
                          <Badge 
                            variant={payment.status === "success" ? "default" : payment.status === "pending" ? "secondary" : "destructive"}
                          >
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {payments.length === 0 && (
                      <div className="text-center py-4">
                        <Database className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No payments yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={log.success ? "default" : "destructive"}
                          >
                            {log.success ? "Success" : "Failed"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {auditLogs.length === 0 && (
                      <div className="text-center py-4">
                        <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No security events</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <p className="text-muted-foreground">Manage all registered users</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge 
                          variant={user.status === "Active" ? "default" : user.status === "Pending" ? "secondary" : "destructive"}
                        >
                          {user.status}
                        </Badge>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            {canManagePayments ? (
              <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Payment Management</CardTitle>
                  <p className="text-muted-foreground">Monitor and manage all payment transactions</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.orderId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{payment.orderId}</p>
                            <p className="text-sm text-muted-foreground">{payment.customerName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(payment.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">₹{payment.amount}</p>
                            <p className="text-xs text-muted-foreground">{payment.email}</p>
                          </div>
                          <Badge 
                            variant={payment.status === "success" ? "default" : payment.status === "pending" ? "secondary" : "destructive"}
                          >
                            {payment.status}
                          </Badge>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    ))}
                    {payments.length === 0 && (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No payments found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
                  <p className="text-muted-foreground">
                    You don't have permission to manage payments. Contact your administrator for access.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Security Audit Logs</span>
                </CardTitle>
                <p className="text-muted-foreground">Monitor all security events and user actions</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          log.success ? 'bg-success/10' : 'bg-destructive/10'
                        }`}>
                          {log.success ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground">
                            User: {log.userId} | Resource: {log.resource}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                          {log.details && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {JSON.stringify(log.details)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={log.success ? "default" : "destructive"}>
                          {log.success ? "Success" : "Failed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <div className="text-center py-8">
                      <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No audit logs available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <p className="text-muted-foreground">Configure application settings</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div>
                    <h3 className="text-lg font-medium">General Settings</h3>
                    <Separator className="mt-2 mb-4" />
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        Update Application Name
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Configure Email Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Manage API Keys
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Security Settings</h3>
                    <Separator className="mt-2 mb-4" />
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        Change Admin Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Two-Factor Authentication
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Audit Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;