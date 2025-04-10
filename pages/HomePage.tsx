import Header from "../components/layout/Header";
import { BottomNavigation } from "../components/layout/BottomNavigation";
import { FloatingActionButton } from "../components/layout/FloatingActionButton";
import SummaryCard from "../components/dashboard/SummaryCard";
import RecordCard from "../components/dashboard/RecordCard";
import AIInsight from "../components/dashboard/AIInsight";
import { AddRecordModal } from "../components/modals/AddRecordModal";
import ViewRecordModal from "../components/modals/ViewRecordModal";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { analyzeAllRecords } from "../lib/openai";
import { useToast } from "../hooks/use-toast";
import { useMedicalRecord } from "../contexts/MedicalRecordContext";
import { apiRequest } from "../lib/queryClient";

export function HomePage() {
  const { showAddRecordModal, setShowAddRecordModal } = useMedicalRecord();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const statsQuery = useQuery({
    queryKey: ["/api/stats"],
    staleTime: 60000, // 1 minute
  });

  const recordsQuery = useQuery({
    queryKey: ["/api/records"],
    staleTime: 60000, // 1 minute
  });

  const insightsQuery = useQuery({
    queryKey: ["/api/insights"],
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
  
  const demoDataMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/demo-data", {});
    },
    onSuccess: () => {
      toast({
        title: "Demo data created",
        description: "Sample medical records have been added to your account."
      });
      // Refresh records data
      queryClient.invalidateQueries({ queryKey: ["/api/records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create demo data",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleAnalyzeAll = () => {
    analysisMutation.mutate();
  };
  
  const handleCreateDemoData = () => {
    demoDataMutation.mutate();
  };

  const loading = statsQuery.isLoading || recordsQuery.isLoading || insightsQuery.isLoading;
  const stats = statsQuery.data || { recordCount: 0, upcomingCount: 0 };
  const records = recordsQuery.data || [];
  const insights = insightsQuery.data || [];

  const recentRecords = records.slice(0, 3); // Show only 3 most recent records

  return (
    <div className="pb-16">
      <Header />
      
      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Dashboard */}
          <Card className="shadow mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-neutral-800 mb-4">Dashboard</h2>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <SummaryCard
                  title="Records"
                  count={loading ? 0 : stats.recordCount}
                  icon="description"
                  colorClass="text-primary"
                  bgClass="bg-blue-50"
                  borderClass="border border-blue-100"
                />
                <SummaryCard
                  title="Upcoming"
                  count={loading ? 0 : stats.upcomingCount}
                  icon="event"
                  colorClass="text-secondary"
                  bgClass="bg-green-50"
                  borderClass="border border-green-100"
                />
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center"
                  onClick={() => setShowAddRecordModal(true)}
                >
                  <span className="material-icons text-sm mr-1">add</span>
                  Add Record
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white text-primary border border-primary px-4 py-2 rounded-full text-sm font-medium flex items-center"
                  onClick={() => setShowAddRecordModal(true)}
                >
                  <span className="material-icons text-sm mr-1">camera_alt</span>
                  Scan Document
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white text-neutral-500 border border-neutral-200 px-4 py-2 rounded-full text-sm font-medium flex items-center"
                  onClick={handleAnalyzeAll}
                  disabled={analysisMutation.isPending}
                >
                  <span className="material-icons text-sm mr-1">smart_toy</span>
                  AI Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Records */}
          <Card className="shadow mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-neutral-800">Recent Records</h2>
                <a
                  className="text-primary text-sm font-medium hover:underline"
                  href="/records"
                >
                  View All
                </a>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
              ) : recentRecords.length > 0 ? (
                <div className="space-y-4">
                  {recentRecords.map(record => (
                    <RecordCard key={record.id} record={record} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-neutral-200 rounded-lg">
                  <span className="material-icons text-neutral-300 text-4xl mb-2">description</span>
                  <p className="text-neutral-500">No records found</p>
                  <div className="flex flex-col md:flex-row gap-3 justify-center mt-4">
                    <Button
                      className="bg-primary"
                      onClick={() => setShowAddRecordModal(true)}
                    >
                      Add Your First Record
                    </Button>
                    <Button
                      variant="outline"
                      className="border border-primary text-primary"
                      onClick={handleCreateDemoData}
                      disabled={demoDataMutation.isPending}
                    >
                      {demoDataMutation.isPending ? "Creating..." : "Load Demo Records"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* AI Insights */}
          <Card className="shadow mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-neutral-800">AI Insights</h2>
                <a
                  className="text-primary text-sm font-medium hover:underline"
                  href="/ai"
                >
                  View All
                </a>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
              ) : insights.length > 0 ? (
                insights.slice(0, 1).map(insight => (
                  <AIInsight key={insight.id} insight={insight} />
                ))
              ) : null}
              
              <div className="text-center py-6 border border-dashed border-neutral-200 rounded-lg">
                <span className="material-icons text-secondary text-4xl mb-2">add_circle</span>
                <p className="text-neutral-500 mb-2">Get more insights from your medical records</p>
                <Button 
                  className="bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium"
                  onClick={handleAnalyzeAll}
                  disabled={analysisMutation.isPending}
                >
                  {analysisMutation.isPending ? "Processing..." : "Run AI Analysis"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <FloatingActionButton />
      <BottomNavigation />
      <AddRecordModal />
      <ViewRecordModal />
    </div>
  );
}

export default HomePage;
