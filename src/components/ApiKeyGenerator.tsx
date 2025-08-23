import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Key, Copy, Eye, EyeOff, Trash2, Plus, Settings, Shield, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiKeyService } from "@/services/apiKeyService";
import { ApiKey, CreateApiKeyRequest } from "@/types";

export function ApiKeyGenerator() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyForm, setNewKeyForm] = useState({
    name: "",
    permissions: [] as string[],
    description: "",
    environment: "development" as "production" | "development" | "staging"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const keys = await apiKeyService.getAllApiKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error('Failed to load API keys:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load API keys"
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newKeyForm.name.trim()) {
      newErrors.name = "API key name is required";
    } else if (newKeyForm.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    }

    if (newKeyForm.permissions.length === 0) {
      newErrors.permissions = "At least one permission is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied Successfully! 📋",
        description: "API key copied to clipboard"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Failed to copy API key"
      });
    }
  };

  const generateApiKey = async () => {
    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);
    
    try {
      const request: CreateApiKeyRequest = {
        name: newKeyForm.name.trim(),
        permissions: newKeyForm.permissions,
        description: newKeyForm.description.trim() || undefined,
        environment: newKeyForm.environment
      };

      const newKey = await apiKeyService.createApiKey(request);
      setApiKeys(prev => [newKey, ...prev]);
      setNewKeyForm({ 
        name: "", 
        permissions: [], 
        description: "",
        environment: "development"
      });
      setErrors({});
      
      toast({
        title: "API Key Generated! 🔑",
        description: `New API key "${newKey.name}" created successfully`,
        duration: 5000,
      });

      // Auto-show the new key for a few seconds
      setVisibleKeys(prev => new Set([...prev, newKey.id]));
      setTimeout(() => {
        setVisibleKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(newKey.id);
          return newSet;
        });
      }, 10000);
      
    } catch (error) {
      console.error('API key generation error:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate API key. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      await apiKeyService.deleteApiKey(keyId);
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      toast({
        title: "API Key Deleted",
        description: "API key has been permanently deleted"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Failed to delete API key"
      });
    }
  };

  const toggleApiKey = async (keyId: string) => {
    try {
      const updatedKey = await apiKeyService.toggleApiKey(keyId);
      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? updatedKey : key
      ));
      toast({
        title: `API Key ${updatedKey.isActive ? 'Activated' : 'Deactivated'}`,
        description: `Key "${updatedKey.name}" is now ${updatedKey.isActive ? 'active' : 'inactive'}`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update API key status"
      });
    }
  };

  const togglePermission = (permission: string) => {
    setNewKeyForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
    
    // Clear permission error when user makes a selection
    if (errors.permissions) {
      setErrors(prev => ({ ...prev, permissions: "" }));
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

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'read': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'write': return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'delete': return 'bg-red-500/10 text-red-700 dark:text-red-300';
      case 'admin': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="p-3 bg-gradient-to-r from-primary to-primary-glow rounded-full">
            <Key className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          API Key Management
        </h1>
        <p className="text-muted-foreground">
          Generate and manage secure API keys for seamless integrations
        </p>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-white/20">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Generate New Key
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Manage Keys ({apiKeys.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6">
          <Card className="card-payment">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Generate New API Key
              </CardTitle>
              <CardDescription>
                Create a secure API key with specific permissions for external services and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name *</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Production API, Mobile App Key, Analytics Service"
                    value={newKeyForm.name}
                    onChange={(e) => {
                      setNewKeyForm(prev => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                    }}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this API key will be used for..."
                    value={newKeyForm.description}
                    onChange={(e) => setNewKeyForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Permissions *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'read', label: 'Read Access', desc: 'View payments and transactions' },
                      { id: 'write', label: 'Write Access', desc: 'Create new payments' },
                      { id: 'delete', label: 'Delete Access', desc: 'Cancel or refund payments' },
                      { id: 'admin', label: 'Admin Access', desc: 'Full system administration' }
                    ].map((permission) => (
                      <div
                        key={permission.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          newKeyForm.permissions.includes(permission.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => togglePermission(permission.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={newKeyForm.permissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                          />
                          <div>
                            <p className="font-medium text-sm">{permission.label}</p>
                            <p className="text-xs text-muted-foreground">{permission.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.permissions && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.permissions}
                    </p>
                  )}
                </div>
              </div>

              <Button 
                onClick={generateApiKey} 
                className="w-full button-payment" 
                size="lg"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Secure Key...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Generate API Key
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <div className="space-y-4">
            {loading ? (
              <Card className="card-payment">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading API keys...</span>
                  </div>
                </CardContent>
              </Card>
            ) : apiKeys.length === 0 ? (
              <Card className="card-payment">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center text-muted-foreground space-y-4">
                    <div className="p-4 bg-muted/30 rounded-full w-fit mx-auto">
                      <Key className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">No API Keys Found</h3>
                      <p>Generate your first API key to get started with integrations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              apiKeys.map((apiKey, index) => (
                <Card key={apiKey.id} className="card-payment">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{apiKey.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                              {apiKey.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {index === 0 && (
                              <Badge variant="outline" className="text-xs">
                                Latest
                              </Badge>
                            )}
                          </div>
                        </div>

                        {apiKey.description && (
                          <p className="text-sm text-muted-foreground">{apiKey.description}</p>
                        )}
                        
                        <div className="flex items-center gap-2 font-mono text-sm bg-muted/50 p-3 rounded-lg">
                          <span className="flex-1">
                            {visibleKeys.has(apiKey.id) 
                              ? apiKey.key 
                              : apiKey.key.substring(0, 12) + "••••••••••••••••••••••••••••••••••••••••"}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {visibleKeys.has(apiKey.id) ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {apiKey.permissions.map((permission) => (
                            <Badge 
                              key={permission} 
                              variant="outline" 
                              className={`text-xs capitalize ${getPermissionColor(permission)}`}
                            >
                              {permission}
                            </Badge>
                          ))}
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Created: {formatDate(apiKey.createdAt)}</span>
                          {apiKey.lastUsed && <span>Last used: {formatDate(apiKey.lastUsed)}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleApiKey(apiKey.id)}
                          className={apiKey.isActive ? "text-warning" : "text-success"}
                        >
                          {apiKey.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteApiKey(apiKey.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}