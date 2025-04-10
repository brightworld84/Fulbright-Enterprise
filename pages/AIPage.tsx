import Header from "../components/layout/Header";
import { BottomNavigation } from "../components/layout/BottomNavigation";
import { FloatingActionButton } from "../components/layout/FloatingActionButton";
import AIInsight from "../components/dashboard/AIInsight";
import EnhancedAIInsight from "../components/data/EnhancedAIInsight";
import { AddRecordModal } from "../components/modals/AddRecordModal";
import ViewRecordModal from "../components/modals/ViewRecordModal";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { analyzeAllRecords, extractTrendsFromInsights } from "../lib/openai";
import { useToast } from "../hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Lightbulb, TrendingUp, Activity, Settings2 } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { useAccessibility } from "../contexts/AccessibilityContext";

export function AIPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { options } = useAccessibility();
  const [analysisLevel, setAnalysisLevel] = useState<"basic" | "standard" | "detailed">("standard");

  const insightsQuery = useQuery({
    queryKey: ["/api/insights"],
    staleTime: 60000, // 1 minute
  });
  
  const recordsQuery = useQuery({
    queryKey: ["/api/records"],
    staleTime: 60000, // 1 minute
  });

  const analysisMutation = useMutation({
    mutationFn: analyzeAllRecords,
    onSuccess: () => {
      toast({
        title: "Analysis started",
        description: "Your records are being analyzed. You'll be notified when complete."
      });
      // Refresh insights after a delay to show new analysis
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleAnalyzeAll = () => {
    analysisMutation.mutate();
  };

  if (insightsQuery.isLoading) {
    return (
      <div className="min-h-screen pb-16">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  const insights = insightsQuery.data || [];
  
  // Extract and categorize insights
  const priorityInsights = Array.isArray(insights) ? insights.filter(insight => 
    insight.title?.toLowerCase().includes('important') || 
    insight.title?.toLowerCase().includes('alert') ||
    insight.title?.toLowerCase().includes('warning')
  ) : [];
  
  const recommendationInsights = Array.isArray(insights) ? insights.filter(insight => 
    insight.title?.toLowerCase().includes('recommend') || 
    insight.title?.toLowerCase().includes('suggestion')
  ) : [];
  
  const otherInsights = Array.isArray(insights) ? insights.filter(insight => 
    !priorityInsights.includes(insight) && 
    !recommendationInsights.includes(insight)
  ) : [];
  
  // Extract trends from insights
  const trends = Array.isArray(insights) ? extractTrendsFromInsights(insights) : [];
  
  // Mock health score (would be calculated from actual insights in production)
  const healthScore = {
    overall: Math.min(85, Math.max(50, 65 + (Array.isArray(insights) ? insights.length : 0) * 5)), // Just a demo calculation
    categories: {
      "Cardiovascular": Math.floor(Math.random() * 30) + 70,
      "Respiratory": Math.floor(Math.random() * 30) + 70,
      "Metabolic": Math.floor(Math.random() * 30) + 70,
      "Nutrition": Math.floor(Math.random() * 30) + 70
    }
  };

  return (
    <div className={`min-h-screen pb-16 ${options.highContrast ? "high-contrast" : ""} ${options.largeText ? "large-text" : ""}`}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-neutral-800 mb-4">AI Health Assistant</h1>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
          <div className="flex items-start">
            <div className="text-primary bg-white p-2 rounded-full mr-3">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-700 mb-1">How AI Helps You</h3>
              <p className="text-sm text-neutral-600">
                Our AI analyzes your medical records to provide insights, detect patterns, and highlight important information. It helps you better understand your health data.
              </p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="insights" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span>Insights</span>
              {priorityInsights.length > 0 && (
                <Badge variant="destructive" className="ml-1">{priorityInsights.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="healthscore" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Health Score</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              <span>AI Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights">
            <Card className="shadow mb-6">
              <CardContent className="p-6">
                {Array.isArray(insights) && insights.length > 0 ? (
                  <div className="space-y-6">
                    {/* Priority Insights */}
                    {priorityInsights.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Badge variant="destructive">Priority</Badge>
                          <span>Important Health Insights</span>
                        </h3>
                        <div className="space-y-4">
                          {priorityInsights.map(insight => (
                            <EnhancedAIInsight key={insight.id} insight={insight} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Recommendations */}
                    {recommendationInsights.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Recommendations</Badge>
                          <span>Suggested Actions</span>
                        </h3>
                        <div className="space-y-4">
                          {recommendationInsights.map(insight => (
                            <EnhancedAIInsight key={insight.id} insight={insight} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Other Insights */}
                    {otherInsights.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-4">General Health Insights</h3>
                        <div className="space-y-4">
                          {otherInsights.map(insight => (
                            <EnhancedAIInsight key={insight.id} insight={insight} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-neutral-200 rounded-lg">
                    <Lightbulb className="h-12 w-12 text-neutral-300 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-neutral-700 mb-1">No insights yet</h3>
                    <p className="text-sm text-neutral-500 max-w-md mx-auto mb-6">
                      Upload medical records and run an analysis to get AI-powered insights about your health.
                    </p>
                  </div>
                )}
                
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={handleAnalyzeAll}
                    disabled={analysisMutation.isPending}
                    className="relative overflow-hidden"
                  >
                    {analysisMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Analyze All Records
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends">
            <Card className="shadow mb-6">
              <CardHeader>
                <CardTitle>Health Trends</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {trends.length > 0 ? (
                  <div className="space-y-4">
                    {trends.map((trend, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{trend.label}</h3>
                          <Badge 
                            variant={trend.trend === 'up' ? 'destructive' : trend.trend === 'down' ? 'outline' : 'secondary'}
                            className="flex items-center gap-1"
                          >
                            {trend.trend === 'up' && '↑'}
                            {trend.trend === 'down' && '↓'}
                            {trend.trend === 'stable' && '→'}
                            {trend.value}
                          </Badge>
                        </div>
                        <div className="relative pt-1">
                          <div className={`h-2 rounded-full ${trend.trend === 'up' ? 'bg-red-100' : trend.trend === 'down' ? 'bg-green-100' : 'bg-blue-100'}`}>
                            <div 
                              className={`h-2 rounded-full ${trend.trend === 'up' ? 'bg-red-500' : trend.trend === 'down' ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min(100, Math.max(20, parseInt(trend.value) || 50))}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-neutral-200 rounded-lg">
                    <TrendingUp className="h-12 w-12 text-neutral-300 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-neutral-700 mb-1">No trends detected yet</h3>
                    <p className="text-sm text-neutral-500 max-w-md mx-auto mb-6">
                      Add more medical records over time to see how your health metrics change.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="healthscore">
            <Card className="shadow mb-6">
              <CardHeader>
                <CardTitle>Your Health Score</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center rounded-full h-32 w-32 border-8 border-blue-100 mb-4">
                    <span className="text-4xl font-bold text-blue-600">{healthScore.overall}</span>
                  </div>
                  <h3 className="text-lg font-medium">Overall Health</h3>
                  <p className="text-sm text-neutral-500 max-w-md mx-auto mt-2">
                    Your health score is calculated based on all your medical records and health metrics
                  </p>
                </div>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <h3 className="font-medium">Health Categories</h3>
                  
                  {Object.entries(healthScore.categories).map(([category, score]) => (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{category}</span>
                        <span className="text-sm font-medium">{score}/100</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}
                </div>
                
                <div className="border-t mt-8 pt-4 text-sm text-center text-neutral-500">
                  <p>
                    This score is for informational purposes only and should not be used for medical decisions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="shadow mb-6">
              <CardHeader>
                <CardTitle>AI Analysis Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium">Analysis Frequency</h3>
                    <p className="text-sm text-neutral-500">How often should AI analyze your health records</p>
                    <select className="border rounded p-2">
                      <option>Manual only</option>
                      <option>When new records are added</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium">Analysis Detail Level</h3>
                    <p className="text-sm text-neutral-500">How comprehensive should the analysis be</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant={analysisLevel === "basic" ? "default" : "outline"}
                        onClick={() => {
                          setAnalysisLevel("basic");
                          toast({
                            title: "Analysis level updated",
                            description: "Analysis level set to Basic. This provides core health insights with minimal detail.",
                            duration: 3000 // 3 seconds as requested
                          });
                        }}
                      >
                        Basic
                      </Button>
                      <Button 
                        variant={analysisLevel === "standard" ? "default" : "outline"}
                        onClick={() => {
                          setAnalysisLevel("standard");
                          toast({
                            title: "Analysis level updated",
                            description: "Analysis level set to Standard. This is the recommended setting for most users.",
                            duration: 3000 // 3 seconds as requested
                          });
                        }}
                      >
                        Standard
                      </Button>
                      <Button 
                        variant={analysisLevel === "detailed" ? "default" : "outline"}
                        onClick={() => {
                          setAnalysisLevel("detailed");
                          toast({
                            title: "Analysis level updated",
                            description: "Analysis level set to Detailed. This provides in-depth analysis with maximum information.",
                            duration: 3000 // 3 seconds as requested
                          });
                        }}
                      >
                        Detailed
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium">Health Focus Areas</h3>
                    <p className="text-sm text-neutral-500">Select areas you want AI to focus on</p>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Cardiovascular</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Respiratory</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Metabolic</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Nutrition</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Reset Defaults</Button>
                    <Button>Save Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <FloatingActionButton />
      <BottomNavigation />
      <AddRecordModal />
      <ViewRecordModal />
    </div>
  );
}

export default AIPage;
