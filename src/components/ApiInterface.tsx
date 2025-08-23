import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Code, Globe, Key, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  timestamp: string;
}

export function ApiInterface() {
  const [config, setConfig] = useState({
    url: "",
    method: "GET",
    headers: "{}",
    body: "",
    apiKey: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateConfig = (): boolean => {
    if (!config.url.trim()) {
      toast({
        variant: "destructive",
        title: "URL Required",
        description: "Please enter a valid API endpoint URL"
      });
      return false;
    }

    try {
      new URL(config.url);
    } catch {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL format"
      });
      return false;
    }

    if (config.headers.trim()) {
      try {
        JSON.parse(config.headers);
      } catch {
        toast({
          variant: "destructive",
          title: "Invalid Headers",
          description: "Headers must be valid JSON format"
        });
        return false;
      }
    }

    if (config.body.trim() && ["POST", "PUT", "PATCH"].includes(config.method)) {
      try {
        JSON.parse(config.body);
      } catch {
        toast({
          variant: "destructive",
          title: "Invalid Body",
          description: "Request body must be valid JSON format"
        });
        return false;
      }
    }

    return true;
  };

  const makeApiCall = async () => {
    if (!validateConfig()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');

      // Parse custom headers
      if (config.headers.trim()) {
        const customHeaders = JSON.parse(config.headers);
        Object.entries(customHeaders).forEach(([key, value]) => {
          headers.set(key, value as string);
        });
      }

      // Add API key if provided
      if (config.apiKey.trim()) {
        headers.set('Authorization', `Bearer ${config.apiKey}`);
      }

      const requestConfig: RequestInit = {
        method: config.method,
        headers: headers,
        mode: 'cors'
      };

      // Add body for POST/PUT/PATCH requests
      if (["POST", "PUT", "PATCH"].includes(config.method) && config.body.trim()) {
        requestConfig.body = config.body;
      }

      const fetchResponse = await fetch(config.url, requestConfig);
      
      // Parse response
      let responseData;
      const contentType = fetchResponse.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await fetchResponse.json();
      } else {
        responseData = await fetchResponse.text();
      }

      // Convert headers to object
      const responseHeaders: Record<string, string> = {};
      fetchResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const apiResponse: ApiResponse = {
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        data: responseData,
        headers: responseHeaders,
        timestamp: new Date().toISOString()
      };

      setResponse(apiResponse);

      toast({
        title: fetchResponse.ok ? "API Call Successful" : "API Call Completed",
        description: `Status: ${fetchResponse.status} ${fetchResponse.statusText}`,
        variant: fetchResponse.ok ? "default" : "destructive"
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "API Call Failed",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500";
    if (status >= 300 && status < 400) return "bg-yellow-500";
    if (status >= 400 && status < 500) return "bg-orange-500";
    if (status >= 500) return "bg-red-500";
    return "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>API Interface</CardTitle>
              <CardDescription>
                Connect and interact with external APIs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
            </TabsList>
            
            <TabsContent value="request" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="url">API Endpoint URL</Label>
                  <Input
                    id="url"
                    placeholder="https://api.example.com/endpoint"
                    value={config.url}
                    onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="method">Method</Label>
                  <Select
                    value={config.method}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, method: value }))}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">
                  <Key className="inline h-4 w-4 mr-1" />
                  API Key (Optional)
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Your API key (will be added as Bearer token)"
                  value={config.apiKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  🔒 For production apps, use Supabase Edge Functions to securely handle API keys
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headers">Custom Headers (JSON)</Label>
                <Textarea
                  id="headers"
                  placeholder='{"Content-Type": "application/json", "X-Custom-Header": "value"}'
                  value={config.headers}
                  onChange={(e) => setConfig(prev => ({ ...prev, headers: e.target.value }))}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              {["POST", "PUT", "PATCH"].includes(config.method) && (
                <div className="space-y-2">
                  <Label htmlFor="body">Request Body (JSON)</Label>
                  <Textarea
                    id="body"
                    placeholder='{"key": "value", "data": "example"}'
                    value={config.body}
                    onChange={(e) => setConfig(prev => ({ ...prev, body: e.target.value }))}
                    disabled={isLoading}
                    rows={4}
                  />
                </div>
              )}

              <Button 
                onClick={makeApiCall}
                disabled={isLoading || !config.url.trim()}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Making API Call...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Request
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="response" className="space-y-4">
              {response && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(response.status)}`} />
                    <Badge variant={response.status < 400 ? "default" : "destructive"}>
                      {response.status} {response.statusText}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(response.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Response Data
                      </h4>
                      <div className="bg-muted p-4 rounded-lg overflow-auto max-h-64">
                        <pre className="text-sm">
                          {typeof response.data === 'string' 
                            ? response.data 
                            : JSON.stringify(response.data, null, 2)
                          }
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Response Headers</h4>
                      <div className="bg-muted p-4 rounded-lg overflow-auto max-h-32">
                        <pre className="text-sm">
                          {JSON.stringify(response.headers, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <h4 className="font-medium text-destructive">Error</h4>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </div>
              )}

              {!response && !error && (
                <div className="text-center py-8 text-muted-foreground">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Make an API request to see the response here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}