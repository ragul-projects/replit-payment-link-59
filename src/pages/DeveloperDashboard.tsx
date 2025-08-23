import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { SecurityManager } from "@/utils/security";
import { ApiInterface } from "@/components/ApiInterface";
import { ApiKeyGenerator } from "@/components/ApiKeyGenerator";
import { 
  Code, 
  Key, 
  Terminal, 
  LogOut, 
  Activity,
  Database,
  Shield,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DeveloperDashboard = () => {
  const { state, logout } = useAuth();
  const { canManageApiKeys } = usePermissions();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [auditLogs, setAuditLogs] = useState(SecurityManager.getAuditLogs());

  useEffect(() => {
    // Refresh audit logs periodically
    const interval = setInterval(() => {
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

  // Mock developer stats
  const stats = [
    {
      title: "API Calls Today",
      value: "1,247",
      change: "+15%",
      icon: Database,
      color: "text-blue-600"
    },
    {
      title: "Active API Keys",
      value: "3",
      change: "No change",
      icon: Key,
      color: "text-green-600"
    },
    {
      title: "Success Rate",
      value: "99.2%",
      change: "+0.3%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Last Request",
      value: "2m ago",
      change: "Active",
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  const recentActivity = [
    { 
      id: 1, 
      action: "API Key Created", 
      details: "Production API key for live transactions",
      timestamp: "2 hours ago",
      status: "success"
    },
    { 
      id: 2, 
      action: "Payment Generated", 
      details: "QR code created for ₹500",
      timestamp: "5 hours ago",
      status: "success"
    },
    { 
      id: 3, 
      action: "API Call", 
      details: "GET /api/payments/status",
      timestamp: "1 day ago",
      status: "success"
    },
    { 
      id: 4, 
      action: "Rate Limit Hit", 
      details: "API rate limit exceeded",
      timestamp: "2 days ago",
      status: "warning"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-primary to-primary-glow rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Developer Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {state.user?.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-primary border-primary/30">
                <Shield className="h-3 w-3 mr-1" />
                Developer Access
              </Badge>
              <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="api-test" className="flex items-center space-x-2">
              <Terminal className="h-4 w-4" />
              <span>API Testing</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Audit Logs</span>
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
            <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.status === 'success' ? 'bg-success/10' : 
                          activity.status === 'warning' ? 'bg-warning/10' : 'bg-destructive/10'
                        }`}>
                          {activity.status === 'success' && <CheckCircle className="h-5 w-5 text-success" />}
                          {activity.status === 'warning' && <AlertCircle className="h-5 w-5 text-warning" />}
                          {activity.status === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        <Badge 
                          variant={activity.status === "success" ? "default" : activity.status === "warning" ? "secondary" : "destructive"}
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-6">
            {canManageApiKeys ? (
              <ApiKeyGenerator />
            ) : (
              <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
                  <p className="text-muted-foreground">
                    You don't have permission to manage API keys. Contact your administrator for access.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* API Testing Tab */}
          <TabsContent value="api-test" className="space-y-6">
            <ApiInterface />
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Security Audit Logs</span>
                </CardTitle>
                <p className="text-muted-foreground">Monitor security events and user actions</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.slice(0, 10).map((log) => (
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
                          {log.details && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {JSON.stringify(log.details)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                        <Badge variant={log.success ? "default" : "destructive"}>
                          {log.success ? "Success" : "Failed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No audit logs available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DeveloperDashboard;